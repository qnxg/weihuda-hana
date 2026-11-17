let seed = 0

/** 生成 id */
export function createId(prefix: string): string {
  seed += 1
  return `${prefix}-${seed}`
}
