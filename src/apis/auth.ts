import type {
  AuthCaptchaSendData,
  AuthCaptchaVerifyData,
  AuthCaptchaVerifyPayload,
  AuthLoginCaptchaData,
  AuthLoginCaptchaPayload,
  AuthLoginData,
  AuthLoginPayload,
  AuthLogoutData,
  AuthMeData,
  AuthRefreshData,
  AuthRefreshPayload,
} from "@contract/routes"
import { request } from "@/utils/request"

export const auth = {
  login: (payload: AuthLoginPayload) => request.post<AuthLoginData>("/auth/login", payload),
  loginCaptcha: (payload: AuthLoginCaptchaPayload) => request.post<AuthLoginCaptchaData>("/auth/login/captcha", payload),
  refresh: (payload: AuthRefreshPayload) => request.post<AuthRefreshData>("/auth/refresh", payload),
  logout: () => request.post<AuthLogoutData>("/auth/logout"),
  captchaSend: () => request.post<AuthCaptchaSendData>("/auth/captcha/send"),
  captchaVerify: (payload: AuthCaptchaVerifyPayload) => request.post<AuthCaptchaVerifyData>("/auth/captcha/verify", payload),
  me: () => request.get<AuthMeData>("/auth/me"),
}
