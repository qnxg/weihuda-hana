import type { PointRecordItem } from "@contract/routes"
import { useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useInfiniteQuery } from "@/hooks/query"

/** 每页条数 */
const SIZE = 20

export interface PointRecordState {
  /** 已加载记录 */
  list: PointRecordItem[]
  /** 总条数 */
  total: number
  /** 首屏是否加载中 */
  loading: boolean
  /** 是否加载更多中 */
  loadingMore: boolean
  /** 是否还有下一页 */
  hasMore: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 加载更多 */
  more: () => void
  /** 刷新 */
  refresh: () => void
}

/** 积分记录, 分页累积 */
export function usePointRecords(): PointRecordState {
  const [refreshing, setRefreshing] = useState(false)

  const query = useInfiniteQuery({
    queryKey: QUERY_KEY.point.record,
    queryFn: ({ pageParam, signal }) => api.point.recordList({ page: pageParam, size: SIZE }, signal),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const loaded = last.page * last.size

      return loaded < last.total
        ? last.page + 1
        : undefined
    },
  })

  const list = query.data?.pages.flatMap(page => page.list) ?? []

  function more(): void {
    if (query.hasNextPage && !query.isFetchingNextPage)
      void query.fetchNextPage()
  }

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void query.refetch().finally(() => setRefreshing(false))
  }

  return {
    list,
    total: query.data?.pages[0]?.total ?? 0,
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    refreshing,
    more,
    refresh,
  }
}
