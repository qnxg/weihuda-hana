/** 页面路径, 带前导斜杠 */
export const PAGE = {
  /** 首页 */
  home: "/pages/home/index",
  /** 工具箱 */
  kit: "/pages/kit/index",
  /** 课表 */
  table: {
    /** 页面路由 */
    index: "/pages/table/index",
    /** 课表视图 */
    timetable: "/pages/table/index?view=timetable",
    /** 无课表视图 */
    extra: "/pages/table/index?view=extra",
    /** 日程视图 */
    schedule: "/pages/table/index?view=schedule",
  },
  /** 课程与待办表单, 类型用 type 参数区分 */
  form: {
    /** 页面路由 */
    index: "/pages/form/index",
    /** 课程表单 */
    course: "/pages/form/index?type=course",
    /** 待办表单 */
    todo: "/pages/form/index?type=todo",
  },
  /** 我的 */
  profile: "/pages/profile/index",
  /** 鉴权, 模式用 mode 参数区分 */
  auth: {
    /** 页面路由 */
    index: "/pages/auth/index",
    /** 登录 */
    login: "/pages/auth/index?mode=login",
    /** 二次验证 */
    verify: "/pages/auth/index?mode=verify",
  },
  /** 调试分包 */
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
