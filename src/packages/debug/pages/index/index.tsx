import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { navigate } from "@/utils/navigate"

/** 调试页入口 */
const entries = [
  { text: "主题", path: "/packages/debug/pages/theme/index" },
  { text: "组件", path: "/packages/debug/pages/comp/index" },
  { text: "表单", path: "/packages/debug/pages/form/index" },
]

export default function DebugIndex(): ReactNode {
  return (
    <Page>
      <Main className="py-1r">
        <View className="flex flex-col gap-2">
          <Text className="text-strong">调试页</Text>

          <Card className="overflow-hidden">
            {entries.map(({ text, path }, index) => (
              <Cell
                key={path}
                title={text}
                link
                border={index < entries.length - 1}
                onClick={() => navigate(path)}
              />
            ))}
          </Card>
        </View>
      </Main>
    </Page>
  )
}
