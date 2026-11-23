import type { NetflowOrderItem } from "@contract/routes"

/** 百分比夹在 0 - 100 */
export function percentOf(value: number): number {
  return Math.min(100, Math.max(0, value))
}

/** 时间文本, 到分钟 */
export function timeOf(value: string): string {
  return value.slice(0, 16)
}

/** 账单按年月倒序 */
export function sortOrders(list: readonly NetflowOrderItem[]): NetflowOrderItem[] {
  return [
    ...list,
  ].sort((a, b) => b.year - a.year || b.month - a.month)
}
