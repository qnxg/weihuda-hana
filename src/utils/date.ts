import type { TermInfo } from "@contract/routes"

/** 星期名, 按 getDay 索引 */
const WEEK_NAMES = "日一二三四五六"

/** 补零 */
function pad(value: number): string {
  return String(value).padStart(2, "0")
}

/** 当前时刻, 随重新渲染读取, 下拉刷新后自然更新 */
export function nowOf(): Date {
  return new Date()
}

/** 当天零点 */
export function startOfDay(date: Date): Date {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

/** 加减天数 */
export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** 日期, 形如 11.09 周四 */
export function dateOf(date: Date): string {
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} 周${WEEK_NAMES[date.getDay()]}`
}

/** 是否同一天 */
export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime()
}

/** 指定日期的 hh:mm */
export function atTime(date: Date, value: string): Date {
  const [hour, minute] = value.split(":").map(Number)
  const result = new Date(date)
  result.setHours(hour, minute, 0, 0)
  return result
}

/** 教学周, 学期未开始或已结束时返回 null */
export function weekOf(date: Date, term: TermInfo): number | null {
  const start = startOfDay(new Date(`${term.start}T00:00:00`))
  const days = (startOfDay(date).getTime() - start.getTime()) / 86_400_000

  if (days < 0)
    return null

  const week = Math.floor(days / 7) + 1
  return week > term.weeks
    ? null
    : week
}
