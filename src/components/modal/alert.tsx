import type { ReactElement, ReactNode } from "react"
import type { ButtonColor } from "@/components/common/button"
import type { IconProps } from "@/components/common/icon"
import { Text, View } from "@tarojs/components"
import { cloneElement } from "react"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Overlay from "@/components/modal/overlay"
import { DURATION } from "@/config/duration"
import { useModalPresence } from "@/hooks/modal"
import { cn } from "@/utils/cn"

/** 图标底色 */
const badge: Record<ButtonColor, string> = {
  primary: "bg-primary",
  error: "bg-error",
  ink: "bg-default",
}

export interface AlertProps {
  /** 显隐 */
  visible: boolean
  /** 图标 */
  icon?: ReactElement<IconProps>
  /** 颜色 */
  color?: ButtonColor
  /** 标题 */
  title?: string
  /** 可关闭 */
  closeable?: boolean
  /** 内容 */
  children?: ReactNode
  /** 确认文案 */
  confirmText?: string
  /** 取消文案 */
  cancelText?: string
  /** 确认回调 */
  onConfirm?: () => void
  /** 取消回调 */
  onCancel?: () => void
  /** 面板样式 */
  className?: string
}

/** 确认框 */
export default function Alert({
  visible,
  icon,
  color = "primary",
  title,
  closeable = true,
  children,
  confirmText = "确定",
  cancelText = "取消",
  onConfirm,
  onCancel,
  className,
}: Readonly<AlertProps>): ReactNode {
  useModalPresence(visible, active => (
    <Overlay position="center" onClick={closeable ? onCancel : undefined} className="w-full px-2r">
      <Card
        className={cn("w-full flex flex-col gap-2", className)}
        style={{
          opacity: active ? 1 : 0,
          transform: active ? "scale(1)" : "scale(0.9)",
          transition: `opacity ${DURATION.animation}ms ease-out, transform ${DURATION.animation}ms ease-out`,
        }}
      >
        {(icon || title) && (
          <View className="flex items-center gap-2">
            {icon && (
              <View className={cn("h-2r w-2r flex items-center justify-center rounded-full", badge[color])}>
                {/* eslint-disable-next-line react/no-clone-element -- 图标颜色随类型色走 */}
                {cloneElement(icon, {
                  className: icon.props.className ?? "h-1r w-1r",
                  color: icon.props.color ?? color,
                })}
              </View>
            )}
            {title && <Text className="flex-1 text-strong">{title}</Text>}
          </View>
        )}
        {children}
        <View className="flex gap-2">
          <Button variant="outline" color="ink" className="flex-1 py-1" onClick={onCancel}>
            <Text>{cancelText}</Text>
          </Button>
          <Button color={color} className="flex-1 py-1" onClick={onConfirm}>
            <Text>{confirmText}</Text>
          </Button>
        </View>
      </Card>
    </Overlay>
  ))

  return null
}
