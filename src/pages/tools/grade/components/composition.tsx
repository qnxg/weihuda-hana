import type { GradeDetailItem, GradeItem } from "@contract/routes"
import type { ReactNode } from "react"
import Cell from "@/components/common/cell"
import DetailText from "@/pages/tools/grade/components/detail-text"

/** 成绩组成 */
export default function Composition({ item, data, loading }: Readonly<{
  item: GradeItem
  data: readonly GradeDetailItem[] | undefined
  loading: boolean
}>): ReactNode {
  if (item.detailId === null || (!loading && (!data || data.length === 0)))
    return <DetailText text="暂无成绩组成" />

  if (loading)
    return <DetailText text="加载中" />

  return (
    <>
      {data?.map((entry, index, rows) => (
        <Cell
          key={entry.name}
          title={entry.name}
          description={`${entry.score} | ${entry.percentage}`}
          border={index < rows.length - 1}
        />
      ))}
    </>
  )
}
