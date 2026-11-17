import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { useMutation } from "@/hooks/query"
import { ApiError } from "@/types/request"
import { clearToken, setToken } from "@/utils/auth"
import { toast } from "@/utils/toast"

/** 演示用密码 */
const demoPassword = "123456"

/** 演示账号, 行为由 mock 决定 */
const accounts = [
  { account: "2022000000", text: "正常" },
  { account: "refresh", text: "访问令牌过期, 刷新后自动重试" },
  { account: "expire", text: "访问令牌过期, 刷新也失败" },
  { account: "verify", text: "受保护接口返回 1003" },
]

export default function AuthDebug(): ReactNode {
  const login = useMutation({
    mutationFn: (account: string) => api.auth.login({ account, password: demoPassword }),
    onSuccess: (data) => {
      setToken(data)
      toast.success("已登录")
    },
    onError: error => toast.error(error.message),
  })

  const me = useMutation({
    mutationFn: () => api.auth.me(),
    onSuccess: data => toast.success(`账号: ${data.name}`),
    onError: (error) => {
      // 中间件已接管的错误由弹窗提示, 不再叠一层提示
      if (error instanceof ApiError && error.handled)
        return

      toast.error(error.message)
    },
  })

  const reset = () => {
    clearToken()
    toast.info("已清除令牌")
  }

  return (
    <Page>
      <Main className="py-1r">
        <View className="flex flex-col gap-3">
          <View className="flex flex-col gap-2">
            <Text className="text-strong">演示账号</Text>
            <Text className="text-sm text-soft">密码统一 123456, 登录后请求受保护接口看结果</Text>

            <Card className="overflow-hidden">
              {accounts.map(({ account, text }, index) => (
                <Cell
                  key={account}
                  title={account}
                  description={text}
                  border={index < accounts.length - 1}
                  onClick={() => login.mutate(account)}
                />
              ))}
            </Card>
          </View>

          <View className="flex flex-col gap-2">
            <Text className="text-strong">操作</Text>

            <Card className="flex flex-col gap-2">
              <Button className="w-full py-1" loading={me.isPending} onClick={() => me.mutate()}>
                请求受保护接口
              </Button>
              <Button variant="outline" color="ink" className="w-full py-1" onClick={reset}>
                清除令牌
              </Button>
            </Card>
          </View>
        </View>
      </Main>
    </Page>
  )
}
