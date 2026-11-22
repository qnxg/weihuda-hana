import type { DehydratedState, QueryClient } from "@tanstack/preact-query"
import { dehydrate, hydrate } from "@tanstack/preact-query"
import { CACHE_TTL } from "@/config/cache"
import { STORAGE } from "@/config/storage"
import { hasStoredToken } from "@/utils/auth"
import { storage } from "@/utils/storage"

/** 写盘节流, 毫秒 */
const THROTTLE = 1000

/** 快照 */
interface Snapshot {
  /** 写入时间 */
  savedAt: number
  /** 查询条目 */
  queries: DehydratedState["queries"]
}

let timer: ReturnType<typeof setTimeout> | null = null

/** 查询键前缀, 取开头的字符串段 */
function prefixOf(queryKey: readonly unknown[]): string {
  const parts: string[] = []

  for (const part of queryKey) {
    if (typeof part !== "string")
      break

    parts.push(part)
  }

  return parts.join(".")
}

/** 查询的缓存时长, 不在名单内返回 null */
function ttlOf(queryKey: readonly unknown[]): number | null {
  return CACHE_TTL[prefixOf(queryKey)] ?? null
}

/** 写盘 */
function write(client: QueryClient): void {
  if (!hasStoredToken())
    return

  const state = dehydrate(client, {
    shouldDehydrateQuery: query => ttlOf(query.queryKey) !== null,
  })

  const snapshot: Snapshot = {
    savedAt: Date.now(),
    queries: state.queries,
  }

  storage.setItem(STORAGE.cache, JSON.stringify(snapshot))
}

/** 延后写盘, 合并连续变更 */
function schedule(client: QueryClient): void {
  if (timer)
    return

  timer = setTimeout(() => {
    timer = null
    write(client)
  }, THROTTLE)
}

/** 恢复快照, 丢弃名单外与已过期的条目 */
function restore(client: QueryClient): void {
  const raw = storage.getItem(STORAGE.cache)

  if (!raw)
    return

  if (!hasStoredToken()) {
    storage.removeItem(STORAGE.cache)
    return
  }

  try {
    const snapshot = JSON.parse(raw) as Snapshot
    const now = Date.now()
    const queries = snapshot.queries.filter((query) => {
      const ttl = ttlOf(query.queryKey)

      return ttl !== null && now - query.state.dataUpdatedAt < ttl
    })

    if (queries.length === 0) {
      storage.removeItem(STORAGE.cache)
      return
    }

    hydrate(client, { queries })

    if (queries.length !== snapshot.queries.length)
      write(client)
  }
  catch {
    storage.removeItem(STORAGE.cache)
  }
}

/** 订阅查询成功, 节流写盘 */
function persist(client: QueryClient): void {
  client.getQueryCache().subscribe((event) => {
    if (event.type === "updated" && event.action.type === "success")
      schedule(client)
  })
}

/** 安装缓存, 在应用启动时调用一次 */
export function installQueryCache(client: QueryClient): void {
  restore(client)
  persist(client)
}

/** 清空持久化与内存缓存 */
export function clearQueryCache(client: QueryClient): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }

  storage.removeItem(STORAGE.cache)
  client.clear()
}
