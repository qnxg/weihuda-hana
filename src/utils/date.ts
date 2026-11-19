import type { TermInfo } from "@contract/routes"
import { od } from "@xtwis/ohday"

/** 星期名, 按 day 索引 */
const WEEK_NAMES = "日一二三四五六"

/** 当前时刻, 随重新渲染读取, 下拉刷新后自然更新 */
export function nowOf(): Date {
  return od().dd
}

/** 加减天数 */
export function addDays(date: Date, days: number): Date {
  return od(date).add("d", days).dd
}

/** 日期, 形如 11.09 周四 */
export function dateOf(date: Date): string {
  const day = od(date)

  return `${day.p("MM.DD")} 周${WEEK_NAMES[day.day]}`
}

/** 指定日期的 hh:mm */
export function atTime(date: Date, value: string): Date {
  const [hour, minute] = value.split(":").map(Number)

  return od(date).c("h", hour).c("m", minute).c("s", 0).c("ms", 0).dd
}

/** 教学周, 学期未开始或已结束时返回 null */
export function weekOf(date: Date, term: TermInfo): number | null {
  const days = od(date).cs("d").diff(od(term.start).cs("d"), "d")

  if (days < 0)
    return null

  const week = Math.floor(days / 7) + 1
  return week > term.weeks
    ? null
    : week
}
