import type { ReactNode } from "react"
import type { DayCell, WeekRow } from "@/pages/tools/calendar/model/calendar"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import { DAY_NAMES } from "@/pages/table/model/course"
import { cn } from "@/utils/cn"

export interface BoardProps {
  /** 周行 */
  weeks: WeekRow[]
}

/** 日期文本, 每月一号显示月份 */
function textOf(cell: DayCell): string {
  return cell.day === 1
    ? `${cell.month} 月`
    : `${cell.day}`
}

/** 日期格 */
function Day({ cell }: Readonly<{ cell: DayCell }>): ReactNode {
  return (
    <View className={cn(
      "flex h-2r flex-1 items-center justify-center",
      cell.month % 2 === 0 && "bg-default",
    )}
    >
      {cell.today
        ? (
            <View className="flex h-3h items-center justify-center rounded-md bg-primary px-1">
              <Text className="text-xs text-primary-strong">{textOf(cell)}</Text>
            </View>
          )
        : (
            <Text className={cn("text-xs", cell.active
              ? "text-default"
              : "text-soft opacity-soft")}
            >
              {textOf(cell)}
            </Text>
          )}
    </View>
  )
}

/** 阶段内的连续月历, 相邻月份以底色区分 */
export default function Board({ weeks }: Readonly<BoardProps>): ReactNode {
  return (
    <Card className="flex flex-col border border-default p-1r">
      <View className="flex items-center pb-1">
        <Text className="w-4h shrink-0 text-center text-xs text-soft">周次</Text>
        {DAY_NAMES.map(name => (
          <Text key={name} className="flex-1 text-center text-xs text-soft">{`周${name}`}</Text>
        ))}
      </View>

      {weeks.map(row => (
        <View key={row.key} className="flex h-2r items-center">
          <Text className="w-4h shrink-0 text-center text-xs text-soft">{row.week ?? ""}</Text>
          {row.days.map(cell => <Day key={cell.key} cell={cell} />)}
        </View>
      ))}
    </Card>
  )
}
