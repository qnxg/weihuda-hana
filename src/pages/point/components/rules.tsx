import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import { usePointDesc } from "@/pages/point/hooks/desc"
import { paragraphsOf } from "@/pages/point/model/point"

/** 积分规则 */
export default function Rules(): ReactNode {
  const { description, loading } = usePointDesc()
  const paragraphs = description
    ? paragraphsOf(description)
    : []

  return (
    <Scroll>
      <View className="pb-1r">
        <Card className="flex flex-col gap-2 border border-default p-3">
          {loading && <Text className="text-sm text-soft">加载中</Text>}
          {!loading && paragraphs.length === 0 && <Text className="text-sm text-soft">暂无说明</Text>}
          {paragraphs.map(item => (
            <Text key={item.key} className="text-sm text-default">{item.text}</Text>
          ))}
        </Card>
      </View>
    </Scroll>
  )
}
