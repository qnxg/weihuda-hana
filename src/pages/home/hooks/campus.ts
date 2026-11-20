import type { CardGetData, NetflowGetData } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { useMemo } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRefreshable } from "@/pages/home/hooks/refresh"

export interface CardOverview {
  /** 校园卡 */
  card?: CardGetData
  /** 本月支出 */
  spent?: number
  /** 是否加载中 */
  loading: boolean
}

/** 校园卡余额与本月支出, 支出按月粒度从流水汇总 */
export function useCard(): CardOverview {
  const now = od()
  const year = now.year
  const month = now.month
  const key = useMemo(() => QUERY_KEY.card.recordList({ year, month, type: "consumption" }), [year, month])

  const card = useQuery({
    queryKey: QUERY_KEY.card.get,
    queryFn: ({ signal }) => api.card.get(signal),
  })
  const records = useQuery({
    queryKey: key,
    queryFn: ({ signal }) => api.card.recordList({ year, month, type: "consumption" }, signal),
  })

  useRefreshable(QUERY_KEY.card.get)
  useRefreshable(key)

  return {
    card: card.data,
    spent: records.data
      ? Math.abs(records.data.total)
      : undefined,
    loading: card.isLoading || records.isLoading,
  }
}

export interface DormOverview {
  /** 宿舍位置 */
  place?: string
  /** 剩余电量, 单位度 */
  electricity?: number
  /** 是否加载中 */
  loading: boolean
}

/** 宿舍位置与剩余电量 */
export function useDorm(): DormOverview {
  const dorm = useQuery({
    queryKey: QUERY_KEY.dorm.get,
    queryFn: ({ signal }) => api.dorm.get(signal),
  })
  const electricity = useQuery({
    queryKey: QUERY_KEY.dorm.electricity,
    queryFn: ({ signal }) => api.dorm.electricityGet(signal),
  })

  useRefreshable(QUERY_KEY.dorm.get)
  useRefreshable(QUERY_KEY.dorm.electricity)

  return {
    place: dorm.data
      ? `${dorm.data.build} ${dorm.data.room}`
      : undefined,
    electricity: electricity.data?.balance,
    loading: dorm.isLoading || electricity.isLoading,
  }
}

export interface PointOverview {
  /** 当前积分 */
  value?: number
  /** 连续签到天数 */
  combo?: number
  /** 是否加载中 */
  loading: boolean
}

/** 积分与连续签到天数 */
export function usePoint(): PointOverview {
  const query = useQuery({
    queryKey: QUERY_KEY.point.get,
    queryFn: ({ signal }) => api.point.get(signal),
  })

  useRefreshable(QUERY_KEY.point.get)

  return {
    value: query.data?.value,
    combo: query.data?.combo,
    loading: query.isLoading,
  }
}

export interface EmailOverview {
  /** 未读邮件数 */
  count?: number
  /** 是否获取失败 */
  failed: boolean
  /** 是否加载中 */
  loading: boolean
}

/** 未读邮件数 */
export function useEmail(): EmailOverview {
  const query = useQuery({
    queryKey: QUERY_KEY.email.get,
    queryFn: ({ signal }) => api.email.get(signal),
  })

  useRefreshable(QUERY_KEY.email.get)

  return {
    count: query.data?.count,
    failed: query.isError,
    loading: query.isLoading,
  }
}

export interface NetflowOverview {
  /** 本月流量 */
  data?: NetflowGetData
  /** 是否加载中 */
  loading: boolean
}

/** 本月流量 */
export function useNetflow(): NetflowOverview {
  const query = useQuery({
    queryKey: QUERY_KEY.netflow.get,
    queryFn: ({ signal }) => api.netflow.get(signal),
  })

  useRefreshable(QUERY_KEY.netflow.get)

  return { data: query.data, loading: query.isLoading }
}
