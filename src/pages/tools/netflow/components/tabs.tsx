import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Button from "@/components/common/button"

/** 页内 tab */
export type NetflowTab = "detail" | "order"

/** tab 选项 */
const OPTIONS = [
  { key: "detail", label: "流量明细" },
  { key: "order", label: "历史账单" },
] as const satisfies readonly { key: NetflowTab, label: string }[]

export interface TabsProps {
  /** 当前 tab */
  value: NetflowTab
  /** 变更 */
  onChange: (value: NetflowTab) => void
}

/** 明细 / 账单 切换 */
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
