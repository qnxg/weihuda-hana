import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

/** 教学楼 */
interface Building {
  /** 标识 */
  id: string
  /** 名称 */
  name: string
  /** 说明 */
  description: string | null
}

/** 空教室 */
interface RoomItem {
  /** 名称 */
  name: string
  /** 类型 */
  type: string
  /** 普通座位数 */
  seats: number
  /** 考试座位数 */
  examSeats: number
}

/** 空教室查询 */
interface RoomQueries {
  /** 教学楼 id */
  building: string
  /** 日期, 格式 YYYY-MM-DD */
  date: string
  /** 小节次, 逗号分隔 */
  times: string
}

interface RoomData {
  /** 首个节次所在的大节 */
  time: number
  /** 空教室 */
  items: RoomItem[]
}

export const room = {
  buildings: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, never, Building[]>("/building", "教学楼"),
  list: endpoint.codes([CODE.invalid, CODE.upstream.failed, CODE.upstream.timeout]).get<never, RoomQueries, RoomData>("/empty_room", "空教室"),
}

export type RoomBuildings = ApiSpec<typeof room.buildings>
export type RoomBuildingsData = Data<RoomBuildings>

export type RoomList = ApiSpec<typeof room.list>
export type RoomListQueries = Queries<RoomList>
export type RoomListData = Data<RoomList>

export type { Building, RoomItem }
