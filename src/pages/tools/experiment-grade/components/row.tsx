import type { ExperimentGradeItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Attendance from "@/pages/tools/experiment-grade/components/attendance"

/** 一次实验 */
export default function Row({ item, onSelect }: Readonly<{ item: ExperimentGradeItem, onSelect: (item: ExperimentGradeItem) => void }>): ReactNode {
  return (
    <Card className="flex items-center gap-3 border border-default p-3" onClick={() => onSelect(item)}>
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-sm text-strong">{item.name}</Text>
        <View className="flex flex-wrap items-center gap-1">
          <Attendance value={item.attendance} />
          <Text className="rounded-full bg-default px-1h py-2x text-xs leading-none text-soft">
            {`${item.details.length} 项评分`}
          </Text>
        </View>
      </View>
      <View className="flex shrink-0 flex-col items-end gap-1">
        <Text className="text-base text-strong">{item.score.trim() || "待发布"}</Text>
        <Text className="text-xs text-soft">实验成绩</Text>
      </View>
    </Card>
  )
}
