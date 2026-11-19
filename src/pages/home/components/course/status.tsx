import type { ReactNode } from "react"
import type { CourseStatus } from "@/pages/home/components/course/text"
import { Text, View } from "@tarojs/components"
import { labelOf } from "@/pages/home/components/course/text"
import { cn } from "@/utils/cn"

/** 各状态的配色 */
const tones: Record<CourseStatus, string> = {
  ongoing: "bg-primary-invert text-invert",
  pending: "bg-primary-strong text-strong",
  ended: "bg-default text-default",
}

/** 课程状态 pill */
export default function Status({ status }: Readonly<{ status: CourseStatus }>): ReactNode {
  return (
    <View className={cn("flex items-center shrink-0 rounded-full px-1h py-1", tones[status])}>
      <Text className="text-xs">{labelOf(status)}</Text>
    </View>
  )
}
