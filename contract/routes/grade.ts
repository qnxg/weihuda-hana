import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

interface GradeItem {
  /** 课程 id */
  courseId: string
  /** 课程名 */
  courseName: string
  /** 学分 */
  credit: number
  /** 绩点 */
  gpa: number | null
  /** 成绩 */
  score: number
  /** 课程类别一, 必修 / 选修等 */
  courseType1: string | null
  /** 课程类别二, 专业基础 / 专业核心等 */
  courseType2: string
  /** 成绩标识, 正常为 null, 缓考 / 重修等 */
  gradeTag: string | null
  /** 成绩类型, 主修 / 辅修等 */
  gradeType: string
  /** 单科成绩详情 id, 无详情为 null */
  detailId: string | null
}

/** 路径参数 */
interface GradeParams {
  /** 单科成绩详情 id */
  detailId: string
}

interface GradeDetailItem {
  /** 成绩组成名称 */
  name: string
  /** 成绩 */
  score: string
  /** 占比 */
  percentage: string
}

export const grade = {
  list: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, Term, GradeItem[]>("/grade", "成绩列表"),
  get: endpoint.codes([CODE.notFound, CODE.upstream.failed, CODE.upstream.timeout]).get<GradeParams, never, GradeDetailItem[]>("/grade/:detailId", "单科成绩"),
}

export type GradeList = ApiSpec<typeof grade.list>
export type GradeListQueries = Queries<GradeList>
export type GradeListData = Data<GradeList>

export type GradeGet = ApiSpec<typeof grade.get>
export type GradeGetParams = ApiSpec<typeof grade.get>["params"]
export type GradeGetData = Data<GradeGet>

export type { GradeDetailItem, GradeItem }
