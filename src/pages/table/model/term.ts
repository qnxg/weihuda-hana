import type { TermInfo } from "@contract/routes"

/** 学期名 */
export const SEMESTER_LABEL = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
} as const

/** 学期唯一键 */
export function termKeyOf(term: TermInfo): string {
  return `${term.year}-${term.semester}`
}

/** 学期展示文本 */
export function termLabelOf(term: TermInfo): string {
  return `${term.year} ${SEMESTER_LABEL[term.semester]}`
}

/** 是否同一学期 */
export function sameTerm(a: TermInfo, b: TermInfo): boolean {
  return a.year === b.year && a.semester === b.semester
}
