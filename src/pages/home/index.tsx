import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"

export default function Home(): ReactNode {
  return (
    <Page tabbar>
      <Main className="py-1r">
        <View className="flex-1 flex flex-col items-center justify-center gap-2">
          <Text className="text-soft">home</Text>
        </View>
      </Main>
    </Page>
  )
}
