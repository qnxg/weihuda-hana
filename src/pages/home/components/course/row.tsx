import type { CourseItem } from "@contract/routes"
import type { ReactNode } from "react"
import type { IconColor } from "@/components/common/icon"
import { Text, View } from "@tarojs/components"
import { ChevronDown, ChevronRight } from "lucide-react-taro"
import { useState } from "react"
import Icon from "@/components/common/icon"
import Status from "@/pages/home/components/course/status"
import { periodOf, statusOf, timeOf } from "@/pages/home/components/course/text"
import { cn } from "@/utils/cn"

export interface RowProps {
  /** 课程 */
  course: CourseItem
  /** 上课日期 */
  date: Date
  /** 当前时刻 */
  now: Date
}

/** 展开指示, 收起为右向, 展开为下向 */
function Indicator({ expanded, color }: Readonly<{ expanded: boolean, color: IconColor }>): ReactNode {
  return <Icon icon={expanded ? ChevronDown : ChevronRight} color={color} className="h-2h w-2h shrink-0" />
}

/** 课表列表的一行, 已上完的课默认收起, 其余默认展开 */
export default function Row({ course, date, now }: Readonly<RowProps>): ReactNode {
  const status = statusOf(course, date, now)
  const [expanded, setExpanded] = useState(status !== "ended")
  const color: IconColor = status === "ended"
    ? "ink"
    : "primary"

  return (
    <View className="flex flex-col gap-1" onClick={() => setExpanded(value => !value)}>
      <View className="flex items-center gap-1h">
        <Indicator expanded={expanded} color={color} />
        <Text className={cn("flex-1 text-strong", expanded ? "text-md" : "text-sm")}>{course.courseName}</Text>
        {expanded
          ? <Status status={status} />
          : (
              <View className="flex shrink-0 items-center">
                <Text className="text-xs text-soft">{periodOf(course.time)}</Text>
                <Status status={status} />
              </View>
            )}
      </View>
      {expanded && (
        <Text className="pl-3h text-xs text-soft">
          {`${periodOf(course.time)} | ${timeOf(course.time)} | ${course.place ?? "暂无地点"} | ${course.teacher ?? "暂无教师"}`}
        </Text>
      )}
    </View>
  )
}
