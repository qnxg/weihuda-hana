import type { ZodType } from "zod"

/** 选项 */
export interface PickerOption {
  /** 显示文本 */
  label: string
  /** 值 */
  value: string | number
  /** 禁用 */
  disabled?: boolean
}

/** 列值 */
export type ColumnValue = Record<string, string | number>

/** 列定义 */
export interface PickerColumn {
  /** 列键 */
  key: string
  /** 列标题 */
  label?: string
  /** 选项, 可依赖当前值动态生成 */
  options: readonly PickerOption[] | ((value: ColumnValue) => readonly PickerOption[])
  /** 列宽 */
  width?: number | string
  /** 禁用 */
  disabled?: boolean
}

/** 列联动 */
export interface ColumnLink {
  /** 前序列 */
  from: string
  /** 后序列 */
  to: string
}

/** Picker 属性 */
export interface PickerProps {
  /** 列, 最多 3 列 */
  columns: readonly PickerColumn[]
  /** 列联动, 默认顶动 */
  links?: readonly ColumnLink[]
  /** 自定义修正, links 之后执行 */
  normalize?: (value: ColumnValue, changed: string) => ColumnValue
  /** 受控值 */
  value?: ColumnValue | null
  /** 非受控初始值 */
  defaultValue?: ColumnValue | null
  /** 校验 */
  schema?: ZodType<ColumnValue | null>
  /** 变更回调 */
  onChange?: (value: ColumnValue | null) => void
  /** 字段名 */
  name?: string
  /** 标签 */
  label?: string
  /** 占位 */
  placeholder?: string
  /** 弹层标题 */
  title?: string
  /** 可清除 */
  clearable?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 追加样式 */
  className?: string
  /** 触发区样式 */
  triggerClassName?: string
  /** 已选文本 */
  formatValue?: (value: ColumnValue) => string
}
