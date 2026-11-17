import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import SafeArea from "@/components/common/safe-area"
import ModalLayer from "@/components/layout/modal-layer"
import NoticeLayer from "@/components/layout/notice-layer"
import Tabbar from "@/components/layout/tabbar"
import { ModalProvider } from "@/contexts/modal"
import { useTheme } from "@/hooks/theme"

export interface PageProps {
  /** 安全区 */
  safeArea?: boolean
  /** 底栏 */
  tabbar?: boolean
  /** 内容 */
  children?: ReactNode
}

export default function Page({ safeArea = true, tabbar = false, children }: Readonly<PageProps>): ReactNode {
  const { className } = useTheme()

  return (
    <ModalProvider>
      <View className={`${className} relative h-screen w-full flex flex-col overflow-hidden bg-default`}>
        <View className="flex-1 relative flex flex-col overflow-hidden">
          {children}
          <NoticeLayer />
        </View>
        {tabbar && <Tabbar />}
        {safeArea && <SafeArea />}
        <ModalLayer />
      </View>
    </ModalProvider>
  )
}
