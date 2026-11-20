import type { CourseItem } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { PERIODS } from "@/config/course"
import { atTime } from "@/utils/date"

/** 课程状态 */
export type CourseStatus = "pending" | "ongoing" | "ended"

/** 倒计时阈值, 分钟 */
const NEAR = 30

/** 节次文本, 如 5-6 节 */
export function periodOf(time: number): string {
  return `${time}-${time + 1} 节`
}

/** 时间文本, 如 14:00 - 15:40 */
export function timeOf(time: number): string {
  const first = PERIODS[time]
  const second = PERIODS[time + 1] ?? first

  return `${first.start} - ${second.end}`
}

/** 课程起止时间 */
export function rangeOf(course: CourseItem, date: Date): { start: Date, end: Date } {
  const first = PERIODS[course.time]
  const second = PERIODS[course.time + 1] ?? first

  return {
    start: atTime(date, first.start),
    end: atTime(date, second.end),
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

/** 阈值内返回分钟数 */
function near(target: Date, now: Date): number | undefined {
  const minutes = Math.ceil(od(target).diff(now, "m", true))

  return minutes > 0 && minutes <= NEAR
    ? minutes
    : undefined
}

/** 课程进度与倒计时 */
export interface CourseProgress {
  /** 状态 */
  status: CourseStatus
  /** 进度, 0 - 1 */
  progress: number
  /** 距开始或结束的分钟, 超过阈值不给出 */
  minutes?: number
}

/** 进度: 未开始恒 0, 已结束恒满 */
export function progressOf(course: CourseItem, date: Date, now: Date): CourseProgress {
  const status = statusOf(course, date, now)
  const { start, end } = rangeOf(course, date)

  if (status === "ongoing") {
    const elapsed = od(now).diff(start, "ms") / od(end).diff(start, "ms")
    return {
      status,
      progress: Math.min(1, Math.max(0, elapsed)),
      minutes: near(end, now),
    }
  }

  return status === "pending"
    ? {
        status,
        progress: 0,
        minutes: near(start, now),
      }
    : { status, progress: 1 }
}
