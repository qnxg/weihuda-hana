import type { NetflowGetData } from "@contract/routes"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"

export interface NetflowSummaryState {
  /** 本月流量 */
  data: NetflowGetData | null
  /** 是否加载中 */
  loading: boolean
}

/** 本月流量概览 */
export function useNetflowSummary(): NetflowSummaryState {
  const query = useQuery({
    queryKey: QUERY_KEY.netflow.get,
    queryFn: ({ signal }) => api.netflow.get(signal),
  })

  return {
    data: query.data ?? null,
    loading: query.isLoading,
  }
}
