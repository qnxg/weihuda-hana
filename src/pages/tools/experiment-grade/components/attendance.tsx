import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import { attendanceOf, attendanceTintOf } from "@/pages/tools/experiment-grade/model/lab"
import { cn } from "@/utils/cn"

/** 出勤标签 */
export default function Attendance({ value }: Readonly<{ value: string | null }>): ReactNode {
  return (
    <Text
      className={cn(
        "rounded-full px-1h py-2x text-xs leading-none",
        attendanceTintOf(value),
      )}
    >
      {`出勤${attendanceOf(value)}`}
    </Text>
  )
}
