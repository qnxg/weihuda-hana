import type { IconProps as LucideIconProps } from "lucide-react-taro"
import type { FC, ReactNode } from "react"
import type { AccentColor } from "@/components/common/icon"
import { Text, View } from "@tarojs/components"
import { ChevronRight } from "lucide-react-taro"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"

/** 强调色对应的图标底色 */
const badges: Record<AccentColor | "primary", string> = {
  primary: "bg-primary",
  sky: "raw:bg-sky-bg",
  cyan: "raw:bg-cyan-bg",
  teal: "raw:bg-teal-bg",
  emerald: "raw:bg-emerald-bg",
  violet: "raw:bg-violet-bg",
  fuchsia: "raw:bg-fuchsia-bg",
  orange: "raw:bg-orange-bg",
  indigo: "raw:bg-indigo-bg",
}

export interface PanelProps {
  /** 图标 */
  icon: FC<LucideIconProps>
  /** 标题 */
  title: string
  /** 强调色 */
  color?: AccentColor | "primary"
  /** 打开完整页面 */
  onOpen?: () => void
  /** 内容 */
  children?: ReactNode
}

/** 校园生活的小卡片, 头部为图标 + 标题 + 打开入口 */
export default function Panel({ icon, title, color = "primary", onOpen, children }: Readonly<PanelProps>): ReactNode {
  return (
    <Card className="flex flex-1 flex-col gap-2 border border-default p-3">
      <View className="flex items-center gap-2">
        <View className={`flex h-3h w-3h items-center justify-center rounded-md ${badges[color]}`}>
          <Icon icon={icon} color={color} className="h-2h w-2h" />
        </View>
        <Text className="flex-1 text-sm text-strong">{title}</Text>
        {onOpen && (
          <View className="flex h-3h w-3h items-center justify-center" onClick={onOpen}>
            <Icon icon={ChevronRight} color="primary" className="h-2h w-2h" />
          </View>
        )}
      </View>
      <View className="flex flex-col gap-1">{children}</View>
    </Card>
  )
}
