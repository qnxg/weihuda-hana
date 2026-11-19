import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Card from "@/components/common/card"
import Skeleton from "@/components/common/skeleton"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"
import { sleep } from "@/utils/sleep"

/** 演示区块, 替换为正式区块 */
export default function Demo(): ReactNode {
  const { data, isPending } = useQuery({
    queryKey: QUERY_KEY.demo,
    queryFn: async () => {
      await sleep(800)
      return `已刷新 ${new Date().toLocaleTimeString()}`
    },
  })

  useRefreshable(QUERY_KEY.demo)

  return (
    <Card className="flex flex-col gap-1">
      <Text className="text-strong">演示</Text>
      {isPending
        ? <Skeleton className="h-2h w-full" />
        : <Text className="text-soft">{data}</Text>}
    </Card>
  )
}
