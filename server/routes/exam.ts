import type { contract, ExamItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const exams: ExamItem[] = [
  {
    courseId: "GE01123",
    courseName: "高等数学 A",
    area: "南校区",
    classroom: "综合楼 301",
    date: "2026-01-08",
    startTime: "09:00",
    endTime: "11:00",
    seat: "12",
    customizeId: null,
  },
  {
    courseId: "CS01001",
    courseName: "程序设计基础",
    area: "南校区",
    classroom: "信息楼 502",
    date: "2026-01-12",
    startTime: "14:30",
    endTime: "16:30",
    seat: null,
    customizeId: null,
  },
]

const customs: ExamItem[] = []

let seed = 0

/** 生成自定义考试 id */
function nextId(): number {
  seed += 1
  return seed
}

export const exam: Handlers<typeof contract.exam> = {
  list: () => ok([
    ...exams,
    ...customs,
  ]),
  create: ({ body }) => {
    const item: ExamItem = {
      courseId: null,
      courseName: body.courseName,
      area: body.area,
      classroom: body.classroom,
      date: body.date,
      startTime: body.startTime,
      endTime: body.endTime,
      seat: body.seat,
      customizeId: nextId(),
    }

    customs.push(item)
    return ok(null)
  },
  update: ({ params, body }) => {
    const id = Number(params.customizeId)
    const target = customs.find(item => item.customizeId === id)

    if (target) {
      target.courseName = body.courseName
      target.area = body.area
      target.classroom = body.classroom
      target.date = body.date
      target.startTime = body.startTime
      target.endTime = body.endTime
      target.seat = body.seat
    }

    return ok(null)
  },
  remove: ({ params }) => {
    const id = Number(params.customizeId)
    const index = customs.findIndex(item => item.customizeId === id)

    if (index !== -1)
      customs.splice(index, 1)

    return ok(null)
  },
}
