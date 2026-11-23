import type { AnnouncementItem } from "@contract/routes"
import { useEffect, useMemo, useRef, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { hasToken } from "@/utils/auth"

export interface AnnouncementDetailState {
  /** 公告, 不存在为 null */
  item: AnnouncementItem | null
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 单条公告, 与列表共用查询, 打开时标记已读 */
export function useAnnouncement(id: string): AnnouncementDetailState {
  const [refreshing, setRefreshing] = useState(false)
  const markedRef = useRef(false)

  const query = useQuery({
    queryKey: QUERY_KEY.announcement.list,
    queryFn: ({ signal }) => api.announcement.list(signal),
  })

  const item = useMemo(() => {
    return query.data?.find(entry => String(entry.id) === id) ?? null
  }, [id, query.data])

  const read = useMutation({
    mutationFn: () => api.announcement.read({ id }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.announcement.list })
    },
  })
  const mark = read.mutate

  useEffect(() => {
    if (!item || item.read || !hasToken() || markedRef.current)
      return

    markedRef.current = true
    mark()
  }, [item, mark])

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY.announcement.list }).finally(() => setRefreshing(false))
  }

  return {
    item,
    loading: query.isLoading,
    refreshing,
    refresh,
  }
}
