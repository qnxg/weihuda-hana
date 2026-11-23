import type { ExperimentItem } from "@contract/routes"
import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Cell from "@/components/common/cell"
import { dateTextOf, timeTextOf, weekTextOf } from "@/pages/tools/experiment/model/experiment"

/** 实验详情 */
export default function Detail({ item }: Readonly<{ item: ExperimentItem }>): ReactNode {
  const week = weekTextOf(item)
  const date = dateTextOf(item)
  const time = timeTextOf(item)
  const rows: { label: string, value: string | null }[] = [
    { label: "课程", value: item.course },
    { label: "教师", value: item.teacher },
    { label: "周次", value: week },
    { label: "日期", value: date },
    { label: "时间", value: time },
    { label: "地点", value: item.place },
    {
      label: "座位",
      value: item.seat
        ? `${item.seat} 号座`
        : null,
    },
    { label: "电话", value: item.phone },
    { label: "邮箱", value: item.email },
  ]
  const list = rows.filter((row): row is { label: string, value: string } => Boolean(row.value))

  return (
    <View className="mt-2 overflow-hidden rounded-md border border-default">
      {list.map((row, index) => (
        <Cell key={row.label} title={row.label} description={row.value} border={index < list.length - 1} />
      ))}
    </View>
  )
}
