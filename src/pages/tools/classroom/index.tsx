import type { RoomListQueries } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import { createDateColumns, Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import Periods from "@/pages/tools/classroom/components/periods"
import Results from "@/pages/tools/classroom/components/results"
import { dateKeyOf, defaultGroupKeyOf, PERIOD_GROUPS, queriesOf } from "@/pages/tools/classroom/model/classroom"
import { nowOf } from "@/utils/date"
import { toast } from "@/utils/toast"

/** 空教室查询 */
export default function Classroom(): ReactNode {
  const now = od(nowOf())
  const [date, setDate] = useState({ year: now.year, month: now.month, day: now.date })
  const [buildingState, setBuildingState] = useState<string | null>(null)
  const [selected, setSelected] = useState<string[]>(() => [
    defaultGroupKeyOf(),
  ])
  const [filter, setFilter] = useState<RoomListQueries | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const buildings = useQuery({
    queryKey: QUERY_KEY.room.buildings,
    queryFn: ({ signal }) => api.room.buildings(signal),
  })
  const rooms = useQuery({
    queryKey: QUERY_KEY.room.list(filter ?? undefined),
    queryFn: async ({ signal }) => {
      if (!filter)
        throw new Error("filter required")

      return api.room.list(filter, signal)
    },
    enabled: filter !== null,
  })

  const dateColumns = useMemo(() => createDateColumns({
    precision: "day",
    min: { year: now.year, month: now.month, day: now.date },
  }), [now.year, now.month, now.date])

  const list = buildings.data ?? []
  const buildingId = buildingState ?? list[0]?.id ?? null
  const buildingName = list.find(item => item.id === buildingId)?.name ?? ""
  const buildingColumns: PickerColumn[] = [
    {
      key: "building",
      label: "教学楼",
      options: list.map(item => ({
        label: item.description
          ? `${item.name} (${item.description})`
          : item.name,
        value: item.id,
      })),
    },
  ]

  const buildingValue: ColumnValue | null = buildingId
    ? { building: buildingId }
    : null
  const dateValue: ColumnValue = {
    year: date.year,
    month: date.month,
    day: date.day,
  }

  function selectBuilding(next: ColumnValue | null): void {
    if (next)
      setBuildingState(String(next.building))
  }

  function selectDate(next: ColumnValue | null): void {
    if (!next)
      return

    setDate({
      year: Number(next.year),
      month: Number(next.month),
      day: Number(next.day),
    })
  }

  function submit(): void {
    if (selected.length === 0) {
      toast.error("请选择节次")
      return
    }

    if (!buildingId)
      return

    const groups = PERIOD_GROUPS.filter(item => selected.includes(item.key))
    const key = dateKeyOf(date)

    setFilter(queriesOf(buildingId, key, groups))
    setSummary(`${buildingName} ${key} ${groups.map(item => item.label).join(" / ")}`)
  }

  function refresh(): void {
    if (!filter || refreshing)
      return

    setRefreshing(true)
    void rooms.refetch().finally(() => setRefreshing(false))
  }

  return (
    <Page title="空教室查询">
      <Main>
        <View className="pt-1r pb-2">
          <Card className="flex flex-col gap-2 border border-default p-3">
            <Text className="text-sm text-strong">筛选</Text>

            <Picker
              triggerClassName="rounded-full py-1"
              columns={buildingColumns}
              value={buildingValue}
              onChange={selectBuilding}
              formatValue={() => buildingName}
              title="选择教学楼"
              placeholder="教学楼"
              disabled={buildings.isPending || list.length === 0}
            />

            <Picker
              triggerClassName="rounded-full py-1"
              columns={dateColumns}
              value={dateValue}
              onChange={selectDate}
              formatValue={() => dateKeyOf(date)}
              title="选择日期"
            />

            <Periods value={selected} onChange={setSelected} />

            <Button
              className="rounded-md py-2"
              disabled={buildingId === null || buildings.isPending}
              onClick={submit}
            >
              查询空教室
            </Button>
          </Card>
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-2 pb-1r">
            <View className="flex items-center gap-2 px-1">
              <Text className="flex-1 truncate text-xs text-soft">{summary ?? "选择条件后查询"}</Text>
              {rooms.data && <Text className="shrink-0 text-xs text-soft">{`共 ${rooms.data.items.length} 间`}</Text>}
            </View>

            {filter && rooms.isFetching && !rooms.data && <Text className="py-6 text-center text-sm text-soft">查询中</Text>}
            {filter && !rooms.isFetching && rooms.isError && (
              <Text className="py-6 text-center text-sm text-soft">查询失败, 请重试</Text>
            )}
            {filter && rooms.data && (
              <Card className="border border-default p-3">
                <Results rooms={rooms.data.items} />
              </Card>
            )}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
