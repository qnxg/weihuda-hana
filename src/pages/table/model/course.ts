import type { CourseItem } from "@contract/routes"
import { PERIODS } from "@/config/course"

/** 星期名, 按 day 索引 */
export const DAY_NAMES = ["日", "一", "二", "三", "四", "五", "六"] as const

/** 可用课程染色, bg 配 fgstrong */
export const TINT = {
  sky: { bg: "raw:bg-sky-bg", fg: "raw:text-sky-fgstrong" },
  cyan: { bg: "raw:bg-cyan-bg", fg: "raw:text-cyan-fgstrong" },
  teal: { bg: "raw:bg-teal-bg", fg: "raw:text-teal-fgstrong" },
  emerald: { bg: "raw:bg-emerald-bg", fg: "raw:text-emerald-fgstrong" },
  lime: { bg: "raw:bg-lime-bg", fg: "raw:text-lime-fgstrong" },
  green: { bg: "raw:bg-green-bg", fg: "raw:text-green-fgstrong" },
  violet: { bg: "raw:bg-violet-bg", fg: "raw:text-violet-fgstrong" },
  purple: { bg: "raw:bg-purple-bg", fg: "raw:text-purple-fgstrong" },
  fuchsia: { bg: "raw:bg-fuchsia-bg", fg: "raw:text-fuchsia-fgstrong" },
  pink: { bg: "raw:bg-pink-bg", fg: "raw:text-pink-fgstrong" },
  rose: { bg: "raw:bg-rose-bg", fg: "raw:text-rose-fgstrong" },
  orange: { bg: "raw:bg-orange-bg", fg: "raw:text-orange-fgstrong" },
  amber: { bg: "raw:bg-amber-bg", fg: "raw:text-amber-fgstrong" },
  yellow: { bg: "raw:bg-yellow-bg", fg: "raw:text-yellow-fgstrong" },
  indigo: { bg: "raw:bg-indigo-bg", fg: "raw:text-indigo-fgstrong" },
  blue: { bg: "raw:bg-blue-bg", fg: "raw:text-blue-fgstrong" },
} as const

export type Tint = keyof typeof TINT

/** 课程块 */
export interface CourseBlock {
  /** 唯一键 */
  key: string
  /** 原始课程 */
  course: CourseItem
  /** 周几 */
  day: number
  /** 起始节次 */
  start: number
  /** 结束节次 */
  end: number
  /** 是否本周 */
  current: boolean
  /** 染色 */
  tint: Tint
}

/** 课程堆 */
export interface CourseCluster {
  /** 唯一键 */
  key: string
  /** 周几 */
  day: number
  /** 起始节次 */
  start: number
  /** 结束节次 */
  end: number
  /** 堆内课程, 本周优先 */
  blocks: CourseBlock[]
}

/** 契约补 times 前按两节兜底 */
function timesOf(course: CourseItem): number[] {
  const times = (course as CourseItem & { times?: number[] }).times

  return times && times.length > 0
    ? times
    : [course.time, course.time + 1]
}

/** 字符串哈希 */
function hashOf(value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index += 1)
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0

  return hash
}

/** 课程染色 */
function tintOf(course: CourseItem): Tint {
  const keys = Object.keys(TINT) as Tint[]
  const source = course.courseId ?? (course.customizeId === null
    ? course.courseName
    : `custom-${course.customizeId}`)

  return keys[hashOf(source) % keys.length]
}

/** 课程归一化 */
export function blocksOf(courses: readonly CourseItem[], week: number): CourseBlock[] {
  return courses.map((course) => {
    const times = timesOf(course)
    const start = Math.min(...times)
    const end = Math.min(Math.max(...times), 12)

    return {
      key: `${course.customizeId ?? course.courseId ?? course.courseName}-${course.day}-${start}-${course.courseName}`,
      course,
      day: course.day,
      start,
      end,
      current: course.weeks.includes(week),
      tint: tintOf(course),
    }
  })
}

/** 按天聚合重叠课程 */
export function clustersOf(blocks: readonly CourseBlock[]): CourseCluster[] {
  const result: CourseCluster[] = []

  for (let day = 0; day < 7; day += 1) {
    const list = blocks
      .filter(block => block.day === day)
      .sort((a, b) => a.start - b.start || a.end - b.end)
    const groups: CourseBlock[][] = []

    for (const block of list) {
      const last = groups[groups.length - 1]
      const end = last
        ? Math.max(...last.map(item => item.end))
        : 0

      if (last && block.start <= end)
        last.push(block)
      else
        groups.push([block])
    }

    for (const group of groups) {
      const start = Math.min(...group.map(block => block.start))
      const end = Math.max(...group.map(block => block.end))
      const sorted = [...group].sort((a, b) =>
        Number(b.current) - Number(a.current)
        || a.course.courseName.localeCompare(b.course.courseName))

      result.push({
        key: `${day}-${start}`,
        day,
        start,
        end,
        blocks: sorted,
      })
    }
  }

  return result
}

/** 周次文本 */
export function weeksTextOf(weeks: readonly number[]): string {
  const sorted = [
    ...new Set(weeks),
  ].sort((a, b) => a - b)

  if (sorted.length === 0)
    return "暂无周次"

  const parts: string[] = []
  let start = sorted[0]
  let end = start

  for (let index = 1; index < sorted.length; index += 1) {
    const week = sorted[index]

    if (week === end + 1) {
      end = week
      continue
    }

    parts.push(start === end
      ? `${start}`
      : `${start}-${end}`)
    start = week
    end = week
  }

  parts.push(start === end
    ? `${start}`
    : `${start}-${end}`)

  return `${parts.join(", ")} 周`
}

/** 节次文本 */
export function periodTextOf(start: number, end: number): string {
  return start === end
    ? `第 ${start} 节`
    : `第 ${start}-${end} 节`
}

/** 时间文本 */
export function timeTextOf(start: number, end: number): string {
  const first = PERIODS[start]
  const last = PERIODS[end] ?? first

  return `${first.start} - ${last.end}`
}
