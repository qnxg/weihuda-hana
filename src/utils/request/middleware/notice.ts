import type { OhNetAdapter, OhNetContext } from "@xtwis/ohnet"
import { OhNetMiddleware } from "@xtwis/ohnet"
import { LABEL } from "@/config/label"
import { BIZ_ERROR_TYPE } from "@/config/request"
import { ApiError } from "@/types/request"
import { logger } from "@/utils/logger"

/** 统一提示: 处理非业务错误 */
export class Notice extends OhNetMiddleware {
  readonly name = "notice"

  async leave(_adapter: OhNetAdapter, context: OhNetContext): Promise<void> {
    const error = context.error

    if (!(error instanceof ApiError) || error.type === BIZ_ERROR_TYPE)
      return

    // 弹窗待提示层就绪后接入
    logger.error(LABEL.request.error, error)
    error.handle()
  }
}

/** 统一提示中间件 */
export const notice = new Notice()
