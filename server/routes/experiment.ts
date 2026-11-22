import type { contract } from "@contract/routes"
import type { ExperimentItem } from "@contract/routes/experiment"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

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

export const experiment: Handlers<typeof contract.experiment> = {
  list: () => ok(experiments),
}
