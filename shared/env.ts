import { z } from "zod"

export interface Env {
  /** 请求 base url */
  baseUrl: string
  /** 是否启用 mock */
  mock: boolean
  /** mock 服务端口 */
  mockPort: number
  /** 传输层失败的最大尝试次数 */
  attempts: number
  /** 日志级别, 0: 错误, 1: 信息, 2: 调试, -1: 关闭 */
  logLevel: number
}

const schema = z.object({
  baseUrl: z.url(),
  mock: z.enum(["true", "false"]).default("false").transform(value => value === "true"),
  mockPort: z.coerce.number().int().min(1).default(9300),
  attempts: z.coerce.number().int().min(1).default(3),
  logLevel: z.coerce.number().int().min(-1).max(2).default(1),
})

/* eslint-disable node/prefer-global/process */
const raw = typeof process === "undefined"
  ? {}
  : {
      baseUrl: process.env.TARO_APP_BASE_URL,
      mock: process.env.TARO_APP_MOCK,
      mockPort: process.env.TARO_APP_MOCK_PORT,
      attempts: process.env.TARO_APP_ATTEMPTS,
      logLevel: process.env.TARO_APP_LOG_LEVEL,
    }
/* eslint-enable node/prefer-global/process */

export const env: Env = schema.parse(raw)
