import { getCurrentPages, switchTab, navigateBack as taroNavigateBack, navigateTo as taroNavigateTo } from "@tarojs/taro"
import { PAGE } from "@/config/page"
import { TABBAR } from "@/config/tabbar"
import { isTableView, useTableStore } from "@/stores/table"

/** tab 页路径, 带前导斜杠 */
const tabPaths = TABBAR.map(item => item.path)

/** 跳转参数 */
export type NavigateParams = Record<string, string | number | null | undefined>

/** 可跳转的目标, 带切换的页面传对象时取 index, 视图用 PAGE 里的具体键 */
export type NavigateTarget = string | { index: string }

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

/** 跳转页面, tab 页的 query 交给 TAB_ENTRY, 普通页面照常拼接 */
export function navigateTo(to: NavigateTarget, params: NavigateParams = {}): void {
  const { path, params: query } = splitUrl(typeof to === "string"
    ? to
    : to.index)
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
