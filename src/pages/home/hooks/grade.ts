import type { Term } from "@contract/routes"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface GradeOverview {
  /** 已出分门数 */
  count?: number
  /** 是否加载中 */
  loading: boolean
}

/** 本学期已出成绩的门数, 缓考等异常标识不计 */
export function useGrade(term: Term | undefined): GradeOverview {
  const key = useMemo(() => QUERY_KEY.grade.list(term), [term])

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.grade.list(term, signal)
    },
    enabled: term !== undefined,
  })

  useRefreshable(key)

  return {
    count: query.data?.filter(item => item.gradeTag === null).length,
    loading: query.isLoading,
  }
}
