import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { hasToken } from "@/utils/auth"

export interface SummaryState {
  /** 积分 */
  points?: number
  /** 未读邮件 */
  mails?: number
  /** 校园卡余额 */
  balance?: number
}

/** 个人页概览数据, 未登录时全部不请求 */
export function useSummary(): SummaryState {
  const enabled = hasToken()

  const points = useQuery({
    queryKey: QUERY_KEY.point.get,
    queryFn: ({ signal }) => api.point.get(signal),
    enabled,
  })

  const mails = useQuery({
    queryKey: QUERY_KEY.email.get,
    queryFn: ({ signal }) => api.email.get(signal),
    enabled,
  })

  const card = useQuery({
    queryKey: QUERY_KEY.card.get,
    queryFn: ({ signal }) => api.card.get(signal),
    enabled,
  })

  return {
    points: points.data?.value,
    mails: mails.data?.count,
    balance: card.data?.balance,
  }
}
