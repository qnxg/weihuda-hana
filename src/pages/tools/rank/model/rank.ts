import type { RankDataSource, RankDisplay, RankRange, Semester, TermInfo } from "@contract/routes"

/** 排名来源 */
export type Source = "jiaowu" | "ca"

/** 参与排名的学期 */
export type RankSemester = Exclude<Semester, "winter">

/** 排名范围 */
export type Scope = "all" | "compulsory" | "core"

/** 时间范围 */
export interface RankTime {
  /** 学年, all 为全部 */
  year: number | "all"
  /** 学期, all 为全部 */
  semester: RankSemester | "all"
}

/** 学期顺序 */
export const SEMESTERS: readonly RankSemester[] = ["spring", "summer", "autumn"]

/** 来源标签 */
export const SOURCES = [
  { key: "jiaowu", title: "教务系统" },
  { key: "ca", title: "可信凭证" },
] as const

/** 课程范围 */
export const RANGES = [
  { key: "major", title: "主修" },
  { key: "minor", title: "辅修" },
] as const satisfies readonly { key: RankRange, title: string }[]

/** 数据来源 */
export const DATA_SOURCES = [
  { key: "total", title: "成绩总库" },
  { key: "execution", title: "执行方案" },
] as const satisfies readonly { key: RankDataSource, title: string }[]

/** 显示方式 */
export const DISPLAYS = [
  { key: "max", title: "最高成绩" },
  { key: "initial", title: "初修成绩" },
] as const satisfies readonly { key: RankDisplay, title: string }[]

/** 排名范围标签 */
export const SCOPES = [
  { key: "all", title: "全部课程" },
  { key: "compulsory", title: "必修课程" },
  { key: "core", title: "核心课程" },
] as const satisfies readonly { key: Scope, title: string }[]

/** 从候选中取值 */
export function oneOf<T extends string>(value: string | number, allowed: readonly T[]): T | null {
  return allowed.find(item => item === value) ?? null
}

/** 某学年可用的学期 */
export function semestersOf(terms: readonly TermInfo[], year: number): RankSemester[] {
  const unique = new Set(terms.filter(item => item.year === year).map(item => item.semester))

  return SEMESTERS.filter(item => unique.has(item))
}
