import type { ReactNode } from "react"
import { Text } from "@tarojs/components"
import Button from "@/components/common/button"
import { useFormContext } from "@/contexts/form"

export interface SubmitProps {
  /** 文案 */
  children?: ReactNode
  /** 样式 */
  className?: string
}

/** 提交按钮 */
export default function Submit({ children, className }: Readonly<SubmitProps>): ReactNode {
  const form = useFormContext()

  if (!form)
    throw new Error("Submit must be used within a Form")

  return (
    <Button
      className={className}
      loading={form.submitting}
      onClick={() => void form.submit()}
    >
      {children ?? <Text>提交</Text>}
    </Button>
  )
}
