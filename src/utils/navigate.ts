import { navigateTo, switchTab } from "@tarojs/taro"
import { tabbar } from "@/config/tabbar"

/** tab 页路径, 带前导斜杠 */
const tabPaths = tabbar.map(item => `/${item.path}`)

/** 跳转页面: tab 页走 switchTab, 其他走 navigateTo */
export function navigate(to: string): void {
  if (tabPaths.includes(to))
    void switchTab({ url: to })
  else
    void navigateTo({ url: to })
}
