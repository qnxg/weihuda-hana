/** 小时 */
const HOUR = 60 * 60 * 1000

/** 持久化缓存时长, 键为查询键前缀, 未列出的查询不落盘 */
export const CACHE_TTL: Record<string, number> = {
  "auth.me": 12 * HOUR,
  "semester": 12 * HOUR,
  "course.list": 24 * HOUR,
  "course.extra": 24 * HOUR,
  "exam.list": 12 * HOUR,
  "experiment.list": 12 * HOUR,
  "todo.list": 12 * HOUR,
}
