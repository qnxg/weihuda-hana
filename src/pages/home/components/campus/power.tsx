import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import Panel from "@/pages/home/components/campus/panel"
import Value from "@/pages/home/components/campus/value"
import { useDorm } from "@/pages/home/hooks/campus"
import { navigateTo } from "@/utils/navigate"

/** 宿舍电量 */
export default function Power(): ReactNode {
  const { place, electricity, loading } = useDorm()

  return (
    <Panel
      tint="electricity"
      title="宿舍电量"
      onOpen={() => navigateTo(PAGE.tools.electricity)}
    >
      {loading || electricity === undefined
        ? (
            <>
              <Skeleton className="h-4h w-8r bg-ink-line" />
              <Skeleton className="h-2 w-full bg-ink-line" />
            </>
          )
        : (
            <>
              <Value value={electricity} unit="度" />
              <Text className="truncate text-xs text-soft">{place ?? "暂无宿舍信息"}</Text>
            </>
          )}
    </Panel>
  )
}
