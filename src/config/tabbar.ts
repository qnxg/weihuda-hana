import type { IconProps } from "lucide-react-taro"
import type { FC } from "react"
import { House, LayoutGrid, Table2, User } from "lucide-react-taro"

/** 一个标签项 */
export interface TabbarItem {
  /** 页面路径 */
  path: string
  /** 标签文字 */
  text: string
  /** 标签图标 */
  icon: FC<IconProps>
}

/** 底部标签配置, 顺序即展示顺序 */
export const tabbar: TabbarItem[] = [
  { path: "pages/home/index", text: "首页", icon: House },
  { path: "pages/kit/index", text: "工具箱", icon: LayoutGrid },
  { path: "pages/table/index", text: "课表", icon: Table2 },
  { path: "pages/profile/index", text: "我的", icon: User },
]

/** 图标色值: 图标渲染成 Image 的 data url, 拿不到 CSS 变量, 也不宜用 oklch */
export const tabbarColor = {
  active: "#f59e0b",
  inactive: "#a3a3a3",
} as const
