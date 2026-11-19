import type {
  PointCheckData,
  PointDescData,
  PointExchangeData,
  PointExchangeListData,
  PointExchangeParams,
  PointGetData,
  PointGoodsListData,
  PointRecordListData,
  PointRecordListQueries,
} from "@contract/routes"
import { request } from "@/utils/request"

export const point = {
  get: (signal?: AbortSignal) => request.add({ signal }).get<PointGetData>("/point"),
  check: () => request.post<PointCheckData>("/point"),
  recordList: (queries: PointRecordListQueries, signal?: AbortSignal) => request.add({ signal }).get<PointRecordListData>("/point/record", queries),
  goodsList: (signal?: AbortSignal) => request.add({ signal }).get<PointGoodsListData>("/point/goods"),
  exchange: ({ id }: PointExchangeParams) => request.post<PointExchangeData>(`/point/goods/${id}`),
  exchangeList: (signal?: AbortSignal) => request.add({ signal }).get<PointExchangeListData>("/point/exchange"),
  desc: (signal?: AbortSignal) => request.add({ signal }).get<PointDescData>("/point/desc"),
}
