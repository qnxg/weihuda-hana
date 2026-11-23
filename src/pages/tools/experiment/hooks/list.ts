import type { ExperimentItem, TermInfo } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"

export interface ExperimentListState {
  /** 实验安排 */
  list: ExperimentItem[]
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某学期的实验安排 */
export function useExperiments(term: TermInfo | null): ExperimentListState {
  const key = useMemo(() => QUERY_KEY.experiment.list(term ?? undefined), [term])
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.experiment.list(term, signal)
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
