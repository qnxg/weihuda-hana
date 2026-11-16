import type { ComponentProps, ReactNode } from "react"
import { View } from "@tarojs/components"

export default function Main({ children }: Readonly<ComponentProps<typeof View>>): ReactNode {
  return (
    <View className="flex-1 flex flex-col overflow-hidden">
      {children}
    </View>
  )
}
