import type { Mode, ModeChoice, ThemeChoice } from "@/types/theme"
import { getSystemInfoSync } from "@tarojs/taro"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { storageKey } from "@/config/storage"
import { storage } from "@/utils/storage"

/** 系统色彩模式 */
function systemMode(): Mode {
  return getSystemInfoSync().theme === "dark"
    ? "dark"
    : "light"
}

interface ThemeState {
  /** 主题选择 */
  theme: ThemeChoice
  /** 色彩模式选择 */
  mode: ModeChoice
  /** 系统色彩模式 */
  system: Mode
  /** 设置主题选择 */
  setThemeChoice: (theme: ThemeChoice) => void
  /** 设置色彩模式选择 */
  setModeChoice: (mode: ModeChoice) => void
  /** 设置系统色彩模式 */
  setSystem: (mode: Mode) => void
}

/** 主题状态, 保存用户选择与系统色彩模式, auto 的解析在 hooks 里做 */
export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: "auto",
      mode: "auto",
      system: systemMode(),
      setThemeChoice: theme => set({ theme }),
      setModeChoice: mode => set({ mode }),
      setSystem: system => set({ system }),
    }),
    {
      name: storageKey.theme,
      storage: createJSONStorage(() => storage),
      partialize: state => ({ theme: state.theme, mode: state.mode }),
    },
  ),
)
