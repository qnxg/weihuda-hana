import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

interface Dorm {
  /** 园区 */
  park: string
  /** 楼栋 */
  build: string
  /** 房间号 */
  room: string
}

interface Electricity {
  /** 剩余电量, 单位度 */
  balance: number
}

export const dorm = {
  get: endpoint.codes([CODE.notFound, CODE.upstream.failed, CODE.upstream.timeout]).get<never, never, Dorm>("/dorm", "宿舍"),
  refresh: endpoint.codes([CODE.notFound, CODE.upstream.failed, CODE.upstream.timeout]).post<never, never, null>("/dorm/refresh", "重新获取宿舍信息"),
  electricityGet: endpoint.codes([CODE.notFound, CODE.upstream.failed, CODE.upstream.timeout]).get<never, never, Electricity>("/dorm/electricity", "剩余电量"),
  electricityRefresh: endpoint.codes([CODE.notFound, CODE.upstream.failed, CODE.upstream.timeout]).post<never, never, null>("/dorm/electricity/refresh", "重新获取剩余电量"),
}

export type DormGet = ApiSpec<typeof dorm.get>
export type DormGetData = Data<DormGet>

export type DormRefresh = ApiSpec<typeof dorm.refresh>

export type ElectricityGet = ApiSpec<typeof dorm.electricityGet>
export type ElectricityGetData = Data<ElectricityGet>

export type ElectricityRefresh = ApiSpec<typeof dorm.electricityRefresh>
