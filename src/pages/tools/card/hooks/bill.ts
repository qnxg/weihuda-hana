import type { CardGetData, CardRecordListData, CardRecordListQueries } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"

export interface CardBillState {
  /** 校园卡信息 */
  card: CardGetData | null
  /** 当月流水 */
  data: CardRecordListData | null
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 校园卡余额与某月指定类型的流水 */
export function useCardBill({ year, month, type }: CardRecordListQueries): CardBillState {
  const recordKey = useMemo(() => QUERY_KEY.card.recordList({ year, month, type }), [year, month, type])
  const [refreshing, setRefreshing] = useState(false)

  const card = useQuery({
    queryKey: QUERY_KEY.card.get,
    queryFn: ({ signal }) => api.card.get(signal),
  })
  const records = useQuery({
    queryKey: recordKey,
    queryFn: ({ signal }) => api.card.recordList({ year, month, type }, signal),
  })

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.card.get }),
      queryClient.invalidateQueries({ queryKey: recordKey }),
    ]).finally(() => setRefreshing(false))
  }

  return {
    card: card.data ?? null,
    data: records.data ?? null,
    loading: card.isLoading || records.isLoading,
    refreshing,
    refresh,
  }
}
