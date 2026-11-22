import type { Term } from "@contract/routes"
import type { ScheduleGroup, ScheduleKind } from "@/pages/table/model/schedule"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import { filterOf, groupsOf, scheduleOf } from "@/pages/table/model/schedule"
import { nowOf } from "@/utils/date"

export interface ScheduleState {
  /** 按日期分组 */
  groups: ScheduleGroup[]
  /** 条数, 未加载时为 undefined */
  count?: number
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 刷新 */
  refresh: () => void
}

/** 某学期的待办, 考试与实验, 合并成日程 */
export function useSchedule(term: Term | null, kinds: readonly ScheduleKind[], enabled = true): ScheduleState {
  const todoKey = useMemo(() => QUERY_KEY.todo.list(term ?? undefined), [term])
  const examKey = useMemo(() => QUERY_KEY.exam.list(term ?? undefined), [term])
  const experimentKey = useMemo(() => QUERY_KEY.experiment.list(term ?? undefined), [term])
  const [refreshing, setRefreshing] = useState(false)

  const todos = useQuery({
    queryKey: todoKey,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.todo.list(term, signal)
    },
    enabled: enabled && term !== null,
  })

  const exams = useQuery({
    queryKey: examKey,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.exam.list(term, signal)
    },
    enabled: enabled && term !== null,
  })

  const experiments = useQuery({
    queryKey: experimentKey,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.experiment.list(term, signal)
    },
    enabled: enabled && term !== null,
  })

  const derived = useMemo(() => {
    const items = scheduleOf(todos.data ?? [], exams.data ?? [], experiments.data ?? [])

    return {
      groups: groupsOf(filterOf(items, kinds), nowOf()),
      count: items.length,
    }
  }, [
    exams.data,
    experiments.data,
    kinds,
    todos.data,
  ])

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: todoKey }),
      queryClient.invalidateQueries({ queryKey: examKey }),
      queryClient.invalidateQueries({ queryKey: experimentKey }),
    ]).finally(() => setRefreshing(false))
  }

  const loaded = todos.data !== undefined && exams.data !== undefined && experiments.data !== undefined

  return {
    groups: derived.groups,
    count: loaded
      ? derived.count
      : undefined,
    loading: todos.isLoading || exams.isLoading || experiments.isLoading,
    refreshing,
    refresh,
  }
}
