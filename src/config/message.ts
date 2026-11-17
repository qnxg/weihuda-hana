import { OHNET_ADAPTER_ERROR_CODE } from "@xtwis/ohnet"

/** 传输层错误的原因, 按错误码索引 */
const reason: Record<string, string> = {
  [OHNET_ADAPTER_ERROR_CODE.NETWORK]: "网络连接失败",
  [OHNET_ADAPTER_ERROR_CODE.TIMEOUT]: "请求超时",
}

/** 提示文案 */
export const MESSAGE = {
  /** 请求 */
  request: {
    /** 非业务错误的统一前缀 */
    failed: "请求失败",
    /** 传输层错误的原因 */
    reason,
  },
} as const
