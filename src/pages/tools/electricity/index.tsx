import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Balance from "@/pages/tools/electricity/components/balance"
import { useElectricity } from "@/pages/tools/electricity/hooks/electricity"

/** 宿舍用电 */
export default function Electricity(): ReactNode {
  const { dorm, balance, loading, syncing, refresh } = useElectricity()
  const [pulling, setPulling] = useState(false)

  const rows = dorm
    ? [
        { label: "园区", value: dorm.park },
        { label: "楼栋", value: dorm.build },
        { label: "房间", value: dorm.room },
      ]
    : []

  function pull(): void {
    if (pulling || syncing)
      return

    setPulling(true)
    void refresh().finally(() => setPulling(false))
  }

  return (
    <Page title="宿舍用电">
      <Main>
        <Scroll refresh refreshing={pulling} onRefresh={pull}>
          <View className="flex flex-col gap-2 py-1r">
            <Card className="flex flex-col gap-2 border border-default p-3">
              <Text className="text-sm text-strong">宿舍信息</Text>

              {rows.length === 0
                ? <Text className="py-4 text-center text-sm text-soft">加载中</Text>
                : rows.map((item, index) => (
                    <View
                      key={item.label}
                      className={index < rows.length - 1
                        ? "flex items-center gap-2 border-b border-default pb-1"
                        : "flex items-center gap-2"}
                    >
                      <Text className="flex-1 text-sm text-default">{item.label}</Text>
                      <Text className="text-sm text-soft">{item.value}</Text>
                    </View>
                  ))}
            </Card>

            <Balance balance={balance} loading={loading} refreshing={syncing} onRefresh={refresh} />

            <Text className="px-1 text-xs text-soft">电量由上游系统同步, 数据可能存在延迟.</Text>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
