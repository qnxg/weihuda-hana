import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

/** 实验安排, 对应实验平台的排期 */
interface ExperimentItem {
  /** 座位号 */
  seat: string
  /** 实验名称 */
  name: string
  /** 课程名 */
  course: string
  /** 指导教师 */
  teacher: string
  /** 教学周 */
  week: number
  /** 周几, 周日为 0 */
  day: number
  /** 实验时间, 格式 YYYY-MM-DD HH:mm */
  dateTime: string
  /** 实验室 */
  place: string
  /** 联系电话 */
  phone: string | null
  /** 联系邮箱 */
  email: string | null
}

export const experiment = {
  list: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, Term, ExperimentItem[]>("/experiment", "实验安排"),
}

export type ExperimentList = ApiSpec<typeof experiment.list>
export type ExperimentListQueries = Queries<ExperimentList>
export type ExperimentListData = Data<ExperimentList>

export type { ExperimentItem }
