import type { TuneConfig } from "tunewind"
import { defineConfig } from "tunewind"

type Scheme = NonNullable<NonNullable<TuneConfig["theme"]>["schemes"]>[string]
type Palette = NonNullable<Scheme["palette"]>
type Shades = NonNullable<Scheme["shade"]>

/** 语义色阶 */
const shade: Shades = {
  fg: { light: 500, dark: 300 },
  fgsoft: { light: 400, dark: 400 },
  fgstrong: { light: 600, dark: 200 },
  bg: { light: 100, dark: 950 },
  bgstrong: { light: 50, dark: 900 },
  line: { light: 200, dark: 950 },
}

/** 同一色系在两种模式下保持一致 */
function pair(family: string): Palette[string] {
  return {
    light: family,
    dark: family,
  }
}

/** 按主题名生成只覆盖主色的方案, 其余色与色阶继承默认主题 */
function createScheme(primary: string): Scheme {
  return {
    palette: {
      primary: pair(primary),
    },
  }
}

export default defineConfig({
  theme: {
    palette: {
      primary: "amber",
      error: "rose",
      ink: "neutral",
    },
    shade,
    opacity: {
      default: 100,
      weak: 90,
      soft: 50,
      ghost: 20,
    },
    schemes: {
      spring: createScheme("emerald"),
      summer: createScheme("blue"),
    },
  },
  size: {
    max: 8,
    // wxss 不支持类名里的 `.` 转义, 小数阶会生成 `.h-5\.5` 直接编译失败, 所以 step 只取整数
    step: 1,
    units: {
      default: "4px",
      x: "1px",
      h: "0.5rem",
      r: "1rem",
    },
  },
  strict: "bypass",
  diagnostics: "warn",
})
