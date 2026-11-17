import type { TermInfo } from "@contract/routes/model"
import type { ApiSpec, Data } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

interface SemesterData {
  /** 当前学期 */
  current: TermInfo
  /** 全部学期 */
  list: TermInfo[]
}

export const semester = {
  get: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, never, SemesterData>("/semester", "学期"),
}

export type SemesterGet = ApiSpec<typeof semester.get>
export type SemesterGetData = Data<SemesterGet>
