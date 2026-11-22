import type { RankDataSource, RankDisplay, RankGetQueries, RankRange } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import type { RankSemester, RankTime, Source } from "@/pages/tools/rank/model/rank"
import { Text, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import { Picker } from "@/components/form/picker"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useQuery } from "@/hooks/query"
import { useRank, useRankCa, useRankCaRefresh } from "@/hooks/rank"
import { SEMESTER_LABEL } from "@/pages/table/model/term"
import CaCard from "@/pages/tools/rank/components/ca-card"
import Pills from "@/pages/tools/rank/components/pills"
import Stats from "@/pages/tools/rank/components/stats"
import { DATA_SOURCES, DISPLAYS, oneOf, RANGES, SCOPES, SEMESTERS, semestersOf, SOURCES } from "@/pages/tools/rank/model/rank"

/** 成绩排名 */
export default function Rank(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const [source, setSource] = useState<Source>("jiaowu")
  const [time, setTime] = useState<RankTime>({ year: "all", semester: "all" })
  const [range, setRange] = useState<RankRange>("major")
  const [dataSource, setDataSource] = useState<RankDataSource>("total")
  const [display, setDisplay] = useState<RankDisplay>("max")
  const [refreshing, setRefreshing] = useState(false)

  const years = useMemo(() => {
    const unique = new Set((semester.data?.list ?? []).map(item => item.year))

    return [
      ...unique,
    ].sort((a, b) => b - a)
  }, [semester.data])

  const timeColumns: PickerColumn[] = [
    {
      key: "year",
      label: "学年",
      options: [
        { label: "全部学年", value: "all" },
        ...years.map(item => ({
          label: `${item}`,
          value: item,
        })),
      ],
    },
    {
      key: "semester",
      label: "学期",
      options: (value) => {
        if (value.year === "all") {
          return [
            { label: "全部学期", value: "all" },
          ]
        }

        const available = semestersOf(semester.data?.list ?? [], Number(value.year))

        return [
          { label: "全部学期", value: "all" },
          ...available.map(item => ({
            label: SEMESTER_LABEL[item],
            value: item,
          })),
        ]
      },
    },
  ]

  const queries = useMemo<RankGetQueries>(() => ({
    year: time.year === "all"
      ? undefined
      : time.year,
    semester: time.semester === "all"
      ? undefined
      : time.semester,
    range,
    dataSource,
    display,
  }), [
    dataSource,
    display,
    range,
    time,
  ])

  const jiaowu = useRank(source === "jiaowu"
    ? queries
    : null)
  const ca = useRankCa(source === "ca")
  const caRefresh = useRankCaRefresh()

  const rank = source === "ca"
    ? ca.ca?.rank
    : jiaowu.rank
  const pending = source === "ca"
    ? ca.loading || caRefresh.refreshing
    : jiaowu.loading

  const timeValue: ColumnValue = {
    year: time.year,
    semester: time.semester,
  }

  function formatTime(value: ColumnValue): string {
    if (value.year === "all")
      return "全部时间"

    const year = Number(value.year)

    if (value.semester === "all")
      return `${year} 学年`

    return `${year} ${SEMESTER_LABEL[value.semester as RankSemester]}`
  }

  function normalizeTime(value: ColumnValue, changed: string): ColumnValue {
    if (changed !== "year")
      return value

    if (value.year === "all") {
      return {
        ...value,
        semester: "all",
      }
    }

    const available = semestersOf(semester.data?.list ?? [], Number(value.year))

    if (value.semester !== "all" && !available.includes(value.semester as RankSemester)) {
      return {
        ...value,
        semester: "all",
      }
    }

    return value
  }

  function selectTime(next: ColumnValue | null): void {
    if (!next)
      return

    const year = next.year === "all"
      ? "all"
      : Number(next.year)

    if (year !== "all" && !Number.isInteger(year))
      return

    const semesterValue = next.semester === "all"
      ? "all"
      : oneOf<RankSemester>(next.semester, SEMESTERS)

    if (semesterValue === null)
      return

    setTime({ year, semester: semesterValue })
  }

  function refresh(): void {
    if (refreshing)
      return

    setRefreshing(true)

    const key = source === "ca"
      ? QUERY_KEY.rank.ca
      : QUERY_KEY.rank.get(queries)

    void queryClient.invalidateQueries({ queryKey: key }).finally(() => setRefreshing(false))
  }

  function emptyText(): string {
    if (source === "ca" && !ca.ca && !ca.loading && !caRefresh.refreshing)
      return "尚未生成凭证排名"

    if (pending)
      return "加载中"

    return "暂无排名"
  }

  return (
    <Page title="成绩排名">
      <Main>
        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3 py-1r">
            <Pills<Source> label="来源" value={source} options={SOURCES} onChange={setSource} />

            {source === "jiaowu" && (
              <Card className="flex flex-col gap-2 border border-default p-3">
                <View className="flex items-center gap-2">
                  <Text className="shrink-0 text-xs text-soft">时间范围</Text>
                  <Picker
                    className="flex-1"
                    triggerClassName="rounded-full py-2x"
                    columns={timeColumns}
                    value={timeValue}
                    onChange={selectTime}
                    normalize={normalizeTime}
                    formatValue={formatTime}
                    title="选择时间范围"
                    disabled={semester.isPending}
                  />
                </View>
                <Pills<RankRange> label="课程范围" value={range} options={RANGES} onChange={setRange} />
                <Pills<RankDataSource> label="数据来源" value={dataSource} options={DATA_SOURCES} onChange={setDataSource} />
                <Pills<RankDisplay> label="显示方式" value={display} options={DISPLAYS} onChange={setDisplay} />
              </Card>
            )}

            {source === "ca" && (
              <CaCard ca={ca.ca} refreshing={caRefresh.refreshing} onRefresh={caRefresh.refresh} />
            )}

            {rank
              ? SCOPES.map(item => (
                  <View key={item.key} className="flex flex-col gap-1">
                    <Text className="px-1 text-xs text-soft">{item.title}</Text>
                    <Stats detail={rank[item.key]} />
                  </View>
                ))
              : <Text className="py-8r text-center text-sm text-soft">{emptyText()}</Text>}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
