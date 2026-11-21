import type { Term, TodoItem } from "@contract/routes"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface TodoList {
  /** 自定义待办 */
  list: TodoItem[]
  /** 是否加载中 */
  loading: boolean
}

/** 某学期的自定义待办, 过滤与排序在组件层完成 */
export function useTodo(term: Term | undefined): TodoList {
  const key = useMemo(() => QUERY_KEY.todo.list(term), [term])

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.todo.list(term, signal)
    },
    enabled: term !== undefined,
  })

  useRefreshable(key)

  return { list: query.data ?? [], loading: query.isLoading }
}
