/** 存储键 */
export const STORAGE = {
  /** 主题 */
  theme: "theme",
  /** 查询缓存快照 */
  cache: "cache.query",
  /** 鉴权 */
  auth: {
    /** 访问令牌 */
    access: "auth.access",
    /** 刷新令牌 */
    refresh: "auth.refresh",
  },
  /** 实验 */
  lab: {
    /** 大物实验平台已绑定 */
    bound: "lab.bound",
  },
} as const
