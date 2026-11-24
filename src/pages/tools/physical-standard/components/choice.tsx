import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"

export interface ChoiceProps<T extends string> {
  /** 标签 */
  label: string
  /** 当前值 */
  value: T
  /** 选项 */
  options: readonly { value: T, label: string }[]
  /** 变更 */
  onChange: (value: T) => void
}

/** 一行二选一按钮, 左文本右操作 */
export default function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: Readonly<ChoiceProps<T>>): ReactNode {
  return (
    <View className="flex items-center gap-2">
      <Text className="w-3r shrink-0 text-xs text-soft">{label}</Text>
      <View className="flex flex-1 items-center gap-1">
        {options.map((item) => {
          const active = item.value === value

          return (
            <Button
              key={item.value}
              variant={active ? "solid" : "outline"}
              color={active ? "primary" : "ink"}
              className="rounded-full px-2 py-2x text-xs"
              onClick={() => onChange(item.value)}
            >
              {item.label}
            </Button>
          )
        })}
      </View>
    </View>
  )
}
