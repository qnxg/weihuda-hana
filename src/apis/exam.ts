import type { ExamCreatePayload, ExamListData, ExamListQueries, ExamRemoveParams, ExamUpdateParams, ExamUpdatePayload } from "@contract/routes"
import { request } from "@/utils/request"

export const exam = {
  list: (queries: ExamListQueries, signal?: AbortSignal) => request.add({ signal }).get<ExamListData>("/exam", queries),
  create: (payload: ExamCreatePayload) => request.post<null>("/exam", payload),
  update: ({ customizeId }: ExamUpdateParams, payload: ExamUpdatePayload) => request.put<null>(`/exam/${customizeId}`, payload),
  remove: ({ customizeId }: ExamRemoveParams) => request.delete<null>(`/exam/${customizeId}`),
}
