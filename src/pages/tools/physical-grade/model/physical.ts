import type { PhysicalGrade } from "@contract/routes"

/** 单项指标键 */
type MetricKey = Exclude<keyof PhysicalGrade, "grade" | "score" | "reportDescription" | "reportStatus" | "reportType" | "eye">

/** 单项指标标签 */
export const METRICS = [
  { key: "shortRun", label: "50 米跑", weight: 20 },
  { key: "bmi", label: "体重指数", weight: 15 },
  { key: "jump", label: "立定跳远", weight: 10 },
  { key: "pullAndSit", label: "引体 / 仰卧起坐", weight: 10 },
  { key: "run", label: "耐力跑", weight: 20 },
  { key: "sitAndReach", label: "坐位体前屈", weight: 10 },
  { key: "vc", label: "肺活量", weight: 15 },
] as const satisfies readonly { key: MetricKey, label: string, weight: number }[]

/** 视力项标签 */
export const EYES = [
  { key: "sight", label: "裸眼视力" },
  { key: "mirror", label: "戴镜视力" },
  { key: "ametropia", label: "屈光状态" },
] as const satisfies readonly { key: keyof PhysicalGrade["eye"], label: string }[]

/** 等级底色 */
export function tintOf(color: string): string {
  switch (color.trim().toLowerCase()) {
    case "green":
      return "bg-primary text-primary-strong"
    case "red":
      return "bg-error text-error-strong"
    default:
      return "bg-default text-soft"
  }
}
