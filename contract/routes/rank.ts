import type { Semester, Year } from "@contract/routes/model"
import type { ApiSpec, Data, Queries } from "@contract/types"
import { endpoint } from "@contract/endpoint"

/** 排名指标 */
interface RankDetail {
  /** 算数平均成绩 */
  arithmetic: string | null
  /** 算数平均成绩排名, 形如 排名/总人数 */
  arithmeticRank: string | null
  /** 加权平均成绩 */
  weighted: string | null
  /** 加权平均成绩排名, 形如 排名/总人数 */
  weightedRank: string | null
  /** 绩点 */
  gpa: string | null
  /** 绩点排名, 形如 排名/总人数 */
  gpaRank: string | null
}

/** 排名, null 表示暂无数据 */
interface Rank {
  /** 全部课程 */
  all: RankDetail | null
  /** 必修课程 */
  compulsory: RankDetail | null
  /** 核心课程 */
  core: RankDetail | null
}

/** 可信电子凭证里的排名 */
interface RankCa {
  /** 最后更新时间, 格式 YYYY-MM-DD HH:mm:ss */
  updatedAt: string
  /** 排名 */
  rank: Rank
}

interface RankQueries {
  /** 学年, 缺省为当前学年 */
  year?: Year
  /** 学期, 缺省为当前学年的全部学期 */
  semester?: Exclude<Semester, "winter">
  /** 课程范围 */
  range: RankRange
  /** 数据来源 */
  dataSource: RankDataSource
  /** 显示方式 */
  display: RankDisplay
}

/** 课程范围, 主修 / 辅修 */
export type RankRange = "major" | "minor"

/** 数据来源, 成绩总库 / 执行方案 */
export type RankDataSource = "total" | "execution"

/** 显示方式, 最高成绩 / 初修成绩 */
export type RankDisplay = "max" | "initial"

export const rank = {
  caGet: endpoint.get<never, never, RankCa | null>("/rank/ca", "凭证排名"),
  caRefresh: endpoint.post<never, never, null>("/rank/ca/refresh", "重新生成凭证排名"),
  get: endpoint.get<never, RankQueries, Rank>("/rank", "教务排名"),
}

export type RankCaGet = ApiSpec<typeof rank.caGet>
export type RankCaGetData = Data<RankCaGet>

export type RankCaRefresh = ApiSpec<typeof rank.caRefresh>

export type RankGet = ApiSpec<typeof rank.get>
export type RankGetQueries = Queries<RankGet>
export type RankGetData = Data<RankGet>

export type { Rank, RankDetail }
