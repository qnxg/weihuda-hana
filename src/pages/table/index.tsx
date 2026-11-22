import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import type { TimetableState } from "@/pages/table/hooks/timetable"
import type { TableView } from "@/stores/table"
import { Text, View } from "@tarojs/components"
import { BookOpen, CalendarClock, CalendarDays, Plus } from "lucide-react-taro"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import { Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Navbar, { NavbarAction } from "@/components/layout/navbar"
import Page from "@/components/layout/page"
import { PAGE } from "@/config/page"
import Extra from "@/pages/table/components/extra"
import Schedule from "@/pages/table/components/schedule"
import Timetable from "@/pages/table/components/timetable"
import { useTimetable } from "@/pages/table/hooks/timetable"
import { termKeyOf, termLabelOf } from "@/pages/table/model/term"
import { useTableStore } from "@/stores/table"
import { navigateTo } from "@/utils/navigate"

/** 视图图标 */
const ICONS = {
  timetable: CalendarDays,
  extra: BookOpen,
  schedule: CalendarClock,
} as const

/** 当前视图的过滤与操作 */
function Filter({ view, state }: Readonly<{ view: TableView, state: TimetableState }>): ReactNode {
  const columns: PickerColumn[] = [
    {
      key: "term",
      label: "学期",
      options: state.terms.map(term => ({
        label: termLabelOf(term),
        value: termKeyOf(term),
      })),
    },
    {
      key: "week",
      label: "周",
      options: (value) => {
        const target = state.terms.find(term => termKeyOf(term) === String(value.term))

        return target
          ? Array.from({ length: target.weeks }, (_, index) => ({
              label: `第 ${index + 1} 周`,
              value: index + 1,
            }))
          : []
      },
    },
  ]
  const value = state.term
    ? {
        term: termKeyOf(state.term),
        week: state.week,
      }
    : null
  const display = state.term
    ? `${termLabelOf(state.term)} - 第 ${state.week} 周`
    : ""
  const termKey = state.term
    ? termKeyOf(state.term)
    : ""

  function selectTermWeek(next: ColumnValue | null): void {
    if (!next)
      return

    const target = state.terms.find(term => termKeyOf(term) === String(next.term))

    if (!target)
      return

    if (!state.term || termKeyOf(state.term) !== termKeyOf(target))
      state.selectTerm(target)

    const week = Number(next.week)

    if (Number.isFinite(week))
      state.selectWeek(week)
  }

  return (
    <View className="flex items-center gap-2">
      <Picker
        className="flex-1"
        triggerClassName="rounded-full py-1"
        columns={columns}
        value={value}
        onChange={selectTermWeek}
        formatValue={() => display}
        title="选择学期与周"
        placeholder="学期与周"
        disabled={!state.term}
      />

      {view === "timetable" && (
        <View className="flex shrink-0 rounded-full bg-strong p-1">
          {(["current", "all"] as const).map((mode) => {
            const active = state.mode === mode

            return (
              <Button
                key={mode}
                variant={active ? "solid" : "ghost"}
                color={active ? "primary" : "ink"}
                className="rounded-full px-3 py-2x text-xs"
                onClick={() => state.setMode(mode)}
              >
                {mode === "current"
                  ? "本周"
                  : "全部"}
              </Button>
            )
          })}
        </View>
      )}

      <Button
        className="shrink-0 rounded-full p-6x"
        icon={<Icon icon={Plus} className="h-2h w-2h" />}
        disabled={!termKey}
        onClick={() => navigateTo(PAGE.form.course, { term: termKey })}
      />
    </View>
  )
}

/** 课程表 */
export default function Table(): ReactNode {
  const state = useTimetable()
  const view = useTableStore(state => state.view)
  const setView = useTableStore(state => state.setView)
  const tabs = [
    { key: "timetable", title: "课表", count: state.count },
    { key: "extra", title: "无课表", count: 0 },
    { key: "schedule", title: "日程", count: 0 },
  ] as const satisfies readonly { key: TableView, title: string, count: number }[]
  const current = tabs.find(tab => tab.key === view) ?? tabs[0]

  return (
    <Page tabbar navbar={false} safeArea="bottom">
      <Navbar
        back={(
          <View className="flex items-baseline gap-1">
            <Text className="text-base text-strong">{current.title}</Text>
            <Text className="text-xs text-soft">{current.count}</Text>
          </View>
        )}
      >
        {tabs.map(tab => (
          <NavbarAction
            key={tab.key}
            icon={ICONS[tab.key]}
            active={tab.key === view}
            onClick={() => setView(tab.key)}
          />
        ))}
      </Navbar>
      <Main className="px-0">
        <View className="flex flex-col gap-2 px-1r pt-1r pb-2">
          <Filter view={view} state={state} />
        </View>
        <View className="flex flex-1 flex-col overflow-hidden">
          {view === "timetable" && <Timetable state={state} />}
          {view === "extra" && <Extra />}
          {view === "schedule" && <Schedule />}
        </View>
      </Main>
    </Page>
  )
}
