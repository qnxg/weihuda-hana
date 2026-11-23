import type { ReactNode } from "react"
import type { ZodType } from "zod"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import { useFormField } from "@/hooks/form"
import { cn } from "@/utils/cn"

export interface WeeksProps {
  /** 总周数 */
  total: number
  /** 当前值 */
  value: number[]
  /** 变更 */
  onChange: (value: number[]) => void
  /** 字段名 */
  name?: string
  /** 标签 */
  label?: string
  /** 校验 */
  schema?: ZodType
}

/** 周次多选, 支持全选与单双周 */
export default function Weeks({
  total,
  value,
  onChange,
  name,
  label,
  schema,
}: Readonly<WeeksProps>): ReactNode {
  const { message, clear } = useFormField<number[]>({ name, schema, value })

  const weeks = Array.from({ length: total }, (_, index) => index + 1)
  const presets = [
    {
      text: "全选",
      weeks,
    },
    {
      text: "单周",
      weeks: weeks.filter(week => week % 2 === 1),
    },
    {
      text: "双周",
      weeks: weeks.filter(week => week % 2 === 0),
    },
    {
      text: "清空",
      weeks: [],
    },
  ]

  function set(next: number[]): void {
    clear()
    onChange(next)
  }

  function toggle(week: number): void {
    set(value.includes(week)
      ? value.filter(item => item !== week)
      : [
          ...value,
          week,
        ].sort((a, b) => a - b))
  }

  return (
    <View className="flex flex-col gap-1">
      {label && <Text className="text-sm text-soft">{label}</Text>}

      <View className="flex flex-wrap gap-1">
        {weeks.map(week => (
          <View
            key={week}
            className={cn(
              "flex h-4h w-4h items-center justify-center rounded-full border",
              value.includes(week)
                ? "border-primary bg-primary"
                : "border-default bg-strong",
            )}
            onClick={() => toggle(week)}
          >
            <Text className={cn("text-xs leading-none", value.includes(week)
              ? "text-primary-strong"
              : "text-soft")}
            >
              {week}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex items-center gap-2">
        {presets.map(preset => (
          <Button
            key={preset.text}
            variant="ghost"
            color="primary"
            className="px-1 py-0 text-xs"
            onClick={() => set(preset.weeks)}
          >
            <Text>{preset.text}</Text>
          </Button>
        ))}
      </View>

      {message && <Text className="text-xs text-error">{message}</Text>}
    </View>
  )
}
