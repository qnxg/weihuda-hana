import type { IconProps as LucideIconProps } from "lucide-react-taro"
import type { FC, ReactNode } from "react"
import type { Mode, Theme } from "@/types/theme"
import { View } from "@tarojs/components"
import { PALETTE } from "@/config/theme"
import { useTheme } from "@/hooks/theme"

/** 语义色名 */
export type IconColor = keyof typeof PALETTE

export interface IconProps {
  /** 图标组件 */
  icon: FC<LucideIconProps>
  /** 语义色 */
  color?: IconColor
  /** 尺寸与布局 */
  className?: string
}

/** 取语义色在当前主题与模式下的值 */
function colorOf(color: IconColor, theme: Theme, mode: Mode): string {
  switch (color) {
    case "primary":
      return PALETTE.primary[theme][mode]
    case "error":
      return PALETTE.error[mode]
    default:
      return PALETTE.ink[mode]
  }
}

/** 图标 */
export default function Icon({
  icon: LucideIcon,
  color = "ink",
  className = "",
}: Readonly<IconProps>): ReactNode {
  const { theme, mode } = useTheme()

  return (
    <View className={className}>
      <LucideIcon size="100%" color={colorOf(color, theme, mode)} />
    </View>
  )
}
