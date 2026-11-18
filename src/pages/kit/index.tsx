import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"

export default function Kit(): ReactNode {
  return (
    <Page tabbar title="工具箱" back={false}>
      <Main className="py-1r">
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-soft">kit</Text>
        </View>
      </Main>
    </Page>
  )
}
