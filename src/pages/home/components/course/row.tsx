import type { CourseItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Status from "@/pages/home/components/course/status"
import { periodOf, statusOf } from "@/pages/home/components/course/text"
import { cn } from "@/utils/cn"

export interface RowProps {
  /** 课程 */
  course: CourseItem
  /** 是否选中 */
  active: boolean
  /** 上课日期 */
  date: Date
  /** 当前时刻 */
  now: Date
  /** 点击 */
  onTap: () => void
}

/** 课表列表的一行 */
export default function Row({ course, active, date, now, onTap }: Readonly<RowProps>): ReactNode {
  return (
    <View
      className={cn(
        "flex items-center gap-2 rounded-md border px-1h py-1h",
        active ? "border-primary bg-primary" : "border-transparent",
      )}
      onClick={onTap}
    >
      <Text className="shrink-0 text-xs text-default">{periodOf(course.time)}</Text>
      <Text className="flex-1 text-sm text-strong">{course.courseName}</Text>
      <Text className="shrink-0 text-xs text-default">{course.place ?? ""}</Text>
      <Status status={statusOf(course, date, now)} />
    </View>
  )
}
