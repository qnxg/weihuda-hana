import type { ExtraCourseItem, Term } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"

export interface ExtraState {
  /** 无课表课程 */
  list: ExtraCourseItem[]
  /** 课程数, 未加载时为 undefined */
  count?: number
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某学期的无课表课程 */
export function useExtra(term: Term | null, enabled = true): ExtraState {
  const key = useMemo(() => QUERY_KEY.course.extraList(term ?? undefined), [term])
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.course.extraList(term, signal)
    },
    enabled: enabled && term !== null,
  })

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: key }).finally(() => setRefreshing(false))
  }

  return {
    list: query.data ?? [],
    count: query.data?.length,
    loading: query.isLoading,
    refreshing,
    refresh,
  }
}
