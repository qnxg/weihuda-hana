import type { ReactNode } from "react"
import type { ToolItem } from "@/pages/kit/config/tool"
import { Text, View } from "@tarojs/components"
import Icon from "@/components/common/icon"
import { ENTRY_TINT } from "@/config/entry"
import { BADGE_BG } from "@/config/theme"
import { cn } from "@/utils/cn"

export interface ToolProps {
  /** 工具项 */
  item: ToolItem
  /** 点击 */
  onClick: () => void
}

/** 工具卡片 */
export default function Tool({ item, onClick }: Readonly<ToolProps>): ReactNode {
  const { icon, color } = ENTRY_TINT[item.tint]

  return (
    <View
      className="flex flex-1 items-center gap-2 rounded-lg border border-default bg-strong p-3"
      onClick={onClick}
    >
      <View className={cn("flex h-5h w-5h shrink-0 items-center justify-center rounded-lg", BADGE_BG[color])}>
        <Icon icon={icon} color={color} className="h-3h w-3h" />
      </View>
      <View className="flex flex-1 flex-col overflow-hidden">
        <Text className="text-sm text-strong">{item.title}</Text>
        <Text className="text-xs text-soft">{item.description}</Text>
      </View>
    </View>
  )
}
