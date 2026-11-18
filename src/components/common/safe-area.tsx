import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { getWindowInfo } from "@tarojs/taro"
import { cn } from "@/utils/cn"

/** 安全区位置 */
export type SafeAreaEdge = "top" | "bottom"

export interface SafeAreaProps extends ComponentProps<typeof View> {
  /** 安全区位置 */
  edge?: SafeAreaEdge
}

let heights: { top: number, bottom: number } | null = null

/** 设备安全区高度 */
function safeAreaHeights(): { top: number, bottom: number } {
  if (heights)
    return heights

  const { statusBarHeight, screenHeight, safeArea } = getWindowInfo()
  const current = {
    top: statusBarHeight ?? 0,
    bottom: Math.max(screenHeight - (safeArea?.bottom ?? 0), 0),
  }
  heights = current
  return current
}

/** 安全区占位, 高度取设备安全区 */
export default function SafeArea({
  edge = "bottom",
  className,
  ...rest
}: Readonly<SafeAreaProps>): ReactNode {
  const { top, bottom } = safeAreaHeights()
  return (
    <View
      {...rest}
      style={{
        height: edge === "bottom"
          ? bottom
          : top,
      }}
      className={cn(className)}
    />
  )
}
