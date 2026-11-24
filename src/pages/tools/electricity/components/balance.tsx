import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import Card from "@/components/common/card"

export interface BalanceProps {
  /** 剩余电量 */
  balance: number | undefined
  /** 是否加载中 */
  loading: boolean
  /** 是否同步中 */
  refreshing: boolean
  /** 同步 */
  onRefresh: () => void
}

/** 剩余电量与同步入口 */
export default function Balance({ balance, loading, refreshing, onRefresh }: Readonly<BalanceProps>): ReactNode {
  return (
    <Card className="flex flex-col gap-2 border border-default p-3">
      <Text className="text-xs text-soft">剩余电量</Text>

      <View className="flex items-baseline gap-1">
        <Text className="text-xl text-strong">
          {loading || balance === undefined
            ? "--"
            : balance.toFixed(1)}
        </Text>
        <Text className="text-xs text-soft">度</Text>
      </View>

      <Button
        variant="outline"
        className="rounded-md py-2"
        loading={refreshing}
        onClick={onRefresh}
      >
        {refreshing
          ? "同步中"
          : "同步电量"}
      </Button>
    </Card>
  )
}
