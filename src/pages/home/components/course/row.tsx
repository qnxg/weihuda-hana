import type { CourseItem } from "@contract/routes"
import type { ReactNode } from "react"
import type { IconColor } from "@/components/common/icon"
import type { CourseProgress } from "@/pages/home/components/course/text"
import { Text, View } from "@tarojs/components"
import { ChevronDown, ChevronRight } from "lucide-react-taro"
import { useState } from "react"
import Icon from "@/components/common/icon"
import Ring from "@/pages/home/components/course/ring"
import Status from "@/pages/home/components/course/status"
import { labelOf, periodOf, progressOf, timeOf } from "@/pages/home/components/course/text"
import { cn } from "@/utils/cn"

export interface RowProps {
  /** 课程 */
  course: CourseItem
  /** 上课日期 */
  date: Date
  /** 当前时刻 */
  now: Date
}

/** 状态指示, 倒计时内用进度环, 否则用 pill */
function Trailing({ state }: Readonly<{ state: CourseProgress }>): ReactNode {
  const { status, progress, minutes } = state

  if (minutes === undefined)
    return <Status status={status} />

  return (
    <View className="flex shrink-0 flex-col items-center gap-1">
      <Text className="text-xs text-soft">{labelOf(status)}</Text>
      <View className="relative">
        <Ring progress={progress} />
        <View className="absolute inset-0 flex items-center justify-center">
          <Text className="text-xs text-primary-strong">{`${minutes}m`}</Text>
        </View>
      </View>
    </View>
  )
}

/** 展开指示, 收起为右向, 展开为下向 */
function Indicator({ expanded, color }: Readonly<{ expanded: boolean, color: IconColor }>): ReactNode {
  return <Icon icon={expanded ? ChevronDown : ChevronRight} color={color} className="h-2h w-2h shrink-0" />
}

/** 课表列表的一行, 已上完的课默认收起, 其余默认展开 */
export default function Row({ course, date, now }: Readonly<RowProps>): ReactNode {
  const state = progressOf(course, date, now)
  const { status } = state
  const [expanded, setExpanded] = useState(status !== "ended")
  const title = expanded
    ? "text-lg"
    : "text-sm"
  const color: IconColor = status === "ended"
    ? "ink"
    : "primary"

  return (
    <View className="flex flex-col gap-1" onClick={() => setExpanded(value => !value)}>
      <View className="flex items-center gap-1h">
        <Indicator expanded={expanded} color={color} />
        <Text className={cn("flex-1 text-strong", title)}>{course.courseName}</Text>
        {expanded
          ? <Trailing state={state} />
          : <Text className="shrink-0 text-xs text-soft">{periodOf(course.time)}</Text>}
        {!expanded && <Status status={status} />}
      </View>
      {expanded && (
        <Text className="pl-3h text-xs text-soft">
          {`${periodOf(course.time)} | ${timeOf(course.time)} | ${course.place ?? "暂无地点"} | ${course.teacher ?? "暂无教师"}`}
        </Text>
      )}
    </View>
  )
}
