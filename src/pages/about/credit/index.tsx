import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { CREDITS } from "@/pages/about/model/credit"
import { cn } from "@/utils/cn"

/** 开源许可 */
export default function Credit(): ReactNode {
  return (
    <Page title="开源许可">
      <Main>
        <Scroll>
          <View className="flex flex-col gap-3 py-1r">
            <Text className="px-1 text-xs text-soft">
              本项目基于以下开源项目构建, 感谢作者与社区.
            </Text>

            {CREDITS.map(section => (
              <View key={section.title} className="flex flex-col gap-1">
                <Text className="px-1 text-xs text-soft">{section.title}</Text>
                <Card className="overflow-hidden border border-default p-0">
                  {section.items.map((item, index) => (
                    <View
                      key={item.name}
                      className={cn(
                        "flex flex-col gap-1 px-4 py-3",
                        index < section.items.length - 1 && "border-b border-default",
                      )}
                    >
                      <View className="flex items-baseline gap-2">
                        <Text className="flex-1 text-sm text-strong">{item.name}</Text>
                        <Text className="shrink-0 text-xs text-soft">{item.license}</Text>
                      </View>
                      <Text className="text-xs text-soft">{item.description}</Text>
                    </View>
                  ))}
                </Card>
              </View>
            ))}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
