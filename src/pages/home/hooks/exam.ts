import type { ExamItem, Term } from "@contract/routes"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface ExamList {
  /** 考试安排 */
  list: ExamItem[]
  /** 是否加载中 */
  loading: boolean
}

/** 某学期的考试安排, 过滤与排序在组件层完成 */
export function useExam(term: Term | undefined): ExamList {
  const key = useMemo(() => QUERY_KEY.exam.list(term), [term])

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.exam.list(term, signal)
    },
    enabled: term !== undefined,
  })

  useRefreshable(key)

  return { list: query.data ?? [], loading: query.isLoading }
}
