import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Tabbar from "@/components/layout/tabbar"
import { navigate } from "@/utils/navigate"

export default function Home(): ReactNode {
  return (
    <Page>
      <Main className="py-1r">
        <View className="flex-1 flex flex-col items-center justify-center gap-2">
          <Text className="text-soft">home</Text>
          <Button
            variant="outline"
            color="primary"
            className="px-2h py-1h"
            onClick={() => navigate("/packages/debug/pages/theme/index")}
          >
            <Text>主题调试</Text>
          </Button>
          <Button
            variant="outline"
            className="px-2h py-1h"
            onClick={() => navigate("/packages/debug/pages/comp/index")}
          >
            <Text>组件调试</Text>
          </Button>
        </View>
      </Main>
      <Tabbar />
    </Page>
  )
}
