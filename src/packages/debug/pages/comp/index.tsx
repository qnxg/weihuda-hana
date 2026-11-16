import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { House, Settings } from "lucide-react-taro"
import { useState } from "react"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Icon from "@/components/common/icon"
import Scroll from "@/components/common/scroll"
import Skeleton from "@/components/common/skeleton"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { sleep } from "@/utils/sleep"

/** 按钮的通用尺寸 */
const buttonClass = "px-3 py-2 text-sm"

export default function CompDebug(): ReactNode {
  const [refreshing, setRefreshing] = useState(false)

  const refresh = async () => {
    setRefreshing(true)
    await sleep(1000)
    setRefreshing(false)
  }

  return (
    <Page>
      <Main className="p-4">
        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3">
            <View className="flex flex-col gap-2">
              <Text className="text-strong">按钮</Text>

              <Card className="p-3 flex flex-col gap-3">
                <View className="flex gap-2">
                  <Button className={buttonClass}>主要</Button>
                  <Button variant="outline" className={buttonClass}>次要</Button>
                  <Button variant="ghost" className={buttonClass}>文字</Button>
                </View>

                <View className="flex gap-2">
                  <Button color="error" className={buttonClass}>危险</Button>
                  <Button variant="outline" color="error" className={buttonClass}>危险</Button>
                  <Button variant="outline" color="ink" className={buttonClass}>中性</Button>
                </View>

                <View className="flex gap-2">
                  <Button icon={<Icon icon={House} className="h-1r w-1r" />} className={buttonClass}>图标</Button>
                  <Button loading className={buttonClass}>加载</Button>
                  <Button icon={<Icon icon={Settings} className="h-1r w-1r" />} loading className={buttonClass}>加载</Button>
                </View>

                <Button disabled className={buttonClass}>禁用</Button>
                <Button className={`${buttonClass} w-full`}>块级</Button>
              </Card>
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-strong">列表项</Text>

              <Card className="p-3 overflow-hidden">
                <Cell title="标题" description="值" />
                <Cell
                  title="可点击"
                  description="值"
                  link
                  onClick={() => {
                  }}
                />
                <Cell
                  title="带图标"
                  icon={<Icon icon={House} className="h-1r w-1r" />}
                  description="值"
                />
                <Cell
                  title="主色"
                  icon={<Icon icon={House} className="h-1r w-1r" />}
                  color="primary"
                  description="值"
                />
                <Cell
                  title="错误色"
                  icon={<Icon icon={Settings} className="h-1r w-1r" />}
                  color="error"
                  description="值"
                />
                <Cell
                  title="下方内容"
                  description="值"
                  border={false}
                >
                  <View className="p-2 bg-default rounded">
                    <Text className="text-xs text-soft">children 区域</Text>
                  </View>
                </Cell>
              </Card>
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-strong">骨架屏</Text>

              <Card className="p-4 flex flex-col gap-2">
                <View className="flex items-center gap-2">
                  <Skeleton className="h-2r w-2r rounded-full" />
                  <View className="flex-1 flex flex-col gap-1">
                    <Skeleton className="h-1r w-full" />
                    <Skeleton className="h-1r w-6" />
                  </View>
                </View>
                <Skeleton className="h-2r w-full" />
                <Skeleton className="h-2r w-full" />
                <Skeleton animated={false} className="h-2r w-full" />
              </Card>
            </View>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
