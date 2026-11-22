import { PAGE } from "./config/page"

/** 调试子包根 */
const DEBUG_ROOT = "packages/debug"

/** tab 页 */
const tabs = [
  { path: PAGE.home, text: "首页" },
  { path: PAGE.kit, text: "工具箱" },
  { path: PAGE.table.index, text: "课表" },
  { path: PAGE.profile, text: "我的" },
]

/** 其余主包页面 */
const pages = [PAGE.auth.index, PAGE.form.index]

/** 调试子包页面 */
const debugPages = [
  PAGE.debug.index,
  PAGE.debug.theme,
  PAGE.debug.comp,
  PAGE.debug.form,
  PAGE.debug.auth,
]

/** 去掉前导斜杠, app.json 的页面路径不带斜杠 */
function strip(path: string): string {
  return path.slice(1)
}

/** 批量去掉前导斜杠 */
function route(paths: readonly string[]): string[] {
  return paths.map(strip)
}

/** 子包内页面路径, 去掉子包根 */
function inner(root: string, paths: readonly string[]): string[] {
  return paths.map(path => path.slice(root.length))
}

export default defineAppConfig({
  darkmode: true,
  pages: route([
    ...tabs.map(tab => tab.path),
    ...pages,
  ]),
  subPackages: [
    {
      root: DEBUG_ROOT,
      pages: inner(`/${DEBUG_ROOT}/`, debugPages),
    },
  ],
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
