import type { CardRecordListQueries, NetflowDetailGetQueries, RankGetQueries, RoomListQueries, Term } from "@contract/routes"

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
    /** 积分记录 */
    record: ["point", "record"],
    /** 积分商品 */
    goods: ["point", "goods"],
    /** 待领取 */
    exchange: ["point", "exchange"],
    /** 积分规则 */
    desc: ["point", "desc"],
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
  /** 空教室 */
  room: {
    /** 教学楼 */
    buildings: ["room", "buildings"],
    /** 空教室, 按楼栋, 日期与节次区分 */
    list: (queries?: RoomListQueries) => [
      "room",
      "list",
      queries?.building,
      queries?.date,
      queries?.times,
    ],
  },
  /** 校园网流量 */
  netflow: {
    /** 本月流量 */
    get: ["netflow"],
    /** 历史账单 */
    orderList: ["netflow", "order"],
    /** 流量明细, 按年月与日区分 */
    detail: (queries: NetflowDetailGetQueries) => [
      "netflow",
      "detail",
      queries.year,
      queries.month,
      queries.day,
    ],
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
  /** 实验 */
  experiment: {
    /** 实验域整体, 用于绑定后统一失效 */
    all: ["experiment"],
    /** 实验安排, 按学期区分 */
    list: (term?: Term) => [
      "experiment",
      "list",
      term?.year,
      term?.semester,
    ],
    /** 实验成绩, 按学期区分 */
    grade: (term?: Term) => [
      "experiment",
      "grade",
      term?.year,
      term?.semester,
    ],
  },
  /** 待办 */
  todo: {
    /** 待办列表, 按学期区分 */
    list: (term?: Term) => [
      "todo",
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
    /** 单科成绩详情 */
    get: (detailId: string) => [
      "grade",
      "get",
      detailId,
    ],
  },
  /** 排名 */
  rank: {
    /** 教务排名 */
    get: (queries: RankGetQueries) => [
      "rank",
      "get",
      queries.year,
      queries.semester,
      queries.range,
      queries.dataSource,
      queries.display,
    ],
    /** 可信电子凭证排名 */
    ca: ["rank", "ca"],
  },
  /** 体测 */
  physical: {
    /** 体测成绩, 按学年区分 */
    get: (year?: number) => [
      "physical",
      year,
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
    /** 无课表课程, 按学期区分 */
    extraList: (term?: Term) => [
      "course",
      "extra",
      term?.year,
      term?.semester,
    ],
  },
} as const
