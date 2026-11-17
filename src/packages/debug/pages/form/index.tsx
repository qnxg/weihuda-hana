import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import { z } from "zod"
import Card from "@/components/common/card"
import Scroll from "@/components/common/scroll"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import Submit from "@/components/form/submit"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { toast } from "@/utils/toast"

/** 演示结构 */
const accountSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  password: z.string().min(6, "至少 6 位"),
})

export default function FormDebug(): ReactNode {
  const [account, setAccount] = useState("")

  return (
    <Page>
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
          </View>
        </Scroll>
      </Main>
    </Page>
  )
}
