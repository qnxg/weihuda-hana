import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Payload, Queries } from "@contract/types"
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

/** 实验成绩明细 */
interface ExperimentGradeDetail {
  /** 明细名称 */
  name: string
  /** 分数, 未评为 null */
  score: number | null
}

/** 单次实验成绩 */
interface ExperimentGradeItem {
  /** 实验名称 */
  name: string
  /** 实验成绩 */
  score: string
  /** 出勤, 无记录为 null */
  attendance: string | null
  /** 成绩明细 */
  details: ExperimentGradeDetail[]
}

/** 实验课程成绩 */
interface ExperimentGrade {
  /** 课程名 */
  courseName: string
  /** 课程总评 */
  courseScore: string | null
  /** 各次实验 */
  labs: ExperimentGradeItem[]
}

/** 绑定入参 */
interface BindPayload {
  /** 大物实验平台密码, 账号为学号 */
  password: string
}

export const experiment = {
  list: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout, CODE.auth.labRebind]).get<never, Term, ExperimentItem[]>("/experiment", "实验安排"),
  grade: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout, CODE.auth.labRebind]).get<never, Term, ExperimentGrade | null>("/experiment/grade", "实验成绩"),
  bind: endpoint.internal().codes([CODE.upstream.failed, CODE.upstream.timeout, CODE.auth.labLoginFailed]).post<never, BindPayload, null>("/experiment/bind", "绑定实验平台"),
  unbind: endpoint.internal().post<never, never, null>("/experiment/unbind", "解除实验平台绑定"),
}

export type ExperimentList = ApiSpec<typeof experiment.list>
export type ExperimentListQueries = Queries<ExperimentList>
export type ExperimentListData = Data<ExperimentList>

export type ExperimentGradeGet = ApiSpec<typeof experiment.grade>
export type ExperimentGradeQueries = Queries<ExperimentGradeGet>
export type ExperimentGradeData = Data<ExperimentGradeGet>

export type ExperimentBind = ApiSpec<typeof experiment.bind>
export type ExperimentBindPayload = Payload<ExperimentBind>

export type { ExperimentGrade, ExperimentGradeDetail, ExperimentGradeItem, ExperimentItem }
