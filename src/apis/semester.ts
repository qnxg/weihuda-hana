import type { SemesterGetData } from "@contract/routes"
import { request } from "@/utils/request"

export const semester = {
  get: (signal?: AbortSignal) => request.add({ signal }).get<SemesterGetData>("/semester"),
}
