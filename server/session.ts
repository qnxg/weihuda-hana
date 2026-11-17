import type { HeaderReader } from "@server/endpoint"

/** 令牌类型 */
export type TokenKind = "access" | "refresh"

/** 令牌对 */
export interface Token {
  /** 访问令牌 */
  access: string
  /** 刷新令牌 */
  refresh: string
}

/** 演示账号的行为 */
interface Behavior {
  /** 访问令牌初始失效 */
  expired: boolean
  /** 支持刷新 */
  refreshable: boolean
  /** 学校侧接口要求二次验证 */
  verify: boolean
}

/** 会话 */
export interface Session extends Behavior {
  /** 账号 */
  account: string
  /** 当前访问令牌是否过期 */
  stale: boolean
  /** 是否已通过二次验证 */
  verified: boolean
  /** 令牌序号 */
  seed: number
}

/** 普通账号 */
const normal: Behavior = { expired: false, refreshable: true, verify: false }

/** 演示账号行为 */
const behaviors = new Map<string, Behavior>([
  [
    "refresh",
    { expired: true, refreshable: true, verify: false },
  ],
  [
    "expire",
    { expired: true, refreshable: false, verify: false },
  ],
  [
    "verify",
    { expired: false, refreshable: true, verify: true },
  ],
])

const sessions = new Map<string, Session>()

/** 签发一对令牌 */
function issue(session: Session): Token {
  session.seed += 1
  return {
    access: `access.${session.account}.${session.seed}`,
    refresh: `refresh.${session.account}.${session.seed}`,
  }
}

/** 从令牌解析账号 */
function parse(token: string, kind: TokenKind): string | null {
  const prefix = `${kind}.`

  if (!token.startsWith(prefix))
    return null

  const rest = token.slice(prefix.length)
  const index = rest.lastIndexOf(".")

  return index === -1
    ? null
    : rest.slice(0, index)
}

/** 读取令牌对应的会话 */
function sessionOf(token: string, kind: TokenKind): Session | null {
  const account = parse(token, kind)
  return account
    ? sessions.get(account) ?? null
    : null
}

/** 从请求头取访问令牌 */
function bearer(header: HeaderReader): string {
  return header("authorization")?.replace(/^Bearer\s+/i, "") ?? ""
}

/** 从请求头取会话 */
export function sessionFrom(header: HeaderReader): Session | null {
  return sessionOf(bearer(header), "access")
}

/** 登录并签发令牌 */
export function login(account: string): Token | null {
  if (!account)
    return null

  const behavior = behaviors.get(account) ?? normal
  const session: Session = {
    ...behavior,
    account,
    stale: behavior.expired,
    verified: false,
    seed: 0,
  }

  sessions.set(account, session)
  return issue(session)
}

/** 刷新令牌 */
export function refresh(token: string): Token | null {
  const session = sessionOf(token, "refresh")

  if (!session || !session.refreshable)
    return null

  session.stale = false
  return issue(session)
}

/** 标记会话已通过二次验证 */
export function verify(session: Session): void {
  session.verified = true
}

/** 销毁会话 */
export function logout(session: Session): void {
  sessions.delete(session.account)
}

/** 是否需要二次验证 */
export function verifyRequired(session: Session): boolean {
  return session.verify && !session.verified
}
