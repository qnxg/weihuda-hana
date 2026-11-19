/** 查询键, 按接口域分层 */
export const QUERY_KEY = {
  /** 首页演示 */
  demo: ["demo"],
  auth: {
    /** 二次验证 */
    verify: ["auth", "verify"],
    /** 当前账号 */
    me: ["auth", "me"],
  },
} as const
