import type { contract } from "@contract/routes"
import type { ExperimentGrade, ExperimentItem } from "@contract/routes/experiment"
import type { Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { bindLab, isLabBound, sessionFrom, unbindLab } from "@server/session"
import { CODE } from "@shared/codes"

const experiments: ExperimentItem[] = [
  {
    seat: "12",
    name: "示波器的使用",
    course: "大学物理实验",
    teacher: "周老师",
    week: 6,
    day: 3,
    dateTime: "2026-11-25 14:30",
    place: "物理实验楼 205",
    phone: null,
    email: "teacher@example.edu.cn",
  },
  {
    seat: "26",
    name: "单摆测重力加速度",
    course: "大学物理实验",
    teacher: "周老师",
    week: 7,
    day: 3,
    dateTime: "2026-12-02 14:30",
    place: "物理实验楼 205",
    phone: null,
    email: "teacher@example.edu.cn",
  },
]

const grade: ExperimentGrade = {
  courseName: "大学物理实验",
  courseScore: "92",
  labs: [
    {
      name: "示波器的使用",
      score: "94",
      attendance: "正常",
      details: [
        { name: "实验报告", score: 94 },
        { name: "操作考核", score: 95 },
      ],
    },
    {
      name: "单摆测重力加速度",
      score: "90",
      attendance: "正常",
      details: [
        { name: "实验报告", score: 90 },
        { name: "操作考核", score: 89 },
      ],
    },
    {
      name: "杨氏模量的测量",
      score: "未出分",
      attendance: "缺勤",
      details: [],
    },
  ],
}

export const experiment: Handlers<typeof contract.experiment> = {
  list: ({ header }) => {
    const session = sessionFrom(header)

    return session && isLabBound(session)
      ? ok(experiments)
      : fail(CODE.upstream.rebind, "大物实验平台需要重新绑定")
  },
  grade: ({ header, query }) => {
    const session = sessionFrom(header)

    if (!session || !isLabBound(session))
      return fail(CODE.upstream.rebind, "大物实验平台需要重新绑定")

    return ok(query.semester === "winter"
      ? null
      : grade)
  },
  bind: ({ header, body }) => {
    const session = sessionFrom(header)

    if (body.password !== "123456")
      return fail(CODE.upstream.loginFailed, "密码错误。")

    if (session)
      bindLab(session)

    return ok(null)
  },
  unbind: ({ header }) => {
    const session = sessionFrom(header)

    if (session)
      unbindLab(session)

    return ok(null)
  },
}
