import type { RankCaGetData } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { RefreshCw } from "lucide-react-taro"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"

/** 可信电子凭证卡片 */
export default function CaCard({ ca, refreshing, onRefresh }: Readonly<{
  ca: RankCaGetData
  refreshing: boolean
  onRefresh: () => void
}>): ReactNode {
  const action = ca
    ? "更新"
    : "生成"

  return (
    <Card className="flex items-center gap-2 border border-default p-3">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-sm text-strong">可信电子凭证</Text>
        <Text className="text-xs text-soft">
          {ca
            ? `更新于 ${ca.updatedAt}`
            : "排名由教务系统生成, 需要主动更新"}
        </Text>
      </View>
      <Button
        variant="outline"
        color="primary"
        className="shrink-0 rounded-full px-2 py-1 text-xs"
        icon={<Icon icon={RefreshCw} className="h-1r w-1r" />}
        loading={refreshing}
        onClick={onRefresh}
      >
        <Text>{action}</Text>
      </Button>
    </Card>
  )
}
