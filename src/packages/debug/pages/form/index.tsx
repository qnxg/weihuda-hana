import type { ReactNode } from "react"
import type { PickerColumn } from "@/components/form/picker"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import { z } from "zod"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import { createDateColumns, createDayColumn, createMinuteColumn, createMonthColumn, createRangeColumns, createTimeColumns, isValidDate, Picker } from "@/components/form/picker"
import Submit from "@/components/form/submit"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { toast } from "@/utils/toast"

/** 演示结构 */
const accountSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  password: z.string().min(6, "至少 6 位"),
})

/** 节次选项 */
const PERIOD_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}`,
  value: index + 1,
}))

/** 自定义列选项 */
const CONTENT_OPTIONS = [
  { label: "自习", value: "study" },
  { label: "实验", value: "lab" },
  { label: "考试", value: "exam" },
]

/** 区间列 */
const period = createRangeColumns({ start: PERIOD_OPTIONS, end: PERIOD_OPTIONS })

/** 月 / 日 / 自定义三列 */
const customColumns: PickerColumn[] = [
  createMonthColumn(),
  createDayColumn(),
  { key: "content", label: "内容", options: CONTENT_OPTIONS },
]

/** 大类选项 */
const CATEGORY_OPTIONS = [
  { label: "大类 A", value: "a" },
  { label: "大类 B", value: "b" },
]

/** 小类选项 */
const SUB_OPTIONS: Record<string, { label: string, value: string }[]> = {
  a: [
    { label: "X", value: "x" },
    { label: "Y", value: "y" },
    { label: "Z", value: "z" },
  ],
  b: [
    { label: "Y", value: "y" },
    { label: "X", value: "x" },
  ],
}

/** 大类 / 小类两列 */
const categoryColumns: PickerColumn[] = [
  { key: "category", label: "大类", options: CATEGORY_OPTIONS },
  {
    key: "sub",
    label: "小类",
    options: value => SUB_OPTIONS[String(value.category)] ?? [],
  },
]

/** Picker 结构 */
const pickerSchema = z.object({
  minute: z.object({
    minute: z.number().int().min(0).max(59),
  }),
  date: z.object({
    year: z.number().int(),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
  }).refine(value => isValidDate(value.year, value.month, value.day), "日期不合法"),
  time: z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
    second: z.number().int().min(0).max(59),
  }),
  period: z.object({
    start: z.number().int(),
    end: z.number().int(),
  }).refine(value => value.start <= value.end, "开始不能晚于结束"),
  custom: z.object({
    month: z.number().int(),
    day: z.number().int(),
    content: z.string(),
  }),
  category: z.object({
    category: z.string(),
    sub: z.string(),
  }),
})

export default function FormDebug(): ReactNode {
  const [account, setAccount] = useState("")

  return (
    <Page title="表单调试">
      <Main>
        <Scroll>
          <View className="py-1r flex flex-col gap-3">
            <View className="flex flex-col gap-2">
              <Text className="text-strong">输入框</Text>

              <Card className="flex flex-col gap-2">
                <Input label="非受控" placeholder="至少 4 位" schema={z.string().min(4, "至少 4 位")} />
                <Input label="受控" value={account} onChange={setAccount} placeholder="输入账号" />
                <Input label="密码" password placeholder="输入密码" />
                <Input label="禁用" disabled defaultValue="不可编辑" />
              </Card>
            </View>

            <View className="flex flex-col gap-2">
              <Text className="text-strong">表单</Text>

              <Card>
                <Form
                  schema={accountSchema}
                  onSubmit={values => toast.success(`提交 ${values.account}`)}
                  onError={errors => toast.error(Object.values(errors)[0] ?? "请检查输入")}
                >
                  <Input name="account" label="账号" placeholder="请输入账号" />
                  <Input name="password" label="密码" password placeholder="至少 6 位" />
                  <Submit className="w-full py-1">提交</Submit>
                </Form>
              </Card>
            </View>
            <View className="flex flex-col gap-2">
              <Text className="text-strong">Picker</Text>

              <Card>
                <Form
                  schema={pickerSchema}
                  onSubmit={values => toast.success(`提交 ${values.date.year}-${values.date.month}-${values.date.day}`)}
                  onError={errors => toast.error(Object.values(errors)[0] ?? "请检查选择")}
                >
                  <Picker
                    name="minute"
                    label="分钟"
                    columns={[
                      createMinuteColumn(),
                    ]}
                    clearable
                  />
                  <Picker name="date" label="日期" columns={createDateColumns({ precision: "day" })} clearable />
                  <Picker name="time" label="时间" columns={createTimeColumns({ precision: "second" })} clearable />
                  <Picker name="period" label="节次" columns={period.columns} links={period.links} clearable />
                  <Picker name="custom" label="自定义" columns={customColumns} clearable />
                  <Picker name="category" label="大类小类" columns={categoryColumns} clearable />
                  <Submit className="w-full py-1">提交</Submit>
                </Form>
              </Card>
            </View>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
