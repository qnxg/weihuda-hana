import type { ExperimentListData, ExperimentListQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const experiment = {
  list: (queries: ExperimentListQueries, signal?: AbortSignal) => request.add({ signal }).get<ExperimentListData>("/experiment", queries),
}
