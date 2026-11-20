import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { X } from "lucide-react-taro"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Overlay from "@/components/modal/overlay"
import { DURATION } from "@/config/duration"
import { useModalPresence } from "@/hooks/modal"
import { cn } from "@/utils/cn"

export interface DialogProps {
  /** 显隐 */
  visible: boolean
  /** 标题 */
  title?: string
  /** 底部 */
  footer?: ReactNode
  /** 可关闭 */
  closeable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 内容 */
  children?: ReactNode
  /** 面板样式 */
  className?: string
}

/** 居中弹窗 */
export default function Dialog({
  visible,
  title,
  footer,
  closeable = true,
  onClose,
  children,
  className,
}: Readonly<DialogProps>): ReactNode {
  useModalPresence(visible, active => (
    <Overlay active={active} position="center" onClick={closeable ? onClose : undefined} className="w-full px-2r">
      <Card
        className={cn("w-full flex flex-col gap-2", className)}
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1)" : "scale(0.9)",
          transition: `opacity ${DURATION.transition}ms ease-out, transform ${DURATION.transition}ms ease-out`,
        }}
      >
        {(title || onClose) && (
          <View className="flex items-center justify-between gap-2">
            <Text className="flex-1 text-strong">{title}</Text>
            {onClose && (
              <View className="-mr-1 p-1" onClick={onClose}>
                <Icon icon={X} className="h-1r w-1r" />
              </View>
            )}
          </View>
        )}
        {children}
        {footer && (
          <View className="flex gap-2">
            {footer}
          </View>
        )}
      </Card>
    </Overlay>
  ))

  return null
}
