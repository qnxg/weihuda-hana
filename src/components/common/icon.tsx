import type { IconProps as LucideIconProps } from "lucide-react-taro"
import type { FC, ReactNode } from "react"
import type { AccentColor } from "@/config/theme"
import type { Mode, Theme } from "@/types/theme"
import { View } from "@tarojs/components"
import { ACCENT, PALETTE } from "@/config/theme"
import { useTheme } from "@/hooks/theme"

/** 语义色名 */
export type IconColor = keyof typeof PALETTE

/** 图标可选的颜色 */
export type IconTint = IconColor | AccentColor

export interface IconProps {
  /** 图标组件 */
  icon: FC<LucideIconProps>
  /** 颜色 */
  color?: IconTint
  /** 尺寸与布局 */
  className?: string
}

/** 取颜色在当前主题与模式下的值 */
function colorOf(color: IconTint, theme: Theme, mode: Mode): string {
  if (color === "primary")
    return PALETTE.primary[theme][mode]

  if (color in ACCENT)
    return ACCENT[color as AccentColor][mode]

  return PALETTE[color as IconColor][mode]
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
