import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"

export interface PointDescState {
  /** 说明文本 */
  description: string | null
  /** 是否加载中 */
  loading: boolean
}

/** 积分规则说明 */
export function usePointDesc(): PointDescState {
  const query = useQuery({
    queryKey: QUERY_KEY.point.desc,
    queryFn: ({ signal }) => api.point.desc(signal),
  })

  return {
    description: query.data?.description ?? null,
    loading: query.isLoading,
  }
}
