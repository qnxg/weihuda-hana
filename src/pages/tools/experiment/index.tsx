import type { ExperimentItem, TermInfo } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useMemo, useState } from "react"
import { api } from "@/apis"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import Popup from "@/components/modal/popup"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import TermPicker from "@/pages/tools/components/term"
import Detail from "@/pages/tools/experiment/components/detail"
import Row from "@/pages/tools/experiment/components/row"
import { useExperiments } from "@/pages/tools/experiment/hooks/list"
import { groupsOf } from "@/pages/tools/experiment/model/experiment"

/** 实验安排 */
export default function Experiment(): ReactNode {
  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const terms = useMemo(() => {
    return [
      ...(semester.data?.list ?? []),
    ].sort((a, b) => a.start.localeCompare(b.start))
  }, [semester.data])

  const [termState, setTermState] = useState<TermInfo | null>(null)
  const term = termState ?? semester.data?.current ?? null
  const { list, loading, refreshing, refresh } = useExperiments(term)
  const pending = semester.isPending || loading
  const groups = useMemo(() => groupsOf(list), [list])
  const [selected, setSelected] = useState<ExperimentItem | null>(null)

  return (
    <Page title="实验安排">
      <Main>
        <View className="pt-1r pb-2">
          <TermPicker
            terms={terms}
            term={term}
            onChange={setTermState}
            disabled={semester.isPending || terms.length === 0}
          />
        </View>

        <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
          <View className="flex flex-col gap-3 py-1r">
            {pending && groups.length === 0 && <Text className="py-8r text-center text-sm text-soft">加载中</Text>}
            {!pending && groups.length === 0 && (
              <Text className="py-8r text-center text-sm text-soft">本学期暂无实验安排</Text>
            )}
            {groups.map(group => (
              <View key={group.key} className="flex flex-col gap-1">
                <Text className="px-1 text-xs text-soft">{group.label}</Text>
                {group.items.map(item => (
                  <Row key={`${item.name}-${item.dateTime}`} item={item} onSelect={setSelected} />
                ))}
              </View>
            ))}
          </View>
        </Scroll>

        <Popup visible={selected !== null} title={selected?.name} onClose={() => setSelected(null)} className="p-1r">
          {selected && <Detail item={selected} />}
        </Popup>
      </Main>
    </Page>
  )
}
