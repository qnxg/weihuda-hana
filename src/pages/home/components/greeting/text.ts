import type { TermInfo } from "@contract/routes"

/** 星期名, 按 getDay 索引 */
const WEEK_NAMES = "日一二三四五六"

/** 时段问候, 按起始小时升序 */
const GREETINGS: [number, string][] = [
  [6, "早上好"],
  [10, "上午好"],
  [12, "中午好"],
  [14, "下午好"],
  [18, "晚上好"],
  [24, "晚安"],
]

/** 补零 */
function pad(value: number): string {
  return String(value).padStart(2, "0")
}

/** 当天零点 */
function startOfDay(date: Date): Date {
  const day = new Date(date)
  day.setHours(0, 0, 0, 0)
  return day
}

/** 当前时刻, 随重新渲染读取, 下拉刷新后自然更新 */
export function nowOf(): Date {
  return new Date()
}

/** 问候语, 未到首个时段视为深夜 */
export function greetingOf(date: Date): string {
  const hour = date.getHours()
  const hit = [...GREETINGS].reverse().find(([from]) => hour >= from)

  return hit ? hit[1] : "晚安"
}

/** 日期, 形如 11.09 周四 */
export function dateOf(date: Date): string {
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())} 周${WEEK_NAMES[date.getDay()]}`
}

/** 当天寄语, 有课与否两种 */
export function wishOf(count: number): string {
  return count > 0
    ? "今天也要加油呢!"
    : "今天有什么计划?"
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
