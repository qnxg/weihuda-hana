import type { ExamItem } from "@contract/routes"
import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Cell from "@/components/common/cell"
import { dateTextOf, STATUS_LABEL, statusOf, timeOf } from "@/pages/tools/exam/model/exam"

/** 考试详情 */
export default function Detail({ item, now }: Readonly<{ item: ExamItem, now: Date }>): ReactNode {
  const status = STATUS_LABEL[statusOf(item, now)]
  const date = dateTextOf(item)
  const time = timeOf(item)
  const rows: { label: string, value: string | null }[] = [
    {
      label: "来源",
      value: item.customizeId === null
        ? "教务"
        : "自定义",
    },
    { label: "状态", value: status },
    { label: "课程代码", value: item.courseId },
    { label: "日期", value: date },
    { label: "时间", value: time },
    { label: "校区", value: item.area },
    { label: "考场", value: item.classroom },
    {
      label: "座位",
      value: item.seat
        ? `${item.seat} 号座`
        : null,
    },
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
