import type { CardRecordItem, CardRecordType } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Scroll from "@/components/common/scroll"
import { createDateColumns, Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Popup from "@/components/modal/popup"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import Balance from "@/pages/tools/card/components/balance"
import Detail from "@/pages/tools/card/components/detail"
import Row from "@/pages/tools/card/components/row"
import Toggle from "@/pages/tools/card/components/toggle"
import { useCardBill } from "@/pages/tools/card/hooks/bill"
import { groupsOf, moneyOf, TYPES } from "@/pages/tools/card/model/card"

/** 校园卡 */
export default function Card(): ReactNode {
  const now = od()
  const [time, setTime] = useState({ year: now.year, month: now.month })
  const [type, setType] = useState<CardRecordType>("consumption")
  const { card, data, loading, refreshing, refresh } = useCardBill({ ...time, type })
  const groups = useMemo(() => groupsOf(data?.records ?? []), [data])
  const [selected, setSelected] = useState<CardRecordItem | null>(null)

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

    const [year, month] = start.split("-").map(Number)

    return { year, month }
  }, [semester.data])

  const columns = useMemo(() => createDateColumns({
    precision: "month",
    min,
    max: {
      year: now.year,
      month: now.month,
    },
  }), [
    min,
    now.month,
    now.year,
  ])

  const value: ColumnValue = {
    year: time.year,
    month: time.month,
  }
  const typeLabel = TYPES.find(item => item.key === type)?.label ?? ""

  function selectMonth(next: ColumnValue | null): void {
    if (!next)
      return

    const year = Number(next.year)
    const month = Number(next.month)

    if (Number.isInteger(year) && Number.isInteger(month))
      setTime({ year, month })
  }

  return (
    <Page title="校园卡">
      <Main>
        <View className="flex flex-col gap-2 pt-1r pb-2">
          <Balance card={card} />
          <View className="flex items-center gap-2">
            <Picker
              className="flex-1"
              triggerClassName="rounded-full py-1"
              columns={columns}
              value={value}
              onChange={selectMonth}
              formatValue={() => `${time.year} 年 ${time.month} 月`}
              title="选择月份"
            />
            <Toggle value={type} onChange={setType} />
          </View>
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3 pb-1r">
            {data && (
              <View className="flex items-center justify-between gap-2 px-1">
                <Text className="text-xs text-soft">{`共 ${data.count} 笔`}</Text>
                <Text className="text-xs text-soft">{`${typeLabel} ${moneyOf(Math.abs(data.total))} 元`}</Text>
              </View>
            )}
            {loading && !data && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
            {!loading && data && data.records.length === 0 && (
              <Text className="py-8r text-center text-sm text-soft">{`本月暂无${typeLabel}记录`}</Text>
            )}
            {groups.map(group => (
              <View key={group.key} className="flex flex-col gap-1">
                <Text className="px-1 text-xs text-soft">{group.label}</Text>
                {group.items.map(item => (
                  <Row key={item.id} item={item} onSelect={setSelected} />
                ))}
              </View>
            ))}
          </View>
        </Scroll>

        <Popup visible={selected !== null} title={selected?.name} onClose={() => setSelected(null)} className="p-1r">
          {selected && <Detail item={selected} />}
        </Popup>
      </Main>
    </Page>
  )
}
