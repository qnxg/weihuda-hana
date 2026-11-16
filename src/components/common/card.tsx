import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

/** 卡片, 增强背景加圆角 */
export default function Card({
  className,
  children,
  ...rest
}: Readonly<ComponentProps<typeof View>>): ReactNode {
  return (
    <View {...rest} className={cn("rounded-lg bg-strong", className)}>
      {children}
    </View>
  )
}
