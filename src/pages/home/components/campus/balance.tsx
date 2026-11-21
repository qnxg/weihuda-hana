import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import Panel from "@/pages/home/components/campus/panel"
import Value from "@/pages/home/components/campus/value"
import { useCard } from "@/pages/home/hooks/campus"
import { navigateTo } from "@/utils/navigate"

/** 校园卡 */
export default function Balance(): ReactNode {
  const { card, spent, loading } = useCard()

  return (
    <Panel
      tint="card"
      title="校园卡"
      onOpen={() => navigateTo(PAGE.debug.index)}
    >
      {loading || !card || spent === undefined
        ? (
            <>
              <Skeleton className="h-4h w-8r bg-ink-line" />
              <Skeleton className="h-2 w-full bg-ink-line" />
            </>
          )
        : (
            <>
              <Value symbol="¥" value={card.balance} unit="元" />
              <Text className="text-xs text-soft">{`本月支出 ${spent.toFixed(2)} 元`}</Text>
            </>
          )}
    </Panel>
  )
}
