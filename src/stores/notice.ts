import type { ReactNode } from "react"
import type { NoticeEntry } from "@/types/notice"
import { create } from "zustand"
import { createId } from "@/utils/id"

interface NoticeState {
  /** 提示列表 */
  entries: NoticeEntry[]
  /** 挂载节点 */
  mount: (node: ReactNode) => string
  /** 卸载节点 */
  unmount: (id: string) => void
}

/** 提示层状态, 只负责挂载与卸载 */
export const useNoticeStore = create<NoticeState>()(set => ({
  entries: [],
  mount: (node) => {
    const id = createId("notice")
    const entry: NoticeEntry = { id, node }

    set(state => ({
      entries: [...state.entries, entry],
    }))
    return id
  },
  unmount: id => set(state => ({
    entries: state.entries.filter(entry => entry.id !== id),
  })),
}))
