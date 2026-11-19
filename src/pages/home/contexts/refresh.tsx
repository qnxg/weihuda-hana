import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useMemo, useRef } from "react"

/** 刷新任务 */
export type RefreshTask = () => Promise<unknown>

interface RefreshRegistry {
  /** 注册任务, 同 id 覆盖 */
  register: (id: string, task: RefreshTask) => void
  /** 注销任务 */
  unregister: (id: string) => void
  /** 当前全部任务 */
  collect: () => RefreshTask[]
}

const RefreshContext = createContext<RefreshRegistry | null>(null)

/** 刷新任务注册表 */
export function RefreshProvider({ children }: Readonly<{ children?: ReactNode }>): ReactNode {
  const tasksRef = useRef(new Map<string, RefreshTask>())

  const register = useCallback((id: string, task: RefreshTask) => {
    tasksRef.current.set(id, task)
  }, [])

  const unregister = useCallback((id: string) => {
    tasksRef.current.delete(id)
  }, [])

  const collect = useCallback(() => [
    ...tasksRef.current.values(),
  ], [])

  const value = useMemo(() => ({ register, unregister, collect }), [register, unregister, collect])

  return (
    <RefreshContext.Provider value={value}>
      {children}
    </RefreshContext.Provider>
  )
}

/** 取注册表, 必须在 RefreshProvider 内使用 */
export function useRefreshRegistry(): RefreshRegistry {
  const value = useContext(RefreshContext)

  if (!value)
    throw new Error("useRefreshRegistry must be used inside RefreshProvider")

  return value
}
