import type { NetflowDetailGetData, NetflowDetailItem } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import { createDateColumns, Picker } from "@/components/form/picker"
import Popup from "@/components/modal/popup"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useNetflowDetail } from "@/pages/tools/netflow/hooks/detail"
import { cn } from "@/utils/cn"

/** 查询模式 */
type Mode = "month" | "day"

/** 模式选项 */
const MODES = [
  { key: "month", label: "全月" },
  { key: "day", label: "按天" },
] as const satisfies readonly { key: Mode, label: string }[]

/** 所选年月日 */
interface Period {
  /** 年 */
  year: number
  /** 月 */
  month: number
  /** 日 */
  day: number
}

/** 所选时段的总量 */
function Usage({ data }: Readonly<{ data: NetflowDetailGetData }>): ReactNode {
  const items = [
    { key: "total", label: "总流量", value: data.total },
    { key: "upload", label: "上传", value: data.upload },
    { key: "download", label: "下载", value: data.download },
  ]

  return (
    <Card className="flex items-center border border-default p-3">
      {items.map((item, index) => (
        <View
          key={item.key}
          className={cn(
            "flex flex-1 flex-col items-center gap-1",
            index > 0 && "border-l border-default",
          )}
        >
          <Text className="text-xs text-soft">{item.label}</Text>
          <Text className="text-sm text-strong">{item.value}</Text>
        </View>
      ))}
    </Card>
  )
}

/** 流量明细 */
export default function Detail(): ReactNode {
  const now = od()
  const [mode, setMode] = useState<Mode>("month")
  const [selected, setSelected] = useState<NetflowDetailItem | null>(null)
  const [period, setPeriod] = useState<Period>(() => ({
    year: now.year,
    month: now.month,
    day: now.date,
  }))

  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const min = useMemo(() => {
    const start = (semester.data?.list ?? [])
      .map(item => item.start)
      .sort()[0]

    if (!start)
      return undefined

    const [year, month, day] = start.split("-").map(Number)

    return { year, month, day }
  }, [semester.data])

  const columns = useMemo(() => createDateColumns({
    precision: mode === "month"
      ? "month"
      : "day",
    min,
    max: {
      year: now.year,
      month: now.month,
      day: now.date,
    },
  }), [
    min,
    mode,
    now.date,
    now.month,
    now.year,
  ])

  const { data, loading, refreshing, refresh } = useNetflowDetail(
    period.year,
    period.month,
    mode === "day"
      ? period.day
      : undefined,
  )

  const value: ColumnValue = mode === "month"
    ? {
        year: period.year,
        month: period.month,
      }
    : {
        year: period.year,
        month: period.month,
        day: period.day,
      }
  const label = mode === "month"
    ? `${period.year} 年 ${period.month} 月`
    : `${period.year} 年 ${period.month} 月 ${period.day} 日`
  const rows = selected
    ? [
        { label: "时段", value: label },
        { label: "总用量", value: selected.total },
        { label: "下载", value: selected.download },
        { label: "上传", value: selected.upload },
        { label: "占比", value: `${selected.percentage}%` },
      ]
    : []

  function select(next: ColumnValue | null): void {
    if (!next)
      return

    const year = Number(next.year)
    const month = Number(next.month)

    if (!Number.isInteger(year) || !Number.isInteger(month))
      return

    if (mode === "month") {
      setPeriod(current => ({
        year,
        month,
        day: current.day,
      }))
      return
    }

    const day = Number(next.day)

    if (Number.isInteger(day))
      setPeriod({ year, month, day })
  }

  function changeMode(next: Mode): void {
    setMode(next)

    if (next !== "day")
      return

    setPeriod((current) => {
      const today = current.year === now.year && current.month === now.month
      const low = min && current.year === min.year && current.month === min.month

      return {
        ...current,
        day: today
          ? now.date
          : low
            ? min.day
            : 1,
      }
    })
  }

  return (
    <>
      <View className="flex items-center gap-2 pb-2">
        <View className="flex shrink-0 rounded-full bg-strong p-1">
          {MODES.map((item) => {
            const active = item.key === mode

            return (
              <Button
                key={item.key}
                variant={active ? "solid" : "ghost"}
                color={active ? "primary" : "ink"}
                className="rounded-full px-2 py-1 text-xs"
                onClick={() => changeMode(item.key)}
              >
                {item.label}
              </Button>
            )
          })}
        </View>

        <Picker
          className="flex-1"
          triggerClassName="rounded-full py-1"
          columns={columns}
          value={value}
          onChange={select}
          formatValue={() => label}
          title="选择时间"
        />
      </View>

      <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
        <View className="flex flex-col gap-2 pb-1r">
          {loading && !data && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
          {data && <Usage data={data} />}
          {!loading && data && data.items.length === 0 && (
            <Text className="py-8r text-center text-sm text-soft">该时段暂无流量明细</Text>
          )}
          {data?.items.map(item => (
            <Card
              key={item.app}
              className="flex flex-col gap-1 border border-default p-3"
              onClick={() => setSelected(item)}
            >
              <View className="flex items-center gap-2">
                <Text className="flex-1 text-sm text-strong">{item.app}</Text>
                <Text className="shrink-0 text-sm text-strong">{item.total}</Text>
              </View>
              <Text className="text-xs text-soft">
                {`下载 ${item.download} | 上传 ${item.upload} | 占比 ${item.percentage}%`}
              </Text>
            </Card>
          ))}
        </View>
      </Scroll>

      <Popup visible={selected !== null} title={selected?.app} onClose={() => setSelected(null)} className="p-1r">
        {selected && (
          <View className="mt-2 overflow-hidden rounded-md border border-default">
            {rows.map((row, index) => (
              <Cell key={row.label} title={row.label} description={row.value} border={index < rows.length - 1} />
            ))}
          </View>
        )}
      </Popup>
    </>
  )
}
