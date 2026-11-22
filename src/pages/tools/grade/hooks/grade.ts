import type { GradeItem, Term } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"

export interface GradeState {
  /** 成绩列表 */
  list: GradeItem[]
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某学期的成绩 */
export function useGrade(term: Term | null): GradeState {
  const key = useMemo(() => QUERY_KEY.grade.list(term ?? undefined), [term])
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.grade.list(term, signal)
    },
    enabled: term !== null,
  })

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: key }).finally(() => setRefreshing(false))
  }

  return {
    list: query.data ?? [],
    loading: query.isLoading,
    refreshing,
    refresh,
  }
}
