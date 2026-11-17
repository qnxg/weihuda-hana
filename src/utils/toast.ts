import type { ToastOptions, ToastType } from "@/types/toast"
import { createElement } from "react"
import Toast from "@/components/notice/toast"
import { DURATION } from "@/config/duration"
import { useToastStore } from "@/stores/toast"
import { notice } from "@/utils/notice"

/** 展示提示 */
function show(message: string, options: ToastOptions = {}): void {
  notice.mount(createElement(Toast), "toast")
  useToastStore.getState().show(message, options.type ?? "info", options.duration ?? DURATION.toast)
}

/** 按类型展示 */
function typed(type: ToastType) {
  return (message: string, duration?: number): void => show(message, { type, duration })
}

/** 提示的命令式入口 */
export const toast = {
  show,
  /** 成功 */
  success: typed("success"),
  /** 失败 */
  error: typed("error"),
  /** 信息 */
  info: typed("info"),
  /** 加载中, 常驻直到被覆盖或手动关闭 */
  loading: (message: string): void => show(message, { type: "loading", duration: 0 }),
  /** 移除提示 */
  hide: (): void => useToastStore.getState().hide(),
}
