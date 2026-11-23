import type { PointExchangeItem, PointGoodsItem } from "@contract/routes"
import { useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { handleError } from "@/utils/error"

export interface PointShopState {
  /** 商品 */
  goods: PointGoodsItem[]
  /** 待领取 */
  exchanges: PointExchangeItem[]
  /** 是否加载中 */
  loading: boolean
  /** 是否兑换中 */
  exchanging: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
  /** 兑换 */
  exchange: (id: number) => Promise<PointExchangeItem>
}

/** 积分商城与待领取 */
export function usePointShop(): PointShopState {
  const [refreshing, setRefreshing] = useState(false)

  const goods = useQuery({
    queryKey: QUERY_KEY.point.goods,
    queryFn: ({ signal }) => api.point.goodsList(signal),
  })
  const exchanges = useQuery({
    queryKey: QUERY_KEY.point.exchange,
    queryFn: ({ signal }) => api.point.exchangeList(signal),
  })

  const exchange = useMutation({
    mutationFn: (id: number) => api.point.exchange({
      id: String(id),
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.get })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.goods })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.exchange })
    },
    onError: handleError(),
  })

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.goods }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.point.exchange }),
    ]).finally(() => setRefreshing(false))
  }

  return {
    goods: goods.data ?? [],
    exchanges: exchanges.data ?? [],
    loading: goods.isLoading || exchanges.isLoading,
    exchanging: exchange.isPending,
    refreshing,
    refresh,
    exchange: exchange.mutateAsync,
  }
}
