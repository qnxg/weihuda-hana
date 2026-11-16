import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

/** 安全区位置 */
export type SafeAreaEdge = "top" | "bottom"

export interface SafeAreaProps extends ComponentProps<typeof View> {
  /** 安全区位置 */
  edge?: SafeAreaEdge
}

/** 安全区占位, 高度取设备安全区 */
export default function SafeArea({
  edge = "bottom",
  className,
  ...rest
}: Readonly<SafeAreaProps>): ReactNode {
  return (
    <View
      {...rest}
      className={cn(edge === "bottom"
        ? "h-safe-bottom"
        : "h-safe-top", className)}
    />
  )
}
