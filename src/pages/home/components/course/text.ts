import type { CourseItem } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { PERIODS } from "@/config/course"
import { atTime } from "@/utils/date"

/** 课程状态 */
export type CourseStatus = "pending" | "ongoing" | "ended"

/** 课程首尾节次 */
function spanOf(course: CourseItem): [number, number] {
  const times = course.times?.length
    ? course.times
    : [course.time, course.time + 1]

  return [
    Math.min(...times),
    Math.max(...times),
  ]
}

/** 节次文本, 如 5-6 节 */
export function periodOf(course: CourseItem): string {
  const [start, end] = spanOf(course)

  return start === end
    ? `${start} 节`
    : `${start}-${end} 节`
}

/** 时间文本, 如 14:00 - 15:40 */
export function timeOf(course: CourseItem): string {
  const [start, end] = spanOf(course)
  const first = PERIODS[start]
  const last = PERIODS[end] ?? first

  return `${first.start} - ${last.end}`
}

/** 课程起止时间 */
export function rangeOf(course: CourseItem, date: Date): { start: Date, end: Date } {
  const [start, end] = spanOf(course)
  const first = PERIODS[start]
  const last = PERIODS[end] ?? first

  return {
    start: atTime(date, first.start),
    end: atTime(date, last.end),
  }
}

/** 课程状态 */
export function statusOf(course: CourseItem, date: Date, now: Date): CourseStatus {
  const { start, end } = rangeOf(course, date)

  const time = od(now)

  if (time.lt(start))
    return "pending"

  return time.le(end)
    ? "ongoing"
    : "ended"
}

/** 状态文本 */
export function labelOf(status: CourseStatus): string {
  switch (status) {
    case "ongoing":
      return "进行中"
    case "ended":
      return "已结束"
    default:
      return "未开始"
  }
}
