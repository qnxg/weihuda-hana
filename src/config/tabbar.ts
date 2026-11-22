import type { IconProps } from "lucide-react-taro"
import type { FC } from "react"
import { House, LayoutGrid, Table2, User } from "lucide-react-taro"
import { PAGE } from "@/config/page"

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
export const TABBAR: TabbarItem[] = [
  { path: PAGE.home, text: "首页", icon: House },
  { path: PAGE.kit, text: "工具箱", icon: LayoutGrid },
  { path: PAGE.table.index, text: "课表", icon: Table2 },
  { path: PAGE.profile, text: "我的", icon: User },
]
