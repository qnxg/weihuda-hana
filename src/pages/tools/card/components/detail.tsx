import type { CardRecordItem } from "@contract/routes"
import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Cell from "@/components/common/cell"
import { amountOf, moneyOf } from "@/pages/tools/card/model/card"

/** 流水详情 */
export default function Detail({ item }: Readonly<{ item: CardRecordItem }>): ReactNode {
  const amount = amountOf(item.amount)
  const balance = moneyOf(item.balance)
  const id = String(item.id)
  const rows: { label: string, value: string | null }[] = [
    { label: "交易时间", value: item.tradedAt },
    { label: "记账时间", value: item.recordedAt },
    { label: "交易地点", value: item.location },
    { label: "交易金额", value: amount },
    { label: "交易后余额", value: balance },
    { label: "交易状态", value: item.status },
    { label: "流水号", value: id },
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
