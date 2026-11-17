/** 学期, 春夏秋冬 */
export type Semester = "spring" | "summer" | "autumn" | "winter"

/** 学年, 以学期开始年份计 */
export type Year = number

/** 学期标识 */
export interface Term {
  /** 学年 */
  year: Year
  /** 学期 */
  semester: Semester
}

/** 学期信息 */
export interface TermInfo extends Term {
  /** 开始日期, 格式 YYYY-MM-DD */
  start: string
  /** 教学周数 */
  weeks: number
}

/** 分页查询 */
export interface PageQueries {
  /** 页码, 从 1 开始 */
  page?: number
  /** 每页数量 */
  size?: number
}

/** 分页数据 */
export interface PageData<T> {
  /** 页码, 从 1 开始 */
  page: number
  /** 每页数量 */
  size: number
  /** 总数 */
  total: number
  /** 当页列表 */
  list: T[]
}
