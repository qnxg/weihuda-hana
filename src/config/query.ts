import type { CardRecordListQueries, RankGetQueries, Term } from "@contract/routes"

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
  /** 校园卡 */
  card: {
    /** 余额 */
    get: ["card"],
    /** 流水, 按年月与类型区分 */
    recordList: (queries: CardRecordListQueries) => [
      "card",
      "record",
      queries.year,
      queries.month,
      queries.type,
    ],
  },
  /** 宿舍 */
  dorm: {
    /** 宿舍信息 */
    get: ["dorm"],
    /** 剩余电量 */
    electricity: ["dorm", "electricity"],
  },
  /** 邮件 */
  email: {
    /** 未读邮件数 */
    get: ["email"],
  },
  /** 校园网流量 */
  netflow: {
    /** 本月流量 */
    get: ["netflow"],
  },
  /** 考试 */
  exam: {
    /** 考试安排, 按学期区分 */
    list: (term?: Term) => [
      "exam",
      "list",
      term?.year,
      term?.semester,
    ],
  },
  /** 成绩 */
  grade: {
    /** 成绩列表, 按学期区分 */
    list: (term?: Term) => [
      "grade",
      "list",
      term?.year,
      term?.semester,
    ],
  },
  /** 排名 */
  rank: {
    /** 教务排名 */
    get: (queries: RankGetQueries) => [
      "rank",
      "get",
      queries.range,
      queries.dataSource,
      queries.display,
    ],
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
