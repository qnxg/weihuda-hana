import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Fragment } from "react"
import { useModalEntries } from "@/hooks/modal"

/** 模态层 */
export default function ModalLayer(): ReactNode {
  const entries = useModalEntries()

  return (
    <View className="absolute inset-0 pointer-events-none">
      {entries.map(({ id, node }) => <Fragment key={id}>{node}</Fragment>)}
    </View>
  )
}
