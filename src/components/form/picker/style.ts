import type { Mode } from "@/types/theme"

/** 生成上下两端淡出的蒙层 */
function fadeMask(color: string, clear: string): string {
  return `linear-gradient(180deg, ${color} 0%, ${clear} 100%), linear-gradient(0deg, ${color} 0%, ${clear} 100%)`
}

/** 蒙层渐变, 对应 bg-strong, 不随系统色彩模式变化 */
export const MASK: Record<Mode, string> = {
  light: fadeMask("#fafafa", "rgba(250, 250, 250, 0)"),
  dark: fadeMask("#262626", "rgba(38, 38, 38, 0)"),
}

/** 选中框线色, 对应 line */
export const LINE: Record<Mode, string> = {
  light: "#e5e5e5",
  dark: "#404040",
}
