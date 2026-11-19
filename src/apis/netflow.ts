import type { NetflowDetailGetData, NetflowDetailGetQueries, NetflowGetData, NetflowOrderListData } from "@contract/routes"
import { request } from "@/utils/request"

export const netflow = {
  get: (signal?: AbortSignal) => request.add({ signal }).get<NetflowGetData>("/netflow"),
  orderList: (signal?: AbortSignal) => request.add({ signal }).get<NetflowOrderListData>("/netflow/order"),
  detail: (queries: NetflowDetailGetQueries, signal?: AbortSignal) => request.add({ signal }).get<NetflowDetailGetData>("/netflow/detail", queries),
}
