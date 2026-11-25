import { od } from "@xtwis/ohday"

/** 接口不可用时关于信息的兜底 */
export const ABOUT_FALLBACK = {
  /** 版本号 */
  version: "0.1.0",
  /** 官网 */
  home: "https://qnxg.cn",
  /** 招新 */
  join: "https://join.qnxg.cn",
  /** 标语 */
  slogans: [
    "遵循本心, 自我驱动, 无限创造",
    "易千网络文化工作室欢迎你 ~",
    "用代码构建我们的微生活 !",
  ],
}

/** 取链接的域名, 用于列表右侧展示 */
export function hostOf(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

/** 版权行 */
export function copyrightOf(): string {
  return `Copyright © 2017-${od().year} 易千网络文化工作室`
}
