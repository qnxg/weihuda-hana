import type { Calendar, Phase, PhaseRange, WeekRow } from "@/pages/tools/calendar/model/calendar"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import {
  calendarOf,
  defaultPhaseOf,
  defaultYearOf,
  weeksOf,
} from "@/pages/tools/calendar/model/calendar"
import { nowOf } from "@/utils/date"

export interface CalendarState {
  /** 当前学年校历 */
  calendar: Calendar | null
  /** 可选学年, 由新到旧 */
  years: number[]
  /** 选中学年 */
  year: number | null
  /** 选中阶段 */
  phase: Phase
  /** 选中阶段的区间 */
  phaseRange: PhaseRange | null
  /** 阶段内的连续周行 */
  weeks: WeekRow[]
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 选择学年 */
  selectYear: (year: number) => void
  /** 选择阶段 */
  selectPhase: (phase: Phase) => void
  /** 刷新 */
  refresh: () => void
}

/** 校历状态 */
export function useCalendar(): CalendarState {
  const now = nowOf()
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const [yearState, setYearState] = useState<number | null>(null)
  const [phaseState, setPhaseState] = useState<Phase | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const terms = useMemo(() => {
    return (semester.data?.list ?? [])
      .filter(item => item.semester !== "winter")
      .sort((a, b) => a.start.localeCompare(b.start))
  }, [semester.data])

  const years = useMemo(() => {
    const unique = new Set(terms.map(item => item.year))

    return [
      ...unique,
    ].sort((a, b) => b - a)
  }, [terms])

  const year = yearState ?? defaultYearOf(terms, semester.data?.current)
  const phase = phaseState ?? defaultPhaseOf(terms, semester.data?.current)
  const calendar = useMemo(() => year === null
    ? null
    : calendarOf(semester.data?.list ?? [], year), [semester.data, year])
  const phaseRange = calendar?.phases.find(item => item.phase === phase) ?? null
  const weeks = calendar && phaseRange
    ? weeksOf(phaseRange, calendar, now)
    : []

  function selectYear(next: number): void {
    setYearState(next)
  }

  function selectPhase(next: Phase): void {
    setPhaseState(next)
  }

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY.semester.get }).finally(() => setRefreshing(false))
  }

  return {
    calendar,
    years,
    year,
    phase,
    phaseRange,
    weeks,
    loading: semester.isPending,
    refreshing,
    selectYear,
    selectPhase,
    refresh,
  }
}
