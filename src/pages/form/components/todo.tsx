import type { TermInfo, TodoItem } from "@contract/routes"
import type { ReactNode } from "react"
import { View } from "@tarojs/components"
import { od } from "@xtwis/ohday"
import { z } from "zod"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import { createDateColumns, createTimeColumns, isValidDate, Picker } from "@/components/form/picker"
import Submit from "@/components/form/submit"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation } from "@/hooks/query"
import { clockOf, dateKeyOf, dateValueOf, minutesOf, timeValueOf } from "@/pages/form/model/option"
import { nowOf } from "@/utils/date"
import { handleError } from "@/utils/error"
import { navigateBack } from "@/utils/navigate"
import { toast } from "@/utils/toast"

export interface TodoFormProps {
  /** 当前学期 */
  term: TermInfo
  /** 待编辑待办, 添加时为 null */
  todo?: TodoItem | null
}

/** 时间结构 */
const timeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
})

/** 待办结构 */
const todoSchema = z.object({
  title: z.string().trim().min(1, "请输入标题"),
  courseName: z.string(),
  date: z.object({
    year: z.number().int(),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
  }).refine(value => isValidDate(value.year, value.month, value.day), "日期不合法"),
  start: timeSchema.nullable(),
  end: timeSchema.nullable(),
  place: z.string(),
  seat: z.string(),
  note: z.string(),
})

type TodoValues = z.infer<typeof todoSchema>

/** 日期列 */
const DATE_COLUMNS = createDateColumns({ precision: "day" })

/** 时间列 */
const TIME_COLUMNS = createTimeColumns({ precision: "minute" })

/** 待办表单, 添加与编辑共用 */
export default function TodoForm({ term, todo = null }: Readonly<TodoFormProps>): ReactNode {
  const now = od(nowOf())
  const date = todo
    ? dateValueOf(todo.date)
    : null
  const start = todo?.startTime
    ? timeValueOf(todo.startTime)
    : null
  const end = todo?.endTime
    ? timeValueOf(todo.endTime)
    : null

  const save = useMutation({
    mutationFn: (values: TodoValues) => {
      const body = {
        title: values.title,
        courseName: values.courseName.trim() || null,
        date: dateKeyOf(values.date),
        startTime: values.start
          ? clockOf(values.start)
          : null,
        endTime: values.end
          ? clockOf(values.end)
          : null,
        place: values.place.trim() || null,
        seat: values.seat.trim() || null,
        note: values.note.trim() || null,
      }

      return todo
        ? api.todo.update({
            id: String(todo.id),
          }, body)
        : api.todo.create({
            ...body,
            year: term.year,
            semester: term.semester,
          })
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEY.todo.list(term),
      })
      toast.success(todo
        ? "待办已保存"
        : "待办已添加")
      navigateBack()
    },
    onError: handleError(),
  })

  function submit(values: TodoValues): void {
    if (values.start && values.end && minutesOf(values.end) <= minutesOf(values.start)) {
      toast.error("结束时间需晚于开始时间")
      return
    }

    save.mutate(values)
  }

  return (
    <Form schema={todoSchema} onSubmit={submit}>
      <Card className="flex flex-col gap-2">
        <Input name="title" label="标题" placeholder="请输入标题" defaultValue={todo?.title ?? ""} />
        <Input name="courseName" label="课程名" placeholder="选填" defaultValue={todo?.courseName ?? ""} />

        <Picker
          name="date"
          label="日期"
          columns={DATE_COLUMNS}
          defaultValue={date ?? {
            year: now.year,
            month: now.month,
            day: now.date,
          }}
          formatValue={dateKeyOf}
          title="选择日期"
        />

        <View className="flex gap-2">
          <Picker
            className="flex-1"
            name="start"
            label="开始时间"
            columns={TIME_COLUMNS}
            defaultValue={start}
            clearable
            placeholder="选填"
            formatValue={clockOf}
            title="选择开始时间"
          />
          <Picker
            className="flex-1"
            name="end"
            label="结束时间"
            columns={TIME_COLUMNS}
            defaultValue={end}
            clearable
            placeholder="选填"
            formatValue={clockOf}
            title="选择结束时间"
          />
        </View>

        <Input name="place" label="地点" placeholder="选填" defaultValue={todo?.place ?? ""} />
        <Input name="seat" label="座位" placeholder="选填" defaultValue={todo?.seat ?? ""} />
        <Input name="note" label="备注" placeholder="选填" defaultValue={todo?.note ?? ""} />
      </Card>

      <Submit className="w-full py-1" loading={save.isPending}>保存</Submit>
    </Form>
  )
}
