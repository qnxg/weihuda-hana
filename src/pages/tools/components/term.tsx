import type { TermInfo } from "@contract/routes"
import type { ReactNode } from "react"
import type { ColumnValue, PickerColumn } from "@/components/form/picker"
import { useMemo } from "react"
import { Picker } from "@/components/form/picker"
import { SEMESTER_LABEL, termLabelOf } from "@/pages/table/model/term"

export interface TermPickerProps {
  /** 全部学期 */
  terms: TermInfo[]
  /** 当前学期 */
  term: TermInfo | null
  /** 变更 */
  onChange: (term: TermInfo) => void
  /** 禁用 */
  disabled?: boolean
}

/** 学年与学期两列选择器, 触发区展示为一个框 */
export default function TermPicker({
  terms,
  term,
  onChange,
  disabled = false,
}: Readonly<TermPickerProps>): ReactNode {
  const years = useMemo(() => {
    const unique = new Set(terms.map(item => item.year))

    return [
      ...unique,
    ].sort((a, b) => b - a)
  }, [terms])

  const value: ColumnValue | null = term
    ? {
        year: term.year,
        semester: term.semester,
      }
    : null
  const columns: PickerColumn[] = [
    {
      key: "year",
      label: "学年",
      options: years.map(item => ({
        label: `${item}`,
        value: item,
      })),
    },
    {
      key: "semester",
      label: "学期",
      options: (current) => {
        const year = Number(current.year)

        return terms
          .filter(item => item.year === year)
          .map(item => ({
            label: SEMESTER_LABEL[item.semester],
            value: item.semester,
          }))
      },
    },
  ]

  function select(next: ColumnValue | null): void {
    if (!next)
      return

    const year = Number(next.year)
    const target = terms.find(item => item.year === year && item.semester === next.semester)

    if (target)
      onChange(target)
  }

  return (
    <Picker
      triggerClassName="rounded-full py-1"
      columns={columns}
      value={value}
      onChange={select}
      formatValue={() => term
        ? termLabelOf(term)
        : ""}
      title="选择学期"
      placeholder="学期"
      disabled={disabled}
    />
  )
}
