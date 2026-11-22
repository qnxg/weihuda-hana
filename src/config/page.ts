/** 页面路径, 带前导斜杠 */
export const PAGE = {
  /** 首页 */
  home: "/pages/home/index",
  /** 工具箱 */
  kit: "/pages/kit/index",
  /** 课表 */
  table: "/pages/table/index",
  /** 课程与待办表单 */
  form: "/pages/form/index",
  /** 我的 */
  profile: "/pages/profile/index",
  /** 鉴权 */
  auth: "/pages/auth/index",
  /** 调试 */
  debug: {
    /** 入口 */
    index: "/packages/debug/pages/index/index",
    /** 主题 */
    theme: "/packages/debug/pages/theme/index",
    /** 组件 */
    comp: "/packages/debug/pages/comp/index",
    /** 表单 */
    form: "/packages/debug/pages/form/index",
    /** 鉴权 */
    auth: "/packages/debug/pages/auth/index",
  },
} as const
