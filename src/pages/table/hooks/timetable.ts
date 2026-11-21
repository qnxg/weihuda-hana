import type { TermInfo } from "@contract/routes"
import type { CourseCluster } from "@/pages/table/model/course"
import { od } from "@xtwis/ohday"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import { blocksOf, clustersOf } from "@/pages/table/model/course"
import { sameTerm } from "@/pages/table/model/term"
import { addDays, nowOf, weekOf } from "@/utils/date"
import { toast } from "@/utils/toast"

/** 展示模式 */
export type TimetableMode = "current" | "all"

export interface TimetableState {
  /** 当前学期 */
  term: TermInfo | null
  /** 全部学期, 按开始日期升序 */
  terms: TermInfo[]
  /** 当前周 */
  week: number
  /** 展示模式 */
  mode: TimetableMode
  /** 当前时刻 */
  today: Date
  /** 本周七天 */
  weekDates: Date[]
  /** 课程堆 */
  clusters: CourseCluster[]
  /** 当前可见课程数 */
  count: number
  /** 是否加载中 */
  loading: boolean
  /** 是否刷新中 */
  refreshing: boolean
  /** 选择学期 */
  selectTerm: (term: TermInfo) => void
  /** 选择周 */
  selectWeek: (week: number) => void
  /** 设置模式 */
  setMode: (mode: TimetableMode) => void
  /** 上一周 */
  prev: () => void
  /** 下一周 */
  next: () => void
  /** 刷新 */
  refresh: () => void
}

/** 课表状态 */
export function useTimetable(): TimetableState {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const [termState, setTermState] = useState<TermInfo | null>(null)
  const [weekState, setWeekState] = useState<number | null>(null)
  const [mode, setMode] = useState<TimetableMode>("current")
  const [refreshing, setRefreshing] = useState(false)

  const term = termState ?? semester.data?.current ?? null
  const week = weekState ?? (term
    ? weekOf(nowOf(), term) ?? 1
    : 1)

  const terms = useMemo(() => {
    return [
      ...(semester.data?.list ?? []),
    ].sort((a, b) => a.start.localeCompare(b.start))
  }, [semester.data])

  const key = useMemo(() => QUERY_KEY.course.list(term ?? undefined), [term])

  const courses = useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      if (!term)
        throw new Error("term required")

      return api.course.list(term, signal)
    },
    enabled: term !== null,
  })

  const blocks = useMemo(() => blocksOf(courses.data ?? [], week), [courses.data, week])
  const visible = useMemo(() => mode === "current"
    ? blocks.filter(block => block.current)
    : blocks, [blocks, mode])
  const clusters = useMemo(() => clustersOf(visible), [visible])

  const weekDates = useMemo(() => {
    if (!term)
      return []

    const start = od(term.start).dd

    return Array.from({ length: 7 }, (_, index) => addDays(start, (week - 1) * 7 + index))
  }, [term, week])

  const today = nowOf()

  function selectTerm(next: TermInfo): void {
    setTermState(next)

    const current = semester.data?.current
    setWeekState(current && sameTerm(current, next)
      ? weekOf(nowOf(), next) ?? 1
      : 1)
  }

  function selectWeek(next: number): void {
    if (!term)
      return

    setWeekState(Math.min(Math.max(1, next), term.weeks))
  }

  function prev(): void {
    if (!term)
      return

    if (week > 1) {
      setWeekState(week - 1)
      return
    }

    const index = terms.findIndex(item => sameTerm(item, term))
    const previous = terms[index - 1]

    if (!previous) {
      toast.info("已经是第一周")
      return
    }

    setTermState(previous)
    setWeekState(previous.weeks)
  }

  function next(): void {
    if (!term)
      return

    if (week < term.weeks) {
      setWeekState(week + 1)
      return
    }

    const index = terms.findIndex(item => sameTerm(item, term))
    const following = terms[index + 1]

    if (!following) {
      toast.info("已经是最后一周")
      return
    }

    setTermState(following)
    setWeekState(1)
  }

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)
    void queryClient.invalidateQueries({ queryKey: key }).finally(() => setRefreshing(false))
  }

  return {
    term,
    terms,
    week,
    mode,
    today,
    weekDates,
    clusters,
    count: visible.length,
    loading: semester.isPending || courses.isLoading,
    refreshing,
    selectTerm,
    selectWeek,
    setMode,
    prev,
    next,
    refresh,
  }
}
