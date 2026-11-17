import { ENV } from "@shared/env"

/** 解析请求地址, mock 开启时直连本地 mock 服务 */
export function resolveBaseUrl(): string {
  return ENV.mock
    ? `http://localhost:${ENV.mockPort}`
    : ENV.baseUrl
}
