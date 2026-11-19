import type { GradeGetData, GradeGetParams, GradeListData, GradeListQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const grade = {
  list: (queries: GradeListQueries, signal?: AbortSignal) => request.add({ signal }).get<GradeListData>("/grade", queries),
  get: ({ detailId }: GradeGetParams, signal?: AbortSignal) => request.add({ signal }).get<GradeGetData>(`/grade/${detailId}`),
}
