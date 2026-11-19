import { z } from "zod"

// 小程序不允许动态编译代码, zod 的 fastpass 会拿到非法函数, 关闭 JIT 走解释执行
z.config({ jitless: true })

export interface Env {
  /** 请求 base url */
  baseUrl: string
  /** 是否启用 mock */
  mock: boolean
  /** mock 服务端口 */
  mockPort: number
  /** mock 响应延时, 毫秒 */
  mockDelay: number
  /** 传输层失败的最大尝试次数 */
  attempts: number
  /** 日志级别, 0: 错误, 1: 信息, 2: 调试, -1: 关闭 */
  logLevel: number
  /** 是否显示调试入口 */
  debug: boolean
}

const schema = z.object({
  baseUrl: z.url(),
  mock: z.enum(["true", "false"]).default("false").transform(value => value === "true"),
  mockPort: z.coerce.number().int().min(1).default(9300),
  mockDelay: z.coerce.number().int().min(0).max(10_000).default(0),
  attempts: z.coerce.number().int().min(1).default(3),
  logLevel: z.coerce.number().int().min(-1).max(2).default(1),
  debug: z.enum(["true", "false"]).default("false").transform(value => value === "true"),
})

/* eslint-disable node/prefer-global/process */
const raw = {
  baseUrl: process.env.TARO_APP_BASE_URL,
  mock: process.env.TARO_APP_MOCK,
  mockPort: process.env.TARO_APP_MOCK_PORT,
  mockDelay: process.env.TARO_APP_MOCK_DELAY,
  attempts: process.env.TARO_APP_ATTEMPTS,
  logLevel: process.env.TARO_APP_LOG_LEVEL,
  debug: process.env.TARO_APP_DEBUG,
}
/* eslint-enable node/prefer-global/process */

export const ENV: Env = schema.parse(raw)
