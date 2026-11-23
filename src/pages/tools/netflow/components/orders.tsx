import type { NetflowOrderItem } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import Popup from "@/components/modal/popup"
import { useNetflowOrders } from "@/pages/tools/netflow/hooks/orders"
import { timeOf } from "@/pages/tools/netflow/model/netflow"
import { cn } from "@/utils/cn"

/** 历史账单 */
export default function Orders(): ReactNode {
  const { list, loading, refreshing, refresh } = useNetflowOrders()
  const [selected, setSelected] = useState<NetflowOrderItem | null>(null)
  const month = selected
    ? `${selected.year} 年 ${selected.month} 月`
    : ""
  const amount = selected
    ? selected.amount > 0
      ? `${selected.amount} 元`
      : "无费用"
    : ""
  const updated = selected
    ? timeOf(selected.updatedAt)
    : ""
  const rows = selected
    ? [
        { label: "月份", value: month },
        { label: "下载", value: selected.download },
        { label: "上传", value: selected.upload },
        { label: "超出", value: selected.over },
        { label: "需缴费用", value: amount },
        { label: "更新时间", value: updated },
      ]
    : []

  return (
    <>
      <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
        <View className="flex flex-col gap-2 pb-1r">
          {loading && list.length === 0 && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
          {!loading && list.length === 0 && (
            <Text className="py-8r text-center text-sm text-soft">暂无历史账单</Text>
          )}
          {list.map(item => (
            <Card
              key={`${item.year}-${item.month}`}
              className="flex flex-col gap-1 border border-default p-3"
              onClick={() => setSelected(item)}
            >
              <View className="flex items-center gap-2">
                <Text className="flex-1 text-sm text-strong">{`${item.year} 年 ${item.month} 月`}</Text>
                <Text className={cn("shrink-0 text-sm", item.amount > 0
                  ? "text-error"
                  : "text-soft")}
                >
                  {item.amount > 0
                    ? `${item.amount} 元`
                    : "无费用"}
                </Text>
              </View>
              <Text className="text-xs text-soft">
                {`下载 ${item.download} | 上传 ${item.upload} | 超出 ${item.over}`}
              </Text>
              <Text className="text-xs text-soft">{`更新于 ${timeOf(item.updatedAt)}`}</Text>
            </Card>
          ))}
        </View>
      </Scroll>

      <Popup
        visible={selected !== null}
        title={selected
          ? `${month}账单`
          : ""}
        onClose={() => setSelected(null)}
        className="p-1r"
      >
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
