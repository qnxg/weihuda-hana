import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import SafeArea from "@/components/common/safe-area"
import ModalLayer from "@/components/layout/modal-layer"
import { ModalProvider } from "@/contexts/modal"
import { useTheme } from "@/hooks/theme"

export interface PageProps {
  /** 安全区 */
  safeArea?: boolean
  /** 内容 */
  children?: ReactNode
}

export default function Page({ safeArea = true, children }: Readonly<PageProps>): ReactNode {
  const { className } = useTheme()

  return (
    <ModalProvider>
      <View className={`${className} relative h-screen w-full flex flex-col overflow-hidden bg-default`}>
        <View className="flex-1 flex flex-col overflow-hidden">
          {children}
        </View>
        {safeArea && <SafeArea />}
        <ModalLayer />
        <View className="absolute inset-0 pointer-events-none" />
      </View>
    </ModalProvider>
  )
}
