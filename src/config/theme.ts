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
  ink: { light: "#525252", dark: "#d4d4d4" },
} as const
