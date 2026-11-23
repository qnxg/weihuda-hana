import type { AnnouncementItem } from "@contract/routes"
import type { ReactNode } from "react"
import type { ListFilter } from "@/pages/announcement/components/tabs"
import { Text, View } from "@tarojs/components"
import { ArrowUpDown } from "lucide-react-taro"
import { useMemo, useState } from "react"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { PAGE } from "@/config/page"
import Row from "@/pages/announcement/components/row"
import Tabs from "@/pages/announcement/components/tabs"
import { useAnnouncementList } from "@/pages/announcement/hooks/list"
import { hasToken } from "@/utils/auth"
import { navigateTo } from "@/utils/navigate"

/** 列表排序 */
type ListSort = "time" | "unread"

/** 公告列表 */
export default function AnnouncementList(): ReactNode {
  const { list, loading, unread, refreshing, marking, refresh, readAll } = useAnnouncementList()
  const [filter, setFilter] = useState<ListFilter>("all")
  const [sort, setSort] = useState<ListSort>("time")

  const visible = useMemo(() => {
    const filtered = filter === "unread"
      ? list.filter(item => !item.read)
      : list

    return sort === "unread"
      ? [
          ...filtered,
        ].sort((a, b) => Number(a.read) - Number(b.read) || b.createdAt.localeCompare(a.createdAt))
      : filtered
  }, [
    filter,
    list,
    sort,
  ])

  function open(item: AnnouncementItem): void {
    navigateTo(PAGE.announcement.detail, { id: item.id })
  }

  function markAll(): void {
    if (!hasToken()) {
      navigateTo(PAGE.auth.login)
      return
    }

    readAll()
  }

  function toggleSort(): void {
    setSort(sort === "time"
      ? "unread"
      : "time")
  }

  return (
    <Page title="公告">
      <Main>
        <View className="flex items-center gap-2 pt-1r pb-2">
          <Tabs value={filter} onChange={setFilter} />
          <Button
            variant="outline"
            color="ink"
            className="shrink-0 rounded-full px-2 py-1 text-xs"
            icon={<Icon icon={ArrowUpDown} className="h-3 w-3" />}
            onClick={toggleSort}
          >
            <Text>
              {sort === "time"
                ? "按时间"
                : "按未读"}
            </Text>
          </Button>
          <View className="flex-1" />
          <Button
            variant="ghost"
            color="primary"
            className="shrink-0 px-1 py-0 text-xs"
            loading={marking}
            disabled={!unread}
            onClick={markAll}
          >
            <Text>全部已读</Text>
          </Button>
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-2 pb-1r">
            {loading && visible.length === 0 && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
            {!loading && visible.length === 0 && (
              <Text className="py-8r text-center text-sm text-soft">
                {filter === "unread"
                  ? "暂无未读公告"
                  : "暂无公告"}
              </Text>
            )}
            {visible.map(item => (
              <Row key={item.id} item={item} onSelect={open} />
            ))}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
