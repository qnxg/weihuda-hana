import type { CardGetData, CardRecordListData, CardRecordListQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const card = {
  get: (signal?: AbortSignal) => request.add({ signal }).get<CardGetData>("/card"),
  recordList: (queries: CardRecordListQueries, signal?: AbortSignal) => request.add({ signal }).get<CardRecordListData>("/card/record", queries),
}
