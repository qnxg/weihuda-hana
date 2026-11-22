import type { GradeItem } from "@contract/routes"

export interface GradeSummary {
  /** 加权平均分 */
  average: number | null
}

/** 概览, 只统计已有成绩的科目 */
export function summaryOf(list: readonly GradeItem[]): GradeSummary {
  const scored = list.filter(item => item.score > 0)
  const credits = scored.reduce((sum, item) => sum + item.credit, 0)
  const weighted = scored.reduce((sum, item) => sum + item.score * item.credit, 0)

  return {
    average: credits > 0
      ? weighted / credits
      : null,
  }
}

/** 课程类别徽标 */
export function badgesOf(item: GradeItem): string[] {
  return [
    item.courseType1,
    item.courseType2,
  ].filter((type): type is string => Boolean(type))
}

/** 详情概览行 */
export function infoRowsOf(item: GradeItem): { label: string, value: string }[] {
  const types = badgesOf(item).join(" | ")
  const score = item.score > 0
    ? String(item.score)
    : null
  const gpa = item.gpa === null
    ? null
    : item.gpa.toFixed(1)
  const rows: { label: string, value: null | string }[] = [
    { label: "课程", value: item.courseName },
    { label: "类型", value: types || null },
    { label: "学分", value: `${item.credit} 学分` },
    { label: "成绩", value: score },
    { label: "绩点", value: gpa },
    { label: "成绩类型", value: item.gradeType },
    { label: "成绩标识", value: item.gradeTag },
  ]

  return rows.filter((row): row is { label: string, value: string } => Boolean(row.value))
}
