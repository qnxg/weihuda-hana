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
  /** 工具箱入口, 按域拆分 */
  tools: {
    /** 学业成绩 */
    grade: "/pages/tools/grade/index",
    /** 实验成绩 */
    experimentGrade: "/pages/tools/experiment-grade/index",
    /** 体测成绩 */
    physicalGrade: "/pages/tools/physical-grade/index",
    /** 成绩排名 */
    rank: "/pages/tools/rank/index",
    /** 实验安排 */
    experiment: "/pages/tools/experiment/index",
    /** 考试安排 */
    exam: "/pages/tools/exam/index",
    /** 校历 */
    calendar: "/pages/tools/calendar/index",
    /** 空教室查询 */
    classroom: "/pages/tools/classroom/index",
    /** 体测标准 */
    physicalStandard: "/pages/tools/physical-standard/index",
    /** 校园卡 */
    card: "/pages/tools/card/index",
    /** 校园网 */
    netflow: "/pages/tools/netflow/index",
    /** 宿舍用电 */
    electricity: "/pages/tools/electricity/index",
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
  /** 调试包 */
  debug: {
    /** 入口 */
    index: "/pages/debug/index/index",
    /** 主题 */
    theme: "/pages/debug/theme/index",
    /** 组件 */
    comp: "/pages/debug/comp/index",
    /** 表单 */
    form: "/pages/debug/form/index",
    /** 鉴权 */
    auth: "/pages/debug/auth/index",
  },
} as const
