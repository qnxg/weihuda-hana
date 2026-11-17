import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { X } from "lucide-react-taro"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import SafeArea from "@/components/common/safe-area"
import Overlay from "@/components/modal/overlay"
import { duration } from "@/config/animation"
import { useModalPresence } from "@/hooks/modal"
import { cn } from "@/utils/cn"

export interface PopupProps {
  /** 显隐 */
  visible: boolean
  /** 标题 */
  title?: string
  /** 可关闭 */
  closeable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 面板样式 */
  className?: string
  /** 内容 */
  children?: ReactNode
}

/** 底部弹出 */
export default function Popup({
  visible,
  title,
  closeable = true,
  onClose,
  className,
  children,
}: Readonly<PopupProps>): ReactNode {
  useModalPresence(visible, active => (
    <Overlay position="bottom" onClick={closeable ? onClose : undefined} className="w-full">
      <Card
        className={cn("w-full flex flex-col overflow-hidden", className)}
        style={{
          transform: active ? "translateY(0)" : "translateY(100%)",
          transition: `transform ${duration}ms ease-out`,
        }}
      >
        <View className="flex items-center justify-between gap-2">
          <Text className="flex-1 text-strong">{title}</Text>
          {onClose && (
            <View className="-mr-1 p-1" onClick={onClose}>
              <Icon icon={X} className="h-1r w-1r" />
            </View>
          )}
        </View>
        {children}
        <SafeArea />
      </Card>
    </Overlay>
  ))

  return null
}
