import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Button from "@/components/common/button"

/** 列表筛选 */
export type ListFilter = "all" | "unread"

/** 筛选选项 */
const OPTIONS = [
  { key: "all", label: "全部" },
  { key: "unread", label: "未读" },
] as const satisfies readonly { key: ListFilter, label: string }[]

export interface TabsProps {
  /** 当前筛选 */
  value: ListFilter
  /** 变更 */
  onChange: (value: ListFilter) => void
}

/** 全部 / 未读 切换 */
export default function Tabs({ value, onChange }: Readonly<TabsProps>): ReactNode {
  return (
    <View className="flex shrink-0 rounded-full bg-strong p-1">
      {OPTIONS.map((item) => {
        const active = item.key === value

        return (
          <Button
            key={item.key}
            variant={active ? "solid" : "ghost"}
            color={active ? "primary" : "ink"}
            className="rounded-full px-3 py-2x text-xs"
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </Button>
        )
      })}
    </View>
  )
}
