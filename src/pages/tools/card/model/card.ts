import type { CardRecordItem, CardRecordType } from "@contract/routes"
import { od } from "@xtwis/ohday"
import { dateOf } from "@/utils/date"

/** 交易类型选项 */
export const TYPES = [
  { key: "consumption", label: "消费" },
  { key: "recharge", label: "充值" },
] as const satisfies readonly { key: CardRecordType, label: string }[]

/** 金额文本, 正数带加号 */
export function amountOf(amount: number): string {
  return `${amount > 0
    ? "+"
    : ""}${amount.toFixed(2)}`
}

/** 余额文本 */
export function moneyOf(value: number): string {
  return value.toFixed(2)
}

/** 按交易日分组的流水 */
export interface RecordGroup {
  /** 组键 */
  key: string
  /** 组标题 */
  label: string
  /** 当天流水 */
  items: CardRecordItem[]
}

/** 按交易日倒序分组 */
export function groupsOf(records: readonly CardRecordItem[]): RecordGroup[] {
  const sorted = [
    ...records,
  ].sort((a, b) => b.tradedAt.localeCompare(a.tradedAt))
  const groups: RecordGroup[] = []

  for (const item of sorted) {
    const key = item.tradedAt.slice(0, 10)
    const last = groups[groups.length - 1]

    if (last && last.key === key) {
      last.items.push(item)
      continue
    }

    groups.push({
      key,
      label: dateOf(od(key).dd),
      items: [item],
    })
  }

  return groups
}
