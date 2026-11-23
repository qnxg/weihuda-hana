import type { Term } from "@contract/routes/model"
import type { ApiSpec, Data, Payload, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

/** 课程, 一个课程对应课表里的一个格子 */
interface CourseItem {
  /** 课程代码, 自定义课程为 null */
  courseId: string | null
  /** 课程名 */
  courseName: string
  /** 上课班级, 自定义课程为 null */
  className: string | null
  /** 课程类型, 通识必修 / 专业选修等 */
  courseType: string | null
  /** 学分, 自定义课程为 null */
  credit: number | null
  /** 上课周次 */
  weeks: number[]
  /** 周几, 周日为 0 */
  day: number
  /** 起始节次, 1 - 12 */
  time: number
  /** 全部节次, 首项即起始节次 */
  times: number[]
  /** 备注, 自定义课程为 null */
  extra: string | null
  /** 校区, 自定义课程为 null */
  area: string | null
  /** 地点 */
  place: string | null
  /** 人数, 自定义课程为 null */
  people: number | null
  /** 教师 */
  teacher: string | null
  /** 自定义课程 id, 非自定义为 null */
  customizeId: number | null
}

/** 无课表课程, 如网课 / 实践课 */
interface ExtraCourseItem {
  /** 课程代码 */
  courseId: string
  /** 课程名 */
  courseName: string
  /** 上课班级 */
  className: string
  /** 课程类型 */
  courseType: string
  /** 学分 */
  credit: number
  /** 备注 */
  extra: string | null
  /** 校区 */
  area: string
  /** 人数 */
  people: number
  /** 教师 */
  teacher: string
}

/** 路径参数 */
interface CourseParams {
  /** 自定义课程 id */
  customizeId: string
}

/** 自定义课程内容 */
interface CoursePayload {
  /** 课程名 */
  courseName: string
  /** 上课周次 */
  weeks: number[]
  /** 周几, 周日为 0 */
  day: number
  /** 节次, 1 - 12 */
  times: number[]
  /** 地点 */
  place: string | null
  /** 教师 */
  teacher: string | null
}

/** 新增自定义课程入参, 需要带上学期 */
interface CreatePayload extends CoursePayload, Term {}

export const course = {
  list: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, Term, CourseItem[]>("/course", "课程列表"),
  extraList: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, Term, ExtraCourseItem[]>("/course/extra", "无课表课程"),
  create: endpoint.internal().post<never, CreatePayload, CourseItem>("/course/custom", "新增自定义课程"),
  update: endpoint.internal().codes([CODE.notFound]).put<CourseParams, CoursePayload, CourseItem>("/course/custom/:customizeId", "修改自定义课程"),
  remove: endpoint.internal().codes([CODE.notFound]).delete<CourseParams, never, null>("/course/custom/:customizeId", "删除自定义课程"),
}

export type CourseList = ApiSpec<typeof course.list>
export type CourseListQueries = Queries<CourseList>
export type CourseListData = Data<CourseList>

export type CourseExtraList = ApiSpec<typeof course.extraList>
export type CourseExtraListQueries = Queries<CourseExtraList>
export type CourseExtraListData = Data<CourseExtraList>

export type CourseCreate = ApiSpec<typeof course.create>
export type CourseCreatePayload = Payload<CourseCreate>
export type CourseCreateData = Data<CourseCreate>

export type CourseUpdate = ApiSpec<typeof course.update>
export type CourseUpdateParams = ApiSpec<typeof course.update>["params"]
export type CourseUpdatePayload = Payload<CourseUpdate>
export type CourseUpdateData = Data<CourseUpdate>

export type CourseRemove = ApiSpec<typeof course.remove>
export type CourseRemoveParams = ApiSpec<typeof course.remove>["params"]

export type { CourseItem, ExtraCourseItem }
