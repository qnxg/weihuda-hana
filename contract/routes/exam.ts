import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Payload, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"

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

/** 路径参数 */
interface ExamParams {
  /** 自定义考试 id */
  customizeId: string
}

interface ExamPayload {
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
}

export const exam = {
  list: endpoint.get<never, Term, ExamItem[]>("/exam", "考试安排"),
  create: endpoint.post<never, ExamPayload, null>("/exam", "新增自定义考试"),
  update: endpoint.put<ExamParams, ExamPayload, null>("/exam/:customizeId", "修改自定义考试"),
  remove: endpoint.delete<ExamParams, never, null>("/exam/:customizeId", "删除自定义考试"),
}

export type ExamList = ApiSpec<typeof exam.list>
export type ExamListQueries = Queries<ExamList>
export type ExamListData = Data<ExamList>

export type ExamCreate = ApiSpec<typeof exam.create>
export type ExamCreatePayload = Payload<ExamCreate>

export type ExamUpdate = ApiSpec<typeof exam.update>
export type ExamUpdateParams = ApiSpec<typeof exam.update>["params"]
export type ExamUpdatePayload = Payload<ExamUpdate>

export type ExamRemove = ApiSpec<typeof exam.remove>
export type ExamRemoveParams = ApiSpec<typeof exam.remove>["params"]

export type { ExamItem }
