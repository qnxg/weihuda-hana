import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { CalendarDays } from "lucide-react-taro"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"

export interface HeaderProps {
  /** 是否明日课表 */
  tomorrow: boolean
  /** 当天课程数 */
  count: number
  /** 是否加载中 */
  loading: boolean
  /** 切换日期 */
  onSwitch: () => void
  /** 打开完整课表 */
  onOpen: () => void
}

/** 课表头部 */
export default function Header({ tomorrow, count, loading, onSwitch, onOpen }: Readonly<HeaderProps>): ReactNode {
  return (
    <View className="flex items-center justify-between gap-2 bg-primary-invert p-1h text-invert opacity-weak">
      <View className="flex items-center gap-1">
        <Icon icon={CalendarDays} color="invert" className="h-2h w-2h" />
        <Text className="text-sm">{tomorrow ? "明日课程" : "今日课程"}</Text>
        {!loading && count > 0 && <Text className="text-xs">{`共 ${count} 节`}</Text>}
      </View>
      {!loading && (
        <View className="flex items-center gap-1">
          <Button
            variant="ghost"
            color="ink"
            className="px-1 py-0 text-xs text-invert"
            onClick={onSwitch}
          >
            <Text>{tomorrow ? "查看今日" : "查看明日"}</Text>
          </Button>
          <Button
            variant="ghost"
            color="ink"
            className="px-1 py-0 text-xs text-invert"
            onClick={onOpen}
          >
            <Text>完整课表</Text>
          </Button>
        </View>
      )}
    </View>
  )
}
