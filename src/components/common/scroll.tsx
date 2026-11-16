import type { ReactNode } from "react"
import { ScrollView, Slot, View } from "@tarojs/components"
import { cn } from "@/utils/cn"

/** 下拉刷新的触发距离, 与三个点所在区域的高度一致 */
const threshold = 50

export interface ScrollProps {
  /** 滚动方向 */
  axis?: "y" | "x"
  /** 开启下拉刷新, 仅纵向有效 */
  refresh?: boolean
  /** 受控的刷新中状态 */
  refreshing?: boolean
  /** 触发刷新 */
  onRefresh?: () => void
  /** 下拉区的样式, 覆盖背景 */
  refresherClassName?: string
  /** 三个点的样式, 覆盖颜色 */
  dotClassName?: string
  /** 追加样式 */
  className?: string
  /** 内容 */
  children?: ReactNode
}

export default function Scroll({
  axis = "y",
  refresh = false,
  refreshing = false,
  onRefresh,
  refresherClassName,
  dotClassName,
  className,
  children,
}: Readonly<ScrollProps>): ReactNode {
  const vertical = axis === "y"

  return (
    <ScrollView
      scrollY={vertical}
      scrollX={!vertical}
      enhanced
      enableFlex
      showScrollbar={false}
      refresherEnabled={refresh && vertical}
      refresherTriggered={refreshing}
      refresherThreshold={threshold}
      refresherDefaultStyle="none"
      refresherBackground="transparent"
      onRefresherRefresh={onRefresh}
      className={cn("flex-1 overflow-hidden", className)}
    >
      {refresh && vertical && (
        <Slot name="refresher" className="w-full">
          <View
            className={cn(
              "h-3r flex items-center justify-center gap-1 bg-default",
              refresherClassName,
            )}
          >
            {[0, 1, 2].map(index => (
              <View
                key={index}
                className={cn("h-1h w-1h rounded-full dot-loading bg-primary", dotClassName)}
                style={{ animationDelay: `${index * 0.15}s` }}
              />
            ))}
          </View>
        </Slot>
      )}
      {children}
    </ScrollView>
  )
}
