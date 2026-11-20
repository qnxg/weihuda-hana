import type { ExamItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { countdownOf, metaOf } from "@/pages/home/components/academic/text"

export interface ExamRowProps {
  /** 考试 */
  item: ExamItem
  /** 当前时刻 */
  now: Date
}

/** 待办列表里的一个考试 */
export default function ExamRow({ item, now }: Readonly<ExamRowProps>): ReactNode {
  const countdown = countdownOf(item, now)

  if (!countdown)
    return null

  return (
    <View className="flex items-center gap-2">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-sm text-strong">{item.courseName}</Text>
        <Text className="text-xs text-soft">{metaOf(item)}</Text>
      </View>
      <View className="shrink-0 rounded-full bg-primary-invert px-1h py-1x">
        <Text className="text-invert text-xs">{countdown}</Text>
      </View>
    </View>
  )
}
