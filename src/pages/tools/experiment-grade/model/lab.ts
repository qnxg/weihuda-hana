/** 出勤值, 空值转为未记录 */
export function attendanceOf(attendance: string | null): string {
  return attendance?.trim() || "未记录"
}

/** 出勤标签底色 */
export function attendanceTintOf(attendance: string | null): string {
  const value = attendanceOf(attendance)

  if (value === "未记录")
    return "bg-default text-soft"

  if (value.includes("缺") || value.includes("旷"))
    return "bg-error text-error-strong"

  if (value.includes("正常") || value.includes("合格"))
    return "bg-primary text-primary-strong"

  return "bg-default text-soft"
}
