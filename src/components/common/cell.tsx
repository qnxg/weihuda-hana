import type { ComponentProps, ReactElement, ReactNode } from "react"
import type { IconColor, IconProps } from "@/components/common/icon"
import { Text, View } from "@tarojs/components"
import { ChevronRight } from "lucide-react-taro"
import { cloneElement } from "react"
import Icon from "@/components/common/icon"
import { cn } from "@/utils/cn"

/** 颜色对应的文本样式 */
const tones: Record<IconColor, { title: string, description: string }> = {
  primary: { title: "text-primary", description: "text-primary-soft" },
  error: { title: "text-error", description: "text-error-soft" },
  ink: { title: "text-default", description: "text-soft" },
}

export interface CellProps {
  /** 主标题 */
  title?: ReactNode
  /** 左侧图标 */
  icon?: ReactElement<IconProps>
  /** 颜色, 同时作用于图标与文本 */
  color?: IconColor
  /** 右侧描述 */
  description?: ReactNode
  /** 显示右箭头 */
  link?: boolean
  /** 底部分隔线 */
  border?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 追加样式 */
  className?: string
  /** 点击 */
  onClick?: ComponentProps<typeof View>["onClick"]
  /** 标题行下方的整块内容 */
  children?: ReactNode
}

export default function Cell({
  title,
  icon,
  color = "ink",
  description,
  link = false,
  border = true,
  disabled = false,
  className,
  onClick,
  children,
}: Readonly<CellProps>): ReactNode {
  const iconColor = icon?.props.color ?? color
  const tone = tones[color]

  return (
    <View
      className={cn(
        "flex flex-col gap-1 px-4 py-3",
        border && "border-b border-default",
        disabled && "opacity-soft",
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      <View className="flex items-center gap-2">
        {icon && cloneElement(icon, { color: iconColor })}
        <View className="flex-1">
          {title && <Text className={tone.title}>{title}</Text>}
        </View>
        {description && <Text className={cn("text-xs", tone.description)}>{description}</Text>}
        {link && <Icon icon={ChevronRight} color="ink" className="h-1r w-1r" />}
      </View>
      {children}
    </View>
  )
}
