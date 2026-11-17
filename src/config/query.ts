/** 查询键, 按接口域分层 */
export const QUERY_KEY = {
  auth: {
    /** 二次验证 */
    verify: ["auth", "verify"],
    /** 当前账号 */
    me: ["auth", "me"],
  },
} as const
