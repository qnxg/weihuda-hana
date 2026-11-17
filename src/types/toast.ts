/** 提示类型 */
export type ToastType = "success" | "error" | "info" | "loading"

/** 提示选项 */
export interface ToastOptions {
  /** 类型 */
  type?: ToastType
  /** 时长, 0 为常驻 */
  duration?: number
}

/** 一条提示 */
export interface ToastItem {
  /** 类型 */
  type: ToastType
  /** 文案 */
  message: string
  /** 开始时间 */
  startAt: number
  /** 时长 */
  duration: number
}
