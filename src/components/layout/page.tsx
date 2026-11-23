import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import SafeArea from "@/components/common/safe-area"
import ModalLayer from "@/components/layout/modal-layer"
import Navbar from "@/components/layout/navbar"
import NoticeLayer from "@/components/layout/notice-layer"
import Tabbar from "@/components/layout/tabbar"
import { ModalProvider } from "@/contexts/modal"
import { useTheme } from "@/hooks/theme"

export interface PageProps {
  /** 安全区, false 全关, true 全开, "top" / "bottom" 单独开 */
  safeArea?: boolean | "top" | "bottom"
  /** 底栏 */
  tabbar?: boolean
  /** 顶栏, 默认 true */
  navbar?: boolean
  /** 标题, 同时作为底栏当前标签 */
  title?: string
  /** 返回按钮 */
  back?: boolean
  /** 内容 */
  children?: ReactNode
}

export default function Page({
  safeArea = true,
  tabbar = false,
  navbar = true,
  title,
  back = true,
  children,
}: Readonly<PageProps>): ReactNode {
  const { className } = useTheme()
  const top = safeArea === true || safeArea === "top"
  const bottom = safeArea === true || safeArea === "bottom"

  return (
    <ModalProvider>
      <View className={`${className} relative h-screen w-full flex flex-col overflow-hidden bg-default`}>
        {top && <SafeArea edge="top" />}
        {navbar && <Navbar title={title} back={back} safeArea={false} />}
        <View className="flex-1 relative flex flex-col overflow-hidden">
          {children}
          <NoticeLayer />
        </View>
        {tabbar && <Tabbar title={title ?? ""} />}
        {bottom && <SafeArea edge="bottom" />}
        <ModalLayer />
      </View>
    </ModalProvider>
  )
}
