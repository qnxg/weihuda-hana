import type { ReactNode } from "react"

/** 挂在模态层的节点 */
export interface ModalEntry {
  /** 模态层 id */
  id: string
  /** 模态层节点 */
  node: ReactNode
}
