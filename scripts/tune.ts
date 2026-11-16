/** 汇总 tunewind 令牌与 styles 目录的样式源, 生成应用样式入口 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import postcss from "postcss"
import { tunewind } from "tunewind"

const srcDir = path.resolve(process.cwd(), "src")
const styleDir = path.resolve(srcDir, "styles")
const entry = path.resolve(srcDir, "app.css")

async function readSources(): Promise<string[]> {
  let found: any[]
  try {
    found = await readdir(styleDir, { recursive: true, withFileTypes: true })
  }
  catch {
    return []
  }

  const files = found
    .filter(item => item.isFile() && !item.name.startsWith("."))
    .map(item => path.resolve(item.parentPath, item.name))
    .sort()

  const sources = await Promise.all(files.map(async (file) => {
    const css = (await readFile(file, "utf8")).trim()
    return css
  }))

  return sources.filter(Boolean)
}

const DARK_QUERY = "prefers-color-scheme: dark"
const DARK_CLASS = "mode-dark"
const THEME_PATTERN = /\[data-theme="([\w-]+)"\]/g

/** 主题属性选择器换成 class */
function toThemeClass(selector: string): string {
  return selector.replace(THEME_PATTERN, ".theme-$1")
}

/** 深色媒体查询折成 class 作用域: wxss 不认 prefers-color-scheme */
function foldDark(root: postcss.Root): void {
  // 方案块只保留与默认深色不同的声明, 其余从相邻块继承
  const base = new Map<string, string>()

  root.walkAtRules("media", (atRule) => {
    if (!atRule.params.includes(DARK_QUERY))
      return

    const rules: postcss.Rule[] = []

    for (const node of [
      ...(atRule.nodes ?? []),
    ]) {
      if (node.type !== "rule")
        continue

      node.selectors = [
        ...new Set(node.selectors.flatMap((selector) => {
          const themed = toThemeClass(selector)
          return themed === selector
            ? [`.${DARK_CLASS}`]
            : [
                `.${DARK_CLASS}${themed}`,
                `.${DARK_CLASS} ${themed}`,
              ]
        })),
      ]

      node.raws.before = "\n"
      node.raws.after = "\n"
      node.walkDecls((decl) => {
        decl.raws.before = "\n  "
      })

      node.remove()
      rules.push(node)
    }

    for (const rule of rules) {
      const isBase = rule.selectors.every(selector => selector === `.${DARK_CLASS}`)

      rule.walkDecls((decl) => {
        if (isBase) {
          base.set(decl.prop, decl.value)
          return
        }

        if (base.get(decl.prop) === decl.value)
          decl.remove()
      })

      atRule.before(rule)
    }

    atRule.remove()
  })
}

function adaptSchemes(css: string): string {
  const root = postcss.parse(css)

  // wxss 不支持属性选择器与 :where(), 主题变体在小程序端无法命中, 直接移除
  root.walkAtRules("custom-variant", (rule) => {
    if (rule.params.includes("[data-theme="))
      rule.remove()
  })

  foldDark(root)

  // 主题块改为 class 作用域: wxss 稳定支持的只有 class 选择器
  root.walkRules((rule) => {
    rule.selectors = rule.selectors.map(toThemeClass)
  })

  return root.toString()
}

async function main(): Promise<void> {
  const { css } = await postcss(tunewind.preprocess()).process("@tunewind", { from: undefined })
  const sources = await readSources()

  const content = [
    "@import \"tailwindcss\" source(none);",
    "@source \".\";",
    adaptSchemes(css.trim()),
    ...sources,
  ].filter(Boolean).join("\n\n")

  await mkdir(path.dirname(entry), { recursive: true })
  await writeFile(entry, `${content}\n`, "utf8")
  process.stdout.write(`generated ${path.relative(process.cwd(), entry)}\n`)
}

function messageOf(error: unknown): string {
  if (error instanceof Error)
    return error.stack ?? error.message

  return String(error)
}

main().catch((error: unknown) => {
  process.stderr.write(`${messageOf(error)}\n`)
  process.exitCode = 1
})
