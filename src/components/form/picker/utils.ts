import type { ColumnLink, ColumnValue, PickerColumn, PickerOption } from "@/components/form/picker/types"

/** 当前列选项 */
export function optionsOf(column: PickerColumn, value: ColumnValue): readonly PickerOption[] {
  return typeof column.options === "function"
    ? column.options(value)
    : column.options
}

/** 最接近的选项 */
export function closestOf(options: readonly PickerOption[], value: string | number | undefined): PickerOption | undefined {
  if (options.length === 0)
    return undefined

  if (value === undefined)
    return options[0]

  const exact = options.find(option => option.value === value)
  if (exact)
    return exact

  if (typeof value === "number") {
    return options.reduce((best, option) => {
      const diff = Math.abs(Number(option.value) - value)
      const bestDiff = Math.abs(Number(best.value) - value)
      return diff < bestDiff
        ? option
        : best
    }, options[0])
  }

  return options[0]
}

/** 按列顺序夹取到合法值 */
export function clampValue(columns: readonly PickerColumn[], value: ColumnValue): ColumnValue {
  const next: ColumnValue = { ...value }

  for (const column of columns) {
    const options = optionsOf(column, next)
    const option = closestOf(options, next[column.key])

    if (option)
      next[column.key] = option.value
  }

  return next
}

/** 初始草稿 */
export function initialValueOf(columns: readonly PickerColumn[], value: ColumnValue | null): ColumnValue {
  const next: ColumnValue = {}

  for (const column of columns) {
    const options = optionsOf(column, next)
    const option = closestOf(options, value?.[column.key])

    if (option)
      next[column.key] = option.value
  }

  return next
}

/** 值转索引 */
export function indicesOf(columns: readonly PickerColumn[], value: ColumnValue): number[] {
  return columns.map((column) => {
    const options = optionsOf(column, value)
    const option = closestOf(options, value[column.key])

    if (!option)
      return 0

    const index = options.findIndex(item => item.value === option.value)
    return index >= 0
      ? index
      : 0
  })
}

/** 未变化列保留旧值, 旧值不存在时按旧索引夹取 */
export function clampDependent(
  columns: readonly PickerColumn[],
  value: ColumnValue,
  previousValue: ColumnValue,
  previousIndices: readonly number[],
): ColumnValue {
  const next: ColumnValue = { ...value }

  columns.forEach((column, index) => {
    if (next[column.key] !== previousValue[column.key])
      return

    const options = optionsOf(column, next)

    if (options.length === 0)
      return

    if (options.some(option => option.value === next[column.key]))
      return

    const position = Math.min(Math.max(previousIndices[index] ?? 0, 0), options.length - 1)
    const option = options[position]

    if (option)
      next[column.key] = option.value
  })

  return next
}

/** 比较两个列值 */
function compare(a: string | number, b: string | number): number {
  if (typeof a === "number" && typeof b === "number")
    return a - b

  return String(a).localeCompare(String(b))
}

/** 应用顶动 */
export function applyLinks(value: ColumnValue, links: readonly ColumnLink[], changed: string): ColumnValue {
  const next = { ...value }

  for (const link of links) {
    const from = next[link.from]
    const to = next[link.to]

    if (from === undefined || to === undefined)
      continue

    if (changed === link.from && compare(from, to) > 0)
      next[link.to] = from

    if (changed === link.to && compare(to, from) < 0)
      next[link.from] = to
  }

  return next
}
