import type { CourseItem, Term } from "@contract/routes"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface DayCourses {
  /** 当天课程, 按节次升序 */
  list: CourseItem[]
  /** 是否已就绪 */
  ready: boolean
  /** 是否加载中 */
  loading: boolean
}

/** 某天的课程, 依赖学期与教学周 */
export function useDayCourses(term: Term | undefined, week: number | null, day: number): DayCourses {
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

  const list = courses.data && week !== null
    ? courses.data
        .filter(item => item.day === day && item.weeks.includes(week))
        .sort((a, b) => a.time - b.time)
    : []

  return { list, ready: courses.data !== undefined, loading: courses.isLoading }
}
