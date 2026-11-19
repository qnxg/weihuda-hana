import type { Mode, ModeChoice, Theme, ThemeChoice } from "@/types/theme"
import { onThemeChange } from "@tarojs/taro"
import { od } from "@xtwis/ohday"
import { useState } from "react"
import { MODE_CLASS, THEME_CLASS } from "@/config/theme"
import { useThemeStore } from "@/stores/theme"

/** 注册系统色彩模式监听, 应用启动时调用一次 */
export function initTheme(): void {
  if (typeof onThemeChange !== "function")
    return

  const { setSystem } = useThemeStore.getState()

  onThemeChange(result => setSystem(result.theme))
}

/** 按月份推断主题, 学期接口接入后改为按学期范围判断 */
function themeOf(month: number): Theme {
  if (month >= 2 && month <= 6)
    return "spring"

  if (month === 7 || month === 8)
    return "summer"

  return "autumn"
}

export interface ThemeResult {
  /** 应用到根节点的 class */
  className: string
  /** 解析后的主题 */
  theme: Theme
  /** 解析后的色彩模式 */
  mode: Mode
  /** 主题选择 */
  themeChoice: ThemeChoice
  /** 色彩模式选择 */
  modeChoice: ModeChoice
  /** 设置主题 */
  setThemeChoice: (theme: ThemeChoice) => void
  /** 设置色彩模式 */
  setModeChoice: (mode: ModeChoice) => void
}

/** 主题与色彩模式, 解析 auto 并产出根节点 class */
export function useTheme(): Readonly<ThemeResult> {
  const themeChoice = useThemeStore(state => state.theme)
  const modeChoice = useThemeStore(state => state.mode)
  const setThemeChoice = useThemeStore(state => state.setThemeChoice)
  const setModeChoice = useThemeStore(state => state.setModeChoice)
  const system = useThemeStore(state => state.system)
  const [month] = useState(() => od().month)

  const theme = themeChoice === "auto"
    ? themeOf(month)
    : themeChoice
  const mode = modeChoice === "auto"
    ? system
    : modeChoice

  return {
    className: `${THEME_CLASS[theme]} ${MODE_CLASS[mode]}`.trim(),
    theme,
    mode,
    themeChoice,
    modeChoice,
    setThemeChoice,
    setModeChoice,
  }
}
