import type { RefreshTask } from "@/pages/home/contexts/refresh"
import { useCallback, useEffect, useRef, useState } from "react"
import { queryClient } from "@/hooks/query"
import { useRefreshRegistry } from "@/pages/home/contexts/refresh"

/** 按查询键注册刷新任务 */
export function useRefreshable(key: readonly unknown[]): void {
  const { register, unregister } = useRefreshRegistry()
  const id = JSON.stringify(key)

  useEffect(() => {
    register(id, () => queryClient.invalidateQueries({ queryKey: key }))
    return () => unregister(id)
  }, [id, key, register, unregister])
}

/** 注册自定义刷新任务 */
export function useRefreshTask(id: string, task: RefreshTask): void {
  const { register, unregister } = useRefreshRegistry()
  const taskRef = useRef(task)
  taskRef.current = task

  useEffect(() => {
    register(id, () => taskRef.current())
    return () => unregister(id)
  }, [id, register, unregister])
}

export interface RefreshResult {
  /** 是否刷新中 */
  refreshing: boolean
  /** 触发全部任务 */
  refresh: () => void
}

/** 首页的刷新编排 */
export function useRefresh(): RefreshResult {
  const { collect } = useRefreshRegistry()
  const [refreshing, setRefreshing] = useState(false)
  const pendingRef = useRef(false)

  const refresh = useCallback(() => {
    if (pendingRef.current)
      return

    pendingRef.current = true
    setRefreshing(true)

    void Promise.allSettled(collect().map(run => run())).finally(() => {
      pendingRef.current = false
      setRefreshing(false)
    })
  }, [collect])

  return { refreshing, refresh }
}
