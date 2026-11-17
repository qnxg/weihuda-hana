import type { contract, CourseItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { CODE } from "@shared/codes"

const courses: CourseItem[] = [
  {
    courseId: "GE01123",
    courseName: "高等数学 A",
    className: "计科 2501",
    courseType: "通识必修",
    credit: 5,
    weeks: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
    ],
    day: 1,
    time: 1,
    extra: null,
    area: "南校区",
    place: "综合楼 301",
    people: 120,
    teacher: "王军",
    customizeId: null,
  },
  {
    courseId: "CS01001",
    courseName: "程序设计基础",
    className: "计科 2501",
    courseType: "专业核心",
    credit: 3,
    weeks: [1, 2, 3, 4, 5, 6, 7, 8],
    day: 3,
    time: 3,
    extra: null,
    area: "南校区",
    place: "信息楼 502",
    people: 60,
    teacher: "李敏",
    customizeId: null,
  },
]

const extras = [
  {
    courseId: "GE03010",
    courseName: "大学生心理健康",
    className: "全校",
    courseType: "通识选修",
    credit: 1,
    extra: "网课, 无固定上课时间",
    area: "线上",
    people: 500,
    teacher: "张晓",
  },
]

const customs: CourseItem[] = []

let seed = 0

export const course: Handlers<typeof contract.course> = {
  list: () => ok([
    ...courses,
    ...customs,
  ]),
  extraList: () => ok(extras),
  create: ({ body }) => {
    seed += 1

    const item: CourseItem = {
      courseId: null,
      courseName: body.courseName,
      className: null,
      courseType: null,
      credit: null,
      weeks: body.weeks,
      day: body.day,
      time: body.times[0] ?? 1,
      extra: null,
      area: null,
      place: body.place,
      people: null,
      teacher: body.teacher,
      customizeId: seed,
    }

    customs.push(item)
    return ok(item)
  },
  update: ({ params, body }) => {
    const id = Number(params.customizeId)
    const target = customs.find(item => item.customizeId === id)

    if (!target)
      return fail(CODE.notFound, "自定义课程不存在")

    target.courseName = body.courseName
    target.weeks = body.weeks
    target.day = body.day
    target.time = body.times[0] ?? target.time
    target.place = body.place
    target.teacher = body.teacher

    return ok(target)
  },
  remove: ({ params }) => {
    const id = Number(params.customizeId)
    const index = customs.findIndex(item => item.customizeId === id)

    if (index !== -1)
      customs.splice(index, 1)

    return ok(null)
  },
}
