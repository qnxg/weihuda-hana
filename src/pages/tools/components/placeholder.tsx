import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"

/** 工具页占位 */
export default function Placeholder({ title }: Readonly<{ title: string }>): ReactNode {
  return (
    <Page title={title}>
      <Main>
        <View className="flex flex-1 items-center justify-center">
          <Text className="text-sm text-soft">待接入</Text>
        </View>
      </Main>
    </Page>
  )
}
