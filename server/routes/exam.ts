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

export const exam: Handlers<typeof contract.exam> = {
  list: () => ok(exams),
}
