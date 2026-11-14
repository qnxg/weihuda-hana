import type { AtRule, Plugin, Root, Rule } from "postcss"
import process from "node:process"
import postcss from "postcss"
import { tunewind } from "tunewind"

const pending = new Set<string>()

function isUtility(rule: Rule): boolean {
  return rule.selectors.every(selector => selector.startsWith("."))
}

function hasLiteralOpacity(rule: Rule): boolean {
  return rule.selectors.some((selector) => {
    const index = selector.indexOf("\\/")
    return index >= 0 && /^\d/.test(selector.slice(index + 2))
  })
}

function wrap(rule: Rule): AtRule {
  const layer = postcss.atRule({ name: "layer", params: "utilities" })
  rule.before(layer)
  layer.append(rule)
  return layer
}

function unwrap(layers: readonly AtRule[]): void {
  for (const layer of layers) {
    if (layer.parent === undefined)
      continue

    for (const child of layer.nodes?.slice() ?? [])
      layer.before(child)

    layer.remove()
  }
}

export function reportTuneDiagnostics(): void {
  if (pending.size === 0)
    return

  for (const line of pending)
    process.stderr.write(`${line}\n`)

  pending.clear()
}

/** 用 tunewind 的规则检查并裁剪生成的 CSS */
export function tune(): Plugin {
  return {
    postcssPlugin: "weihuda-hana-tune",
    async OnceExit(root: Root, { result }) {
      const targets: Rule[] = []
      root.walkRules((rule) => {
        if (isUtility(rule))
          targets.push(rule)
      })

      if (targets.length === 0)
        return

      const layers = targets.map(wrap)
      const nested = await postcss(tunewind.postprocess()).process(root, { from: result.opts.from })
      const lines = nested.warnings().map(warning => warning.text)

      for (const rule of targets) {
        if (!hasLiteralOpacity(rule) || rule.parent === undefined)
          continue

        lines.push(`tunewind: dropped ${rule.selector} (opacity modifier is not a theme key)`)
        rule.remove()
      }

      for (const line of lines) {
        pending.add(line)
        result.warn(line)
      }

      unwrap(layers)
    },
  }
}
