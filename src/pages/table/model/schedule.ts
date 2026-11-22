import type { ExamItem, ExperimentItem, TodoItem } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { addDays, dateOf } from "@/utils/date"

/** 日程来源 */
export const SCHEDULE_KINDS = ["exam", "experiment", "todo"] as const

/** 来源 */
export type ScheduleKind = typeof SCHEDULE_KINDS[number]

/** 来源名 */
export const SCHEDULE_NAME: Record<ScheduleKind, string> = {
  exam: "考试",
  experiment: "实验",
  todo: "待办",
}

/** 日程条目 */
export interface ScheduleItem {
  /** 唯一键 */
  key: string
  /** 来源 */
  kind: ScheduleKind
  /** 标题 */
  title: string
  /** 关联课程 */
  courseName: string | null
  /** 日期, 格式 YYYY-MM-DD */
  date: string
  /** 开始时间, 格式 HH:mm */
  startTime: string | null
  /** 结束时间, 格式 HH:mm */
  endTime: string | null
  /** 校区 */
  area: string | null
  /** 地点 */
  place: string | null
  /** 座位 */
  seat: string | null
  /** 教师 */
  teacher: string | null
  /** 教学周 */
  week: number | null
  /** 周几, 周日为 0 */
  day: number | null
  /** 联系电话 */
  phone: string | null
  /** 联系邮箱 */
  email: string | null
  /** 备注 */
  note: string | null
}

/** 日程分组 */
export interface ScheduleGroup {
  /** 日期键 */
  key: string
  /** 分组标题 */
  label: string
  /** 当天条目 */
  items: ScheduleItem[]
}

/** 分组标题 */
function labelOf(date: string, todayKey: string, tomorrowKey: string): string {
  if (date === todayKey)
    return "今天"

  if (date === tomorrowKey)
    return "明天"

  return dateOf(od(date).dd)
}

/** 待办, 考试与实验归一化, 按日期与开始时间升序 */
export function scheduleOf(
  todos: readonly TodoItem[],
  exams: readonly ExamItem[],
  experiments: readonly ExperimentItem[],
): ScheduleItem[] {
  const items: ScheduleItem[] = []

  for (const todo of todos) {
    items.push({
      key: `todo-${todo.id}`,
      kind: "todo",
      title: todo.title,
      courseName: todo.courseName,
      date: todo.date,
      startTime: todo.startTime,
      endTime: todo.endTime,
      area: null,
      place: todo.place,
      seat: todo.seat,
      teacher: null,
      week: null,
      day: null,
      phone: null,
      email: null,
      note: todo.note,
    })
  }

  for (const exam of exams) {
    if (!exam.date)
      continue

    items.push({
      key: `exam-${exam.courseId ?? exam.customizeId ?? exam.courseName}`,
      kind: "exam",
      title: exam.courseName,
      courseName: exam.courseName,
      date: exam.date,
      startTime: exam.startTime,
      endTime: exam.endTime,
      area: exam.area,
      place: exam.classroom,
      seat: exam.seat,
      teacher: null,
      week: null,
      day: null,
      phone: null,
      email: null,
      note: null,
    })
  }

  for (const experiment of experiments) {
    const [date = "", time = ""] = experiment.dateTime.split(" ")

    if (!date)
      continue

    items.push({
      key: `experiment-${experiment.name}-${experiment.dateTime}`,
      kind: "experiment",
      title: experiment.name,
      courseName: experiment.course,
      date,
      startTime: time || null,
      endTime: null,
      area: null,
      place: experiment.place,
      seat: experiment.seat,
      teacher: experiment.teacher,
      week: experiment.week,
      day: experiment.day,
      phone: experiment.phone,
      email: experiment.email,
      note: null,
    })
  }

  return items.sort((a, b) =>
    a.date.localeCompare(b.date)
    || (a.startTime ?? "").localeCompare(b.startTime ?? "")
    || a.title.localeCompare(b.title))
}

/** 按来源筛选 */
export function filterOf(items: readonly ScheduleItem[], kinds: readonly ScheduleKind[]): ScheduleItem[] {
  return items.filter(item => kinds.includes(item.kind))
}

/** 按日期分组 */
export function groupsOf(items: readonly ScheduleItem[], today: Date): ScheduleGroup[] {
  const todayKey = od(today).p("YYYY-MM-DD")
  const tomorrowKey = od(addDays(today, 1)).p("YYYY-MM-DD")
  const groups: ScheduleGroup[] = []

  for (const item of items) {
    const last = groups[groups.length - 1]

    if (last && last.key === item.date) {
      last.items.push(item)
      continue
    }

    groups.push({
      key: item.date,
      label: labelOf(item.date, todayKey, tomorrowKey),
      items: [item],
    })
  }

  return groups
}
