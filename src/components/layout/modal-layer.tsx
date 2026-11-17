import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Fragment } from "react"
import { useModal } from "@/hooks/modal"

/** 模态层 */
export default function ModalLayer(): ReactNode {
  const { entries } = useModal()

  return (
    <View className="absolute inset-0 pointer-events-none">
      {entries.map(({ id, node }) => <Fragment key={id}>{node}</Fragment>)}
    </View>
  )
}
