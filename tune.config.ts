import type { TuneConfig } from "tunewind"
import { defineConfig } from "tunewind"

type Scheme = NonNullable<NonNullable<TuneConfig["theme"]>["schemes"]>[string]
type Palette = NonNullable<Scheme["palette"]>
type Shades = NonNullable<Scheme["shade"]>

/** 语义色阶 */
const shade: Shades = {
  /** 默认文本亮度 */
  fg: { light: 500, dark: 300 },
  /** 弱化文本亮度 */
  fgsoft: { light: 400, dark: 400 },
  /** 加强文本亮度 */
  fgstrong: { light: 600, dark: 200 },
  /** 反色文本 (仅用于 ink, 表现为 light 的白色文本) */
  fginvert: { light: 50, dark: 900 },
  /** 默认背景亮度 (较柔和亮度) */
  bg: { light: 100, dark: 950 },
  /** 加强背景亮度 (较强调亮度) */
  bgstrong: { light: 50, dark: 900 },
  /** 反色背景 (仅用于 primary 和 error, 表现为 light 的深色背景) */
  bginvert: { light: 600, dark: 400 },
  /** 线亮度 (边框, 分割线等) */
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
      // taro 中 1rem 对应 32rpx, 但 1px 却强行替换为 1rpx, 因此 16px = 1rem 关系失效, 此处只能使用 rem 维持单位
      default: "0.25rem",
      x: "0.0625rem",
      h: "0.5rem",
      r: "1rem",
    },
  },
  strict: "bypass",
  diagnostics: "warn",
})
