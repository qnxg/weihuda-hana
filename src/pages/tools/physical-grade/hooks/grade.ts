import type { PhysicalGrade } from "@contract/routes"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"

export interface PhysicalGradeState {
  /** 体测成绩, 无数据为 null */
  grade: PhysicalGrade | null
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某学年的体测成绩 */
export function usePhysicalGrade(year: number | null): PhysicalGradeState {
  const key = useMemo(() => QUERY_KEY.physical.get(year ?? undefined), [year])
  const [refreshing, setRefreshing] = useState(false)

  const query = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (year === null)
        throw new Error("year required")

      return api.physical.get({ year }, signal)
    },
    enabled: year !== null,
  })

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
    refresh,
  }
}
