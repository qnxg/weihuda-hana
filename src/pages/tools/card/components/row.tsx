import type { CardRecordItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { amountOf, moneyOf } from "@/pages/tools/card/model/card"
import { cn } from "@/utils/cn"

/** 一条流水 */
export default function Row({ item, onSelect }: Readonly<{
  item: CardRecordItem
  onSelect: (item: CardRecordItem) => void
}>): ReactNode {
  const time = item.tradedAt.slice(11, 16)

  return (
    <Card className="flex flex-col gap-1 border border-default p-3" onClick={() => onSelect(item)}>
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-sm text-strong">{item.name}</Text>
        <Text className={cn("shrink-0 text-sm", item.amount < 0
          ? "text-strong"
          : "text-primary")}
        >
          {amountOf(item.amount)}
        </Text>
      </View>
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-xs text-soft">{`${time} | ${item.location ?? "地点未记录"}`}</Text>
        <Text className="shrink-0 text-xs text-soft">{`余额 ${moneyOf(item.balance)}`}</Text>
      </View>
    </Card>
  )
}
