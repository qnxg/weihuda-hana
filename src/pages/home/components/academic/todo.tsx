import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { ChevronRight } from "lucide-react-taro"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Icon from "@/components/common/icon"
import Skeleton from "@/components/common/skeleton"
import { ENTRY_TINT } from "@/config/entry"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { BADGE_BG } from "@/config/theme"
import { useQuery } from "@/hooks/query"
import EntryRow from "@/pages/home/components/academic/entry"
import { entriesOf, recentOf } from "@/pages/home/components/academic/text"
import { useExam } from "@/pages/home/hooks/exam"
import { useTodo } from "@/pages/home/hooks/todo"
import { nowOf } from "@/utils/date"
import { navigateTo } from "@/utils/navigate"

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

/** 待办, 近期考试与自定义待办 */
export default function Todo(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const term = semester.data?.current
  const { list: exams, loading: examLoading } = useExam(term)
  const { list: todos, loading: todoLoading } = useTodo(term)
  const loading = examLoading || todoLoading
  const now = nowOf()
  const entries = recentOf(entriesOf(exams, todos), now)
  const { icon, color } = ENTRY_TINT.todo

  return (
    <Card className="flex flex-col gap-2 border border-default p-3">
      <View className="flex items-center gap-2">
        <View className={`flex h-3h w-3h items-center justify-center rounded-md ${BADGE_BG[color]}`}>
          <Icon icon={icon} color={color} className="h-2h w-2h" />
        </View>
        <Text className="flex-1 text-sm text-strong">待办</Text>
        <View className="flex h-3h w-3h items-center justify-center" onClick={() => navigateTo(PAGE.table)}>
          <Icon icon={ChevronRight} color="primary" className="h-2h w-2h" />
        </View>
      </View>
      <View className="flex flex-col gap-2">
        {loading || semester.isPending
          ? (
              <>
                <RowSkeleton />
                <RowSkeleton />
              </>
            )
          : entries.length === 0
            ? <Text className="text-xs text-soft">近期无待办</Text>
            : entries.map(item => (
                <EntryRow
                  key={item.key}
                  item={item}
                  now={now}
                />
              ))}
      </View>
    </Card>
  )
}
