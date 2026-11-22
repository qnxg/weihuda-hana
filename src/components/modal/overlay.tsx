import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { DURATION } from "@/config/duration"
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
  /** 激活, 决定遮罩的显隐过渡 */
  active?: boolean
  /** 内容位置 */
  position?: OverlayPosition
  /** 遮罩变暗, 关掉只保留点击捕获层 */
  dim?: boolean
  /** 内容容器 class */
  className?: string
  /** 内容 */
  children?: ReactNode
  /** 点击遮罩 */
  onClick?: ComponentProps<typeof View>["onClick"]
}

/** 遮罩层 */
export default function Overlay({
  active = true,
  position = "center",
  dim = true,
  className,
  children,
  onClick,
}: Readonly<OverlayProps>): ReactNode {
  return (
    <View className={cn("absolute inset-0 pointer-events-auto flex", align[position])}>
      <View
        className={cn("absolute inset-0", dim && "bg-black", active ? "opacity-soft" : "opacity-hidden")}
        style={{ transition: `opacity ${DURATION.transition}ms ease-out` }}
        onClick={onClick}
      />
      <View className={cn("relative", className)}>
        {children}
      </View>
    </View>
  )
}
