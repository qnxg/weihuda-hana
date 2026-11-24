import type { RoomBuildingsData, RoomListData, RoomListQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const room = {
  buildings: (signal?: AbortSignal) => request.add({ signal }).get<RoomBuildingsData>("/building"),
  list: (queries: RoomListQueries, signal?: AbortSignal) => request.add({ signal }).get<RoomListData>("/empty_room", queries),
}
