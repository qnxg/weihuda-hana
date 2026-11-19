import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { PAGE } from "@/config/page"
import { navigateTo } from "@/utils/navigate"

/** 页面入口 */
const pages = [
  { text: "首页", path: PAGE.home },
  { text: "工具箱", path: PAGE.kit },
  { text: "课表", path: PAGE.table },
  { text: "我的", path: PAGE.profile },
  { text: "鉴权(登录)", path: PAGE.auth },
  { text: "鉴权(账号验证)", path: `${PAGE.auth}?mode=verify` },
]

/** 调试页入口 */
const entries = [
  { text: "主题", path: PAGE.debug.theme },
  { text: "组件", path: PAGE.debug.comp },
  { text: "表单", path: PAGE.debug.form },
  { text: "鉴权", path: PAGE.debug.auth },
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
            onClick={() => navigateTo(path)}
          />
        ))}
      </Card>
    </View>
  )
}

export default function DebugIndex(): ReactNode {
  return (
    <Page title="调试">
      <Main className="py-1r">
        <View className="flex flex-col gap-3">
          <Group title="页面" items={pages} />
          <Group title="调试页" items={entries} />
        </View>
      </Main>
    </Page>
  )
}
