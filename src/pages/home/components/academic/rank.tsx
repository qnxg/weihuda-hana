import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Skeleton from "@/components/common/skeleton"
import { ENTRY_TINT } from "@/config/entry"
import { PAGE } from "@/config/page"
import { BADGE_BG } from "@/config/theme"
import { useRank } from "@/pages/home/hooks/rank"
import { navigateTo } from "@/utils/navigate"

/** 成绩排名 */
export default function Rank(): ReactNode {
  const { weightedRank, loading } = useRank()
  const { icon, color } = ENTRY_TINT.rank

  return (
    <Card
      className="flex flex-1 items-center gap-2 border border-default p-3"
      onClick={() => navigateTo(PAGE.tools.rank)}
    >
      <View className={`flex h-4h w-4h shrink-0 items-center justify-center rounded-lg ${BADGE_BG[color]}`}>
        <Icon icon={icon} color={color} className="h-2h w-2h" />
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
