import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Tabbar from "@/components/layout/tabbar"

export default function Table(): ReactNode {
  return (
    <Page>
      <Main className="py-1r">
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-soft">table</Text>
        </View>
      </Main>
      <Tabbar />
    </Page>
  )
}
