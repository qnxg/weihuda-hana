import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Demo from "@/pages/home/components/demo"
import { RefreshProvider } from "@/pages/home/contexts/refresh"
import { useRefresh } from "@/pages/home/hooks/refresh"

function Content(): ReactNode {
  const { refreshing, refresh } = useRefresh()

  return (
    <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
      <View className="flex flex-col gap-1r py-1r">
        <Demo />
      </View>
    </Scroll>
  )
}

export default function Home(): ReactNode {
  return (
    <Page tabbar title="首页" back={false}>
      <Main>
        <RefreshProvider>
          <Content />
        </RefreshProvider>
      </Main>
    </Page>
  )
}
