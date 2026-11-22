import type { GradeDetailItem, GradeItem } from "@contract/routes"
import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Cell from "@/components/common/cell"
import Composition from "@/pages/tools/grade/components/composition"
import { infoRowsOf } from "@/pages/tools/grade/model/grade"

/** 成绩详情, 概览与成绩组成两个列表 */
export default function Detail({ item, data, loading }: Readonly<{
  item: GradeItem
  data: readonly GradeDetailItem[] | undefined
  loading: boolean
}>): ReactNode {
  return (
    <View className="mt-2 flex flex-col gap-2">
      <View className="overflow-hidden rounded-md border border-default">
        {infoRowsOf(item).map((row, index, rows) => (
          <Cell
            key={row.label}
            title={row.label}
            description={row.value}
            border={index < rows.length - 1}
          />
        ))}
      </View>

      <View className="overflow-hidden rounded-md border border-default">
        <Composition item={item} data={data} loading={loading} />
      </View>
    </View>
  )
}
