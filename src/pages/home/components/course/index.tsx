import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import Header from "@/pages/home/components/course/header"
import Info from "@/pages/home/components/course/info"
import Row from "@/pages/home/components/course/row"
import { activeOf, statusOf } from "@/pages/home/components/course/text"
import { useDayCourses } from "@/pages/home/hooks/course"
import { addDays, nowOf, weekOf } from "@/utils/date"
import { navigateTo } from "@/utils/navigate"

/** 选中的课程 */
interface Picked {
  /** 是否明日 */
  tomorrow: boolean
  /** 列表下标, -1 为取消选中 */
  index: number
}

/** 列表行骨架 */
function RowSkeleton(): ReactNode {
  return (
    <View className="flex items-center gap-2 px-1h py-1h">
      <Skeleton className="h-3 w-2r bg-ink-line" />
      <Skeleton className="h-3 flex-1 bg-ink-line" />
      <Skeleton className="h-3 w-2r bg-ink-line" />
      <Skeleton className="h-2h w-3r rounded-full bg-ink-line" />
    </View>
  )
}

/** 加载骨架 */
function SkeletonBlock(): ReactNode {
  return (
    <>
      <View className="flex flex-col gap-1 border-b border-default pb-1h">
        <Skeleton className="h-2h w-6r bg-ink-line" />
        <Skeleton className="h-3 w-10r bg-ink-line" />
      </View>
      <View className="flex flex-col gap-1 pt-1">
        <RowSkeleton />
        <RowSkeleton />
      </View>
    </>
  )
}

/** 课表 */
export default function Course(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const [tomorrow, setTomorrow] = useState(false)
  const [picked, setPicked] = useState<Picked | null>(null)

  const now = nowOf()
  const date = addDays(now, tomorrow ? 1 : 0)
  const term = semester.data?.current
  const week = term
    ? weekOf(date, term)
    : null
  const { list, loading } = useDayCourses(term, week, date.getDay())

  const pending = semester.isPending || loading
  const pickedToday = picked?.tomorrow === tomorrow
  const index = pickedToday
    ? picked.index
    : activeOf(list, date, now)
  const active = list[index]
  const finished = list.length > 0 && list.every(item => statusOf(item, date, now) === "ended")

  return (
    <Card className="overflow-hidden border border-default p-0">
      <Header
        tomorrow={tomorrow}
        count={list.length}
        loading={pending}
        onSwitch={() => setTomorrow(value => !value)}
        onOpen={() => navigateTo(PAGE.table)}
      />
      <View className="flex flex-col p-1r">
        {pending
          ? <SkeletonBlock />
          : (
              <>
                {active && <Info course={active} date={date} now={now} />}
                {!active && list.length === 0 && (
                  <View className="flex items-center justify-between gap-2">
                    <Text className="text-sm text-soft">{tomorrow ? "明日无课" : "今日无课"}</Text>
                    <Button
                      variant="ghost"
                      color="primary"
                      className="px-1 py-0 text-xs"
                      onClick={() => setTomorrow(value => !value)}
                    >
                      <Text>{tomorrow ? "查看今日" : "查看明日"}</Text>
                    </Button>
                  </View>
                )}
                {!active && finished && (
                  <View className="flex items-center justify-between gap-2 border-b border-default pb-1h">
                    <Text className="text-sm text-soft">{tomorrow ? "明日课程已结束" : "今日课程已结束"}</Text>
                    <Button
                      variant="ghost"
                      color="primary"
                      className="px-1 py-0 text-xs"
                      onClick={() => setTomorrow(value => !value)}
                    >
                      <Text>{tomorrow ? "查看今日" : "查看明日"}</Text>
                    </Button>
                  </View>
                )}
                {list.length > 0 && (
                  <View className="flex flex-col gap-1 pt-1">
                    {list.map((course, position) => (
                      <Row
                        key={`${course.courseId ?? "custom"}-${course.time}`}
                        course={course}
                        active={position === index}
                        date={date}
                        now={now}
                        onTap={() => setPicked({
                          tomorrow,
                          index: position === index
                            ? -1
                            : position,
                        })}
                      />
                    ))}
                  </View>
                )}
              </>
            )}
      </View>
    </Card>
  )
}
