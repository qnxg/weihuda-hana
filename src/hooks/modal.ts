import type { ReactNode } from "react"
import type { ModalEntry } from "@/types/modal"
import { useCallback } from "react"
import { useModalContext } from "@/contexts/modal"

let seed = 0

/** 生成 id */
function createId(): string {
  seed += 1
  return `modal-${seed}`
}

interface UseModalResult {
  /** 模态层节点 */
  entries: ModalEntry[]
  /** 挂载节点 */
  mount: (node: ReactNode) => string
  /** 更新节点 */
  update: (id: string, node: ReactNode) => void
  /** 卸载节点 */
  unmount: (id: string) => void
}

/** 模态层控制 */
export function useModal(): UseModalResult {
  const { entries, setEntry, removeEntry } = useModalContext()

  const mount = useCallback((node: ReactNode) => {
    const id = createId()
    setEntry(id, node)
    return id
  }, [setEntry])

  const update = useCallback((id: string, node: ReactNode) => {
    setEntry(id, node)
  }, [setEntry])

  const unmount = useCallback((id: string) => {
    removeEntry(id)
  }, [removeEntry])

  return { entries, mount, update, unmount }
}
