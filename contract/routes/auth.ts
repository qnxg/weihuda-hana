import type { ApiSpec, Data, Payload } from "@contract/types"
import { endpoint } from "@contract/endpoint"

/** 账号信息 */
interface User {
  /** 学号 */
  id: string
  /** 姓名 */
  name: string
}

/** 令牌对 */
interface Token {
  /** 访问令牌 */
  access: string
  /** 刷新令牌 */
  refresh: string
}

/** 登录入参 */
interface LoginPayload {
  /** 账号 */
  account: string
  /** 密码 */
  password: string
}

/** 验证手机号 */
interface VerifyData {
  /** 手机号 */
  phone: string
}

/** 刷新入参 */
interface RefreshPayload {
  /** 刷新令牌 */
  refresh: string
}

/** 验证码入参 */
interface CaptchaPayload {
  /** 验证码 */
  code: string
}

/** 验证码发送结果 */
interface CaptchaSent {
  /** 冷却秒数 */
  cooldown: number
}

export const auth = {
  login: endpoint.post<never, LoginPayload, Token>("/auth/login", "登录"),
  refresh: endpoint.post<never, RefreshPayload, Token>("/auth/refresh", "刷新令牌"),
  logout: endpoint.post<never, never, null>("/auth/logout", "登出"),
  verify: endpoint.post<never, never, VerifyData>("/auth/verify", "开始验证"),
  captchaSend: endpoint.post<never, never, CaptchaSent>("/auth/captcha/send", "发送验证码"),
  captchaVerify: endpoint.post<never, CaptchaPayload, null>("/auth/captcha/verify", "二次验证"),
  me: endpoint.get<never, never, User>("/auth/me", "当前账号"),
}

export type AuthLogin = ApiSpec<typeof auth.login>
export type AuthLoginPayload = Payload<AuthLogin>
export type AuthLoginData = Data<AuthLogin>

export type AuthRefresh = ApiSpec<typeof auth.refresh>
export type AuthRefreshPayload = Payload<AuthRefresh>
export type AuthRefreshData = Data<AuthRefresh>

export type AuthLogout = ApiSpec<typeof auth.logout>
export type AuthLogoutData = Data<AuthLogout>

export type AuthVerify = ApiSpec<typeof auth.verify>
export type AuthVerifyData = Data<AuthVerify>

export type AuthCaptchaSend = ApiSpec<typeof auth.captchaSend>
export type AuthCaptchaSendData = Data<AuthCaptchaSend>

export type AuthCaptchaVerify = ApiSpec<typeof auth.captchaVerify>
export type AuthCaptchaVerifyPayload = Payload<AuthCaptchaVerify>
export type AuthCaptchaVerifyData = Data<AuthCaptchaVerify>

export type AuthMe = ApiSpec<typeof auth.me>
export type AuthMeData = Data<AuthMe>
