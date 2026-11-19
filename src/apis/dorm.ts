import type { DormGetData, ElectricityGetData } from "@contract/routes"
import { request } from "@/utils/request"

export const dorm = {
  get: (signal?: AbortSignal) => request.add({ signal }).get<DormGetData>("/dorm"),
  refresh: () => request.post<null>("/dorm/refresh"),
  electricityGet: (signal?: AbortSignal) => request.add({ signal }).get<ElectricityGetData>("/dorm/electricity"),
  electricityRefresh: () => request.post<null>("/dorm/electricity/refresh"),
}
