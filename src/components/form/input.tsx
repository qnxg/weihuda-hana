import type { ReactNode } from "react"
import type { ZodType } from "zod"
import { Input as TaroInput, Text, View } from "@tarojs/components"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "@/contexts/form"
import { cn } from "@/utils/cn"

export interface InputProps {
  /** 受控值 */
  value?: string
  /** 初始值 */
  defaultValue?: string
  /** 字段名, 在表单内注册 */
  name?: string
  /** 校验 */
  schema?: ZodType<string>
  /** 变更回调 */
  onChange?: (value: string) => void
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

/** 校验取值 */
function validate(schema: ZodType<string> | undefined, value: string): string {
  if (!schema)
    return ""

  const result = schema.safeParse(value)
  return result.success
    ? ""
    : result.error.issues[0]?.message ?? "输入有误"
}

/** 输入框, 默认非受控 */
export default function Input({
  value,
  defaultValue = "",
  name,
  schema,
  onChange,
  label,
  placeholder,
  password = false,
  maxlength,
  disabled = false,
  className,
}: Readonly<InputProps>): ReactNode {
  const form = useFormContext()
  const [inner, setInner] = useState(defaultValue)
  const [touched, setTouched] = useState(false)

  const controlled = value !== undefined
  const current = controlled ? value : inner
  const fieldSchema = schema ?? (form && name
    ? form.fieldSchema(name)
    : undefined)

  const currentRef = useRef(current)
  const schemaRef = useRef(fieldSchema)
  const register = form?.register
  const clearError = form?.clearError

  currentRef.current = current
  schemaRef.current = fieldSchema

  useEffect(() => {
    if (!register || !name)
      return

    return register(name, {
      getValue: () => currentRef.current,
      validate: () => validate(schemaRef.current, currentRef.current),
    })
  }, [name, register])

  const formError = form && name
    ? form.errors[name]
    : ""
  const message = formError || (touched
    ? validate(fieldSchema, current)
    : "")

  function handle(next: string) {
    if (!controlled)
      setInner(next)

    if (clearError && name)
      clearError(name)

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
          password={password}
          maxlength={maxlength}
          disabled={disabled}
          placeholder={placeholder}
          placeholderClass="text-soft"
          onInput={event => handle(event.detail.value)}
          onBlur={() => setTouched(true)}
        />
      </View>
      {message && <Text className="text-xs text-error">{message}</Text>}
    </View>
  )
}
