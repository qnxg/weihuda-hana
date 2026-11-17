import type { ReactNode } from "react"
import type { ModalEntry } from "@/types/modal"
import { createContext, useCallback, useContext, useMemo, useState } from "react"

interface ModalApiValue {
  /** 写入节点 */
  setEntry: (id: string, node: ReactNode) => void
  /** 移除节点 */
  removeEntry: (id: string) => void
}

const EntriesContext = createContext<ModalEntry[] | null>(null)

const ApiContext = createContext<ModalApiValue | null>(null)

/** 读取条目 */
export function useModalEntriesContext(): ModalEntry[] {
  const context = useContext(EntriesContext)

  if (!context)
    throw new Error("useModalEntriesContext must be used within a ModalProvider")

  return context
}

/** 读取写接口 */
export function useModalApiContext(): ModalApiValue {
  const context = useContext(ApiContext)

  if (!context)
    throw new Error("useModalApiContext must be used within a ModalProvider")

  return context
}

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

  const api = useMemo(() => ({ setEntry, removeEntry }), [setEntry, removeEntry])

  return (
    <ApiContext.Provider value={api}>
      <EntriesContext.Provider value={entries}>
        {children}
      </EntriesContext.Provider>
    </ApiContext.Provider>
  )
}
