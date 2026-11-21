import type { ColumnLink, ColumnValue, PickerColumn, PickerOption } from "@/components/form/picker/types"

/** 某月天数 */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

/** 日期是否合法 */
export function isValidDate(year: number, month: number, day: number): boolean {
  return month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth(year, month)
}

/** 年份列 */
export function createYearColumn({ from = 2000, to = 2100 }: { from?: number, to?: number } = {}): PickerColumn {
  return {
    key: "year",
    label: "年",
    options: Array.from({ length: to - from + 1 }, (_, index) => {
      const year = from + index
      return { label: `${year}`, value: year }
    }),
  }
}

/** 月份列 */
export function createMonthColumn(): PickerColumn {
  return {
    key: "month",
    label: "月",
    options: Array.from({ length: 12 }, (_, index) => ({
      label: `${index + 1}`,
      value: index + 1,
    })),
  }
}

/** 日期列, 依赖年与月 */
export function createDayColumn(): PickerColumn {
  return {
    key: "day",
    label: "日",
    options: (value: ColumnValue) => {
      const year = Number(value.year ?? 2000)
      const month = Number(value.month ?? 1)

      return Array.from({
        length: daysInMonth(year, month),
      }, (_, index) => ({
        label: `${index + 1}`,
        value: index + 1,
      }))
    },
  }
}

/** 小时列 */
export function createHourColumn(): PickerColumn {
  return {
    key: "hour",
    label: "时",
    options: Array.from({ length: 24 }, (_, index) => ({
      label: String(index).padStart(2, "0"),
      value: index,
    })),
  }
}

/** 分钟列 */
export function createMinuteColumn(): PickerColumn {
  return {
    key: "minute",
    label: "分",
    options: Array.from({ length: 60 }, (_, index) => ({
      label: String(index).padStart(2, "0"),
      value: index,
    })),
  }
}

/** 秒列 */
export function createSecondColumn(): PickerColumn {
  return {
    key: "second",
    label: "秒",
    options: Array.from({ length: 60 }, (_, index) => ({
      label: String(index).padStart(2, "0"),
      value: index,
    })),
  }
}

/** 日期列组 */
export function createDateColumns({
  precision = "day",
  from,
  to,
}: {
  /** 精度 */
  precision?: "year" | "month" | "day"
  /** 起始年份 */
  from?: number
  /** 结束年份 */
  to?: number
} = {}): PickerColumn[] {
  const columns = [
    createYearColumn({ from, to }),
  ]

  if (precision !== "year")
    columns.push(createMonthColumn())

  if (precision === "day")
    columns.push(createDayColumn())

  return columns
}

/** 时间列组 */
export function createTimeColumns({
  precision = "minute",
}: {
  /** 精度 */
  precision?: "hour" | "minute" | "second"
} = {}): PickerColumn[] {
  const columns = [
    createHourColumn(),
  ]

  if (precision !== "hour")
    columns.push(createMinuteColumn())

  if (precision === "second")
    columns.push(createSecondColumn())

  return columns
}

/** 区间列组, 默认顶动 */
export function createRangeColumns({
  start,
  end,
}: {
  /** 起始选项 */
  start: readonly PickerOption[]
  /** 结束选项 */
  end: readonly PickerOption[]
}): { columns: PickerColumn[], links: ColumnLink[] } {
  return {
    columns: [
      { key: "start", label: "开始", options: start },
      { key: "end", label: "结束", options: end },
    ],
    links: [
      { from: "start", to: "end" },
    ],
  }
}
