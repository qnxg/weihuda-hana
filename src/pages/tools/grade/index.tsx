import type { GradeItem, RankGetQueries, Term } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Scroll from "@/components/common/scroll"
import { Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Popup from "@/components/modal/popup"
import { PAGE } from "@/config/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { useRank } from "@/hooks/rank"
import { termKeyOf, termLabelOf } from "@/pages/table/model/term"
import Detail from "@/pages/tools/grade/components/detail"
import Row from "@/pages/tools/grade/components/row"
import Summary from "@/pages/tools/grade/components/summary"
import { useGrade } from "@/pages/tools/grade/hooks/grade"
import { summaryOf } from "@/pages/tools/grade/model/grade"
import { navigateTo } from "@/utils/navigate"

/** 学业成绩 */
export default function Grade(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const terms = useMemo(() => {
    return [
      ...(semester.data?.list ?? []),
    ].sort((a, b) => a.start.localeCompare(b.start))
  }, [semester.data])

  const [termState, setTermState] = useState<Term | null>(null)
  const term = termState ?? semester.data?.current ?? null
  const { list, loading, refreshing, refresh } = useGrade(term)
  const [selected, setSelected] = useState<GradeItem | null>(null)

  const rankQueries = useMemo<RankGetQueries | null>(() => {
    if (!term)
      return null

    return {
      year: term.year,
      semester: term.semester === "winter"
        ? undefined
        : term.semester,
      range: "major",
      dataSource: "total",
      display: "max",
    }
  }, [term])

  const ranking = useRank(rankQueries)

  const detail = useQuery({
    queryKey: QUERY_KEY.grade.get(selected?.detailId ?? ""),
    queryFn: ({ signal }) => {
      if (!selected?.detailId)
        throw new Error("detailId required")

      return api.grade.get({ detailId: selected.detailId }, signal)
    },
    enabled: selected !== null && selected.detailId !== null,
  })

  const value: ColumnValue | null = term
    ? {
        term: termKeyOf(term),
      }
    : null
  const columns: PickerColumn[] = [
    {
      key: "term",
      label: "学期",
      options: terms.map(item => ({
        label: termLabelOf(item),
        value: termKeyOf(item),
      })),
    },
  ]

  function selectTerm(next: ColumnValue | null): void {
    if (!next)
      return

    const target = terms.find(item => termKeyOf(item) === String(next.term))

    if (target)
      setTermState(target)
  }

  return (
    <Page title="学业成绩">
      <Main>
        <View className="flex flex-col gap-2 pt-1r pb-2">
          <View className="flex items-center gap-2">
            <Picker
              className="flex-1"
              triggerClassName="rounded-full py-1"
              columns={columns}
              value={value}
              onChange={selectTerm}
              formatValue={() => term
                ? termLabelOf(term)
                : ""}
              title="选择学期"
              placeholder="学期"
              disabled={!term}
            />
            <Button
              variant="ghost"
              color="primary"
              className="shrink-0 px-1 py-0 text-xs"
              onClick={() => navigateTo(PAGE.tools.rank)}
            >
              <Text>查看排名</Text>
            </Button>
          </View>

          {!loading && list.length > 0 && (
            <Summary average={summaryOf(list).average} rank={ranking.rank} />
          )}
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3 pb-1r">
            {loading && list.length === 0
              ? <Text className="py-8r text-center text-sm text-soft">加载中</Text>
              : list.length === 0
                ? <Text className="py-8r text-center text-sm text-soft">本学期暂无成绩</Text>
                : list.map(item => <Row key={item.courseId} item={item} onSelect={setSelected} />)}
          </View>
        </Scroll>

        <Popup visible={selected !== null} title={selected?.courseName} onClose={() => setSelected(null)} className="p-1r">
          {selected && <Detail item={selected} data={detail.data} loading={detail.isLoading} />}
        </Popup>
      </Main>
    </Page>
  )
}
