import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

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
  /** 当前账号是否已读, 未登录恒为 false */
  read: boolean
}

/** 路径参数 */
interface ReadParams {
  /** 公告 id */
  id: string
}

export const announcement = {
  list: endpoint.public().get<never, never, AnnouncementItem[]>("/announcement", "公告列表"),
  read: endpoint.internal().codes([CODE.notFound]).post<ReadParams, never, null>("/announcement/:id/read", "标记单条已读"),
  readAll: endpoint.internal().post<never, never, null>("/announcement/read", "标记全部已读"),
}

export type AnnouncementList = ApiSpec<typeof announcement.list>
export type AnnouncementListData = Data<AnnouncementList>

export type AnnouncementRead = ApiSpec<typeof announcement.read>
export type AnnouncementReadParams = ApiSpec<typeof announcement.read>["params"]

export type AnnouncementReadAll = ApiSpec<typeof announcement.readAll>

export type { AnnouncementItem }
