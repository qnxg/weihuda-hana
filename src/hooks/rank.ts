import type { Rank, RankCaGetData, RankGetQueries } from "@contract/routes"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"

/** 排名默认查询, 主修 / 成绩总库 / 最高成绩 */
const BASE: RankGetQueries = {
  range: "major",
  dataSource: "total",
  display: "max",
}

export interface RankState {
  /** 排名, 无数据为 null */
  rank: Rank | null
  /** 是否加载中 */
  loading: boolean
}

/** 教务排名, queries 为 null 时不请求 */
export function useRank(queries: RankGetQueries | null): RankState {
  const query = useQuery({
    queryKey: QUERY_KEY.rank.get(queries ?? BASE),
    queryFn: ({ signal }) => {
      if (!queries)
        throw new Error("queries required")

      return api.rank.get(queries, signal)
    },
    enabled: queries !== null,
  })

  return {
    rank: query.data ?? null,
    loading: query.isLoading,
  }
}

export interface RankCaState {
  /** 凭证排名, 未生成为 null */
  ca: RankCaGetData
  /** 是否加载中 */
  loading: boolean
}

/** 可信电子凭证排名, 读取后端缓存 */
export function useRankCa(enabled: boolean): RankCaState {
  const query = useQuery({
    queryKey: QUERY_KEY.rank.ca,
    queryFn: ({ signal }) => api.rank.caGet(signal),
    enabled,
  })

  return {
    ca: query.data ?? null,
    loading: query.isLoading,
  }
}

export interface RankCaRefreshState {
  /** 重新生成并刷新缓存 */
  refresh: () => void
  /** 是否更新中 */
  refreshing: boolean
}

/** 重新生成凭证排名 */
export function useRankCaRefresh(): RankCaRefreshState {
  const mutation = useMutation({
    mutationFn: () => api.rank.caRefresh(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY.rank.ca }),
  })

  return {
    refresh: () => mutation.mutate(),
    refreshing: mutation.isPending,
  }
}
