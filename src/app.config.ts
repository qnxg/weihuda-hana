import { PAGE } from "./config/page"

/** tab 页 */
const tabs = [
  { path: PAGE.home, text: "首页" },
  { path: PAGE.kit, text: "工具箱" },
  { path: PAGE.table.index, text: "课表" },
  { path: PAGE.profile, text: "我的" },
]

/** 其余页面 */
const pages = [
  PAGE.auth.index,
  PAGE.form.index,
  ...Object.values(PAGE.tools),
  ...Object.values(PAGE.announcement),
  PAGE.point,
  ...Object.values(PAGE.debug),
]

/** 去掉前导斜杠, app.json 的页面路径不带斜杠 */
function strip(path: string): string {
  return path.slice(1)
}

/** 批量去掉前导斜杠 */
function route(paths: readonly string[]): string[] {
  return paths.map(strip)
}

export default defineAppConfig({
  darkmode: true,
  pages: route([
    ...tabs.map(tab => tab.path),
    ...pages,
  ]),
  tabBar: {
    custom: true,
    list: tabs.map(tab => ({
      pagePath: strip(tab.path),
      text: tab.text,
    })),
  },
  window: {
    navigationStyle: "custom",
  },
})
