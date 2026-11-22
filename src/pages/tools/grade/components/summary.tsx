import type { Rank } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import RankValue from "@/pages/tools/grade/components/rank-value"

/** 概览 */
export default function Summary({ average, rank }: Readonly<{ average: number | null, rank: Rank | null }>): ReactNode {
  return (
    <Card className="flex overflow-hidden border border-default p-0">
      <View className="flex flex-1 flex-col items-center gap-1 border-r border-default py-3">
        <Text className="text-lg text-strong">
          {average === null
            ? "--"
            : average.toFixed(1)}
        </Text>
        <Text className="text-xs text-soft">加权平均分</Text>
      </View>
      <View className="flex flex-1 flex-col items-center gap-1 py-3">
        <RankValue value={rank?.all?.weightedRank ?? null} />
        <Text className="text-xs text-soft">加权排名</Text>
      </View>
    </Card>
  )
}
