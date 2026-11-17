import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useEffect, useState } from "react"
import { z } from "zod"
import { api } from "@/apis"
import Button from "@/components/common/button"
import Card from "@/components/common/card"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import Submit from "@/components/form/submit"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation, useQuery } from "@/hooks/query"
import { unlockAuthPrompts } from "@/utils/auth"
import { handleError } from "@/utils/error"
import { toast } from "@/utils/toast"

export interface VerifyProps {
  /** 验证成功, 返回来源页 */
  onBack: () => void
}

/** 验证码结构 */
const codeSchema = z.object({
  code: z.string().length(6, "请输入 6 位验证码"),
})

/** 二次验证 */
export default function Verify({ onBack }: Readonly<VerifyProps>): ReactNode {
  const [cooldown, setCooldown] = useState(0)

  const phone = useQuery({
    queryKey: QUERY_KEY.auth.verify,
    queryFn: ({ signal }) => api.auth.verify(signal),
    staleTime: 0,
  })

  const send = useMutation({
    mutationFn: () => api.auth.captchaSend(),
    onSuccess: data => setCooldown(data.cooldown),
    onError: handleError(),
  })

  const verify = useMutation({
    mutationFn: (code: string) => api.auth.captchaVerify({ code }),
    onSuccess: () => {
      toast.success("验证成功")
      void queryClient.invalidateQueries()
      unlockAuthPrompts()
      onBack()
    },
    onError: handleError(),
  })

  useEffect(() => {
    if (cooldown <= 0)
      return

    const timer = setTimeout(setCooldown, 1000, cooldown - 1)
    return () => clearTimeout(timer)
  }, [cooldown])

  const phoneText = phone.isPending
    ? "正在获取验证方式"
    : phone.isError
      ? phone.error.message
      : "验证码将发送到"

  return (
    <Card className="flex flex-col gap-2">
      <Text className="text-strong">二次验证</Text>

      <View className="flex items-center gap-1">
        <Text className="text-sm text-soft">{phoneText}</Text>
        {phone.isSuccess && <Text className="text-sm text-strong">{phone.data.phone}</Text>}
      </View>

      <Form schema={codeSchema} onSubmit={values => verify.mutate(values.code)}>
        <Text className="text-sm text-soft">验证码</Text>
        <View className="flex items-start gap-2">
          <Input name="code" placeholder="请输入验证码" maxlength={6} className="flex-1" />
          <Button
            variant="outline"
            color="ink"
            className="px-2h py-1h text-sm"
            loading={send.isPending}
            disabled={cooldown > 0}
            onClick={() => send.mutate()}
          >
            <Text>
              {cooldown > 0
                ? `${cooldown} 秒后重发`
                : "发送验证码"}
            </Text>
          </Button>
        </View>
        <Submit className="w-full py-1" loading={verify.isPending}>验证</Submit>
      </Form>
    </Card>
  )
}
