import type { ReactNode } from "react"
import type { NavigateParams } from "@/utils/navigate"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { PAGE } from "@/config/page"
import { navigateTo } from "@/utils/navigate"

/** 附加按钮 */
interface Action {
  /** 文案 */
  text: string
  /** 路径 */
  path: string
  /** 参数 */
  params?: NavigateParams
}

/** 页面入口 */
interface Item {
  /** 文案 */
  text: string
  /** 路径 */
  path: string
  /** 附加按钮 */
  actions?: readonly Action[]
}

/** 页面入口 */
const pages: Item[] = [
  { text: "首页", path: PAGE.home },
  { text: "工具箱", path: PAGE.kit },
  {
    text: "课表",
    path: PAGE.table.index,
    actions: [
      { text: "课表", path: PAGE.table.timetable },
      { text: "无课表", path: PAGE.table.extra },
      { text: "日程", path: PAGE.table.schedule },
    ],
  },
  {
    text: "表单",
    path: PAGE.form.index,
    actions: [
      { text: "课程", path: PAGE.form.course },
      { text: "待办", path: PAGE.form.todo },
    ],
  },
  {
    text: "公告",
    path: PAGE.announcement.list,
    actions: [
      {
        text: "详情 1",
        path: PAGE.announcement.detail,
        params: {
          id: 1,
        },
      },
    ],
  },
  { text: "我的", path: PAGE.profile },
  { text: "积分中心", path: PAGE.point },
  {
    text: "鉴权",
    path: PAGE.auth.index,
    actions: [
      { text: "登录", path: PAGE.auth.login },
      { text: "账号验证", path: PAGE.auth.verify },
      { text: "大物绑定", path: PAGE.auth.lab },
    ],
  },
]

/** 调试页入口 */
const entries: Item[] = [
  { text: "主题", path: PAGE.debug.theme },
  { text: "组件", path: PAGE.debug.comp },
  { text: "表单", path: PAGE.debug.form },
  { text: "鉴权", path: PAGE.debug.auth },
]

/** 列表 */
function Group({ title, items }: Readonly<{ title: string, items: readonly Item[] }>): ReactNode {
  return (
    <View className="flex flex-col gap-2">
      <Text className="text-strong">{title}</Text>

      <Card className="overflow-hidden">
        {items.map(({ text, path, actions }, index) => (
          <Cell
            key={path}
            title={text}
            link
            border={index < items.length - 1}
            onClick={() => navigateTo(path)}
          >
            {actions && (
              <View className="flex gap-2">
                {actions.map(action => (
                  <Button
                    key={action.text}
                    variant="outline"
                    color="ink"
                    className="flex-1 py-1 text-xs"
                    onClick={(event) => {
                      event.stopPropagation()
                      navigateTo(action.path, action.params)
                    }}
                  >
                    <Text>{action.text}</Text>
                  </Button>
                ))}
              </View>
            )}
          </Cell>
        ))}
      </Card>
    </View>
  )
}

export default function DebugIndex(): ReactNode {
  return (
    <Page title="调试">
      <Main>
        <Scroll>
          <View className="flex flex-col gap-3 py-1r">
            <Group title="调试页" items={entries} />
            <Group title="页面" items={pages} />
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
