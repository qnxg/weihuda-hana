import type { ExamItem } from "@contract/routes"
import { od } from "@xtwis/ohday"

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/** 展示窗口, 未来 15 天 */
const WINDOW = 15

/** 解析起止时间, 字段缺失返回 null */
function rangeOf(item: ExamItem): { start: Date, end: Date } | null {
  if (!item.date || !item.startTime || !item.endTime)
    return null

  const [year, month, date] = item.date.split("-").map(Number)
  const [startHour, startMinute] = item.startTime.split(":").map(Number)
  const [endHour, endMinute] = item.endTime.split(":").map(Number)

  return {
    start: new Date(year, month - 1, date, startHour, startMinute),
    end: new Date(year, month - 1, date, endHour, endMinute),
  }
}

/** 倒计时, 已结束或字段缺失返回 null */
export function countdownOf(item: ExamItem, now: Date): string | null {
  const range = rangeOf(item)
  if (!range)
    return null

  const ts = od(now).ts
  const start = od(range.start).ts
  const end = od(range.end).ts

  if (ts >= end)
    return null

  if (ts >= start)
    return "进行中"

  const diff = start - ts

  if (diff < HOUR)
    return "即将开始"

  if (diff < DAY)
    return `${Math.floor(diff / HOUR)}时`

  return `${Math.floor(diff / DAY)}天`
}

/** 近 15 天的考试, 未结束且开始时间在窗口内, 按开始时间升序 */
export function recentOf(list: ExamItem[], now: Date): ExamItem[] {
  const ts = od(now).ts
  const horizon = ts + WINDOW * DAY

  return list
    .map(item => ({
      item,
      range: rangeOf(item),
    }))
    .filter(({ range }) => range && ts < od(range.end).ts && od(range.start).ts <= horizon)
    .sort((a, b) => od(a.range!.start).ts - od(b.range!.start).ts)
    .map(({ item }) => item)
}

/** 第二行的日期时间与地点文本 */
export function metaOf(item: ExamItem): string {
  const date = item.date?.slice(5) ?? ""
  const time = item.startTime && item.endTime
    ? `${item.startTime} - ${item.endTime}`
    : ""
  const place = [item.area, item.classroom].filter(Boolean).join(" ")
  const seat = item.seat
    ? ` - ${item.seat}`
    : ""
  const location = place
    ? `${place}${seat}`
    : "暂无地点"

  return `${date} | ${time} | ${location}`.trim()
}
