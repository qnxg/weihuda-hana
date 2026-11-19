/** 时段问候, 按起始小时升序 */
const GREETINGS: [number, string][] = [
  [6, "早上好"],
  [10, "上午好"],
  [12, "中午好"],
  [14, "下午好"],
  [18, "晚上好"],
  [24, "晚安"],
]

/** 问候语, 未到首个时段视为深夜 */
export function greetingOf(date: Date): string {
  const hour = date.getHours()
  const hit = [...GREETINGS].reverse().find(([from]) => hour >= from)

  return hit ? hit[1] : "晚安"
}

/** 当天寄语, 有课与否两种 */
export function wishOf(count: number): string {
  return count > 0
    ? "今天也要加油呢!"
    : "今天有什么计划?"
}
