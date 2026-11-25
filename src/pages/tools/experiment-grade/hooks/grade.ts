import type { ExperimentGrade, Term } from "@contract/routes"
import { CODE } from "@shared/codes"
import { useEffect, useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import { ApiError } from "@/types/request"
import { setLabBound } from "@/utils/lab"

export interface ExperimentGradeState {
  /** 实验成绩, 无数据为 null */
  grade: ExperimentGrade | null
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 大物实验平台需要重新绑定 */
  rebind: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某学期的实验成绩 */
export function useExperimentGrade(term: Term | null): ExperimentGradeState {
  const key = useMemo(() => QUERY_KEY.experiment.grade(term ?? undefined), [term])
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.experiment.grade(term, signal)
    },
    enabled: term !== null,
  })

  const rebind = query.error instanceof ApiError
    && Number(query.error.code) === CODE.auth.labRebind

  useEffect(() => {
    if (rebind)
      setLabBound(false)
  }, [rebind])

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: key }).finally(() => setRefreshing(false))
  }

  return {
    grade: query.data ?? null,
    loading: query.isLoading,
    refreshing,
    rebind,
    refresh,
  }
}
