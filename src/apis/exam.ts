import type { ExamListData, ExamListQueries } from "@contract/routes"
import { request } from "@/utils/request"

export const exam = {
  list: (queries: ExamListQueries, signal?: AbortSignal) => request.add({ signal }).get<ExamListData>("/exam", queries),
}
