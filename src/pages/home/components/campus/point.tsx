import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import { Trophy } from "lucide-react-taro"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import Panel from "@/pages/home/components/campus/panel"
import Value from "@/pages/home/components/campus/value"
import { usePoint } from "@/pages/home/hooks/campus"
import { navigateTo } from "@/utils/navigate"

/** 积分 */
export default function Point(): ReactNode {
  const { value, combo, loading } = usePoint()

  return (
    <Panel
      icon={Trophy}
      title="积分"
      onOpen={() => navigateTo(PAGE.debug.index)}
    >
      {loading || value === undefined || combo === undefined
        ? (
            <>
              <Skeleton className="h-4h w-8r bg-ink-line" />
              <Skeleton className="h-2 w-full bg-ink-line" />
            </>
          )
        : (
            <>
              <Value value={value} unit="积分" digits={0} />
              <Text className="text-xs text-soft">{`已连续签到 ${combo} 天`}</Text>
            </>
          )}
    </Panel>
  )
}
