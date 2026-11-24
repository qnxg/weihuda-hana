import type { DormGetData } from "@contract/routes"
import { useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import { handleError } from "@/utils/error"

export interface ElectricityState {
  /** 宿舍信息 */
  dorm: DormGetData | null
  /** 剩余电量 */
  balance: number | undefined
  /** 是否加载中 */
  loading: boolean
  /** 是否同步中 */
  syncing: boolean
  /** 同步电量与宿舍信息, 返回同步结束 */
  refresh: () => Promise<void>
}

/** 宿舍信息与剩余电量 */
export function useElectricity(): ElectricityState {
  const [syncing, setSyncing] = useState(false)

  const dorm = useQuery({
    queryKey: QUERY_KEY.dorm.get,
    queryFn: ({ signal }) => api.dorm.get(signal),
  })
  const electricity = useQuery({
    queryKey: QUERY_KEY.dorm.electricity,
    queryFn: ({ signal }) => api.dorm.electricityGet(signal),
  })

  function refresh(): Promise<void> {
    if (syncing)
      return Promise.resolve()

    setSyncing(true)
    return Promise.all([
      api.dorm.refresh(),
      api.dorm.electricityRefresh(),
    ])
      .then(() => Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.dorm.get }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEY.dorm.electricity }),
      ]))
      .then(() => undefined)
      .catch(handleError())
      .finally(() => setSyncing(false))
  }

  return {
    dorm: dorm.data ?? null,
    balance: electricity.data?.balance,
    loading: dorm.isPending || electricity.isPending,
    syncing,
    refresh,
  }
}
