import type { ReactNode } from "react"
import type { ScheduleState } from "@/pages/table/hooks/schedule"
import type { ScheduleGroup, ScheduleItem, ScheduleKind } from "@/pages/table/model/schedule"
import { Text, View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { useState } from "react"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import Popup from "@/components/modal/popup"
import { DAY_NAMES } from "@/pages/table/model/course"
import { SCHEDULE_NAME } from "@/pages/table/model/schedule"
import { cn } from "@/utils/cn"
import { dateOf } from "@/utils/date"

/** 来源标记 */
const BADGE: Record<ScheduleKind, string> = {
  exam: "bg-error text-error-strong",
  experiment: "raw:bg-violet-bg raw:text-violet-fgstrong",
  todo: "bg-primary text-primary-strong",
}

/** 时间文本 */
function timeOf(item: ScheduleItem): string {
  if (!item.startTime)
    return "全天"

  return item.endTime
    ? `${item.startTime} - ${item.endTime}`
    : item.startTime
}

/** 详情行, 去掉空值与会重复标题的项 */
function detailsOf(item: ScheduleItem): { label: string, value: string }[] {
  const date = dateOf(od(item.date).dd)
  const time = timeOf(item)
  const seat = item.seat
    ? `${item.seat} 号座`
    : null
  const week = item.week === null
    ? null
    : item.day === null
      ? `第 ${item.week} 周`
      : `第 ${item.week} 周 周${DAY_NAMES[item.day]}`
  const contact = [item.phone, item.email].filter(Boolean).join(" | ") || null
  const rows: { label: string, value: string | null }[] = [
    { label: "类型", value: SCHEDULE_NAME[item.kind] },
    { label: "日期", value: date },
    { label: "时间", value: time },
    { label: "周次", value: week },
    { label: "课程", value: item.courseName },
    { label: "校区", value: item.area },
    { label: "地点", value: item.place },
    { label: "座位", value: seat },
    { label: "教师", value: item.teacher },
    { label: "联系", value: contact },
    { label: "备注", value: item.note },
  ]

  return rows.filter((row): row is { label: string, value: string } => Boolean(row.value) && row.value !== item.title)
}

/** 一张日程卡片 */
function Row({ item, onSelect }: Readonly<{ item: ScheduleItem, onSelect: (item: ScheduleItem) => void }>): ReactNode {
  const meta = [
    timeOf(item),
    item.place,
    item.seat
      ? `${item.seat} 号座`
      : null,
    item.teacher,
  ].filter(Boolean).join(" | ")

  return (
    <Card className="flex flex-col gap-1 border border-default p-3" onClick={() => onSelect(item)}>
      <View className="flex items-center gap-2">
        <Text className="flex-1 text-sm text-strong">{item.title}</Text>
        <Text className={cn("shrink-0 rounded px-1 text-xs", BADGE[item.kind])}>
          {SCHEDULE_NAME[item.kind]}
        </Text>
      </View>
      <Text className="text-xs text-soft">{meta}</Text>
    </Card>
  )
}

/** 一天的日程, 日期在卡片外做小标题 */
function Day({ group, onSelect }: Readonly<{ group: ScheduleGroup, onSelect: (item: ScheduleItem) => void }>): ReactNode {
  return (
    <View className="flex flex-col gap-1">
      <Text className="px-1 text-xs text-soft">{group.label}</Text>
      {group.items.map(item => <Row key={item.key} item={item} onSelect={onSelect} />)}
    </View>
  )
}

/** 待办日程视图 */
export default function Schedule({ state }: Readonly<{ state: ScheduleState }>): ReactNode {
  const { groups, loading, refreshing, refresh } = state
  const [selected, setSelected] = useState<ScheduleItem | null>(null)

  return (
    <>
      <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
        <View className="flex flex-col gap-3 px-1r py-1r">
          {loading && groups.length === 0
            ? <Text className="py-8r text-center text-sm text-soft">加载中</Text>
            : groups.length === 0
              ? <Text className="py-8r text-center text-sm text-soft">暂无日程</Text>
              : groups.map(group => <Day key={group.key} group={group} onSelect={setSelected} />)}
        </View>
      </Scroll>

      <Popup visible={selected !== null} title={selected?.title} onClose={() => setSelected(null)} className="p-1r">
        {selected && (
          <View className="mt-2 overflow-hidden rounded-md border border-default">
            {detailsOf(selected).map((row, index, rows) => (
              <Cell key={row.label} title={row.label} description={row.value} border={index < rows.length - 1} />
            ))}
          </View>
        )}
      </Popup>
    </>
  )
}
