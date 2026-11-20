import type { RankGetQueries } from "@contract/routes"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

/** 排名默认查询, 主修 / 成绩总库 / 最高成绩 */
const queries: RankGetQueries = {
  range: "major",
  dataSource: "total",
  display: "max",
}

export interface RankOverview {
  /** 核心课程加权排名, 形如 排名/总人数 */
  weightedRank?: string
  /** 是否加载中 */
  loading: boolean
}

/** 核心课程的加权平均排名 */
export function useRank(): RankOverview {
  const key = useMemo(() => QUERY_KEY.rank.get(queries), [])

  const query = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => api.rank.get(queries, signal),
  })

  useRefreshable(key)

  return {
    weightedRank: query.data?.core?.weightedRank ?? undefined,
    loading: query.isLoading,
  }
}
