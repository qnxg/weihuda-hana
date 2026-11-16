import type { TuneConfig } from "tunewind"
import { defineConfig } from "tunewind"

type Scheme = NonNullable<NonNullable<TuneConfig["theme"]>["schemes"]>[string]
type Palette = NonNullable<Scheme["palette"]>
type Shades = NonNullable<Scheme["shade"]>

/** 语义色阶, 深色侧反向取值 */
const shade: Shades = {
  fg: { light: 600, dark: 300 },
  fgsoft: { light: 400, dark: 400 },
  fgstrong: { light: 800, dark: 200 },
  fginvert: { light: 50, dark: 950 },
  bg: { light: 50, dark: 950 },
  bgstrong: { light: 100, dark: 900 },
  bginvert: { light: 900, dark: 50 },
  line: { light: 200, dark: 800 },
  lineinvert: { light: 900, dark: 100 },
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
      ink: "slate",
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
      summer: createScheme("sky"),
    },
  },
  size: {
    max: 8,
    step: 0.5,
    units: {
      default: "4px",
      x: "1px",
      r: "1rem",
    },
  },
  strict: "bypass",
  diagnostics: "warn",
})
