import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { SearchX } from "lucide-react-taro"
import Icon from "@/components/common/icon"

/** 搜索空状态 */
export default function Empty(): ReactNode {
  return (
    <View className="flex flex-col items-center gap-2 py-6r">
      <Icon icon={SearchX} color="ink" className="h-4r w-4r" />
      <Text className="text-sm text-soft">没有找到相关工具</Text>
      <Text className="text-xs text-soft">换个关键词试试</Text>
    </View>
  )
}
