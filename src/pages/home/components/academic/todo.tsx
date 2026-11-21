import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Skeleton from "@/components/common/skeleton"
import { ENTRY_TINT } from "@/config/entry"
import { QUERY_KEY } from "@/config/query"
import { BADGE_BG } from "@/config/theme"
import { useQuery } from "@/hooks/query"
import ExamRow from "@/pages/home/components/academic/exam"
import { recentOf } from "@/pages/home/components/academic/text"
import { useExam } from "@/pages/home/hooks/exam"
import { nowOf } from "@/utils/date"

/** 列表行骨架 */
function RowSkeleton(): ReactNode {
  return (
    <View className="flex items-center gap-2">
      <View className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-3 w-6r bg-ink-line" />
        <Skeleton className="h-2 w-full bg-ink-line" />
      </View>
      <Skeleton className="h-2h w-3r rounded-full bg-ink-line" />
    </View>
  )
}

/** 待办, 近期考试 */
export default function Todo(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const term = semester.data?.current
  const { list, loading } = useExam(term)
  const now = nowOf()
  const exams = recentOf(list, now)
  const { icon, color } = ENTRY_TINT.todo

  return (
    <Card className="flex flex-col gap-2 border border-default p-3">
      <View className="flex items-center gap-2">
        <View className={`flex h-3h w-3h items-center justify-center rounded-md ${BADGE_BG[color]}`}>
          <Icon icon={icon} color={color} className="h-2h w-2h" />
        </View>
        <Text className="flex-1 text-sm text-strong">待办</Text>
      </View>
      <View className="flex flex-col gap-2">
        {loading || semester.isPending
          ? (
              <>
                <RowSkeleton />
                <RowSkeleton />
              </>
            )
          : exams.length === 0
            ? <Text className="text-xs text-soft">近期无考试</Text>
            : exams.map(item => (
                <ExamRow
                  key={`${item.courseId ?? "custom"}-${item.customizeId ?? item.date}-${item.startTime}`}
                  item={item}
                  now={now}
                />
              ))}
      </View>
    </Card>
  )
}
