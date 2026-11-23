import type { ExperimentItem } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { DAY_NAMES } from "@/pages/table/model/course"
import { dateOf } from "@/utils/date"

/** 分隔日期与时间 */
function splitOf(item: ExperimentItem): { date: string, time: string } {
  const [date = "", time = ""] = item.dateTime.split(" ")

  return { date, time }
}

/** 按时间升序, 无时间的排在最后 */
function sortOf(list: readonly ExperimentItem[]): ExperimentItem[] {
  return [
    ...list,
  ].sort((a, b) => (a.dateTime || "9999").localeCompare(b.dateTime || "9999"))
}

/** 日期文本, 如 11.25 周三, 无日期返回 null */
export function dateTextOf(item: ExperimentItem): string | null {
  const { date } = splitOf(item)

  return date
    ? dateOf(od(date).dd)
    : null
}

/** 时间文本, 如 14:30 */
export function timeTextOf(item: ExperimentItem): string {
  const { time } = splitOf(item)

  return time || "时间待定"
}

/** 周次文本 */
export function weekTextOf(item: ExperimentItem): string {
  return `第 ${item.week} 周 周${DAY_NAMES[item.day] ?? ""}`
}

/** 卡片摘要, 只保留时间, 地点与教师 */
export function metaOf(item: ExperimentItem): string {
  return [
    timeTextOf(item),
    item.place,
    item.teacher,
  ].filter(Boolean).join(" | ")
}

/** 按日期分组的实验 */
export interface ExperimentGroup {
  /** 组键 */
  key: string
  /** 组标题 */
  label: string
  /** 当天实验 */
  items: ExperimentItem[]
}

/** 按日期分组, 无日期的归入最后 */
export function groupsOf(list: readonly ExperimentItem[]): ExperimentGroup[] {
  const groups: ExperimentGroup[] = []

  for (const item of sortOf(list)) {
    const key = splitOf(item).date || "unknown"
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
