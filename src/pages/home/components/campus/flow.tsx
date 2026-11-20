import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { Wifi } from "lucide-react-taro"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import Panel from "@/pages/home/components/campus/panel"
import { useNetflow } from "@/pages/home/hooks/campus"
import { cn } from "@/utils/cn"
import { navigateTo } from "@/utils/navigate"

/** 进度条达到该百分比后切换为错误色 */
const WARN = 80

/** 校园网流量 */
export default function Flow(): ReactNode {
  const { data, loading } = useNetflow()

  return (
    <Panel icon={Wifi} title="校园网流量" color="indigo" onOpen={() => navigateTo(PAGE.debug.index)}>
      {loading || !data
        ? (
            <>
              <Skeleton className="h-4h w-full bg-ink-line" />
              <Skeleton className="h-2 w-full bg-ink-line" />
            </>
          )
        : (
            <>
              <View className="flex items-center justify-between gap-2">
                <Text className="text-sm text-strong">{`${data.total} / ${data.baseAmount}`}</Text>
                <Text className="text-sm text-primary">{`${data.basePercentage}%`}</Text>
              </View>
              <View className="h-1 w-full overflow-hidden rounded-full bg-default">
                <View
                  className={cn(
                    "h-full rounded-full",
                    data.basePercentage >= WARN
                      ? "bg-error-invert"
                      : "bg-primary-invert",
                  )}
                  style={{ width: `${Math.min(100, Math.max(0, data.basePercentage))}%` }}
                />
              </View>
              <View className="flex items-center justify-between gap-2">
                <Text className="text-xs text-soft">{`上传 ${data.upload} | 下载 ${data.download}`}</Text>
                <Text className={cn("text-xs", data.locked ? "text-error" : "text-primary")}>
                  {data.locked ? "账户已锁定" : "账户正常"}
                </Text>
              </View>
            </>
          )}
    </Panel>
  )
}
