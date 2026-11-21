import type { ReactNode } from "react"
import type { ColumnValue, PickerProps } from "@/components/form/picker/types"
import { useState } from "react"
import PickerField from "@/components/form/picker/field"
import PickerPopup from "@/components/form/picker/popup"
import { optionsOf } from "@/components/form/picker/utils"
import { useFormField } from "@/hooks/form"

/** 多列选择器 */
export default function Picker({
  columns,
  links = [],
  normalize,
  value,
  defaultValue = null,
  schema,
  onChange,
  name,
  label,
  placeholder = "请选择",
  title,
  clearable = false,
  disabled = false,
  className,
  triggerClassName,
  formatValue,
}: Readonly<PickerProps>): ReactNode {
  const controlled = value !== undefined
  const [inner, setInner] = useState<ColumnValue | null>(defaultValue ?? null)
  const current = controlled ? value : inner
  const { message, markTouched, clear } = useFormField<ColumnValue | null>({ name, schema, value: current })
  const [open, setOpen] = useState(false)

  if (columns.length === 0)
    throw new Error("Picker requires at least one column")

  if (columns.length > 3)
    throw new Error("Picker supports at most 3 columns")

  const selected = current
    ? columns.map((column) => {
        const options = optionsOf(column, current)
        return options.find(option => option.value === current[column.key])?.label
          ?? String(current[column.key] ?? "")
      }).filter(Boolean)
    : []
  const display = current
    ? formatValue?.(current) ?? selected.join(" / ")
    : ""
  const hasValue = current !== null

  function setValue(next: ColumnValue | null): void {
    if (!controlled)
      setInner(next)

    onChange?.(next)
  }

  function commit(next: ColumnValue | null): void {
    setValue(next)
    clear()
    markTouched()
    setOpen(false)
  }

  return (
    <>
      <PickerField
        label={label}
        placeholder={placeholder}
        display={display}
        message={message}
        hasValue={hasValue}
        clearable={clearable}
        disabled={disabled}
        className={className}
        triggerClassName={triggerClassName}
        onOpen={() => setOpen(true)}
        onClear={() => commit(null)}
      />
      <PickerPopup
        visible={open}
        title={title ?? label}
        columns={columns}
        value={current}
        links={links}
        normalize={normalize}
        onConfirm={commit}
        onClose={() => {
          setOpen(false)
          markTouched()
        }}
      />
    </>
  )
}
