import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { X } from "lucide-react-taro"
import { useEffect, useId, useState } from "react"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Overlay from "@/components/modal/overlay"
import { useModal } from "@/hooks/modal"
import { cn } from "@/utils/cn"

/** 进出场时长, 与退场卸载的延迟一致 */
const duration = 200

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
  const { update, unmount } = useModal()
  const id = useId()
  const [present, setPresent] = useState(visible)
  const [active, setActive] = useState(visible)

  const style = {
    opacity: active ? 1 : 0,
    transform: active ? "scale(1)" : "scale(0.9)",
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
  }

  useEffect(() => {
    if (visible) {
      setPresent(true)
      const timer = setTimeout(setActive, 0, true)
      return () => clearTimeout(timer)
    }

    setActive(false)
    const timer = setTimeout(setPresent, duration, false)
    return () => clearTimeout(timer)
  }, [visible])

  const node = present
    ? (
        <Overlay position="center" onClick={closeable ? onClose : undefined} className="w-full px-2r">
          <Card className={cn("w-full flex flex-col gap-2", className)} style={style}>
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
      )
    : null

  useEffect(() => {
    if (present)
      update(id, node)
    else
      unmount(id)
  }, [id, node, present, unmount, update])

  useEffect(() => () => unmount(id), [id, unmount])

  return null
}
