import type { Year } from "@contract/routes/model"
import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"
import { CODE } from "@shared/codes"

/** 单项成绩 */
interface PhysicalMetric {
  /** 等级颜色, 后端给出 green 或 red */
  color: string
  /** 排名或位次说明 */
  rank: string
  /** 等级 */
  grade: string
  /** 分数 */
  score: number
}

/** 单项视力 */
interface PhysicalEyeValue {
  /** 数值 */
  value: string
  /** 说明 */
  description: string
}

/** 一项视力, 左右眼 */
interface PhysicalEye {
  /** 左眼 */
  left: PhysicalEyeValue
  /** 右眼 */
  right: PhysicalEyeValue
}

/** 视力详情 */
interface PhysicalEyeDetail {
  /** 裸眼视力 */
  sight: PhysicalEye
  /** 戴镜视力 */
  mirror: PhysicalEye
  /** 屈光状态 */
  ametropia: PhysicalEye
}

/** 体测成绩 */
interface PhysicalGrade {
  /** 总评等级 */
  grade: string
  /** 总分 */
  score: number
  /** 报告说明 */
  reportDescription: string
  /** 报告状态 */
  reportStatus: string
  /** 报告类型 */
  reportType: string
  /** 视力 */
  eye: PhysicalEyeDetail
  /** 50 米跑 */
  shortRun: PhysicalMetric
  /** 体重指数 */
  bmi: PhysicalMetric
  /** 立定跳远 */
  jump: PhysicalMetric
  /** 引体向上或仰卧起坐 */
  pullAndSit: PhysicalMetric
  /** 耐力跑 */
  run: PhysicalMetric
  /** 坐位体前屈 */
  sitAndReach: PhysicalMetric
  /** 肺活量 */
  vc: PhysicalMetric
}

/** 体测查询 */
interface PhysicalQueries {
  /** 学年 */
  year: Year
}

export const physical = {
  get: endpoint.codes([CODE.upstream.failed, CODE.upstream.timeout]).get<never, PhysicalQueries, PhysicalGrade | null>("/physical", "体测成绩"),
}

export type PhysicalGet = ApiSpec<typeof physical.get>
export type PhysicalGetQueries = Queries<PhysicalGet>
export type PhysicalGetData = Data<PhysicalGet>

export type { PhysicalEye, PhysicalEyeDetail, PhysicalEyeValue, PhysicalGrade, PhysicalMetric }
