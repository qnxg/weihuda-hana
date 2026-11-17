import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Fragment } from "react"
import Debug from "@/components/notice/debug"
import { useNotice } from "@/hooks/notice"

/** 提示层 */
export default function NoticeLayer(): ReactNode {
  const { entries } = useNotice()

  return (
    <View className="absolute inset-0 pointer-events-none">
      {entries.map(({ id, node }) => <Fragment key={id}>{node}</Fragment>)}
      <Debug />
    </View>
  )
}
