import type { OhNetAdapter, OhNetContext, OhNetMiddlewareLeaveControls } from "@xtwis/ohnet"
import { CODE } from "@shared/codes"
import { OhNetMiddleware } from "@xtwis/ohnet"
import { BIZ_ERROR_TYPE } from "@/config/request"
import { ApiError } from "@/types/request"
import { getAccessToken, promptLoginLost, promptVerify, refreshToken } from "@/utils/auth"

/** 免鉴权路径 */
const publicPaths = ["/auth/login", "/auth/refresh"]

/** 自动鉴权 */
export class Auth extends OhNetMiddleware {
  readonly name = "auth"

  async enter(_adapter: OhNetAdapter, context: OhNetContext): Promise<void> {
    if (publicPaths.some(path => context.request.url.endsWith(path)))
      return

    const token = getAccessToken()
    if (token)
      context.request.headers.set("Authorization", `Bearer ${token}`)
  }

  async leave(_adapter: OhNetAdapter, context: OhNetContext, controls: OhNetMiddlewareLeaveControls): Promise<void> {
    const error = context.error

    if (!(error instanceof ApiError) || error.type !== BIZ_ERROR_TYPE)
      return

    // 令牌失效: 换令牌后重试一次, 失败交由弹窗引导重新登录
    if (error.code === CODE.auth.tokenInvalid) {
      if (await refreshToken())
        controls.retry()
      else
        promptLoginLost()

      return
    }

    // 需要验证: 弹窗引导去验证, 此处不登出
    if (error.code === CODE.auth.verifyRequired) {
      error.handle()
      promptVerify()
    }
  }
}

/** 鉴权中间件 */
export const auth = new Auth()
