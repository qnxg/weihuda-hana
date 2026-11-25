/**
 * 业务码
 * 分段: 1xxxx 通用, 2xxxx 鉴权, 3xxxx 上游
 * 鉴权段内 200xx 为一般鉴权, 201xx 为大物实验平台
 * 通用段按前端处置方式划分, 具体原因由 message 说明
 */
export const CODE = {
  /** 成功 */
  ok: 0,
  /** 通用失败 */
  failed: 10001,
  /** 参数不合法 */
  invalid: 10002,
  /** 资源不存在 */
  notFound: 10003,
  /** 当前状态不允许该操作 */
  rejected: 10004,
  /** 鉴权 */
  auth: {
    /** 登录失败 */
    loginFailed: 20001,
    /** 令牌无效或过期 */
    tokenInvalid: 20002,
    /** 需要二次验证 */
    verifyRequired: 20003,
    /** 验证码错误 */
    captchaInvalid: 20004,
    /** 账号在别处登录 */
    kickOff: 20005,
    /** 令牌重复使用 */
    tokenReused: 20006,
    /** 未绑定账号 */
    notBound: 20007,
    /** 大物实验平台凭据失效, 需要重新绑定 */
    labRebind: 20101,
    /** 大物实验平台登录失败 */
    labLoginFailed: 20102,
  },
  /** 上游系统 */
  upstream: {
    /** 上游返回失败 */
    failed: 30001,
    /** 上游超时 */
    timeout: 30002,
    /** 上游鉴权失效 */
    unauthorized: 30003,
  },
} as const

/** 把码表展平成业务码字面量 */
type Leaves<T> = T extends number ? T : { [K in keyof T]: Leaves<T[K]> }[keyof T]

/** 码表里的全部业务码 */
export type AppCode = Leaves<typeof CODE>

/** 非成功码 */
export type ErrorCode = Exclude<AppCode, typeof CODE.ok>
