import type { NetflowOrderItem } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import { sortOrders } from "@/pages/tools/netflow/model/netflow"

export interface NetflowOrderState {
  /** 账单, 按年月倒序 */
  list: NetflowOrderItem[]
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 流量账单 */
export function useNetflowOrders(): NetflowOrderState {
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: QUERY_KEY.netflow.orderList,
    queryFn: ({ signal }) => api.netflow.orderList(signal),
  })

  const list = useMemo(() => sortOrders(query.data ?? []), [query.data])

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.netflow.orderList }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.netflow.get }),
    ]).finally(() => setRefreshing(false))
  }

  return {
    list,
    loading: query.isLoading,
    refreshing,
    refresh,
  }
}
