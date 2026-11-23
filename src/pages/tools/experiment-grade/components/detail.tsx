import type { ExperimentGradeItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Cell from "@/components/common/cell"
import { attendanceOf } from "@/pages/tools/experiment-grade/model/lab"

/** 实验成绩详情, 概览与明细两个列表 */
export default function Detail({ item }: Readonly<{ item: ExperimentGradeItem }>): ReactNode {
  const attendance = attendanceOf(item.attendance)
  const score = item.score.trim() || "待发布"
  const rows = [
    { label: "出勤", value: attendance },
    { label: "实验成绩", value: score },
  ]

  return (
    <View className="mt-2 flex flex-col gap-2">
      <View className="overflow-hidden rounded-md border border-default">
        {rows.map((row, index, list) => (
          <Cell
            key={row.label}
            title={row.label}
            description={row.value}
            border={index < list.length - 1}
          />
        ))}
      </View>

      <View className="overflow-hidden rounded-md border border-default">
        {item.details.length > 0
          ? item.details.map((entry, index, list) => (
              <Cell
                key={entry.name}
                title={entry.name}
                description={entry.score === null
                  ? "待发布"
                  : String(entry.score)}
                border={index < list.length - 1}
              />
            ))
          : (
              <View className="p-3">
                <Text className="text-sm text-soft">暂无成绩明细</Text>
              </View>
            )}
      </View>
    </View>
  )
}
