import type { AnnouncementItem } from "@contract/routes"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface AnnouncementState {
  /** 公告列表, 按发布时间降序 */
  list: AnnouncementItem[]
  /** 是否有未读 */
  unread: boolean
  /** 是否加载中 */
  loading: boolean
  /** 标记单条已读 */
  mark: (id: number) => void
  /** 标记全部已读 */
  markAll: () => void
}

/** 公告列表与未读状态 */
export function useAnnouncements(): AnnouncementState {
  const query = useQuery({
    queryKey: QUERY_KEY.announcement.list,
    queryFn: ({ signal }) => api.announcement.list(signal),
  })

  useRefreshable(QUERY_KEY.announcement.list)

  const refresh = (): void => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY.announcement.list })
  }

  const single = useMutation({
    mutationFn: (id: number) => api.announcement.read({
      id: String(id),
    }),
    onSuccess: refresh,
  })

  const all = useMutation({
    mutationFn: () => api.announcement.readAll(),
    onSuccess: refresh,
  })

  const list = [
    ...(query.data ?? []),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  return {
    list,
    unread: list.some(item => !item.read),
    loading: query.isLoading,
    mark: single.mutate,
    markAll: all.mutate,
  }
}
