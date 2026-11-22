import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"

/** 一行二选一按钮, 左文本右操作 */
export default function Pills<T extends string>({ label, value, options, onChange }: Readonly<{
  label: string
  value: T
  options: readonly { key: T, title: string }[]
  onChange: (value: T) => void
}>): ReactNode {
  return (
    <View className="flex items-center gap-2">
      <Text className="shrink-0 text-xs text-soft">{label}</Text>
      <View className="flex flex-1 flex-wrap items-center justify-end gap-1">
        {options.map((item) => {
          const active = item.key === value

          return (
            <Button
              key={item.key}
              variant={active ? "solid" : "outline"}
              color={active ? "primary" : "ink"}
              className="rounded-full px-2 py-2x text-xs"
              onClick={() => onChange(item.key)}
            >
              {item.title}
            </Button>
          )
        })}
      </View>
    </View>
  )
}
