import type { ReactNode } from "react"
import type { z, ZodObject, ZodType } from "zod"
import type { FormField } from "@/contexts/form"
import { View } from "@tarojs/components"
import { useCallback, useMemo, useRef, useState } from "react"
import { FormScope } from "@/contexts/form"
import { cn } from "@/utils/cn"

export interface FormProps<S extends ZodObject> {
  /** 表单结构 */
  schema: S
  /** 提交 */
  onSubmit: (values: z.infer<S>) => void | Promise<void>
  /** 校验失败 */
  onError?: (errors: Record<string, string>) => void
  /** 容器样式 */
  className?: string
  /** 内容 */
  children?: ReactNode
}

/** 表单, 校验与取值由 schema 驱动 */
export default function Form<S extends ZodObject>({
  schema,
  onSubmit,
  onError,
  className,
  children,
}: Readonly<FormProps<S>>): ReactNode {
  const fieldsRef = useRef(new Map<string, FormField>())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const register = useCallback((name: string, field: FormField) => {
    fieldsRef.current.set(name, field)

    return () => {
      fieldsRef.current.delete(name)
    }
  }, [])

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      if (!(name in prev))
        return prev

      const next = { ...prev }
      delete next[name]
      return next
    })
  }, [])

  const fieldSchema = useCallback(<T,>(name: string): ZodType<T> | undefined => {
    return (schema.shape as Record<string, ZodType<T>>)[name]
  }, [schema])

  const submit = useCallback(async () => {
    const values: Record<string, unknown> = {}
    fieldsRef.current.forEach((field, name) => {
      values[name] = field.getValue()
    })

    const result = schema.safeParse(values)

    if (!result.success) {
      const next: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const name = String(issue.path[0] ?? "")
        if (name && !next[name])
          next[name] = issue.message
      })

      setErrors(next)
      onError?.(next)
      return
    }

    setErrors({})
    setSubmitting(true)

    try {
      await onSubmit(result.data)
    }
    finally {
      setSubmitting(false)
    }
  }, [onError, onSubmit, schema])

  const value = useMemo(() => ({
    register,
    errors,
    clearError,
    fieldSchema,
    submit,
    submitting,
  }), [
    clearError,
    errors,
    fieldSchema,
    register,
    submit,
    submitting,
  ])

  return (
    <FormScope value={value}>
      <View className={cn("flex flex-col gap-2", className)}>
        {children}
      </View>
    </FormScope>
  )
}
