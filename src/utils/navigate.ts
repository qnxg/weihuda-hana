import { getCurrentPages, switchTab, navigateBack as taroNavigateBack, navigateTo as taroNavigateTo } from "@tarojs/taro"
import { PAGE } from "@/config/page"
import { TABBAR } from "@/config/tabbar"
import { isTableView, useTableStore } from "@/stores/table"

/** tab 页路径, 带前导斜杠 */
const tabPaths = TABBAR.map(item => item.path)

/** 跳转参数 */
export type NavigateParams = Record<string, string | number | null | undefined>

/** 可跳转的页面路径 */
export type NavigateTarget = string

/**
 * tab 页不能用 query 带参, 参数在各页面的入口里消化
 * 新增 tab 页的参数时在这里登记
 */
const TAB_ENTRY: Record<string, (params: NavigateParams) => void> = {
  [PAGE.table.index]: (params) => {
    if (isTableView(params.view))
      useTableStore.getState().setView(params.view)
  },
}

/** 拆出路径与查询 */
function splitUrl(url: string): { path: string, params: NavigateParams } {
  const [path, query = ""] = url.split("?")
  const params: NavigateParams = {}

  for (const pair of query.split("&")) {
    if (!pair)
      continue

    const [key, value = ""] = pair.split("=")
    params[decodeURIComponent(key)] = decodeURIComponent(value)
  }

  return { path, params }
}

/** 拼查询串, 跳过空值 */
function queryOf(params: NavigateParams): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)

  return query.length > 0
    ? `?${query.join("&")}`
    : ""
}

/** 当前页面路由, 不带前导斜杠 */
export function currentRoute(): string {
  const pages = getCurrentPages()
  return pages[pages.length - 1]?.route ?? ""
}

/** 跳转页面, 第二个参数按 k=v 拼到路径后, tab 页的 query 交给 TAB_ENTRY */
export function navigateTo(to: NavigateTarget, params: NavigateParams = {}): void {
  const { path, params: query } = splitUrl(to)
  const merged = {
    ...query,
    ...params,
  }

  if (tabPaths.includes(path)) {
    TAB_ENTRY[path]?.(merged)
    void switchTab({ url: path })
    return
  }

  void taroNavigateTo({ url: `${path}${queryOf(merged)}` })
}

/** 返回来源页 */
export function navigateBack(): void {
  taroNavigateBack().catch(() => navigateTo(PAGE.home))
}
