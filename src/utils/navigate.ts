import { getCurrentPages, switchTab, navigateBack as taroNavigateBack, navigateTo as taroNavigateTo } from "@tarojs/taro"
import { PAGE } from "@/config/page"
import { TABBAR } from "@/config/tabbar"

/** tab 页路径, 带前导斜杠 */
const tabPaths = TABBAR.map(item => item.path)

/** 当前页面路由, 不带前导斜杠 */
export function currentRoute(): string {
  const pages = getCurrentPages()
  return pages[pages.length - 1]?.route ?? ""
}

/** 跳转页面 */
export function navigateTo(to: string): void {
  if (tabPaths.includes(to))
    void switchTab({ url: to })
  else
    void taroNavigateTo({ url: to })
}

/** 返回来源页 */
export function navigateBack(): void {
  taroNavigateBack().catch(() => navigateTo(PAGE.home))
}
