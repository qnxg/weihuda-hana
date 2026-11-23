import type { TermInfo } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { useState } from "react"
import { z } from "zod"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import { Picker } from "@/components/form/picker"
import Submit from "@/components/form/submit"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation } from "@/hooks/query"
import Weeks from "@/pages/form/components/weeks"
import { DAY_OPTIONS, dayLabelOf, PERIOD_OPTIONS, timesOf } from "@/pages/form/model/option"
import { handleError } from "@/utils/error"
import { navigateBack } from "@/utils/navigate"
import { toast } from "@/utils/toast"

export interface CourseFormProps {
  /** 当前学期 */
  term: TermInfo
  /** 预填周几 */
  day: number
  /** 预填起始节次 */
  start: number
}

/** 课程结构 */
const courseSchema = z.object({
  courseName: z.string().trim().min(1, "请输入课程名"),
  weeks: z.array(z.number().int().min(1)).min(1, "请选择周次"),
  time: z.object({
    day: z.number().int().min(0).max(6),
    start: z.number().int().min(1).max(12),
    end: z.number().int().min(1).max(12),
  }).refine(value => value.start <= value.end, "结束节次不能早于开始节次"),
  place: z.string(),
  teacher: z.string(),
})

type CourseValues = z.infer<typeof courseSchema>

/** 上课时间列 */
const TIME_COLUMNS: PickerColumn[] = [
  { key: "day", label: "周", options: DAY_OPTIONS },
  { key: "start", label: "起始", options: PERIOD_OPTIONS },
  { key: "end", label: "结束", options: PERIOD_OPTIONS },
]

/** 上课时间文本 */
function timeLabelOf(value: ColumnValue): string {
  const start = Number(value.start)
  const end = Number(value.end)
  const period = start === end
    ? `第 ${start} 节`
    : `第 ${start}-${end} 节`

  return `${dayLabelOf(Number(value.day))} ${period}`
}

/** 添加课程 */
export default function CourseForm({ term, day, start }: Readonly<CourseFormProps>): ReactNode {
  const [weeks, setWeeks] = useState<number[]>(() =>
    Array.from({ length: term.weeks }, (_, index) => index + 1))

  const create = useMutation({
    mutationFn: (values: CourseValues) => api.course.create({
      courseName: values.courseName,
      weeks: values.weeks,
      day: values.time.day,
      times: timesOf(values.time.start, values.time.end),
      place: values.place.trim() || null,
      teacher: values.teacher.trim() || null,
      year: term.year,
      semester: term.semester,
    }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEY.course.list(term),
      })
      toast.success("课程已添加")
      navigateBack()
    },
    onError: handleError(),
  })

  return (
    <Form schema={courseSchema} onSubmit={values => create.mutate(values)}>
      <Card className="flex flex-col gap-2">
        <Input name="courseName" label="课程名" placeholder="请输入课程名" />

        <Weeks name="weeks" label="周次" total={term.weeks} value={weeks} onChange={setWeeks} />

        <Picker
          name="time"
          label="上课时间"
          columns={TIME_COLUMNS}
          links={[
            { from: "start", to: "end" },
          ]}
          defaultValue={{
            day,
            start,
            end: Math.min(start + 1, 12),
          }}
          formatValue={timeLabelOf}
          title="选择上课时间"
        />

        <Input name="place" label="地点" placeholder="选填" />
        <Input name="teacher" label="教师" placeholder="选填" />
      </Card>

      <Submit className="w-full py-1" loading={create.isPending}>保存</Submit>
    </Form>
  )
}
