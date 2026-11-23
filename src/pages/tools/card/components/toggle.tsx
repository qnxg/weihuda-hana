import type { CardRecordType } from "@contract/routes"
import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Button from "@/components/common/button"
import { TYPES } from "@/pages/tools/card/model/card"

export interface ToggleProps {
  /** 当前类型 */
  value: CardRecordType
  /** 变更 */
  onChange: (value: CardRecordType) => void
}

/** 交易类型切换 */
export default function Toggle({ value, onChange }: Readonly<ToggleProps>): ReactNode {
  return (
    <View className="flex shrink-0 rounded-full bg-strong p-1">
      {TYPES.map((item) => {
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
