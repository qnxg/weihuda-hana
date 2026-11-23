import type { PointGetData } from "@contract/routes"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { handleError } from "@/utils/error"
import { toast } from "@/utils/toast"

export interface PointInfoState {
  /** 积分与签到状态 */
  info: PointGetData | null
  /** 是否加载中 */
  loading: boolean
  /** 是否签到中 */
  checking: boolean
  /** 签到 */
  check: () => void
}

/** 积分与签到 */
export function usePointInfo(): PointInfoState {
  const query = useQuery({
    queryKey: QUERY_KEY.point.get,
    queryFn: ({ signal }) => api.point.get(signal),
  })

  const check = useMutation({
    mutationFn: () => api.point.check(),
    onSuccess: (data) => {
      toast.success(`签到成功, 获得 ${data.delta} 积分`)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.get })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.record })
    },
    onError: handleError(),
  })

  return {
    info: query.data ?? null,
    loading: query.isLoading,
    checking: check.isPending,
    check: check.mutate,
  }
}
