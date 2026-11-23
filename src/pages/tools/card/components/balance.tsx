import type { CardGetData } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { moneyOf } from "@/pages/tools/card/model/card"

/** 余额概览 */
export default function Balance({ card }: Readonly<{ card: CardGetData | null }>): ReactNode {
  return (
    <Card className="flex items-center gap-3 border border-default p-3">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-xs text-soft">当前余额</Text>
        <View className="flex items-baseline gap-1">
          <Text className="text-xs text-soft">¥</Text>
          <Text className="text-xl text-strong">
            {card
              ? moneyOf(card.balance)
              : "--"}
          </Text>
        </View>
      </View>
      {card && <Text className="shrink-0 text-xs text-soft">{`卡号 ${card.id}`}</Text>}
    </Card>
  )
}
