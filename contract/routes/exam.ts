import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

interface ExamItem {
  /** 课程代码, 自定义考试为 null */
  courseId: string | null
  /** 课程名或考试名 */
  courseName: string
  /** 校区 */
  area: string | null
  /** 考场 */
  classroom: string | null
  /** 日期, 格式 YYYY-MM-DD */
  date: string | null
  /** 开始时间, 格式 HH:mm */
  startTime: string | null
  /** 结束时间, 格式 HH:mm */
  endTime: string | null
  /** 座位号 */
  seat: string | null
  /** 自定义考试 id, 非自定义为 null */
  customizeId: number | null
}

export const exam = {
  list: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, Term, ExamItem[]>("/exam", "考试安排"),
}

export type ExamList = ApiSpec<typeof exam.list>
export type ExamListQueries = Queries<ExamList>
export type ExamListData = Data<ExamList>

export type { ExamItem }
