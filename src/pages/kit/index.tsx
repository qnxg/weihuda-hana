import type { ReactNode } from "react"
import type { ToolGroup, ToolItem } from "@/pages/kit/config/tool"
import { Text, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import Scroll from "@/components/common/scroll"
import Search from "@/components/form/search"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Empty from "@/pages/kit/components/empty"
import Group from "@/pages/kit/components/group"
import { TOOL_GROUP, TOOLS } from "@/pages/kit/config/tool"
import { cn } from "@/utils/cn"

/** 筛选项 */
type Filter = ToolGroup | "all"

/** 筛选项列表 */
const FILTERS: readonly { key: Filter, title: string }[] = [
  { key: "all", title: "全部工具" },
  ...(Object.keys(TOOL_GROUP) as ToolGroup[]).map(key => ({ key, title: TOOL_GROUP[key] })),
]

/** 匹配工具 */
function matches(item: ToolItem, keyword: string): boolean {
  if (!keyword)
    return true

  return [item.title, ...item.keywords]
    .some(field => field.toLowerCase().includes(keyword) || keyword.includes(field.toLowerCase()))
}

/** 筛选条 */
function Filters({ value, onChange }: Readonly<{ value: Filter, onChange: (value: Filter) => void }>): ReactNode {
  return (
    <View className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const active = filter.key === value

        return (
          <View
            key={filter.key}
            className={cn(
              "flex items-center justify-center rounded-full border px-2 py-1",
              active ? "border-primary bg-primary" : "border-default bg-strong",
            )}
            onClick={() => onChange(filter.key)}
          >
            <Text className={cn("text-xs leading-none", active ? "text-primary-strong" : "text-soft")}>
              {filter.title}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/** 工具箱 */
export default function Kit(): ReactNode {
  const [keyword, setKeyword] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  const groups = useMemo(() => {
    const query = keyword.trim().toLowerCase()

    return (Object.keys(TOOLS) as ToolGroup[])
      .filter(key => filter === "all" || key === filter)
      .map(key => ({
        key,
        title: TOOL_GROUP[key],
        items: TOOL_GROUP[key].includes(query)
          ? TOOLS[key]
          : TOOLS[key].filter(item => matches(item, query)),
      }))
      .filter(group => group.items.length > 0)
  }, [keyword, filter])

  return (
    <Page tabbar title="工具箱" back={false}>
      <Main>
        <View className="flex flex-col gap-2 pt-1r pb-1r">
          <Search
            value={keyword}
            placeholder="搜索工具"
            onChange={setKeyword}
            onSearch={() => setKeyword(keyword.trim())}
          />
          <Filters value={filter} onChange={setFilter} />
        </View>
        <Scroll>
          <View className="flex flex-col gap-1r pb-1r">
            {groups.length > 0
              ? groups.map(group => <Group key={group.key} title={group.title} items={group.items} />)
              : <Empty />}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
