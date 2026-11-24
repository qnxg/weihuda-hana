import type { ExperimentBindPayload, ExperimentGradeData, ExperimentGradeQueries, ExperimentListData, ExperimentListQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const experiment = {
  list: (queries: ExperimentListQueries, signal?: AbortSignal) => request.add({ signal }).get<ExperimentListData>("/experiment", queries),
  grade: (queries: ExperimentGradeQueries, signal?: AbortSignal) => request.add({ signal }).get<ExperimentGradeData>("/experiment/grade", queries),
  bind: (payload: ExperimentBindPayload) => request.post<null>("/experiment/bind", payload),
  unbind: () => request.post<null>("/experiment/unbind"),
}
