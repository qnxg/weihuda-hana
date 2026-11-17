import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

/** 位置 */
export type OverlayPosition = "top" | "center" | "bottom"

/** 位置对齐 */
const align: Record<OverlayPosition, string> = {
  top: "items-start justify-center",
  center: "items-center justify-center",
  bottom: "items-end justify-center",
}

export interface OverlayProps {
  /** 内容位置 */
  position?: OverlayPosition
  /** 内容容器 class */
  className?: string
  /** 内容 */
  children?: ReactNode
  /** 点击遮罩 */
  onClick?: ComponentProps<typeof View>["onClick"]
}

/** 遮罩层 */
export default function Overlay({
  position = "center",
  className,
  children,
  onClick,
}: Readonly<OverlayProps>): ReactNode {
  return (
    <View className={cn("absolute inset-0 pointer-events-auto flex", align[position])}>
      <View className="absolute inset-0 bg-black opacity-soft" onClick={onClick} />
      <View className={cn("relative", className)}>
        {children}
      </View>
    </View>
  )
}
