import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { GraduationCap } from "lucide-react-taro"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useGrade } from "@/pages/home/hooks/grade"
import { navigateTo } from "@/utils/navigate"

/** 成绩查询 */
export default function Grade(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const { count, loading } = useGrade(semester.data?.current)

  return (
    <Card
      className="flex flex-1 items-center gap-2 border border-default p-3"
      onClick={() => navigateTo(PAGE.debug.index)}
    >
      <View className="flex h-4h w-4h shrink-0 items-center justify-center rounded-lg raw:bg-emerald-bg">
        <Icon icon={GraduationCap} color="emerald" className="h-2h w-2h" />
      </View>
      <View className="flex flex-col gap-1">
        <Text className="text-sm text-strong">成绩查询</Text>
        {loading || semester.isPending || count === undefined
          ? <Skeleton className="h-2 w-6r bg-ink-line" />
          : (
              <Text className="text-xs text-soft">
                {count > 0
                  ? `${count} 门成绩已出炉`
                  : "本学期暂无成绩"}
              </Text>
            )}
      </View>
    </Card>
  )
}
