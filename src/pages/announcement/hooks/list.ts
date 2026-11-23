import type { AnnouncementItem } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { sortOf } from "@/pages/announcement/model/announcement"

export interface AnnouncementListState {
  /** 公告列表, 按发布时间倒序 */
  list: AnnouncementItem[]
  /** 是否加载中 */
  loading: boolean
  /** 是否有未读 */
  unread: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 是否标记中 */
  marking: boolean
  /** 刷新 */
  refresh: () => void
  /** 全部已读 */
  readAll: () => void
}

/** 公告列表 */
export function useAnnouncementList(): AnnouncementListState {
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: QUERY_KEY.announcement.list,
    queryFn: ({ signal }) => api.announcement.list(signal),
  })

  const list = useMemo(() => sortOf(query.data ?? []), [query.data])

  const readAll = useMutation({
    mutationFn: () => api.announcement.readAll(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.announcement.list })
    },
  })

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY.announcement.list }).finally(() => setRefreshing(false))
  }

  return {
    list,
    loading: query.isLoading,
    unread: list.some(item => !item.read),
    refreshing,
    marking: readAll.isPending,
    refresh,
    readAll: readAll.mutate,
  }
}
