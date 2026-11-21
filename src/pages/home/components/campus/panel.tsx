import type { ReactNode } from "react"
import type { EntryTintKey } from "@/config/entry"
import { Text, View } from "@tarojs/components"
import { ChevronRight } from "lucide-react-taro"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import { ENTRY_TINT } from "@/config/entry"
import { BADGE_BG } from "@/config/theme"

export interface PanelProps {
  /** 图标与颜色语义键 */
  tint: EntryTintKey
  /** 标题 */
  title: string
  /** 打开完整页面 */
  onOpen?: () => void
  /** 内容 */
  children?: ReactNode
}

/** 校园生活的小卡片, 头部为图标 + 标题 + 打开入口 */
export default function Panel({ tint, title, onOpen, children }: Readonly<PanelProps>): ReactNode {
  const { icon, color } = ENTRY_TINT[tint]

  return (
    <Card className="flex flex-1 flex-col gap-2 border border-default p-3">
      <View className="flex items-center gap-2">
        <View className={`flex h-3h w-3h items-center justify-center rounded-md ${BADGE_BG[color]}`}>
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
