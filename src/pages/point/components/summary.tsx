import type { PointGetData } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import Card from "@/components/common/card"

export interface SummaryProps {
  /** 积分与签到状态 */
  info: PointGetData | null
  /** 是否签到中 */
  checking: boolean
  /** 签到 */
  onCheck: () => void
}

/** 积分概览与签到 */
export default function Summary({ info, checking, onCheck }: Readonly<SummaryProps>): ReactNode {
  const checked = info?.checked ?? false

  return (
    <Card className="flex items-center gap-3 border border-default p-3">
      <View className="flex flex-1 flex-col gap-1">
        <Text className="text-xs text-soft">当前积分</Text>
        <View className="flex items-baseline gap-1">
          <Text className="text-xl text-strong">
            {info
              ? String(info.value)
              : "--"}
          </Text>
          <Text className="text-xs text-soft">积分</Text>
        </View>
        <Text className="text-xs text-soft">{`已连续签到 ${info?.combo ?? 0} 天`}</Text>
      </View>

      <Button
        className="shrink-0 rounded-full px-3 py-1 text-sm"
        disabled={!info || checked}
        loading={checking}
        onClick={onCheck}
      >
        <Text>{checked ? "今日已签到" : "签到"}</Text>
      </Button>
    </Card>
  )
}
