import type { Term } from "@contract/routes"

/** 查询键, 按接口域分层 */
export const QUERY_KEY = {
  auth: {
    /** 二次验证 */
    verify: ["auth", "verify"],
    /** 当前账号 */
    me: ["auth", "me"],
  },
  /** 学期 */
  semester: {
    /** 当前学期与全部学期 */
    get: ["semester"],
  },
  /** 积分 */
  point: {
    /** 积分与签到状态 */
    get: ["point"],
  },
  /** 公告 */
  announcement: {
    /** 公告列表 */
    list: ["announcement", "list"],
  },
  /** 课程 */
  course: {
    /** 课程列表, 按学期区分 */
    list: (term?: Term) => [
      "course",
      "list",
      term?.year,
      term?.semester,
    ],
  },
} as const
