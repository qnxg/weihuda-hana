import type { RankDetail } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { cn } from "@/utils/cn"

/** 一项排名的三项指标 */
export default function Stats({ detail }: Readonly<{ detail: RankDetail | null }>): ReactNode {
  const arithmetic = detail?.arithmetic ?? "--"
  const arithmeticRank = detail?.arithmeticRank ?? "--"
  const weighted = detail?.weighted ?? "--"
  const weightedRank = detail?.weightedRank ?? "--"
  const gpa = detail?.gpa ?? "--"
  const gpaRank = detail?.gpaRank ?? "--"
  const items = [
    {
      key: "arithmetic",
      label: "算术平均",
      value: arithmetic,
      rank: arithmeticRank,
    },
    {
      key: "weighted",
      label: "加权平均",
      value: weighted,
      rank: weightedRank,
    },
    {
      key: "gpa",
      label: "绩点",
      value: gpa,
      rank: gpaRank,
    },
  ]

  return (
    <Card className="flex overflow-hidden border border-default p-0">
      {items.map((item, index) => (
        <View
          key={item.key}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3",
            index < items.length - 1 && "border-r border-default",
          )}
        >
          <Text className="text-xs text-soft">{item.label}</Text>
          <Text className="text-lg text-strong">{item.value}</Text>
          <Text className="text-xs text-soft">{item.rank}</Text>
        </View>
      ))}
    </Card>
  )
}
