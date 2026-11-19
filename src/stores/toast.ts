import type { ToastItem, ToastType } from "@/types/toast"
import { od } from "@xtwis/ohday"
import { create } from "zustand"

interface ToastState {
  /** 当前提示 */
  current: ToastItem | null
  /** 新增提示 */
  show: (message: string, type: ToastType, duration: number) => void
  /** 移除提示 */
  hide: () => void
}

/** 提示状态, 后来者覆盖前者 */
export const useToastStore = create<ToastState>()(set => ({
  current: null,
  show: (message, type, duration) =>
    set({
      current: {
        message,
        type,
        startAt: od().ts,
        duration,
      },
    }),
  hide: () => set({ current: null }),
}))
