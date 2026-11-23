import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { useAnnouncement } from "@/pages/announcement/hooks/detail"
import { dateTimeOf, sectionsOf } from "@/pages/announcement/model/announcement"

/** 公告详情 */
export default function AnnouncementDetail(): ReactNode {
  const { params } = useRouter()
  const { item, loading, refreshing, refresh } = useAnnouncement(params.id ?? "")

  function content(): ReactNode {
    if (loading && !item)
      return <Text className="py-8r text-center text-sm text-soft">加载中</Text>

    if (!item)
      return <Text className="py-8r text-center text-sm text-soft">公告不存在</Text>

    return (
      <View className="flex flex-col gap-2 py-1r">
        <Text className="text-base text-strong">{item.title}</Text>
        <Text className="text-xs text-soft">{dateTimeOf(item)}</Text>
        <View className="mt-1 flex flex-col gap-2">
          {sectionsOf(item.content).map(section => (
            <Text key={section.key} className="text-sm text-default">{section.text}</Text>
          ))}
        </View>
      </View>
    )
  }

  return (
    <Page title="公告详情">
      <Main>
        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          {content()}
        </Scroll>
      </Main>
    </Page>
  )
}
