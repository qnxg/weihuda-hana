import type { RoomListQueries } from "@contract/routes"
import { PERIODS } from "@/config/course"
import { nowOf } from "@/utils/date"

/** 大节选项 */
export interface PeriodGroup {
  /** 唯一键 */
  key: string
  /** 小节次 */
  times: readonly number[]
  /** 展示名 */
  label: string
  /** 开始时间 */
  start: string
  /** 结束时间 */
  end: string
}

/** 大节分组 */
const GROUPS: readonly number[][] = [
  [1, 2],
  [3, 4],
  [5, 6],
  [7, 8],
  [9, 10, 11],
  [12],
]

/** 时分折算为分钟 */
function minutesOf(value: string): number {
  const [hour, minute] = value.split(":").map(Number)

  return hour * 60 + minute
}

/** 大节选项, 时间取自课程节次 */
export const PERIOD_GROUPS: readonly PeriodGroup[] = GROUPS.map((times) => {
  const first = times[0]
  const last = times[times.length - 1]
  const start = PERIODS[first].start
  const end = PERIODS[last].end

  return {
    key: `${first}-${last}`,
    times,
    label: `${first} - ${last} 节`,
    start,
    end,
  }
})

/** 默认大节, 优先未结束的一节, 当天课程结束后取第一节 */
export function defaultGroupKeyOf(now = nowOf()): string {
  const current = now.getHours() * 60 + now.getMinutes()
  const group = PERIOD_GROUPS.find(item => minutesOf(item.end) > current)

  return (group ?? PERIOD_GROUPS[0]).key
}

/** 已选大节对应的小节次, 逗号分隔 */
export function timesOf(groups: readonly PeriodGroup[]): string {
  return groups
    .flatMap(item => item.times)
    .sort((a, b) => a - b)
    .join(",")
}

/** 日期键 */
export function dateKeyOf(date: { year: number, month: number, day: number }): string {
  const pad = (value: number) => String(value).padStart(2, "0")

  return `${date.year}-${pad(date.month)}-${pad(date.day)}`
}

/** 空教室查询参数 */
export function queriesOf(building: string, date: string, groups: readonly PeriodGroup[]): RoomListQueries {
  return {
    building,
    date,
    times: timesOf(groups),
  }
}
