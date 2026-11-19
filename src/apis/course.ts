import type {
  CourseCreateData,
  CourseCreatePayload,
  CourseExtraListData,
  CourseExtraListQueries,
  CourseListData,
  CourseListQueries,
  CourseRemoveParams,
  CourseUpdateData,
  CourseUpdateParams,
  CourseUpdatePayload,
} from "@contract/routes"
import { request } from "@/utils/request"

export const course = {
  list: (queries: CourseListQueries, signal?: AbortSignal) => request.add({ signal }).get<CourseListData>("/course", queries),
  extraList: (queries: CourseExtraListQueries, signal?: AbortSignal) => request.add({ signal }).get<CourseExtraListData>("/course/extra", queries),
  create: (payload: CourseCreatePayload) => request.post<CourseCreateData>("/course/custom", payload),
  update: ({ customizeId }: CourseUpdateParams, payload: CourseUpdatePayload) => request.put<CourseUpdateData>(`/course/custom/${customizeId}`, payload),
  remove: ({ customizeId }: CourseRemoveParams) => request.delete<null>(`/course/custom/${customizeId}`),
}
