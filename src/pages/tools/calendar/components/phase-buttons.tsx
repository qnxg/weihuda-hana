import type { ReactNode } from "react"
import type { Phase } from "@/pages/tools/calendar/model/calendar"
import { Text, View } from "@tarojs/components"
import { PHASE_SHORT, PHASES } from "@/pages/tools/calendar/model/calendar"
import { cn } from "@/utils/cn"

export interface PhaseButtonsProps {
  /** 当前阶段 */
  phase: Phase
  /** 变更 */
  onChange: (phase: Phase) => void
}

/** 秋 冬 春 夏 单字切换 */
export default function PhaseButtons({ phase, onChange }: Readonly<PhaseButtonsProps>): ReactNode {
  return (
    <View className="flex shrink-0 rounded-full bg-strong p-1">
      {PHASES.map(item => (
        <View
          key={item}
          className={cn("rounded-full px-3 py-2x", item === phase && "bg-primary-invert")}
          onClick={() => onChange(item)}
        >
          <Text className={cn("text-xs", item === phase
            ? "text-invert"
            : "text-soft")}
          >
            {PHASE_SHORT[item]}
          </Text>
        </View>
      ))}
    </View>
  )
}
