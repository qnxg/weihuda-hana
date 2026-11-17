import type { ReactNode } from "react"
import type { ModalEntry } from "@/types/modal"
import { useCallback, useEffect, useId, useState } from "react"
import { duration } from "@/config/animation"
import { useModalApiContext, useModalEntriesContext } from "@/contexts/modal"

let seed = 0

/** 生成 id */
function createId(): string {
  seed += 1
  return `modal-${seed}`
}

interface UseModalResult {
  /** 挂载节点 */
  mount: (node: ReactNode) => string
  /** 更新节点 */
  update: (id: string, node: ReactNode) => void
  /** 卸载节点 */
  unmount: (id: string) => void
}

/** 模态层控制 */
export function useModal(): UseModalResult {
  const { setEntry, removeEntry } = useModalApiContext()

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

  return { mount, update, unmount }
}

interface UseModalPresenceResult {
  /** 在场 */
  present: boolean
  /** 激活 */
  active: boolean
}

/** 模态层在场状态 */
export function useModalPresence(
  visible: boolean,
  render: (active: boolean) => ReactNode,
): UseModalPresenceResult {
  const { update, unmount } = useModal()
  const id = useId()
  const [present, setPresent] = useState(visible)
  const [active, setActive] = useState(visible)

  useEffect(() => {
    if (visible) {
      setPresent(true)
      const timer = setTimeout(setActive, 0, true)
      return () => clearTimeout(timer)
    }

    setActive(false)
    const timer = setTimeout(setPresent, duration, false)
    return () => clearTimeout(timer)
  }, [visible])

  const node = render(active)

  useEffect(() => {
    if (present)
      update(id, node)
    else
      unmount(id)
  }, [id, node, present, unmount, update])

  useEffect(() => () => unmount(id), [id, unmount])

  return { present, active }
}

/** 模态层条目 */
export function useModalEntries(): ModalEntry[] {
  return useModalEntriesContext()
}
