import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { Bell } from "lucide-react-taro"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import Skeleton from "@/components/common/skeleton"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import Sign from "@/pages/home/components/greeting/sign"
import { greetingOf, wishOf } from "@/pages/home/components/greeting/text"
import { useAnnouncements } from "@/pages/home/hooks/announcement"
import { useDayCourses } from "@/pages/home/hooks/course"
import { useRefreshable } from "@/pages/home/hooks/refresh"
import { dateOf, nowOf, weekOf } from "@/utils/date"
import { navigateTo } from "@/utils/navigate"

/** 问候 */
export default function Greeting(): ReactNode {
  const me = useQuery({
    queryKey: QUERY_KEY.auth.me,
    queryFn: ({ signal }) => api.auth.me(signal),
  })
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })
  useRefreshable(QUERY_KEY.auth.me)
  useRefreshable(QUERY_KEY.semester.get)

  const now = nowOf()
  const term = semester.data?.current
  const week = term
    ? weekOf(now, term)
    : null
  const today = useDayCourses(term, week, now.getDay())
  const announcement = useAnnouncements()
  const pending = me.isPending
    || semester.isPending
    || today.loading
    || announcement.loading
  const title = me.data
    ? `${greetingOf(now)}, ${me.data.name.slice(0, 1)}同学`
    : greetingOf(now)
  const subtitle = today.ready
    ? `${dateOf(now)} | ${wishOf(today.list.length)}`
    : dateOf(now)

  return (
    <View className="flex items-center justify-between gap-2">
      {pending
        ? (
            <View className="flex flex-1 flex-col gap-1">
              <Skeleton className="h-2h w-7r bg-strong" />
              <Skeleton className="h-3 w-9r bg-strong" />
            </View>
          )
        : (
            <View className="flex flex-1 flex-col gap-1">
              <View className="flex items-center gap-1">
                <Text className="text-lg text-strong">{title}</Text>
                {week !== null && (
                  <View className="flex items-center rounded-full bg-primary px-1h py-1">
                    <Text className="text-xs text-primary-strong">{`第 ${week} 周`}</Text>
                  </View>
                )}
              </View>
              <Text className="text-xs text-soft">{subtitle}</Text>
            </View>
          )}
      {!pending && (
        <View className="flex items-center gap-1h">
          <Button
            variant="outline"
            color="ink"
            className="relative h-4h w-4h rounded-full p-0"
            onClick={() => navigateTo(PAGE.debug.index)}
          >
            <Icon icon={Bell} color="ink" className="h-2h w-2h" />
            {announcement.unread && <View className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error-invert" />}
          </Button>
          <Sign />
        </View>
      )}
    </View>
  )
}
