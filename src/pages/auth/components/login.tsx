import type { AuthLoginPayload } from "@contract/routes"
import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import { z } from "zod"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import Submit from "@/components/form/submit"
import { queryClient, useMutation } from "@/hooks/query"
import { setToken, unlockAuthPrompts } from "@/utils/auth"
import { handleError } from "@/utils/error"
import { toast } from "@/utils/toast"

export interface LoginProps {
  /** 登录成功, 返回来源页 */
  onBack: () => void
}

/** 登录结构 */
const loginSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  password: z.string().min(1, "请输入密码"),
})

/** 登录 */
export default function Login({ onBack }: Readonly<LoginProps>): ReactNode {
  const login = useMutation({
    mutationFn: (values: AuthLoginPayload) => api.auth.login(values),
    onSuccess: (data) => {
      setToken(data)
      unlockAuthPrompts()
      void queryClient.invalidateQueries()
      toast.success("登录成功")
      onBack()
    },
    onError: handleError(),
  })

  return (
    <Card className="flex flex-col gap-2">
      <Text className="text-strong">登录</Text>

      <Form schema={loginSchema} onSubmit={values => login.mutate(values)}>
        <Input name="account" label="账号" placeholder="请输入账号" />
        <Input name="password" label="密码" password placeholder="请输入密码" />
        <Submit className="w-full py-1" loading={login.isPending}>登录</Submit>
      </Form>
    </Card>
  )
}
