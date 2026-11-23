import type { contract, CourseItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { CODE } from "@shared/codes"

/** 课程模板 */
interface Template {
  /** 课程名 */
  courseName: string
  /** 课程类型 */
  courseType: string
  /** 学分 */
  credit: number
  /** 教师 */
  teacher: string
  /** 地点 */
  place: string
  /** 校区 */
  area: string
  /** 上课班级 */
  className: string
  /** 人数 */
  people: number
  /** 上课周次 */
  weeks: number[]
}

/** 连续周次 */
function weeks(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index)
}

/** 课程模板池, 按天循环取用 */
const templates: Template[] = [
  {
    courseName: "高等数学 A",
    courseType: "通识必修",
    credit: 5,
    teacher: "王军",
    place: "综合楼 301",
    area: "南校区",
    className: "计科 2501",
    people: 120,
    weeks: weeks(1, 16),
  },
  {
    courseName: "程序设计基础",
    courseType: "专业核心",
    credit: 3,
    teacher: "李敏",
    place: "信息楼 502",
    area: "南校区",
    className: "计科 2501",
    people: 60,
    weeks: weeks(1, 16),
  },
  {
    courseName: "大学英语(三)",
    courseType: "通识必修",
    credit: 3,
    teacher: "陈静",
    place: "外语楼 204",
    area: "南校区",
    className: "计科 2501",
    people: 45,
    weeks: weeks(1, 16),
  },
  {
    courseName: "线性代数",
    courseType: "通识必修",
    credit: 3,
    teacher: "刘洋",
    place: "综合楼 105",
    area: "南校区",
    className: "计科 2501",
    people: 100,
    weeks: weeks(1, 8),
  },
  {
    courseName: "数据结构",
    courseType: "专业核心",
    credit: 4,
    teacher: "赵磊",
    place: "信息楼 401",
    area: "南校区",
    className: "计科 2501",
    people: 55,
    weeks: weeks(9, 18),
  },
  {
    courseName: "计算机组成原理",
    courseType: "专业核心",
    credit: 4,
    teacher: "孙倩",
    place: "信息楼 305",
    area: "南校区",
    className: "计科 2501",
    people: 50,
    weeks: weeks(1, 16),
  },
  {
    courseName: "大学物理 B",
    courseType: "通识必修",
    credit: 3,
    teacher: "周涛",
    place: "理学楼 208",
    area: "南校区",
    className: "计科 2501",
    people: 90,
    weeks: weeks(1, 12),
  },
  {
    courseName: "体育(三)",
    courseType: "通识必修",
    credit: 1,
    teacher: "吴强",
    place: "体育馆",
    area: "南校区",
    className: "计科 2501",
    people: 40,
    weeks: weeks(1, 18),
  },
  {
    courseName: "马克思主义基本原理",
    courseType: "通识必修",
    credit: 3,
    teacher: "郑华",
    place: "文科楼 302",
    area: "南校区",
    className: "计科 2501",
    people: 130,
    weeks: weeks(1, 16),
  },
  {
    courseName: "概率论与数理统计",
    courseType: "通识必修",
    credit: 3,
    teacher: "冯雪",
    place: "综合楼 202",
    area: "南校区",
    className: "计科 2501",
    people: 110,
    weeks: weeks(9, 18),
  },
]

/** 每天的节次, 空数组表示当天无课 */
const schedule: Record<number, number[]> = {
  0: [],
  1: [1, 3, 5],
  2: [3, 5],
  3: [1, 5],
  4: [3, 7],
  5: [1],
  6: [],
}

/** 按课表铺满整学期 */
function createCourses(): CourseItem[] {
  const list: CourseItem[] = []
  let index = 0

  for (const [day, times] of Object.entries(schedule)) {
    for (const time of times) {
      const template = templates[index % templates.length]
      index += 1

      list.push({
        courseId: `GE${String(index).padStart(5, "0")}`,
        courseName: template.courseName,
        className: template.className,
        courseType: template.courseType,
        credit: template.credit,
        weeks: template.weeks,
        day: Number(day),
        time,
        times: [time, time + 1],
        extra: null,
        area: template.area,
        place: template.place,
        people: template.people,
        teacher: template.teacher,
        customizeId: null,
      })
    }
  }

  return list
}

const courses = createCourses()

courses.push({
  courseId: "GE09999",
  courseName: "高等数学 A(重修)",
  className: "重修班",
  courseType: "通识必修",
  credit: 5,
  weeks: weeks(9, 18),
  day: 1,
  time: 1,
  times: [1, 2],
  extra: null,
  area: "南校区",
  place: "综合楼 301",
  people: 30,
  teacher: "王军",
  customizeId: null,
})

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

const customs: CourseItem[] = [
  {
    courseId: null,
    courseName: "自定义课程",
    className: null,
    courseType: null,
    credit: null,
    weeks: weeks(1, 16),
    day: 2,
    time: 7,
    times: [7, 8],
    extra: null,
    area: null,
    place: "线上",
    people: null,
    teacher: "我",
    customizeId: 1,
  },
]

let seed = 1

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
      times: body.times,
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
    target.times = body.times
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
