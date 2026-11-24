import type { ExperimentGradeItem, Term } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Scroll from "@/components/common/scroll"
import { Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Popup from "@/components/modal/popup"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import { SEMESTER_LABEL, termLabelOf } from "@/pages/table/model/term"
import Rebind from "@/pages/tools/components/rebind"
import Detail from "@/pages/tools/experiment-grade/components/detail"
import Row from "@/pages/tools/experiment-grade/components/row"
import Summary from "@/pages/tools/experiment-grade/components/summary"
import { useExperimentGrade } from "@/pages/tools/experiment-grade/hooks/grade"

/** 实验成绩 */
export default function ExperimentGrade(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const terms = useMemo(() => {
    return [
      ...(semester.data?.list ?? []),
    ].sort((a, b) => a.start.localeCompare(b.start))
  }, [semester.data])

  const years = useMemo(() => {
    const unique = new Set(terms.map(item => item.year))

    return [
      ...unique,
    ].sort((a, b) => b - a)
  }, [terms])

  const [termState, setTermState] = useState<Term | null>(null)
  const term = termState ?? semester.data?.current ?? null
  const { grade, loading, refreshing, rebind, refresh } = useExperimentGrade(term)
  const [dismissed, setDismissed] = useState(false)
  const [selected, setSelected] = useState<ExperimentGradeItem | null>(null)

  const value: ColumnValue | null = term
    ? {
        year: term.year,
        semester: term.semester,
      }
    : null
  const columns: PickerColumn[] = [
    {
      key: "year",
      label: "学年",
      options: years.map(item => ({
        label: `${item}`,
        value: item,
      })),
    },
    {
      key: "semester",
      label: "学期",
      options: (current) => {
        const year = Number(current.year)

        return terms
          .filter(item => item.year === year)
          .map(item => ({
            label: SEMESTER_LABEL[item.semester],
            value: item.semester,
          }))
      },
    },
  ]

  function selectTerm(next: ColumnValue | null): void {
    if (!next)
      return

    const year = Number(next.year)
    const target = terms.find(item => item.year === year && item.semester === next.semester)

    if (target)
      setTermState(target)
  }

  return (
    <Page title="实验成绩">
      <Main>
        <View className="pt-1r pb-2">
          <Picker
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
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3 pb-1r">
            {grade && <Summary grade={grade} />}

            {loading && !grade && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
            {!loading && rebind && (
              <Text className="py-8r text-center text-sm text-soft">大物实验平台需要重新绑定</Text>
            )}
            {!loading && !rebind && (!grade || grade.labs.length === 0) && (
              <Text className="py-8r text-center text-sm text-soft">本学期暂无实验成绩</Text>
            )}
            {grade?.labs.map(item => <Row key={item.name} item={item} onSelect={setSelected} />)}
          </View>
        </Scroll>

        <Popup visible={selected !== null} title={selected?.name} onClose={() => setSelected(null)} className="p-1r">
          {selected && <Detail item={selected} />}
        </Popup>

        <Rebind visible={rebind && !dismissed} onClose={() => setDismissed(true)} />
      </Main>
    </Page>
  )
}
