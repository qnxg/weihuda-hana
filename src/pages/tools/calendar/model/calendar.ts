import type { TermInfo } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { addDays, weekOf } from "@/utils/date"

/** 校历阶段 */
export type Phase = "autumn" | "winter" | "spring" | "summer"

/** 阶段, 按学年顺序 */
export const PHASES: readonly Phase[] = ["autumn", "winter", "spring", "summer"]

/** 阶段名称 */
export const PHASE_LABEL: Record<Phase, string> = {
  autumn: "秋季学期",
  winter: "寒假",
  spring: "春季学期",
  summer: "夏季学期",
}

/** 阶段单字 */
export const PHASE_SHORT: Record<Phase, string> = {
  autumn: "秋",
  winter: "冬",
  spring: "春",
  summer: "夏",
}

/** 阶段区间 */
export interface PhaseRange {
  /** 阶段 */
  phase: Phase
  /** 开始日期, 未知为 null */
  start: Date | null
  /** 结束日期, 未知为 null */
  end: Date | null
}

/** 校历 */
export interface Calendar {
  /** 学年 */
  year: number
  /** 阶段, 按先后顺序 */
  phases: PhaseRange[]
  /** 教学学期, 不含寒假 */
  terms: TermInfo[]
  /** 首日 */
  start: Date | null
  /** 末日 */
  end: Date | null
}

/** 日期格 */
export interface DayCell {
  /** 唯一键 */
  key: string
  /** 月 */
  month: number
  /** 日 */
  day: number
  /** 是否今天 */
  today: boolean
  /** 是否属于当前阶段 */
  active: boolean
}

/** 周行 */
export interface WeekRow {
  /** 唯一键 */
  key: string
  /** 教学周, 假期为 null */
  week: number | null
  /** 七天 */
  days: DayCell[]
}

/** 日详情 */
export interface DayDetail {
  /** 阶段 */
  phase: Phase | null
  /** 教学周 */
  week: number | null
}

/** 日期键, 用于比较 */
function dayKeyOf(date: Date): string {
  return od(date).p("YYYY-MM-DD")
}

/** 学期最后一天, 含最后一周 */
function endOfTerm(term: TermInfo): Date {
  return addDays(od(term.start).dd, term.weeks * 7 - 1)
}

/** 学期区间 */
function rangeOfTerm(term: TermInfo | null): Omit<PhaseRange, "phase"> {
  return term
    ? {
        start: od(term.start).dd,
        end: endOfTerm(term),
      }
    : { start: null, end: null }
}

/** 某学年的校历, 寒假定为秋季学期结束到春季学期开始之间 */
export function calendarOf(list: readonly TermInfo[], year: number): Calendar {
  const terms = list.filter(item => item.year === year && item.semester !== "winter")
  const termOf = (semester: TermInfo["semester"]) =>
    terms.find(item => item.semester === semester) ?? null

  const autumn = rangeOfTerm(termOf("autumn"))
  const spring = rangeOfTerm(termOf("spring"))
  const summer = rangeOfTerm(termOf("summer"))
  const winter = {
    start: autumn.end
      ? addDays(autumn.end, 1)
      : null,
    end: spring.start
      ? addDays(spring.start, -1)
      : null,
  }
  const phases: PhaseRange[] = [
    { phase: "autumn", ...autumn },
    { phase: "winter", ...winter },
    { phase: "spring", ...spring },
    { phase: "summer", ...summer },
  ]
  const starts = phases
    .map(item => item.start)
    .filter((date): date is Date => date !== null)
  const ends = phases
    .map(item => item.end)
    .filter((date): date is Date => date !== null)

  return {
    year,
    phases,
    terms,
    start: starts.length > 0
      ? new Date(Math.min(...starts.map(date => date.getTime())))
      : null,
    end: ends.length > 0
      ? new Date(Math.max(...ends.map(date => date.getTime())))
      : null,
  }
}

/** 默认学年, 优先当前学期所在学年, 否则取最新 */
export function defaultYearOf(terms: readonly TermInfo[], current: TermInfo | null | undefined): number | null {
  if (current && terms.some(item => item.year === current.year))
    return current.year

  return terms[terms.length - 1]?.year ?? null
}

/** 默认阶段, 优先当前学期, 否则秋季 */
export function defaultPhaseOf(terms: readonly TermInfo[], current: TermInfo | null | undefined): Phase {
  return current && terms.some(item => item.year === current.year)
    ? current.semester
    : "autumn"
}

/** 阶段文本, 如 秋季学期 09.21 - 01.24 */
export function phaseTextOf(range: PhaseRange | null): string {
  if (!range)
    return ""

  const label = PHASE_LABEL[range.phase]

  return range.start && range.end
    ? `${label} ${od(range.start).p("MM.DD")} - ${od(range.end).p("MM.DD")}`
    : `${label} 日期待定`
}

/** 日期所在阶段, 不在任何阶段返回 null */
export function phaseAt(date: Date, calendar: Calendar): Phase | null {
  const key = dayKeyOf(date)

  for (const item of calendar.phases) {
    if (item.start && item.end && key >= dayKeyOf(item.start) && key <= dayKeyOf(item.end))
      return item.phase
  }

  return null
}

/** 日期所在教学周, 假期返回 null */
export function weekAt(date: Date, calendar: Calendar): number | null {
  for (const term of calendar.terms) {
    const week = weekOf(date, term)

    if (week !== null)
      return week
  }

  return null
}

/** 某日的阶段与教学周 */
export function detailOf(date: Date, calendar: Calendar): DayDetail {
  return {
    phase: phaseAt(date, calendar),
    week: weekAt(date, calendar),
  }
}

/** 阶段内的连续周行, 周日开头, 无重复日期 */
export function weeksOf(range: PhaseRange, calendar: Calendar, today: Date): WeekRow[] {
  if (!range.start || !range.end)
    return []

  const startKey = dayKeyOf(range.start)
  const endKey = dayKeyOf(range.end)
  const first = od(range.start)
  const last = od(range.end)
  const start = addDays(first.dd, -first.day)
  const end = addDays(last.dd, 6 - last.day)
  const todayKey = dayKeyOf(today)
  const rows: WeekRow[] = []

  for (let date = start; od(date).le(end); date = addDays(date, 7)) {
    const days: DayCell[] = []
    let week: number | null = null

    for (let column = 0; column < 7; column++) {
      const current = addDays(date, column)
      const day = od(current)
      const key = dayKeyOf(current)
      const active = key >= startKey && key <= endKey

      days.push({
        key,
        month: day.month,
        day: day.date,
        today: key === todayKey,
        active,
      })

      if (active && week === null)
        week = weekAt(current, calendar)
    }

    rows.push({
      key: days[0].key,
      week,
      days,
    })
  }

  return rows
}
