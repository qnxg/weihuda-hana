import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"

/** 无课表课程视图, 待接入 */
export default function Extra(): ReactNode {
  return (
    <View className="flex flex-1 items-center justify-center">
      <Text className="text-sm text-soft">无课表课程待接入</Text>
    </View>
  )
}
