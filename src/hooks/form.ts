import type { ZodType } from "zod"
import { useCallback, useEffect, useRef, useState } from "react"
import { useFormContext } from "@/contexts/form"

/** 校验取值 */
function validate(schema: ZodType | undefined, value: unknown): string {
  if (!schema)
    return ""

  const result = schema.safeParse(value)
  return result.success
    ? ""
    : result.error.issues[0]?.message ?? "输入有误"
}

export interface UseFormFieldOptions<T> {
  /** 字段名 */
  name?: string
  /** 校验 */
  schema?: ZodType
  /** 当前值 */
  value: T
}

export interface UseFormFieldResult {
  /** 错误文本 */
  message: string
  /** 是否已交互 */
  touched: boolean
  /** 标记已交互 */
  markTouched: () => void
  /** 清除表单错误 */
  clear: () => void
}

/** 表单字段注册与校验 */
export function useFormField<T>({ name, schema, value }: UseFormFieldOptions<T>): UseFormFieldResult {
  const form = useFormContext()
  const [touched, setTouched] = useState(false)

  const fieldSchema = schema ?? (form && name
    ? form.fieldSchema<T>(name)
    : undefined)

  const valueRef = useRef(value)
  const schemaRef = useRef(fieldSchema)

  valueRef.current = value
  schemaRef.current = fieldSchema

  const register = form?.register

  useEffect(() => {
    if (!register || !name)
      return

    return register(name, {
      getValue: () => valueRef.current,
      validate: () => validate(schemaRef.current, valueRef.current),
    })
  }, [name, register])

  const markTouched = useCallback(() => setTouched(true), [])

  const clear = useCallback(() => {
    if (form && name)
      form.clearError(name)
  }, [form, name])

  const formError = form && name
    ? form.errors[name]
    : ""
  const message = formError || (touched
    ? validate(fieldSchema, value)
    : "")

  return {
    message,
    touched,
    markTouched,
    clear,
  }
}
