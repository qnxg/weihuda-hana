import type { AnnouncementItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { dateOf } from "@/pages/announcement/model/announcement"

/** 一条公告 */
export default function Row({ item, onSelect }: Readonly<{
  item: AnnouncementItem
  onSelect: (item: AnnouncementItem) => void
}>): ReactNode {
  return (
    <Card className="flex flex-col gap-1 border border-default p-3" onClick={() => onSelect(item)}>
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-sm text-strong">{item.title}</Text>
        {!item.read && <Text className="shrink-0 rounded bg-primary px-1 text-xs text-primary-strong">未读</Text>}
      </View>
      <Text className="text-xs text-soft">{dateOf(item)}</Text>
    </Card>
  )
}
