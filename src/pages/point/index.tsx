import type { ReactNode } from "react"
import type { PointTab } from "@/pages/point/model/point"
import { View } from "@tarojs/components"
import { useState } from "react"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Records from "@/pages/point/components/records"
import Rules from "@/pages/point/components/rules"
import Shop from "@/pages/point/components/shop"
import Summary from "@/pages/point/components/summary"
import Tabs from "@/pages/point/components/tabs"
import { usePointInfo } from "@/pages/point/hooks/info"

/** 积分中心 */
export default function Point(): ReactNode {
  const { info, checking, check } = usePointInfo()
  const [tab, setTab] = useState<PointTab>("record")

  return (
    <Page title="积分中心">
      <Main>
        <View className="flex flex-col gap-2 pt-1r pb-2">
          <Summary info={info} checking={checking} onCheck={check} />
          <Tabs value={tab} onChange={setTab} />
        </View>

        {tab === "record" && <Records />}
        {tab === "shop" && <Shop value={info?.value ?? 0} />}
        {tab === "rule" && <Rules />}
      </Main>
    </Page>
  )
}
