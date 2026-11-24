import type { ExperimentBindPayload } from "@contract/routes"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { useState } from "react"
import { z } from "zod"
import { api } from "@/apis"
import Card from "@/components/common/card"
import Cell from "@/components/common/cell"
import Form from "@/components/form/form"
import Input from "@/components/form/input"
import Submit from "@/components/form/submit"
import Alert from "@/components/modal/alert"
import { QUERY_KEY } from "@/config/query"
import { queryClient, useMutation } from "@/hooks/query"
import { useUser } from "@/hooks/user"
import { hasToken } from "@/utils/auth"
import { handleError } from "@/utils/error"
import { hasLabBound, setLabBound } from "@/utils/lab"
import { toast } from "@/utils/toast"

export interface LabProps {
  /** 绑定成功, 返回来源页 */
  onBack: () => void
}

/** 绑定结构 */
const bindSchema = z.object({
  password: z.string().trim().min(1, "请输入密码"),
})

/** 大物实验平台绑定 */
export default function Lab({ onBack }: Readonly<LabProps>): ReactNode {
  const { user } = useUser()
  const [bound, setBound] = useState(hasLabBound)
  const [confirm, setConfirm] = useState(false)

  const bind = useMutation({
    mutationFn: (values: ExperimentBindPayload) => api.experiment.bind(values),
    onSuccess: () => {
      setLabBound(true)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.experiment.all })
      toast.success("绑定成功")
      onBack()
    },
    onError: handleError(),
  })

  const unbind = useMutation({
    mutationFn: () => api.experiment.unbind(),
    onSuccess: () => {
      setLabBound(false)
      setBound(false)
      void queryClient.invalidateQueries({ queryKey: QUERY_KEY.experiment.all })
      toast.success("已解除绑定")
    },
    onError: handleError(),
  })

  function submit(values: ExperimentBindPayload): void {
    if (!hasToken()) {
      toast.info("请先登录")
      return
    }

    bind.mutate(values)
  }

  return (
    <View className="flex flex-col gap-2 py-1r">
      <Card className="overflow-hidden border border-default p-0">
        <Cell title="学号" description={user?.id ?? "未登录"} />
        <Cell
          title="绑定状态"
          description={bound
            ? "已绑定"
            : "未绑定"}
          border={false}
        />
      </Card>

      {!bound && (
        <Card className="border border-default p-3">
          <Form
            schema={bindSchema}
            className="flex flex-col gap-2"
            onSubmit={submit}
          >
            <Input
              name="password"
              label="大物实验平台密码"
              password
              placeholder="请输入密码"
            />
            <Submit className="w-full py-1" loading={bind.isPending}>
              绑定
            </Submit>
          </Form>
        </Card>
      )}

      {bound && (
        <Card className="overflow-hidden border border-default p-0">
          <Cell
            title="解除绑定"
            color="error"
            border={false}
            onClick={() => setConfirm(true)}
          />
        </Card>
      )}

      <Text className="px-1 text-xs text-soft">
        {bound
          ? "实验安排与实验成绩已同步. 大物实验平台改密后需解除绑定并重新填写."
          : "账号为学号, 密码为大物实验平台密码. 绑定后实验安排与实验成绩才会同步."}
      </Text>

      <Alert
        visible={confirm}
        title="解除绑定"
        confirmText="解除"
        color="error"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false)
          unbind.mutate()
        }}
      >
        <Text className="text-sm text-default">解除后实验安排与实验成绩将无法查看.</Text>
      </Alert>
    </View>
  )
}
