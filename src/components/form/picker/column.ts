import type { ColumnLink, ColumnValue, PickerColumn, PickerOption } from "@/components/form/picker/types"

/** 日期 */
export interface PickerDate {
  /** 年 */
  year: number
  /** 月, 1 - 12 */
  month: number
  /** 日, 1 - 31, 缺省按对应边界取 */
  day?: number
}

/** 日期范围, 两端均包含 */
export interface DateRange {
  /** 最早日期 */
  min?: PickerDate
  /** 最晚日期 */
  max?: PickerDate
}

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

/** 月份列, 传入范围时按当前年份收紧 */
export function createMonthColumn({ min, max }: DateRange = {}): PickerColumn {
  return {
    key: "month",
    label: "月",
    options: (value) => {
      const year = Number(value.year)
      const start = min && year === min.year
        ? min.month
        : 1
      const end = max && year === max.year
        ? max.month
        : 12

      return Array.from(
        {
          length: Math.max(0, end - start + 1),
        },
        (_, index) => {
          const month = start + index

          return {
            label: `${month}`,
            value: month,
          }
        },
      )
    },
  }
}

/** 日期列, 依赖年月, 传入范围时收紧边界月 */
export function createDayColumn({ min, max }: DateRange = {}): PickerColumn {
  return {
    key: "day",
    label: "日",
    options: (value: ColumnValue) => {
      const year = Number(value.year ?? 2000)
      const month = Number(value.month ?? 1)
      const total = daysInMonth(year, month)
      const start = min && year === min.year && month === min.month
        ? min.day ?? 1
        : 1
      const end = max && year === max.year && month === max.month
        ? Math.min(max.day ?? total, total)
        : total

      return Array.from(
        {
          length: Math.max(0, end - start + 1),
        },
        (_, index) => {
          const day = start + index

          return {
            label: `${day}`,
            value: day,
          }
        },
      )
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

/** 日期列组, min / max 的 day 仅日精度生效 */
export function createDateColumns({
  precision = "day",
  from,
  to,
  min,
  max,
}: {
  /** 精度 */
  precision?: "year" | "month" | "day"
  /** 起始年份 */
  from?: number
  /** 结束年份 */
  to?: number
  /** 最早日期 */
  min?: PickerDate
  /** 最晚日期 */
  max?: PickerDate
} = {}): PickerColumn[] {
  const columns = [
    createYearColumn({
      from: min?.year ?? from,
      to: max?.year ?? to,
    }),
  ]

  if (precision !== "year")
    columns.push(createMonthColumn({ min, max }))

  if (precision === "day")
    columns.push(createDayColumn({ min, max }))

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
