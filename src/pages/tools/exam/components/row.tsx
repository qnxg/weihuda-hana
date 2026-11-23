import type { ExamItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { metaOf, STATUS_LABEL, STATUS_TINT, statusOf } from "@/pages/tools/exam/model/exam"
import { cn } from "@/utils/cn"

/** 一场考试 */
export default function Row({ item, now, onSelect }: Readonly<{
  item: ExamItem
  now: Date
  onSelect: (item: ExamItem) => void
}>): ReactNode {
  const status = statusOf(item, now)

  return (
    <Card className="flex flex-col gap-1 border border-default p-3" onClick={() => onSelect(item)}>
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-sm text-strong">{item.courseName}</Text>
        <Text className={cn("shrink-0 rounded px-1 text-xs", STATUS_TINT[status])}>
          {STATUS_LABEL[status]}
        </Text>
      </View>
      <Text className="text-xs text-soft">{metaOf(item)}</Text>
    </Card>
  )
}
