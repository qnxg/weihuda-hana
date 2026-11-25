import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { PRIVACY, PRIVACY_UPDATED } from "@/pages/about/model/privacy"

/** 隐私政策 */
export default function Privacy(): ReactNode {
  return (
    <Page title="隐私政策">
      <Main>
        <Scroll>
          <View className="flex flex-col gap-3 py-1r">
            <Text className="px-1 text-xs text-soft">{`更新日期 ${PRIVACY_UPDATED}`}</Text>

            {PRIVACY.map(section => (
              <View key={section.title} className="flex flex-col gap-1">
                <Text className="px-1 text-xs text-soft">{section.title}</Text>
                <Card className="flex flex-col gap-2 border border-default p-3">
                  {section.paragraphs.map(paragraph => (
                    <Text key={paragraph} className="text-sm text-default">
                      {paragraph}
                    </Text>
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
