import type { RankCaGetData, RankGetData, RankGetQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const rank = {
  caGet: (signal?: AbortSignal) => request.add({ signal }).get<RankCaGetData>("/rank/ca"),
  caRefresh: () => request.post<null>("/rank/ca/refresh"),
  get: (queries: RankGetQueries, signal?: AbortSignal) => request.add({ signal }).get<RankGetData>("/rank", queries),
}
