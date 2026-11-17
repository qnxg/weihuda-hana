import type { SnackbarOptions } from "@/types/snackbar"
import { createElement } from "react"
import Snackbar from "@/components/notice/snackbar"
import { useSnackbarStore } from "@/stores/snackbar"
import { notice } from "@/utils/notice"

/** 展示通知 */
function show(message: string, options: SnackbarOptions = {}): string {
  notice.mount(createElement(Snackbar), "snackbar")
  return useSnackbarStore.getState().show(message, options)
}

/** 通知的命令式入口 */
export const snackbar = {
  show,
  /** 移除当前 */
  hide: (): void => useSnackbarStore.getState().hide(),
}
