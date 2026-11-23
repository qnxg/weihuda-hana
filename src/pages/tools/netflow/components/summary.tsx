import type { NetflowGetData } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { percentOf } from "@/pages/tools/netflow/model/netflow"
import { cn } from "@/utils/cn"

/** 进度条达到该百分比后切换为错误色 */
const WARN = 80

export interface SummaryProps {
  /** 本月流量 */
  data: NetflowGetData | null
}

/** 本月流量概览 */
export default function Summary({ data }: Readonly<SummaryProps>): ReactNode {
  const percentage = percentOf(data?.basePercentage ?? 0)
  const warn = percentage >= WARN
  const upload = data?.upload ?? "--"
  const download = data?.download ?? "--"
  const base = data?.baseAmount ?? "--"
  const extend = data
    ? `${data.extendUsage} GB`
    : "--"
  const metrics = [
    { key: "upload", label: "上传", value: upload },
    { key: "download", label: "下载", value: download },
    { key: "base", label: "免费额度", value: base },
    { key: "extend", label: "超出", value: extend },
  ]

  return (
    <Card className="flex flex-col gap-2 border border-default p-3">
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-xs text-soft">本月已用</Text>
        <Text className="text-xs text-soft">{`${percentage}%`}</Text>
      </View>

      <View className="flex items-baseline gap-1">
        <Text className="text-xl text-strong">{data?.total ?? "--"}</Text>
        <Text className="text-xs text-soft">
          {data
            ? `/ ${data.baseAmount}`
            : ""}
        </Text>
      </View>

      <View className="h-1 w-full overflow-hidden rounded-full bg-default">
        <View
          className={cn("h-full rounded-full", warn
            ? "bg-error-invert"
            : "bg-primary-invert")}
          style={{ width: `${percentage}%` }}
        />
      </View>

      <View className="flex items-center">
        {metrics.map((item, index) => (
          <View
            key={item.key}
            className={cn(
              "flex flex-1 flex-col items-center gap-1",
              index > 0 && "border-l border-default",
            )}
          >
            <Text className="text-xs text-soft">{item.label}</Text>
            <Text className="text-xs text-strong">{item.value}</Text>
          </View>
        ))}
      </View>

      <View className="flex items-center justify-between gap-2">
        <Text className={cn("text-xs", (data?.overduePayment ?? 0) > 0
          ? "text-error"
          : "text-soft")}
        >
          {data && data.overduePayment > 0
            ? `欠费 ${data.overduePayment} 元`
            : "无欠费"}
        </Text>
        <Text className={cn("text-xs", data?.locked
          ? "text-error"
          : "text-primary")}
        >
          {data
            ? (data.locked ? "账号已锁定" : "账号正常")
            : "--"}
        </Text>
      </View>
    </Card>
  )
}
