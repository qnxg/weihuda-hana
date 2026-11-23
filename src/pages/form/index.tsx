import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import { od } from "@xtwis/ohday"
import { useMemo } from "react"
import { api } from "@/apis"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { QUERY_KEY } from "@/config/query"
import { useQuery } from "@/hooks/query"
import CourseForm from "@/pages/form/components/course"
import TodoForm from "@/pages/form/components/todo"
import { sameTerm, termLabelOf, termOfKey } from "@/pages/table/model/term"
import { nowOf } from "@/utils/date"

/** 表单类型 */
type FormType = "course" | "todo"

/** 表单标题 */
const TITLE: Record<FormType, string> = {
  course: "添加课程",
  todo: "添加待办",
}

/** 取范围内的整数, 否则回落 */
function intOf(value: string | undefined, min: number, max: number, fallback: number): number {
  const parsed = Number(value)

  return Number.isInteger(parsed) && parsed >= min && parsed <= max
    ? parsed
    : fallback
}

/** 课程与待办表单 */
export default function FormPage(): ReactNode {
  const { params } = useRouter()
  const type: FormType = params.type === "todo"
    ? "todo"
    : "course"

  const semester = useQuery({
    queryKey: QUERY_KEY.semester.get,
    queryFn: ({ signal }) => api.semester.get(signal),
  })

  const term = useMemo(() => {
    const key = termOfKey(params.term ?? "")
    const matched = key
      ? semester.data?.list.find(item => sameTerm(item, key))
      : undefined

    return matched ?? semester.data?.current ?? null
  }, [
    params.term,
    semester.data,
  ])

  const day = intOf(params.day, 0, 6, od(nowOf()).day)
  const start = intOf(params.start, 1, 12, 1)

  return (
    <Page title={TITLE[type]}>
      <Main>
        <Scroll>
          <View className="flex flex-col gap-2 py-1r">
            {term && <Text className="text-xs text-soft">{termLabelOf(term)}</Text>}
            {term
              ? type === "course"
                ? <CourseForm term={term} day={day} start={start} />
                : <TodoForm term={term} />
              : (
                  <Text className="py-8r text-center text-sm text-soft">
                    {semester.isPending
                      ? "加载中"
                      : "无法获取学期"}
                  </Text>
                )}
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
