import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { X } from "lucide-react-taro"
import { useEffect, useId, useState } from "react"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import SafeArea from "@/components/common/safe-area"
import Overlay from "@/components/modal/overlay"
import { useModal } from "@/hooks/modal"
import { cn } from "@/utils/cn"

/** 进出场时长, 与退场卸载的延迟一致 */
const duration = 200

export interface PopupProps {
  /** 显隐 */
  visible: boolean
  /** 标题 */
  title?: string
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
  onClose,
  className,
  children,
}: Readonly<PopupProps>): ReactNode {
  const { update, unmount } = useModal()
  const id = useId()
  const [present, setPresent] = useState(visible)
  const [active, setActive] = useState(visible)

  const style = {
    transform: active ? "translateY(0)" : "translateY(100%)",
    transition: `transform ${duration}ms ease-out`,
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
        <Overlay position="bottom" onClick={onClose} className="w-full">
          <Card
            className={cn("w-full flex flex-col overflow-hidden", className)}
            style={style}
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
