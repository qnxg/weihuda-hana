import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Scroll from "@/components/common/scroll"
import { Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import Eye from "@/pages/tools/physical-grade/components/eye"
import Metrics from "@/pages/tools/physical-grade/components/metrics"
import Summary from "@/pages/tools/physical-grade/components/summary"
import { usePhysicalGrade } from "@/pages/tools/physical-grade/hooks/grade"

/** 体测成绩 */
export default function PhysicalGrade(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const years = useMemo(() => {
    const unique = new Set((semester.data?.list ?? []).map(item => item.year))

    return [
      ...unique,
    ].sort((a, b) => b - a)
  }, [semester.data])

  const [yearState, setYearState] = useState<number | null>(null)
  const year = yearState ?? semester.data?.current?.year ?? null
  const { grade, loading, refreshing, refresh } = usePhysicalGrade(year)

  const value: ColumnValue | null = year === null
    ? null
    : {
        year,
      }
  const columns: PickerColumn[] = [
    {
      key: "year",
      options: years.map(item => ({
        label: `${item}`,
        value: item,
      })),
    },
  ]

  function selectYear(next: ColumnValue | null): void {
    if (!next)
      return

    const target = Number(next.year)

    if (Number.isInteger(target))
      setYearState(target)
  }

  return (
    <Page title="体测成绩">
      <Main>
        <View className="pt-1r pb-2">
          <Picker
            triggerClassName="rounded-full py-1"
            columns={columns}
            value={value}
            onChange={selectYear}
            formatValue={() => year === null
              ? ""
              : `${year}`}
            title="选择学年"
            placeholder="学年"
            disabled={year === null}
          />
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3 pb-1r">
            {loading && !grade && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
            {!loading && !grade && <Text className="py-8r text-center text-sm text-soft">本学年暂无体测成绩</Text>}
            {grade && (
              <>
                <Summary grade={grade} />
                <Metrics grade={grade} />
                <Eye eye={grade.eye} />
              </>
            )}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
