/** 操作按钮 */
export interface SnackbarAction {
  /** 文案 */
  text: string
  /** 点击 */
  onTap: () => void
}

/** 通知选项 */
export interface SnackbarOptions {
  /** 时长, 0 为常驻 */
  duration?: number
  /** 操作 */
  action?: SnackbarAction
}

/** 一条通知 */
export interface SnackbarItem {
  /** 标识 */
  id: string
  /** 文案 */
  message: string
  /** 操作 */
  action?: SnackbarAction
  /** 开始时间, 0 为排队中 */
  startAt: number
  /** 时长 */
  duration: number
}
