import { getCurrentPages, navigateTo, switchTab } from "@tarojs/taro"
import { TABBAR } from "@/config/tabbar"

/** tab 页路径, 带前导斜杠 */
const tabPaths = TABBAR.map(item => `/${item.path}`)

/** 当前页面路由, 不带前导斜杠 */
export function currentRoute(): string {
  const pages = getCurrentPages()
  return pages[pages.length - 1]?.route ?? ""
}

/** 跳转页面: tab 页走 switchTab, 其他走 navigateTo */
export function navigate(to: string): void {
  if (tabPaths.includes(to))
    void switchTab({ url: to })
  else
    void navigateTo({ url: to })
}
