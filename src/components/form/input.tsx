import type { ComponentProps, ReactNode } from "react"
import type { ZodType } from "zod"
import { Input as TaroInput, Text, View } from "@tarojs/components"
import { useState } from "react"
import { useFormField } from "@/hooks/form"
import { cn } from "@/utils/cn"

export interface InputProps {
  /** 受控值 */
  value?: string
  /** 初始值 */
  defaultValue?: string
  /** 字段名, 在表单内注册 */
  name?: string
  /** 校验, 由 zod 决定类型 */
  schema?: ZodType
  /** 变更回调 */
  onChange?: (value: string) => void
  /** 输入类型 */
  type?: ComponentProps<typeof TaroInput>["type"]
  /** 标签 */
  label?: string
  /** 占位 */
  placeholder?: string
  /** 密码 */
  password?: boolean
  /** 最大长度 */
  maxlength?: number
  /** 禁用 */
  disabled?: boolean
  /** 容器样式 */
  className?: string
}

/** 输入框, 默认非受控 */
export default function Input({
  value,
  defaultValue = "",
  name,
  schema,
  onChange,
  type,
  label,
  placeholder,
  password = false,
  maxlength,
  disabled = false,
  className,
}: Readonly<InputProps>): ReactNode {
  const [inner, setInner] = useState(defaultValue)

  const controlled = value !== undefined
  const current = controlled ? value : inner
  const { message, markTouched, clear } = useFormField({ name, schema, value: current })

  function handle(next: string) {
    if (!controlled)
      setInner(next)

    clear()
    onChange?.(next)
  }

  return (
    <View className={cn("flex flex-col gap-1", className)}>
      {label && <Text className="text-sm text-soft">{label}</Text>}
      <View
        className={cn(
          "flex items-center rounded-md border px-2h py-1h bg-strong",
          message ? "border-error" : "border-default",
          disabled && "opacity-soft",
        )}
      >
        <TaroInput
          className="flex-1 text-sm text-default"
          value={current}
          type={type}
          password={password}
          maxlength={maxlength}
          disabled={disabled}
          placeholder={placeholder}
          placeholderClass="text-soft"
          onInput={event => handle(event.detail.value)}
          onBlur={markTouched}
        />
      </View>
      {message && <Text className="text-xs text-error">{message}</Text>}
    </View>
  )
}
