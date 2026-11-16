import type { Mode, Theme } from "@/types/theme"

/** 主题 class */
export const themeClass: Record<Theme, string> = {
  spring: "theme-spring",
  summer: "theme-summer",
  autumn: "",
}

/** 色彩模式 class */
export const modeClass: Record<Mode, string> = {
  light: "",
  dark: "mode-dark",
}

/** 运行时色板, 对应 tune.config 的 fg 阶 */
export const palette = {
  primary: {
    spring: { light: "#10b981", dark: "#6ee7b7" },
    summer: { light: "#3b82f6", dark: "#93c5fd" },
    autumn: { light: "#f59e0b", dark: "#fcd34d" },
  },
  error: { light: "#f43f5e", dark: "#fda4af" },
  ink: { light: "#a3a3a3", dark: "#a3a3a3" },
} as const
