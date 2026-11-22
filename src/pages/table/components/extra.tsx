import type { ExtraCourseItem } from "@contract/routes"
import type { ReactNode } from "react"
import type { ExtraState } from "@/pages/table/hooks/extra"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Scroll from "@/components/common/scroll"
import Popup from "@/components/modal/popup"

/** 详情行, 去掉空值 */
function detailsOf(course: ExtraCourseItem): { label: string, value: string }[] {
  const rows: { label: string, value: string | null }[] = [
    { label: "课程代码", value: course.courseId },
    { label: "班级", value: course.className },
    { label: "类型", value: course.courseType },
    { label: "学分", value: `${course.credit} 学分` },
    { label: "教师", value: course.teacher },
    { label: "校区", value: course.area },
    { label: "人数", value: `${course.people} 人` },
    { label: "备注", value: course.extra },
  ]

  return rows.filter((row): row is { label: string, value: string } => Boolean(row.value))
}

/** 一行无课表课程 */
function Row({ course, onSelect }: Readonly<{ course: ExtraCourseItem, onSelect: (course: ExtraCourseItem) => void }>): ReactNode {
  const meta = [course.courseType, course.teacher, `${course.credit} 学分`].filter(Boolean).join(" | ")

  return (
    <Card className="flex flex-col gap-1 border border-default p-3" onClick={() => onSelect(course)}>
      <View className="flex items-baseline gap-2">
        <Text className="flex-1 text-sm text-strong">{course.courseName}</Text>
        <Text className="shrink-0 text-xs text-soft">{`${course.credit} 学分`}</Text>
      </View>
      <Text className="text-xs text-soft">{meta}</Text>
    </Card>
  )
}

/** 无课表课程视图 */
export default function Extra({ state }: Readonly<{ state: ExtraState }>): ReactNode {
  const { list, loading, refreshing, refresh } = state
  const [selected, setSelected] = useState<ExtraCourseItem | null>(null)

  return (
    <>
      <Scroll refresh refreshing={refreshing} onRefresh={refresh}>
        <View className="flex flex-col gap-2 px-1r py-1r">
          {loading && list.length === 0
            ? <Text className="py-8r text-center text-sm text-soft">加载中</Text>
            : list.length === 0
              ? <Text className="py-8r text-center text-sm text-soft">暂无无课表课程</Text>
              : list.map(course => <Row key={course.courseId} course={course} onSelect={setSelected} />)}
        </View>
      </Scroll>

      <Popup visible={selected !== null} title={selected?.courseName} onClose={() => setSelected(null)} className="p-1r">
        {selected && (
          <View className="mt-2 overflow-hidden rounded-md border border-default">
            {detailsOf(selected).map((row, index, rows) => (
              <Cell key={row.label} title={row.label} description={row.value} border={index < rows.length - 1} />
            ))}
          </View>
        )}
      </Popup>
    </>
  )
}
