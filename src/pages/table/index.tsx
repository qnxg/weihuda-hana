import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"

export default function Table(): ReactNode {
  return (
    <Page tabbar>
      <Main className="py-1r">
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-soft">table</Text>
        </View>
      </Main>
    </Page>
  )
}
