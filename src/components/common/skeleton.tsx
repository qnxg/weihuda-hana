import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

export interface SkeletonProps extends ComponentProps<typeof View> {
  /** 闪烁动画 */
  animated?: boolean
}

/** 骨架屏占位块 */
export default function Skeleton({
  animated = true,
  className,
  ...rest
}: Readonly<SkeletonProps>): ReactNode {
  return (
    <View
      {...rest}
      className={cn("rounded bg-default", animated && "skeleton-pulse", className)}
    />
  )
}
