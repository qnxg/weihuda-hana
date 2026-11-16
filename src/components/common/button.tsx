import type { ComponentProps, ReactElement, ReactNode } from "react"
import type { IconProps } from "@/components/common/icon"
import { View } from "@tarojs/components"
import { LoaderCircle } from "lucide-react-taro"
import { cloneElement } from "react"
import Icon from "@/components/common/icon"
import { cn } from "@/utils/cn"

/** 按钮变体 */
export type ButtonVariant = "solid" | "outline" | "ghost"

/** 按钮颜色 */
export type ButtonColor = "primary" | "error" | "ink"

/** 变体与颜色的组合样式 */
const variants: Record<ButtonVariant, Record<ButtonColor, string>> = {
  solid: {
    primary: "bg-primary text-primary-strong",
    error: "bg-error text-error-strong",
    ink: "bg-default text-strong",
  },
  outline: {
    primary: "border border-primary text-primary",
    error: "border border-error text-error",
    ink: "border border-default text-default",
  },
  ghost: {
    primary: "text-primary",
    error: "text-error",
    ink: "text-soft",
  },
}

export interface ButtonProps {
  /** 变体 */
  variant?: ButtonVariant
  /** 颜色 */
  color?: ButtonColor
  /** 前置图标, 加载时替换为加载图标 */
  icon?: ReactElement<IconProps>
  /** 禁用 */
  disabled?: boolean
  /** 加载中 */
  loading?: boolean
  /** 尺寸与布局 */
  className?: string
  /** 内容 */
  children?: ReactNode
  /** 点击 */
  onClick?: ComponentProps<typeof View>["onClick"]
}

export default function Button({
  variant = "solid",
  color = "primary",
  icon,
  disabled = false,
  loading = false,
  className,
  children,
  onClick,
}: Readonly<ButtonProps>): ReactNode {
  const inert = disabled || loading
  const iconClassName = icon?.props.className ?? "h-1r w-1r"
  const iconColor = icon?.props.color ?? color

  return (
    <View
      className={cn(
        "flex items-center justify-center gap-1",
        variants[variant][color],
        inert && "opacity-soft",
        className,
      )}
      onClick={inert ? undefined : onClick}
    >
      {loading && icon
        ? <Icon icon={LoaderCircle} color={iconColor} className={cn(iconClassName, "animate-spin")} />
        : icon && cloneElement(icon, { color: iconColor })}
      {children}
    </View>
  )
}
