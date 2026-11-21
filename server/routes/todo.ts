import type { contract, TodoItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { CODE } from "@shared/codes"

/** 待办列表 */
const todos: TodoItem[] = [
  {
    id: 1,
    title: "高等数学 A 期末考试",
    courseName: "高等数学 A",
    date: "2026-11-12",
    startTime: "09:00",
    endTime: "11:00",
    place: "南校区 综合楼 301",
    seat: "12",
    note: "闭卷",
  },
  {
    id: 2,
    title: "大学物理实验报告",
    courseName: "大学物理实验",
    date: "2026-11-12",
    startTime: "14:00",
    endTime: "16:00",
    place: "理学楼 208",
    seat: null,
    note: "提交预习报告",
  },
  {
    id: 3,
    title: "提交课程设计",
    courseName: null,
    date: "2026-11-15",
    startTime: null,
    endTime: null,
    place: "线上",
    seat: null,
    note: "提交到教务系统",
  },
]

let seed = todos.length

/** 生成 id */
function nextId(): number {
  seed += 1
  return seed
}

/** 按日期与开始时间排序 */
function compare(a: TodoItem, b: TodoItem): number {
  return a.date.localeCompare(b.date)
    || (a.startTime ?? "").localeCompare(b.startTime ?? "")
    || a.id - b.id
}

export const todo: Handlers<typeof contract.todo> = {
  list: () => ok([...todos].sort(compare)),
  create: ({ body }) => {
    const item: TodoItem = {
      id: nextId(),
      title: body.title,
      courseName: body.courseName,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      place: body.place,
      seat: body.seat,
      note: body.note,
    }

    todos.push(item)
    return ok(item)
  },
  update: ({ params, body }) => {
    const id = Number(params.id)
    const target = todos.find(item => item.id === id)

    if (!target)
      return fail(CODE.notFound, "待办不存在")

    Object.assign(target, body)
    return ok(target)
  },
  remove: ({ params }) => {
    const id = Number(params.id)
    const index = todos.findIndex(item => item.id === id)

    if (index === -1)
      return fail(CODE.notFound, "待办不存在")

    todos.splice(index, 1)
    return ok(null)
  },
}
