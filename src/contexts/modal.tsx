import type { ReactNode } from "react"
import type { ModalEntry } from "@/types/modal"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

interface ModalContextValue {
  /** 模态层节点 */
  entries: ModalEntry[]
  /** 写入节点 */
  setEntry: (id: string, node: ReactNode) => void
  /** 移除节点 */
  removeEntry: (id: string) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

/** 模态层容器 */
export function ModalProvider({ children }: Readonly<{ children?: ReactNode }>): ReactNode {
  const [entries, setEntries] = useState<ModalEntry[]>([])

  const setEntry = useCallback((id: string, node: ReactNode) => {
    setEntries((list) => {
      const index = list.findIndex(item => item.id === id)

      if (index === -1) {
        return [
          ...list,
          { id, node },
        ]
      }

      const next = list.slice()
      next[index] = { id, node }
      return next
    })
  }, [])

  const removeEntry = useCallback((id: string) => {
    setEntries(list => list.filter(item => item.id !== id))
  }, [])

  const value = useMemo(
    () => ({ entries, setEntry, removeEntry }),
    [entries, setEntry, removeEntry],
  )

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  )
}

/** 读取状态 */
export function useModalContext(): ModalContextValue {
  const context = useContext(ModalContext)

  if (!context)
    throw new Error("useModalContext must be used within a ModalProvider")

  return context
}
