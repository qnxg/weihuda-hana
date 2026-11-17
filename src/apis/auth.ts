import type {
  AuthCaptchaSendData,
  AuthCaptchaVerifyData,
  AuthCaptchaVerifyPayload,
  AuthLoginData,
  AuthLoginPayload,
  AuthLogoutData,
  AuthMeData,
  AuthRefreshData,
  AuthRefreshPayload,
  AuthVerifyData,
} from "@contract/routes"
import { request } from "@/utils/request"

export const auth = {
  login: (payload: AuthLoginPayload) => request.post<AuthLoginData>("/auth/login", payload),
  refresh: (payload: AuthRefreshPayload) => request.post<AuthRefreshData>("/auth/refresh", payload),
  logout: () => request.post<AuthLogoutData>("/auth/logout"),
  verify: (signal?: AbortSignal) => request.add({ signal }).post<AuthVerifyData>("/auth/verify"),
  captchaSend: () => request.post<AuthCaptchaSendData>("/auth/captcha/send"),
  captchaVerify: (payload: AuthCaptchaVerifyPayload) => request.post<AuthCaptchaVerifyData>("/auth/captcha/verify", payload),
  me: (signal?: AbortSignal) => request.add({ signal }).get<AuthMeData>("/auth/me"),
}
