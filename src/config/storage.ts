/** 存储键 */
export const STORAGE = {
  /** 主题 */
  theme: "theme",
  /** 公告 */
  announcement: {
    /** 已读时间, 毫秒时间戳 */
    readAt: "announcement.readAt",
  },
  /** 鉴权 */
  auth: {
    /** 访问令牌 */
    access: "auth.access",
    /** 刷新令牌 */
    refresh: "auth.refresh",
  },
} as const
