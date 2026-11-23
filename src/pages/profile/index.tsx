import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useDidShow } from "@tarojs/taro"
import { Bell, Info, MessageSquare, Settings, Trophy, UserRound } from "lucide-react-taro"
import { useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Icon from "@/components/common/icon"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { PAGE } from "@/config/page"
import { queryClient } from "@/hooks/query"
import { useUser } from "@/hooks/user"
import { useSummary } from "@/pages/profile/hooks/summary"
import { clearToken, hasToken } from "@/utils/auth"
import { clearQueryCache } from "@/utils/cache"
import { cn } from "@/utils/cn"
import { navigateTo } from "@/utils/navigate"
import { toast } from "@/utils/toast"

/** 跳转入口 */
const NAV = [
  { key: "notice", title: "消息通知", icon: Bell },
  { key: "point", title: "积分中心", icon: Trophy },
  { key: "feedback", title: "问题反馈", icon: MessageSquare },
  { key: "settings", title: "小程序设置", icon: Settings },
  { key: "about", title: "关于", icon: Info },
] as const

/** 概览 */
function Stats(): ReactNode {
  const { points, mails, balance } = useSummary()
  const items = [
    {
      key: "point",
      label: "积分",
      value: points === undefined
        ? "--"
        : String(points),
    },
    {
      key: "mail",
      label: "未读邮件",
      value: mails === undefined
        ? "--"
        : String(mails),
    },
    {
      key: "card",
      label: "校园卡",
      value: balance === undefined
        ? "--"
        : `¥${balance.toFixed(2)}`,
    },
  ]

  return (
    <Card className="flex overflow-hidden border border-default p-0">
      {items.map((item, index) => (
        <View
          key={item.key}
          className={cn(
            "flex flex-1 flex-col items-center gap-1 py-3",
            index < items.length - 1 && "border-r border-default",
          )}
        >
          <Text className="text-lg text-strong">{item.value}</Text>
          <Text className="text-xs text-soft">{item.label}</Text>
        </View>
      ))}
    </Card>
  )
}

/** 我的 */
export default function Profile(): ReactNode {
  const [signed, setSigned] = useState(hasToken)
  const { user } = useUser()

  useDidShow(() => setSigned(hasToken()))

  const name = !signed
    ? "未登录"
    : user
      ? user.name
      : "加载中"
  const detail = !signed
    ? "登录后同步课表与成绩"
    : user
      ? `学号 ${user.id}`
      : ""

  async function logout(): Promise<void> {
    try {
      await api.auth.logout()
    }
    catch {
      toast.error("退出失败")
    }
    finally {
      clearToken()
      clearQueryCache(queryClient)
      setSigned(false)
    }
  }

  return (
    <Page tabbar title="我的" back={false}>
      <Main>
        <Scroll>
          <View className="flex flex-col gap-3 py-1r">
            <Card className="flex items-center gap-3 border border-default p-3">
              <View className="flex h-4r w-4r shrink-0 items-center justify-center rounded-full bg-primary">
                <Icon icon={UserRound} color="primary" className="h-2r w-2r" />
              </View>
              <View className="flex flex-1 flex-col gap-1">
                <Text className="text-base text-strong">{name}</Text>
                <Text className="text-xs text-soft">{detail}</Text>
              </View>
              {!signed && (
                <Button className="rounded-full px-3 py-1 text-sm" onClick={() => navigateTo(PAGE.auth.login)}>
                  <Text>登录</Text>
                </Button>
              )}
            </Card>

            <Stats />

            <Card className="overflow-hidden border border-default p-0">
              {NAV.map(({ key, title, icon }, index) => (
                <Cell
                  key={key}
                  title={title}
                  icon={<Icon icon={icon} className="h-1r w-1r" />}
                  border={index < NAV.length - 1}
                  link
                  onClick={() => navigateTo(key === "notice"
                    ? PAGE.announcement.list
                    : PAGE.debug.index)}
                />
              ))}
            </Card>

            <Card className="overflow-hidden border border-default p-0">
              <Cell
                title="清除缓存"
                border={signed}
                onClick={() => {
                  clearQueryCache(queryClient)
                  toast.success("已清除缓存")
                }}
              />
              {signed && (
                <Cell
                  title="退出登录"
                  color="error"
                  border={false}
                  onClick={() => void logout()}
                />
              )}
            </Card>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
