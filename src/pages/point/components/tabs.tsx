import type { ReactNode } from "react"
import type { PointTab } from "@/pages/point/model/point"
import { View } from "@tarojs/components"
import Button from "@/components/common/button"

/** tab 选项 */
const OPTIONS = [
  { key: "record", label: "记录" },
  { key: "shop", label: "商城" },
  { key: "rule", label: "规则" },
] as const satisfies readonly { key: PointTab, label: string }[]

export interface TabsProps {
  /** 当前 tab */
  value: PointTab
  /** 变更 */
  onChange: (value: PointTab) => void
}

/** 记录 / 商城 / 规则 切换 */
export default function Tabs({ value, onChange }: Readonly<TabsProps>): ReactNode {
  return (
    <View className="flex rounded-full bg-strong p-1">
      {OPTIONS.map((item) => {
        const active = item.key === value

        return (
          <Button
            key={item.key}
            variant={active ? "solid" : "ghost"}
            color={active ? "primary" : "ink"}
            className="flex-1 rounded-full py-1 text-xs"
            onClick={() => onChange(item.key)}
          >
            {item.label}
          </Button>
        )
      })}
    </View>
  )
}
