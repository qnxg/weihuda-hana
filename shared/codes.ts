/**
 * 业务码
 * 分段: 1xxx 通用, 2xxx 鉴权, 3xxx 上游
 * 通用段按前端处置方式划分, 具体原因由 message 说明
 */
export const CODE = {
  /** 成功 */
  ok: 0,
  /** 通用失败 */
  failed: 1001,
  /** 参数不合法 */
  invalid: 1002,
  /** 资源不存在 */
  notFound: 1003,
  /** 当前状态不允许该操作 */
  rejected: 1004,
  /** 鉴权 */
  auth: {
    /** 登录失败 */
    loginFailed: 2101,
    /** 令牌无效或过期 */
    tokenInvalid: 2102,
    /** 需要二次验证 */
    verifyRequired: 2103,
    /** 验证码错误 */
    captchaInvalid: 2104,
    /** 账号在别处登录 */
    kickOff: 2105,
    /** 令牌重复使用 */
    tokenReused: 2106,
    /** 未绑定账号 */
    notBound: 2107,
  },
  /** 上游系统 */
  upstream: {
    /** 上游返回失败 */
    failed: 3001,
    /** 上游超时 */
    timeout: 3002,
    /** 上游鉴权失效 */
    unauthorized: 3003,
    /** 上游账号需要重新绑定 */
    rebind: 3004,
    /** 上游登录失败 */
    loginFailed: 3005,
  },
} as const

/** 把码表展平成业务码字面量 */
type Leaves<T> = T extends number ? T : { [K in keyof T]: Leaves<T[K]> }[keyof T]

/** 码表里的全部业务码 */
export type AppCode = Leaves<typeof CODE>

/** 非成功码 */
export type ErrorCode = Exclude<AppCode, typeof CODE.ok>
