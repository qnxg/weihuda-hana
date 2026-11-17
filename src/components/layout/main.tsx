import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"
import { cn } from "@/utils/cn"

export default function Main({
  className,
  children,
}: Readonly<ComponentProps<typeof View>>): ReactNode {
  return (
    <View className={cn("flex-1 flex flex-col overflow-hidden px-1r", className)}>
      {children}
    </View>
  )
}
