import type { contract } from "@contract/routes"
import type { PhysicalGrade } from "@contract/routes/physical"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

/** 单项成绩 */
function metric(color: string, grade: string, score: number, rank: string) {
  return { color, grade, score, rank }
}

const grade: PhysicalGrade = {
  grade: "良好",
  score: 82.5,
  reportDescription: "本学年体测已完成, 成绩可申请复核",
  reportStatus: "已发布",
  reportType: "国家学生体质健康标准",
  eye: {
    sight: {
      left: { value: "4.6", description: "轻度近视" },
      right: { value: "4.7", description: "轻度近视" },
    },
    mirror: {
      left: { value: "5.0", description: "矫正正常" },
      right: { value: "5.0", description: "矫正正常" },
    },
    ametropia: {
      left: { value: "近视", description: "-2.50D" },
      right: { value: "近视", description: "-2.25D" },
    },
  },
  shortRun: metric("green", "良好", 18, "前 30%"),
  bmi: metric("green", "正常", 14, "前 20%"),
  jump: metric("green", "良好", 8, "前 40%"),
  pullAndSit: metric("red", "及格", 6, "后 30%"),
  run: metric("green", "良好", 17, "前 35%"),
  sitAndReach: metric("green", "优秀", 10, "前 10%"),
  vc: metric("green", "良好", 13, "前 25%"),
}

export const physical: Handlers<typeof contract.physical> = {
  get: () => ok(grade),
}
