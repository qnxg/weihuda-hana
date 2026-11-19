import type { Term } from "@contract/routes"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface TodayCourses {
  /** 当天课程数, 未就绪为 null */
  count: number | null
  /** 是否加载中 */
  loading: boolean
}

/** 当天课程, 依赖学期 */
export function useTodayCourses(term: Term | undefined, week: number | null, day: number): TodayCourses {
  const key = useMemo(() => QUERY_KEY.course.list(term), [term])

  const courses = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.course.list(term, signal)
    },
    enabled: term !== undefined,
  })

  useRefreshable(key)

  const count = courses.data
    ? courses.data.filter(item => week !== null && item.day === day && item.weeks.includes(week)).length
    : null

  return { count, loading: courses.isLoading }
}
