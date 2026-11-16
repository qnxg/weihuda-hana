import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Tabbar from "@/components/layout/tabbar"
import { navigate } from "@/utils/navigate"

export default function Home(): ReactNode {
  return (
    <Page>
      <Main>
        <View className="flex-1 flex flex-col items-center justify-center gap-2">
          <Text className="text-soft">home</Text>
          <View
            className="p-2 border border-primary"
            onClick={() => navigate("/packages/debug/pages/theme/index")}
          >
            <Text className="text-primary text-xs">主题调试</Text>
          </View>
        </View>
      </Main>
      <Tabbar />
    </Page>
  )
}
