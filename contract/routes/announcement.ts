import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"

interface AnnouncementItem {
  /** 公告 id */
  id: number
  /** 标题 */
  title: string
  /** 跳转链接 */
  url: string | null
  /** 内容 */
  content: string
  /** 发布时间, 格式 YYYY-MM-DD HH:mm:ss */
  createdAt: string
}

export const announcement = {
  list: endpoint.public().get<never, never, AnnouncementItem[]>("/announcement", "公告列表"),
}

export type AnnouncementList = ApiSpec<typeof announcement.list>
export type AnnouncementListData = Data<AnnouncementList>
export type { AnnouncementItem }
