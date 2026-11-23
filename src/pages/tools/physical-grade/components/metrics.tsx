import type { PhysicalGrade } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { METRICS, tintOf } from "@/pages/tools/physical-grade/model/physical"
import { cn } from "@/utils/cn"

/** 单项成绩列表 */
export default function Metrics({ grade }: Readonly<{ grade: PhysicalGrade }>): ReactNode {
  return (
    <Card className="flex flex-col overflow-hidden border border-default p-0">
      {METRICS.map((item, index) => {
        const metric = grade[item.key]

        return (
          <View
            key={item.key}
            className={cn(
              "flex items-center gap-2 px-3 py-1h",
              index < METRICS.length - 1 && "border-b border-default",
            )}
          >
            <View className="flex flex-1 flex-col gap-1">
              <Text className="text-sm text-default">{item.label}</Text>
              <Text className="text-xs text-soft">{`占比 ${item.weight}% / 位次 ${metric.rank}`}</Text>
            </View>
            <Text className="w-8 shrink-0 text-right text-sm text-strong">{metric.score}</Text>
            <Text className={cn("shrink-0 rounded-full px-1h py-1x text-xs leading-none", tintOf(metric.color))}>
              {metric.grade}
            </Text>
          </View>
        )
      })}
    </Card>
  )
}
