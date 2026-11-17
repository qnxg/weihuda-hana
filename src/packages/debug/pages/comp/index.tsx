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
import Alert from "@/components/modal/alert"
import Dialog from "@/components/modal/dialog"
import Popup from "@/components/modal/popup"
import { sleep } from "@/utils/sleep"

/** 按钮的通用尺寸 */
const buttonClass = "px-3 py-2 text-sm"

export default function CompDebug(): ReactNode {
  const [refreshing, setRefreshing] = useState(false)
  const [popup, setPopup] = useState(false)
  const [alert, setAlert] = useState(false)
  const [dialog, setDialog] = useState(false)

  const refresh = async () => {
    setRefreshing(true)
    await sleep(1000)
    setRefreshing(false)
  }

  return (
    <Page>
      <Main>
        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="py-1r flex flex-col gap-3">
            <View className="flex flex-col gap-2">
              <Text className="text-strong">按钮</Text>

              <Card className="flex flex-col gap-3">
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

              <Card className="overflow-hidden">
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

              <Card className="flex flex-col gap-2">
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

            <View className="flex flex-col gap-2">
              <Text className="text-strong">底部弹出</Text>

              <Card className="flex flex-col gap-3">
                <Button className={buttonClass} onClick={() => setPopup(true)}>打开</Button>
              </Card>
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-strong">确认框</Text>

              <Card className="flex flex-col gap-3">
                <Button className={buttonClass} color="error" onClick={() => setAlert(true)}>打开</Button>
              </Card>
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-strong">居中弹窗</Text>

              <Card className="flex flex-col gap-3">
                <Button className={buttonClass} onClick={() => setDialog(true)}>打开</Button>
              </Card>
            </View>
          </View>
        </Scroll>
      </Main>

      <Popup title="底部弹出" visible={popup} onClose={() => setPopup(false)} className="gap-1r">
        <Text className="text-sm text-soft">点遮罩或右上角关闭, 退场动画结束后才从模态层移除</Text>
        <Button className={`${buttonClass} w-full`} onClick={() => setPopup(false)}>关闭</Button>
      </Popup>

      <Alert
        visible={alert}
        icon={<Icon icon={House} className="h-1r w-1r" />}
        color="error"
        title="确认框"
        confirmText="确定"
        cancelText="取消"
        onConfirm={() => setAlert(false)}
        onCancel={() => setAlert(false)}
      >
        <Text className="text-sm text-soft">居中弹窗, 点遮罩等同取消</Text>
      </Alert>

      <Dialog
        visible={dialog}
        title="居中弹窗"
        closeable={false}
        onClose={() => setDialog(false)}
        footer={<Button className="flex-1 py-1" onClick={() => setDialog(false)}>知道了</Button>}
      >
        <Text className="text-sm text-soft">标题与右上角关闭在头部, 底部由 footer 传入</Text>
      </Dialog>
    </Page>
  )
}
