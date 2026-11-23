import type { ReactNode } from "react"
import type { NetflowTab } from "@/pages/tools/netflow/components/tabs"
import { View } from "@tarojs/components"
import { useState } from "react"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Detail from "@/pages/tools/netflow/components/detail"
import Orders from "@/pages/tools/netflow/components/orders"
import Summary from "@/pages/tools/netflow/components/summary"
import Tabs from "@/pages/tools/netflow/components/tabs"
import { useNetflowSummary } from "@/pages/tools/netflow/hooks/summary"

/** 校园网 */
export default function Netflow(): ReactNode {
  const { data } = useNetflowSummary()
  const [tab, setTab] = useState<NetflowTab>("detail")

  return (
    <Page title="校园网">
      <Main>
        <View className="flex flex-col gap-2 pt-1r pb-2">
          <Summary data={data} />
          <Tabs value={tab} onChange={setTab} />
        </View>

        {tab === "detail"
          ? <Detail />
          : <Orders />}
      </Main>
    </Page>
  )
}
