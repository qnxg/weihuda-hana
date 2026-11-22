import type { AuthRefreshData, AuthRefreshPayload } from "@contract/routes"
import { OhNetClient } from "@xtwis/ohnet"
import { STORAGE } from "@/config/storage"
import { useAuthStore } from "@/stores/auth"
import { adapter } from "@/utils/request/adapter"
import { resolveBaseUrl } from "@/utils/request/base"
import { normalize } from "@/utils/request/middleware/normalize"
import { snackbar } from "@/utils/snackbar"
import { storage } from "@/utils/storage"

/** 刷新专用请求实例, 不走 auth 中间件 */
const client = OhNetClient.create({
  url: resolveBaseUrl(),
  adapter,
}).with(normalize)

let access = ""
let refresh = ""
let refreshing: Promise<string | null> | null = null

/** 载入令牌 */
export function hydrateToken(): void {
  access = storage.getItem(STORAGE.auth.access) ?? ""
  refresh = storage.getItem(STORAGE.auth.refresh) ?? ""
}

/** 读取访问令牌 */
export function getAccessToken(): string {
  return access
}

/** 是否已登录 */
export function hasToken(): boolean {
  return access !== "" || refresh !== ""
}

/** 存储中是否存在令牌, 用于内存尚未载入的初始化阶段 */
export function hasStoredToken(): boolean {
  return storage.getItem(STORAGE.auth.access) !== null
    || storage.getItem(STORAGE.auth.refresh) !== null
}

/** 写入令牌 */
export function setToken(token: AuthRefreshData): void {
  access = token.access
  refresh = token.refresh
  storage.setItem(STORAGE.auth.access, access)
  storage.setItem(STORAGE.auth.refresh, refresh)
}

/** 清除令牌 */
export function clearToken(): void {
  access = ""
  refresh = ""
  storage.removeItem(STORAGE.auth.access)
  storage.removeItem(STORAGE.auth.refresh)
}

/** 单飞刷新, 并发调用共用同一个 Promise */
export function refreshToken(): Promise<string | null> {
  refreshing ??= doRefresh().finally(() => {
    refreshing = null
  })
  return refreshing
}

/** 用刷新令牌换新令牌 */
async function doRefresh(): Promise<string | null> {
  if (!refresh)
    return null

  snackbar.show("同步用户数据")

  try {
    const payload: AuthRefreshPayload = { refresh }
    setToken(await client.post<AuthRefreshData>("/auth/refresh", payload))
    return access
  }
  catch {
    clearToken()
    return null
  }
}

/** 登录失效: 弹窗引导重新登录 */
export function promptLoginLost(): void {
  useAuthStore.getState().ask("loginLost")
}

/** 需要二次验证: 弹窗引导去验证 */
export function promptVerify(): void {
  useAuthStore.getState().ask("verify")
}

/** 解锁全部提示, 允许下次失效再次弹窗 */
export function unlockAuthPrompts(): void {
  useAuthStore.getState().unlock()
}
