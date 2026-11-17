import type { ReactNode } from "react"

/** 挂在提示层的节点 */
export interface NoticeEntry {
  /** 标识 */
  id: string
  /** 节点 */
  node: ReactNode
}
