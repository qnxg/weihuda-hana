import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { navigate } from "@/utils/navigate"

/** 页面入口 */
const pages = [
  { text: "首页", path: "/pages/home/index" },
  { text: "工具箱", path: "/pages/kit/index" },
  { text: "课表", path: "/pages/table/index" },
  { text: "我的", path: "/pages/profile/index" },
  { text: "鉴权(登录)", path: "/pages/auth/index" },
  { text: "鉴权(账号验证)", path: "/pages/auth/index?mode=verify" },
]

/** 调试页入口 */
const entries = [
  { text: "主题", path: "/packages/debug/pages/theme/index" },
  { text: "组件", path: "/packages/debug/pages/comp/index" },
  { text: "表单", path: "/packages/debug/pages/form/index" },
]

/** 列表 */
function Group({ title, items }: Readonly<{ title: string, items: { text: string, path: string }[] }>): ReactNode {
  return (
    <View className="flex flex-col gap-2">
      <Text className="text-strong">{title}</Text>

      <Card className="overflow-hidden">
        {items.map(({ text, path }, index) => (
          <Cell
            key={path}
            title={text}
            link
            border={index < items.length - 1}
            onClick={() => navigate(path)}
          />
        ))}
      </Card>
    </View>
  )
}

export default function DebugIndex(): ReactNode {
  return (
    <Page>
      <Main className="py-1r">
        <View className="flex flex-col gap-3">
          <Group title="页面" items={pages} />
          <Group title="调试页" items={entries} />
        </View>
      </Main>
    </Page>
  )
}
