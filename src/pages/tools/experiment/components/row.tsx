import type { ExperimentItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Card from "@/components/common/card"
import { metaOf } from "@/pages/tools/experiment/model/experiment"

/** 一次实验安排 */
export default function Row({ item, onSelect }: Readonly<{
  item: ExperimentItem
  onSelect: (item: ExperimentItem) => void
}>): ReactNode {
  return (
    <Card className="flex flex-col gap-1 border border-default p-3" onClick={() => onSelect(item)}>
      <Text className="text-sm text-strong">{item.name}</Text>
      <Text className="text-xs text-soft">{metaOf(item)}</Text>
    </Card>
  )
}
