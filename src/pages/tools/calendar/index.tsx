import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import Scroll from "@/components/common/scroll"
import { Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Board from "@/pages/tools/calendar/components/board"
import PhaseButtons from "@/pages/tools/calendar/components/phase-buttons"
import { useCalendar } from "@/pages/tools/calendar/hooks/calendar"
import { detailOf, PHASE_LABEL, phaseTextOf } from "@/pages/tools/calendar/model/calendar"
import { nowOf } from "@/utils/date"

/** 校历 */
export default function Calendar(): ReactNode {
  const {
    calendar,
    years,
    year,
    phase,
    phaseRange,
    weeks,
    loading,
    refreshing,
    selectYear,
    selectPhase,
    refresh,
  } = useCalendar()
  const now = nowOf()
  const detail = calendar
    ? detailOf(now, calendar)
    : null
  const todayText = detail?.phase === phase
    ? detail.week === null
      ? `今天 ${PHASE_LABEL[phase]}`
      : `今天 第 ${detail.week} 周`
    : null

  const columns: PickerColumn[] = [
    {
      key: "year",
      label: "学年",
      options: years.map(item => ({
        label: `${item}`,
        value: item,
      })),
    },
  ]
  const value: ColumnValue | null = year === null
    ? null
    : { year }

  function select(next: ColumnValue | null): void {
    if (next)
      selectYear(Number(next.year))
  }

  return (
    <Page title="校历">
      <Main>
        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-2 pt-1r pb-1r">
            <View className="flex items-center gap-2">
              <Picker
                className="flex-1"
                triggerClassName="rounded-full py-1"
                columns={columns}
                value={value}
                onChange={select}
                formatValue={() => `${year ?? ""} 学年`}
                title="选择学年"
                placeholder="学年"
                disabled={loading || years.length === 0}
              />
              <PhaseButtons phase={phase} onChange={selectPhase} />
            </View>

            <View className="flex items-center justify-between gap-2 px-1">
              <Text className="text-xs text-soft">{phaseTextOf(phaseRange)}</Text>
              {todayText && <Text className="shrink-0 text-xs text-soft">{todayText}</Text>}
            </View>

            {loading && !calendar && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
            {!loading && weeks.length === 0 && (
              <Text className="py-8r text-center text-sm text-soft">本阶段日期待定</Text>
            )}
            {weeks.length > 0 && <Board weeks={weeks} />}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
