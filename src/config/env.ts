import { z } from "zod"

export interface Env {
  /** 请求 base url */
  baseUrl: string
  /** 是否启用 mock */
  mock: boolean
}

const schema = z.object({
  baseUrl: z.url(),
  mock: z.enum(["true", "false"]).default("false").transform(value => value === "true"),
})

/* eslint-disable node/prefer-global/process */
const raw = typeof process === "undefined"
  ? {}
  : { baseUrl: process.env.TARO_APP_BASE_URL, mock: process.env.TARO_APP_MOCK }
/* eslint-enable node/prefer-global/process */

export const env: Env = schema.parse(raw)
