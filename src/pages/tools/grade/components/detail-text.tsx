import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"

/** 详情占位文本 */
export default function DetailText({ text }: Readonly<{ text: string }>): ReactNode {
  return (
    <View className="p-3">
      <Text className="text-sm text-soft">{text}</Text>
    </View>
  )
}
