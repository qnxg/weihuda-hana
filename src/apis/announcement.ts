import type { AnnouncementListData, AnnouncementReadParams } from "@contract/routes"
import { request } from "@/utils/request"

export const announcement = {
  list: (signal?: AbortSignal) => request.add({ signal }).get<AnnouncementListData>("/announcement"),
  read: ({ id }: AnnouncementReadParams) => request.post<null>(`/announcement/${id}/read`),
  readAll: () => request.post<null>("/announcement/read"),
}
