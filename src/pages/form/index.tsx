import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useRouter } from "@tarojs/taro"
import Scroll from "@/components/common/scroll"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { termLabelOf, termOfKey } from "@/pages/table/model/term"

/** 表单类型 */
type FormType = "course" | "todo"

/** 表单标题 */
const TITLE: Record<FormType, string> = {
  course: "添加课程",
  todo: "添加待办",
}

/** 课程与待办表单 */
export default function Form(): ReactNode {
  const { params } = useRouter()
  const type: FormType = params.type === "todo"
    ? "todo"
    : "course"
  const term = termOfKey(params.term ?? "")

  return (
    <Page title={TITLE[type]}>
      <Main>
        <Scroll>
          <View className="flex flex-col gap-2 py-1r">
            <Text className="text-sm text-soft">
              {term
                ? termLabelOf(term)
                : "未指定学期"}
            </Text>
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
