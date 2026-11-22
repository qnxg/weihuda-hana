import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import { cn } from "@/utils/cn"

/** 强调展示的类别 */
const PRIMARY_TYPES = new Set(["必修", "专业基础", "专业核心"])

/** 课程类别徽标 */
export default function TypeBadge({ text }: Readonly<{ text: string }>): ReactNode {
  const primary = PRIMARY_TYPES.has(text)

  return (
    <Text
      className={cn(
        "rounded-full px-1h py-2x text-xs leading-none",
        primary
          ? "bg-primary text-primary-strong"
          : "bg-default text-soft",
      )}
    >
      {text}
    </Text>
  )
}
