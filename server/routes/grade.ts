import type { contract, GradeDetailItem, GradeItem } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

const grades: GradeItem[] = [
  {
    courseId: "GE01123",
    courseName: "高等数学 A",
    credit: 5,
    gpa: 3.7,
    score: 88,
    courseType1: "必修",
    courseType2: "专业基础",
    gradeTag: null,
    gradeType: "主修",
    detailId: "GE01123-2025",
  },
  {
    courseId: "CS01001",
    courseName: "程序设计基础",
    credit: 3,
    gpa: 4.0,
    score: 94,
    courseType1: "必修",
    courseType2: "专业核心",
    gradeTag: null,
    gradeType: "主修",
    detailId: "CS01001-2025",
  },
  {
    courseId: "GE02011",
    courseName: "大学物理",
    credit: 4,
    gpa: null,
    score: 0,
    courseType1: "必修",
    courseType2: "专业基础",
    gradeTag: "缓考",
    gradeType: "主修",
    detailId: null,
  },
  {
    courseId: "GE03101",
    courseName: "中国近现代史纲要",
    credit: 2,
    gpa: 3.3,
    score: 82,
    courseType1: "选修",
    courseType2: "通识选修",
    gradeTag: null,
    gradeType: "主修",
    detailId: null,
  },
]

const details: Record<string, GradeDetailItem[]> = {
  "GE01123-2025": [
    { name: "平时", score: "90", percentage: "30%" },
    { name: "期末", score: "87", percentage: "70%" },
  ],
  "CS01001-2025": [
    { name: "实验", score: "95", percentage: "40%" },
    { name: "期末", score: "93", percentage: "60%" },
  ],
}

export const grade: Handlers<typeof contract.grade> = {
  list: () => ok(grades),
  get: ({ params }) => ok(details[params.detailId] ?? []),
}
