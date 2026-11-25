import { DAY_NAMES } from "@/pages/table/model/course"

/** 周几文本 */
export function dayLabelOf(day: number): string {
  return `周${DAY_NAMES[day] ?? ""}`
}

/** 周几选项, 周一在前 */
export const DAY_OPTIONS = [
  1,
  2,
  3,
  4,
  5,
  6,
  0,
].map(day => ({
  label: dayLabelOf(day),
  value: day,
}))

/** 节次选项 */
export const PERIOD_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `第 ${index + 1} 节`,
  value: index + 1,
}))

/** 起止节次展开 */
export function timesOf(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

/** 时分补零 */
function pad(value: number): string {
  return String(value).padStart(2, "0")
}

/** 时间键, 形如 09:30 */
export function clockOf(value: { hour: number, minute: number }): string {
  return `${pad(value.hour)}:${pad(value.minute)}`
}

/** 时分折算为分钟 */
export function minutesOf(value: { hour: number, minute: number }): number {
  return value.hour * 60 + value.minute
}

/** 日期键, 形如 2026-11-24 */
export function dateKeyOf(value: { year: number, month: number, day: number }): string {
  return `${value.year}-${pad(value.month)}-${pad(value.day)}`
}

/** 日期键拆成日期列的值, 格式不合法返回 null */
export function dateValueOf(key: string): { year: number, month: number, day: number } | null {
  const [year, month, day] = key.split("-").map(Number)

  return Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
    ? { year, month, day }
    : null
}

/** 时间键拆成时间列的值, 格式不合法返回 null */
export function timeValueOf(clock: string): { hour: number, minute: number } | null {
  const [hour, minute] = clock.split(":").map(Number)

  return Number.isInteger(hour) && Number.isInteger(minute)
    ? { hour, minute }
    : null
}
