import type { Mode, Theme } from "@/types/theme"

/** 主题 class */
export const THEME_CLASS: Record<Theme, string> = {
  spring: "theme-spring",
  summer: "theme-summer",
  autumn: "",
}

/** 色彩模式 class */
export const MODE_CLASS: Record<Mode, string> = {
  light: "",
  dark: "mode-dark",
}

/** 运行时色板, 对应 tune.config 的 fg 阶 */
export const PALETTE = {
  primary: {
    spring: { light: "#059669", dark: "#6ee7b7" },
    summer: { light: "#2563eb", dark: "#93c5fd" },
    autumn: { light: "#d97706", dark: "#fcd34d" },
  },
  error: { light: "#e11d48", dark: "#fda4af" },
  /** 反色文本, 与 bginvert 背景搭配 */
  invert: { light: "#fafafa", dark: "#171717" },
  ink: { light: "#525252", dark: "#d4d4d4" },
} as const

/** 强调色板, 只用于装饰, 对应 tune.config 的 fg 阶 */
export const ACCENT = {
  sky: { light: "#0084d1", dark: "#74d4ff" },
  cyan: { light: "#0092b8", dark: "#53eafd" },
  teal: { light: "#009689", dark: "#46ecd5" },
  emerald: { light: "#009966", dark: "#5ee9b5" },
  violet: { light: "#7f22fe", dark: "#c4b4ff" },
  fuchsia: { light: "#c800de", dark: "#f4a8ff" },
  orange: { light: "#f54900", dark: "#ffb86a" },
  indigo: { light: "#4f39f6", dark: "#a3b3ff" },
} as const

/** 强调色名 */
export type AccentColor = keyof typeof ACCENT

/** 图标底色可选的颜色 */
export type BadgeTint = AccentColor | "primary"

/** 图标底色 class */
export const BADGE_BG: Record<BadgeTint, string> = {
  primary: "bg-primary",
  sky: "raw:bg-sky-bg",
  cyan: "raw:bg-cyan-bg",
  teal: "raw:bg-teal-bg",
  emerald: "raw:bg-emerald-bg",
  violet: "raw:bg-violet-bg",
  fuchsia: "raw:bg-fuchsia-bg",
  orange: "raw:bg-orange-bg",
  indigo: "raw:bg-indigo-bg",
}
