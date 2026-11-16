import type { ReactNode } from "react"
import { View } from "@tarojs/components"

interface PageProps {
  children?: ReactNode
}

export default function Page({ children }: Readonly<PageProps>): ReactNode {
  return (
    <View className="relative h-screen w-full flex flex-col overflow-hidden bg-strong">
      <View className="flex-1 flex flex-col overflow-hidden">
        {children}
      </View>
      <View className="absolute inset-0 pointer-events-none" />
      <View className="absolute inset-0 pointer-events-none" />
    </View>
  )
}
