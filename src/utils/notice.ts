import type { ReactNode } from "react"
import { useNoticeStore } from "@/stores/notice"

const hosts = new Map<string, string>()

/** 挂载节点, 已挂载的 key 复用 */
function mount(node: ReactNode, key: string): string {
  const { entries, mount: register } = useNoticeStore.getState()
  const id = hosts.get(key)

  if (id && entries.some(entry => entry.id === id))
    return id

  const next = register(node)
  hosts.set(key, next)
  return next
}

/** 卸载节点 */
function unmount(id: string): void {
  useNoticeStore.getState().unmount(id)
}

/** 提示层的命令式入口, 供非组件代码调用 */
export const notice = { mount, unmount }
