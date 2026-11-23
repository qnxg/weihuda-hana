import type { PointRecordItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import { usePointRecords } from "@/pages/point/hooks/records"
import { deltaOf, timeOf } from "@/pages/point/model/point"
import { cn } from "@/utils/cn"

/** 一条积分记录 */
function Row({ item }: Readonly<{ item: PointRecordItem }>): ReactNode {
  return (
    <Card className="flex items-center gap-2 border border-default p-3">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-sm text-strong">{item.description}</Text>
        <Text className="text-xs text-soft">{timeOf(item.createdAt)}</Text>
      </View>
      <Text className={cn("shrink-0 text-sm", item.delta > 0
        ? "text-primary"
        : "text-strong")}
      >
        {deltaOf(item.delta)}
      </Text>
    </Card>
  )
}

/** 积分记录 */
export default function Records(): ReactNode {
  const { list, loading, loadingMore, refreshing, more, refresh } = usePointRecords()

  return (
    <Scroll refresh refreshing={refreshing} onRefresh={refresh} onScrollToLower={more}>
      <View className="flex flex-col gap-2 pb-1r">
        {loading && list.length === 0 && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
        {!loading && list.length === 0 && (
          <Text className="py-8r text-center text-sm text-soft">暂无积分记录</Text>
        )}
        {list.map(item => <Row key={item.id} item={item} />)}
        {loadingMore && <Text className="py-3 text-center text-xs text-soft">加载中</Text>}
      </View>
    </Scroll>
  )
}
