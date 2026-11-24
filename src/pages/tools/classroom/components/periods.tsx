import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { PERIOD_GROUPS } from "@/pages/tools/classroom/model/classroom"
import { cn } from "@/utils/cn"

export interface PeriodsProps {
  /** 已选大节键 */
  value: readonly string[]
  /** 变更 */
  onChange: (value: string[]) => void
}

/** 大节多选, 三列铺满 */
export default function Periods({ value, onChange }: Readonly<PeriodsProps>): ReactNode {
  const rows = [
    PERIOD_GROUPS.slice(0, 3),
    PERIOD_GROUPS.slice(3, 6),
  ]

  function toggle(key: string): void {
    onChange(value.includes(key)
      ? value.filter(item => item !== key)
      : [...value, key])
  }

  return (
    <View className="flex flex-col gap-1">
      {rows.map(row => (
        <View key={row[0].key} className="flex gap-1">
          {row.map((item) => {
            const active = value.includes(item.key)

            return (
              <View
                key={item.key}
                className={cn(
                  "flex flex-1 flex-col items-center rounded-md border px-1 py-1",
                  active
                    ? "border-primary bg-primary"
                    : "border-default",
                )}
                onClick={() => toggle(item.key)}
              >
                <Text className={cn("text-xs", active
                  ? "text-primary-strong"
                  : "text-default")}
                >
                  {item.label}
                </Text>
                <Text className={cn("text-xs", active
                  ? "text-primary-soft"
                  : "text-soft")}
                >
                  {`${item.start} - ${item.end}`}
                </Text>
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}
