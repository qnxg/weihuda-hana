import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"

/** 待办日程视图, 待接入 */
export default function Schedule(): ReactNode {
  return (
    <View className="flex flex-1 items-center justify-center">
      <Text className="text-sm text-soft">待办日程待接入</Text>
    </View>
  )
}
