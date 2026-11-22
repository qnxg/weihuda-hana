import type { Semester, Term } from "@contract/routes"

/** 学期名 */
export const SEMESTER_LABEL = {
  spring: "春",
  summer: "夏",
  autumn: "秋",
  winter: "冬",
} as const

/** 学期唯一键 */
export function termKeyOf(term: Term): string {
  return `${term.year}-${term.semester}`
}

/** 解析学期键, 非法返回 null */
export function termOfKey(key: string): Term | null {
  const [year, semester] = key.split("-")
  const value = Number(year)

  if (!Number.isInteger(value) || !(semester in SEMESTER_LABEL))
    return null

  return { year: value, semester: semester as Semester }
}

/** 学期展示文本 */
export function termLabelOf(term: Term): string {
  return `${term.year} ${SEMESTER_LABEL[term.semester]}`
}

/** 是否同一学期 */
export function sameTerm(a: Term, b: Term): boolean {
  return a.year === b.year && a.semester === b.semester
}
