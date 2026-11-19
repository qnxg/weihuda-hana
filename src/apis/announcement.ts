import type { AnnouncementListData } from "@contract/routes"
import { request } from "@/utils/request"

export const announcement = {
  list: (signal?: AbortSignal) => request.add({ signal }).get<AnnouncementListData>("/announcement"),
}
