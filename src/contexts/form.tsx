import type { ReactNode } from "react"
import type { ZodType } from "zod"
import { createContext, useContext } from "react"

/** 字段注册内容 */
export interface FormField {
  /** 取值 */
  getValue: () => string
  /** 校验 */
  validate: () => string
}

export interface FormContextValue {
  /** 注册字段 */
  register: (name: string, field: FormField) => () => void
  /** 字段错误 */
  errors: Record<string, string>
  /** 清除错误 */
  clearError: (name: string) => void
  /** 字段结构 */
  fieldSchema: (name: string) => ZodType<string> | undefined
  /** 提交 */
  submit: () => Promise<void>
  /** 提交中 */
  submitting: boolean
}

const FormContext = createContext<FormContextValue | null>(null)

/** 读取表单, 不在表单内返回 null */
export function useFormContext(): FormContextValue | null {
  return useContext(FormContext)
}

/** 表单作用域 */
export function FormScope({ value, children }: Readonly<{ value: FormContextValue, children?: ReactNode }>): ReactNode {
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  )
}
