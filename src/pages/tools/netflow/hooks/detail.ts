import type { NetflowDetailGetData } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"

export interface NetflowDetailState {
  /** 流量明细 */
  data: NetflowDetailGetData | null
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某月或某日的流量明细 */
export function useNetflowDetail(year: number, month: number, day?: number): NetflowDetailState {
  const [refreshing, setRefreshing] = useState(false)
  const key = useMemo(() => QUERY_KEY.netflow.detail({ year, month, day }), [year, month, day])

  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => api.netflow.detail({ year, month, day }, signal),
  })

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: key }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.netflow.get }),
    ]).finally(() => setRefreshing(false))
  }

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    refreshing,
    refresh,
  }
}
