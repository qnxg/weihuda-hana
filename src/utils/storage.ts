import { getStorageSync, removeStorageSync, setStorageSync } from "@tarojs/taro"

/** 同步存储, 供持久化使用 */
export const storage = {
  /** 读取字符串, 不存在时返回 null */
  getItem(name: string): string | null {
    const value = getStorageSync(name)
    return typeof value === "string" && value !== ""
      ? value
      : null
  },
  /** 写入字符串 */
  setItem(name: string, value: string): void {
    setStorageSync(name, value)
  },
  /** 删除 */
  removeItem(name: string): void {
    removeStorageSync(name)
  },
}
