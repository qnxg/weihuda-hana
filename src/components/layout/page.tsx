import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import ModalLayer from "@/components/layout/modal-layer"
import { ModalProvider } from "@/contexts/modal"
import { useTheme } from "@/hooks/theme"

export default function Page({ children }: Readonly<{ children?: ReactNode }>): ReactNode {
  const { className } = useTheme()

  return (
    <ModalProvider>
      <View className={`${className} relative h-screen w-full flex flex-col overflow-hidden bg-default`}>
        <View className="flex-1 flex flex-col overflow-hidden">
          {children}
        </View>
        <ModalLayer />
        <View className="absolute inset-0 pointer-events-none" />
      </View>
    </ModalProvider>
  )
}
