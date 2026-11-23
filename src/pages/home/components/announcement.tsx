import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { createSelectorQuery, nextTick } from "@tarojs/taro"
import { Bell, X } from "lucide-react-taro"
import { useEffect, useState } from "react"
import Icon from "@/components/common/icon"
import { DURATION } from "@/config/duration"
import { PAGE } from "@/config/page"
import { useAnnouncements } from "@/pages/home/hooks/announcement"
import { navigateTo } from "@/utils/navigate"

/** 循环时的分隔符 */
const SEPARATOR = " | "
/** 内容容器 class, 供选择器使用 */
const BOX = "announcement-box"
/** 文本 class, 供选择器使用 */
const TEXT = "announcement-text"

/** 公告滚字, 只展示最近一条未读, 删除即标为已读 */
export default function Announcement(): ReactNode {
  const { list, mark } = useAnnouncements()
  const item = list.find(entry => !entry.read)
  const title = item?.title
  const [measured, setMeasured] = useState<{ title: string, width: number } | null>(null)
  const scrolling = measured !== null && measured.title === title

  useEffect(() => {
    if (!title)
      return

    let cancelled = false

    nextTick(() => {
      if (cancelled)
        return

      createSelectorQuery()
        .select(`.${BOX}`)
        .boundingClientRect()
        .select(`.${TEXT}`)
        .boundingClientRect()
        .exec((result: unknown[]) => {
          const box = result[0] as { width: number } | null
          const text = result[1] as { width: number } | null

          if (cancelled || !box || !text || text.width <= box.width)
            return

          setMeasured({ title, width: text.width })
        })
    })

    return () => {
      cancelled = true
    }
  }, [title])

  if (!item || !title)
    return null

  const line = scrolling
    ? `${title}${SEPARATOR}`
    : title
  const duration = Math.max(DURATION.marquee.min, Math.round((measured?.width ?? 0) * DURATION.marquee.speed))
  const content = `${TEXT} whitespace-nowrap text-xs text-soft`

  return (
    <View
      className="flex items-center gap-1 rounded-md border border-default bg-strong px-1h py-1h"
      onClick={() => navigateTo(PAGE.announcement.detail, { id: item.id })}
    >
      <View className="relative shrink-0">
        <Icon icon={Bell} color="primary" className="h-2h w-2h" />
      </View>
      <View className={`${BOX} flex-1 overflow-hidden`}>
        {scrolling
          ? (
              <View className="marquee inline-flex" style={{ animationDuration: `${duration}ms` }}>
                <Text className={content}>{line}</Text>
                <Text className={content}>{line}</Text>
              </View>
            )
          : <Text className={content}>{line}</Text>}
      </View>
      <View
        className="flex h-3h w-3h shrink-0 items-center justify-center"
        onClick={(event) => {
          event.stopPropagation()
          mark(item.id)
        }}
      >
        <Icon icon={X} className="h-2h w-2h" />
      </View>
    </View>
  )
}
