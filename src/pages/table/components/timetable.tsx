import type { ReactNode } from "react"
import type { TimetableState } from "@/pages/table/hooks/timetable"
import type { CourseCluster } from "@/pages/table/model/course"
import { Text, View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { useState } from "react"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import Alert from "@/components/modal/alert"
import Popup from "@/components/modal/popup"
import { PERIODS } from "@/config/course"
import { QUERY_KEY } from "@/config/query"
import { queryClient } from "@/hooks/query"
import { useSwipe } from "@/pages/table/hooks/swipe"
import { DAY_NAMES, periodTextOf, timeTextOf, TINT, weeksTextOf } from "@/pages/table/model/course"
import { cn } from "@/utils/cn"
import { toast } from "@/utils/toast"

/** 行高 */
const ROW = 56

/** 单元格间距 */
const GAP = 4

/** 节次 */
const PERIOD_LIST = Object.entries(PERIODS).map(([index, time]) => ({
  index: Number(index),
  ...time,
}))

/** 周头 */
function WeekHeader({ state }: Readonly<{ state: TimetableState }>): ReactNode {
  const todayKey = od(state.today).p("YYYY-MM-DD")

  return (
    <View className="flex gap-1 border-b border-default">
      <View className="w-4h shrink-0" />
      {DAY_NAMES.map((name, index) => {
        const date = state.weekDates[index]
        const isToday = date
          ? od(date).p("YYYY-MM-DD") === todayKey
          : false

        return (
          <View key={name} className="flex flex-1 flex-col items-center py-1">
            <Text className={cn("text-sm", isToday ? "text-primary" : "text-strong")}>{`周${name}`}</Text>
            <Text className={cn("text-xs", isToday ? "text-primary-soft" : "text-soft")}>
              {date
                ? od(date).p("MM.DD")
                : ""}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

/** 课程块 */
function CourseCard({
  cluster,
  onSelect,
}: Readonly<{ cluster: CourseCluster, onSelect: (cluster: CourseCluster) => void }>): ReactNode {
  const block = cluster.blocks[0]
  const tint = block.current
    ? TINT[block.tint]
    : null

  return (
    <View
      className={`absolute left-0 right-0 overflow-hidden rounded p-2x ${tint ? tint.bg : "bg-strong"}`}
      style={{
        top: `${(cluster.start - 1) * ROW + GAP / 2}px`,
        height: `${(cluster.end - cluster.start + 1) * ROW - GAP}px`,
      }}
      onClick={() => onSelect(cluster)}
    >
      <View className="flex flex-col gap-1">
        <Text className={`line-clamp-3 text-xs leading-tight ${tint ? tint.fg : "text-soft"}`}>
          {block.course.courseName}
        </Text>
        {cluster.end > cluster.start && block.course.place && (
          <Text className={`text-xs leading-tight opacity-weak ${tint ? tint.fg : "text-soft"}`}>
            {block.course.place}
          </Text>
        )}
      </View>
      {cluster.blocks.length > 1 && (
        <View
          className="absolute bottom-0 right-0 h-0 w-0"
          style={{
            borderTop: "12px solid transparent",
            borderRight: "12px solid rgba(0,0,0,0.18)",
          }}
        />
      )}
    </View>
  )
}

/** 网格 */
function Grid({
  clusters,
  onSelect,
}: Readonly<{ clusters: CourseCluster[], onSelect: (cluster: CourseCluster) => void }>): ReactNode {
  return (
    <View className="flex gap-1">
      <View className="w-4h shrink-0">
        {PERIOD_LIST.map(period => (
          <View key={period.index} className="flex h-7h flex-col items-center justify-center gap-1x text-center leading-none">
            <Text className="text-sm text-strong">{period.index}</Text>
            <Text className="text-xs text-soft">{period.start}</Text>
            <Text className="text-xs text-soft">{period.end}</Text>
          </View>
        ))}
      </View>

      {DAY_NAMES.map((name, index) => (
        <View key={name} className="relative flex-1">
          {PERIOD_LIST.map(period => (
            <View key={period.index} className="h-7h" />
          ))}
          {clusters.filter(cluster => cluster.day === index).map(cluster => (
            <CourseCard key={cluster.key} cluster={cluster} onSelect={onSelect} />
          ))}
        </View>
      ))}
    </View>
  )
}

/** 课表视图 */
export default function Timetable({ state }: Readonly<{ state: TimetableState }>): ReactNode {
  const swipe = useSwipe({ onPrev: state.prev, onNext: state.next })
  const [selected, setSelected] = useState<CourseCluster | null>(null)
  const [selectedKey, setSelectedKey] = useState("")
  const [confirm, setConfirm] = useState(false)

  if (!state.term)
    return <View className="flex flex-1 items-center justify-center"><Text className="text-soft">加载中</Text></View>

  const block = selected?.blocks.find(item => item.key === selectedKey) ?? selected?.blocks[0]

  function open(cluster: CourseCluster): void {
    setSelected(cluster)
    setSelectedKey(cluster.blocks[0]?.key ?? "")
    setConfirm(false)
  }

  function close(): void {
    setSelected(null)
    setConfirm(false)
  }

  async function remove(customizeId: number): Promise<void> {
    try {
      await api.course.remove({
        customizeId: String(customizeId),
      })
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.list(state.term ?? undefined),
      })
      close()
    }
    catch {
      toast.error("删除失败")
    }
  }

  return (
    <View className="flex flex-1 flex-col overflow-hidden px-1" {...swipe}>
      <WeekHeader state={state} />
      <Scroll refresh refreshing={state.refreshing} onRefresh={state.refresh}>
        {state.loading && state.clusters.length === 0
          ? <View className="py-8r text-center"><Text className="text-soft">加载中</Text></View>
          : <Grid clusters={state.clusters} onSelect={open} />}
      </Scroll>

      <Popup visible={selected !== null} title={block?.course.courseName ?? "课程详情"} onClose={close} className="p-1r">
        {selected && block && (
          <View className="mt-2 flex flex-col gap-2">
            {selected.blocks.length > 1 && (
              <View className="flex flex-wrap gap-2">
                {selected.blocks.map(item => (
                  <View
                    key={item.key}
                    className={cn(
                      "flex items-center justify-center rounded-full border px-2 py-2x",
                      item.key === block.key
                        ? "border-primary bg-primary"
                        : "border-default bg-strong",
                    )}
                    onClick={() => setSelectedKey(item.key)}
                  >
                    <Text className={cn("text-xs leading-none", item.key === block.key
                      ? "text-primary-strong"
                      : "text-soft")}
                    >
                      {item.course.courseName}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View className="overflow-hidden rounded-md border border-default">
              <Cell title="时间">
                <Text className="text-sm text-default">
                  {`周${DAY_NAMES[block.day]} ${periodTextOf(block.start, block.end)} | ${timeTextOf(block.start, block.end)}`}
                </Text>
              </Cell>
              <Cell title="周次" description={weeksTextOf(block.course.weeks)} />
              <Cell title="地点" description={block.course.place ?? "暂无地点"} />
              <Cell title="教师" description={block.course.teacher ?? "暂无教师"} />
              <Cell title="类型" description={block.course.courseType ?? "未知类型"} />
              <Cell title="学分" description={`${block.course.credit ?? "-"} 学分`} />
              <Cell
                title="来源"
                description={block.course.customizeId !== null
                  ? "自定义"
                  : "教务"}
                border={Boolean(block.course.extra)}
              />
              {block.course.extra && (
                <Cell title="备注" border={false}>
                  <Text className="text-sm text-default">{block.course.extra}</Text>
                </Cell>
              )}
            </View>

            {block.course.customizeId !== null && (
              <View className="flex gap-2">
                <Button variant="outline" color="ink" className="flex-1 py-1" onClick={() => toast.info("编辑待接入")}>
                  <Text>编辑</Text>
                </Button>
                <Button variant="outline" color="error" className="flex-1 py-1" onClick={() => setConfirm(true)}>
                  <Text>删除</Text>
                </Button>
              </View>
            )}
          </View>
        )}
      </Popup>

      <Alert
        visible={confirm}
        title="删除自定义课程"
        confirmText="删除"
        cancelText="取消"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false)
          const customizeId = block?.course.customizeId
          if (typeof customizeId === "number")
            void remove(customizeId)
        }}
      >
        <Text className="text-sm text-soft">删除后无法恢复, 确认删除?</Text>
      </Alert>
    </View>
  )
}
