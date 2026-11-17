import type { ReactNode } from "react"
import type { NoticeEntry } from "@/types/notice"
import { useNoticeStore } from "@/stores/notice"

export interface UseNoticeResult {
  /** 提示列表 */
  entries: NoticeEntry[]
  /** 挂载节点 */
  mount: (node: ReactNode) => string
  /** 卸载节点 */
  unmount: (id: string) => void
}

/** 提示层状态 */
export function useNotice(): UseNoticeResult {
  const entries = useNoticeStore(state => state.entries)
  const mount = useNoticeStore(state => state.mount)
  const unmount = useNoticeStore(state => state.unmount)

  return { entries, mount, unmount }
}
