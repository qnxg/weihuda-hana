import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"
import { getReadAt, parseTime } from "@/utils/announcement"

export interface AnnouncementState {
  /** 是否有未读 */
  unread: boolean
  /** 是否加载中 */
  loading: boolean
}

/** 公告未读状态, 已读时间记录在本地 */
export function useAnnouncements(): AnnouncementState {
  const query = useQuery({
    queryKey: QUERY_KEY.announcement.list,
    queryFn: ({ signal }) => api.announcement.list(signal),
  })

  useRefreshable(QUERY_KEY.announcement.list)

  const readAt = getReadAt()
  const unread = query.data?.some(item => parseTime(item.createdAt) > readAt) ?? false

  return { unread, loading: query.isLoading }
}
