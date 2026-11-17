import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Debug from "@/components/notice/debug"

/** 提示层 */
export default function NoticeLayer(): ReactNode {
  return (
    <View className="absolute inset-0 pointer-events-none">
      <Debug />
    </View>
  )
}
