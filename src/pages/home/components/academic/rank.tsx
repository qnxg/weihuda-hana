import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { Medal } from "lucide-react-taro"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import { useRank } from "@/pages/home/hooks/rank"
import { navigateTo } from "@/utils/navigate"

/** 成绩排名 */
export default function Rank(): ReactNode {
  const { weightedRank, loading } = useRank()

  return (
    <Card
      className="flex flex-1 items-center gap-2 border border-default p-3"
      onClick={() => navigateTo(PAGE.debug.index)}
    >
      <View className="flex h-4h w-4h shrink-0 items-center justify-center rounded-lg raw:bg-orange-bg">
        <Icon icon={Medal} color="orange" className="h-2h w-2h" />
      </View>
      <View className="flex flex-col gap-1">
        <Text className="text-sm text-strong">成绩排名</Text>
        {loading
          ? <Skeleton className="h-2 w-6r bg-ink-line" />
          : (
              <Text className="text-xs text-soft">
                {weightedRank
                  ? `加权核心 ${weightedRank}`
                  : "暂无排名"}
              </Text>
            )}
      </View>
    </Card>
  )
}
