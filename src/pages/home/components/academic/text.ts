import type { ExamItem, TodoItem } from "@contract/routes"
import { od } from "@xtwis/ohday"

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

/** 展示窗口, 未来 15 天 */
const WINDOW = 15

/** 待办条目, 考试与自定义待办归一化后的形态 */
export interface TodoEntry {
  /** 唯一键 */
  key: string
  /** 标题 */
  title: string
  /** 日期, 格式 YYYY-MM-DD */
  date: string
  /** 开始时间, 格式 HH:mm */
  startTime: string | null
  /** 结束时间, 格式 HH:mm */
  endTime: string | null
  /** 地点 */
  place: string | null
  /** 座位 */
  seat: string | null
}

/** 解析起止时间, 缺失时间按全天处理 */
function rangeOf(item: TodoEntry): { start: Date, end: Date } | null {
  if (!item.date)
    return null

  const [year, month, date] = item.date.split("-").map(Number)
  const start = item.startTime ?? "00:00"
  const end = item.endTime ?? "23:59"
  const [startHour, startMinute] = start.split(":").map(Number)
  const [endHour, endMinute] = end.split(":").map(Number)

  return {
    start: new Date(year, month - 1, date, startHour, startMinute),
    end: new Date(year, month - 1, date, endHour, endMinute),
  }
}

/** 倒计时, 已结束返回 null */
export function countdownOf(item: TodoEntry, now: Date): string | null {
  const range = rangeOf(item)
  if (!range)
    return null

  const ts = od(now).ts
  const start = od(range.start).ts
  const end = od(range.end).ts

  if (ts >= end)
    return null

  if (!item.startTime && !item.endTime) {
    if (ts >= start)
      return "今天"

    const days = Math.ceil((start - ts) / DAY)
    return days <= 1
      ? "明天"
      : `${days}天`
  }

  if (ts >= start)
    return "进行中"

  const diff = start - ts

  if (diff < HOUR)
    return "即将开始"

  if (diff < DAY)
    return `${Math.floor(diff / HOUR)}时`

  return `${Math.floor(diff / DAY)}天`
}

/** 近 15 天的条目, 未结束且开始时间在窗口内, 按开始时间升序 */
export function recentOf(list: TodoEntry[], now: Date): TodoEntry[] {
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
export function metaOf(item: TodoEntry): string {
  const date = item.date.slice(5)
  const time = item.startTime && item.endTime
    ? `${item.startTime} - ${item.endTime}`
    : item.startTime ?? item.endTime ?? "全天"
  const place = item.place ?? "暂无地点"
  const seat = item.seat
    ? ` - ${item.seat}`
    : ""

  return `${date} | ${time} | ${place}${seat}`
}

/** 考试与自定义待办归一化 */
export function entriesOf(exams: ExamItem[], todos: TodoItem[]): TodoEntry[] {
  const fromExams = exams
    .map((item): TodoEntry | null => {
      if (!item.date)
        return null

      return {
        key: `exam-${item.customizeId ?? item.courseId ?? "custom"}-${item.date}-${item.startTime ?? ""}`,
        title: item.courseName,
        date: item.date,
        startTime: item.startTime,
        endTime: item.endTime,
        place: [item.area, item.classroom].filter(Boolean).join(" ") || null,
        seat: item.seat,
      }
    })
    .filter((item): item is TodoEntry => item !== null)

  const fromTodos = todos.map((item): TodoEntry => ({
    key: `todo-${item.id}`,
    title: item.title,
    date: item.date,
    startTime: item.startTime,
    endTime: item.endTime,
    place: item.place,
    seat: item.seat,
  }))

  return [
    ...fromExams,
    ...fromTodos,
  ]
}
