import type { ExamItem } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { atTime, dateOf } from "@/utils/date"

/** 考试状态 */
export type ExamStatus = "pending" | "ongoing" | "ended" | "unknown"

/** 状态文本 */
export const STATUS_LABEL: Record<ExamStatus, string> = {
  pending: "未开始",
  ongoing: "进行中",
  ended: "已结束",
  unknown: "时间待定",
}

/** 状态底色 */
export const STATUS_TINT: Record<ExamStatus, string> = {
  pending: "bg-primary text-primary-strong",
  ongoing: "bg-primary-invert text-invert",
  ended: "bg-default text-soft",
  unknown: "bg-default text-soft",
}

/** 考试起止时间, 缺日期返回 null */
function rangeOf(item: ExamItem): { start: Date, end: Date } | null {
  if (!item.date)
    return null

  const date = od(item.date).dd
  const start = atTime(date, item.startTime ?? "00:00")
  const end = atTime(date, item.endTime ?? "23:59")

  return { start, end }
}

/** 考试状态 */
export function statusOf(item: ExamItem, now: Date): ExamStatus {
  const range = rangeOf(item)

  if (!range)
    return "unknown"

  const time = od(now)

  if (time.lt(range.start))
    return "pending"

  return time.le(range.end)
    ? "ongoing"
    : "ended"
}

/** 按日期与开始时间升序, 无日期的排在最后 */
function sortOf(list: readonly ExamItem[]): ExamItem[] {
  return [
    ...list,
  ].sort((a, b) =>
    (a.date ?? "9999-99-99").localeCompare(b.date ?? "9999-99-99")
    || (a.startTime ?? "").localeCompare(b.startTime ?? "")
    || a.courseName.localeCompare(b.courseName))
}

/** 日期文本, 无日期返回 null */
export function dateTextOf(item: ExamItem): string | null {
  return item.date
    ? dateOf(od(item.date).dd)
    : null
}

/** 时间文本 */
export function timeOf(item: ExamItem): string {
  if (item.startTime && item.endTime)
    return `${item.startTime} - ${item.endTime}`

  return item.startTime ?? item.endTime ?? "时间待定"
}

/** 卡片摘要 */
export function metaOf(item: ExamItem): string {
  return [
    timeOf(item),
    item.area,
    item.classroom,
    item.seat
      ? `${item.seat} 号座`
      : null,
    item.courseId,
  ].filter(Boolean).join(" | ")
}

/** 按日期分组的考试 */
export interface ExamGroup {
  /** 组键 */
  key: string
  /** 组标题 */
  label: string
  /** 当天考试 */
  items: ExamItem[]
}

/** 按日期分组, 无日期的归入最后 */
export function groupsOf(list: readonly ExamItem[]): ExamGroup[] {
  const groups: ExamGroup[] = []

  for (const item of sortOf(list)) {
    const key = item.date ?? "unknown"
    const last = groups[groups.length - 1]

    if (last && last.key === key) {
      last.items.push(item)
      continue
    }

    groups.push({
      key,
      label: dateTextOf(item) ?? "时间待定",
      items: [item],
    })
  }

  return groups
}
