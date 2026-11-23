import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import Header from "@/pages/home/components/course/header"
import Row from "@/pages/home/components/course/row"
import { statusOf } from "@/pages/home/components/course/text"
import { useDayCourses } from "@/pages/home/hooks/course"
import { addDays, nowOf, weekOf } from "@/utils/date"
import { navigateTo } from "@/utils/navigate"

/** 列表行骨架 */
function RowSkeleton(): ReactNode {
  return (
    <View className="flex items-center justify-between gap-2">
      <View className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-3 w-6r bg-ink-line" />
        <Skeleton className="h-2 w-full bg-ink-line" />
      </View>
      <Skeleton className="h-2h w-3r rounded-full bg-ink-line" />
    </View>
  )
}

/** 加载骨架 */
function SkeletonBlock(): ReactNode {
  return (
    <View className="flex flex-col gap-1">
      <RowSkeleton />
      <RowSkeleton />
    </View>
  )
}

/** 列表下方的课程状态提示 */
function Notice({
  text,
  tomorrow,
  onSwitch,
}: Readonly<{ text: string, tomorrow: boolean, onSwitch: () => void }>): ReactNode {
  return (
    <View className="flex items-center justify-between gap-2">
      <Text className="text-xs text-soft">{text}</Text>
      <Button
        variant="ghost"
        color="primary"
        className="px-1 py-0 text-xs"
        onClick={onSwitch}
      >
        <Text>{tomorrow ? "查看今日" : "查看明日"}</Text>
      </Button>
    </View>
  )
}

/** 课表 */
export default function Course(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const [tomorrow, setTomorrow] = useState(false)

  const now = nowOf()
  const date = addDays(now, tomorrow ? 1 : 0)
  const term = semester.data?.current
  const week = term
    ? weekOf(date, term)
    : null
  const { list, loading } = useDayCourses(term, week, od(date).day)

  const pending = semester.isPending || loading
  const finished = list.length > 0 && list.every(item => statusOf(item, date, now) === "ended")

  const notice = list.length === 0
    ? (tomorrow ? "明日无课, 好好休息吧" : "今日无课, 好好休息吧")
    : finished
      ? (tomorrow ? "明日课程已结束" : "今日课程已结束")
      : null

  return (
    <Card className="overflow-hidden border border-default p-0">
      <Header
        tomorrow={tomorrow}
        count={list.length}
        loading={pending}
        onSwitch={() => setTomorrow(value => !value)}
        onOpen={() => navigateTo(PAGE.table.timetable)}
      />
      <View className="flex flex-col p-1r">
        {pending
          ? <SkeletonBlock />
          : (
              <View className="flex flex-col">
                <View className="flex flex-col gap-1">
                  {list.map(course => (
                    <Row
                      key={`${course.courseId ?? "custom"}-${course.time}`}
                      course={course}
                      date={date}
                      now={now}
                    />
                  ))}
                </View>
                {notice && list.length > 0 && <View className="my-3 border-t border-default" />}
                {notice && (
                  <Notice
                    text={notice}
                    tomorrow={tomorrow}
                    onSwitch={() => setTomorrow(value => !value)}
                  />
                )}
              </View>
            )}
      </View>
    </Card>
  )
}
