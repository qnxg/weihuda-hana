import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { Fragment } from "react"
import AuthModal from "@/components/layout/auth-modal"
import { useModalEntries } from "@/hooks/modal"

/**
 * 模态节点
 * 单独拆出来订阅条目: 与 AuthModal 平级, 避免条目变动把 AuthModal 一起重渲染,
 * 否则 Dialog 每次渲染都会更新条目, 互相触发形成循环
 */
function Entries(): ReactNode {
  const entries = useModalEntries()

  return <>{entries.map(({ id, node }) => <Fragment key={id}>{node}</Fragment>)}</>
}

/** 模态层 */
export default function ModalLayer(): ReactNode {
  return (
    <View className="absolute inset-0 pointer-events-none">
      <Entries />
      <AuthModal />
    </View>
  )
}
