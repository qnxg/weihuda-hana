import type { ReactNode } from "react"
import type { ToolItem } from "@/pages/kit/config/tool"
import { Text, View } from "@tarojs/components"
import Tool from "@/pages/kit/components/tool"
import { navigateTo } from "@/utils/navigate"

/** 每行卡片数 */
const COLUMNS = 2

/** 按行切分 */
function rows(items: readonly ToolItem[]): ToolItem[][] {
  const count = Math.ceil(items.length / COLUMNS)

  return Array.from({ length: count }, (_, index) =>
    items.slice(index * COLUMNS, index * COLUMNS + COLUMNS))
}

export interface GroupProps {
  /** 分组标题 */
  title: string
  /** 工具项 */
  items: readonly ToolItem[]
}

/** 工具分组 */
export default function Group({ title, items }: Readonly<GroupProps>): ReactNode {
  if (items.length === 0)
    return null

  return (
    <View className="flex flex-col gap-1r">
      <Text className="text-sm text-strong">{title}</Text>
      <View className="flex flex-col gap-3">
        {rows(items).map(row => (
          <View key={row[0].title} className="flex gap-3">
            {row.map(item => (
              <Tool key={item.title} item={item} onClick={() => navigateTo(item.path)} />
            ))}
            {row.length < COLUMNS && <View className="flex-1" />}
          </View>
        ))}
      </View>
    </View>
  )
}
