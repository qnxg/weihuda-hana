import { STORAGE } from "@/config/storage"
import { storage } from "@/utils/storage"

/** 已读公告时间, 无记录为 0 */
export function getReadAt(): number {
  return Number(storage.getItem(STORAGE.announcement.readAt)) || 0
}

/** 标记公告已读 */
export function setReadAt(time: number): void {
  storage.setItem(STORAGE.announcement.readAt, String(time))
}

/** 解析接口时间, 格式 YYYY-MM-DD HH:mm:ss */
export function parseTime(value: string): number {
  return new Date(value.replace(" ", "T")).getTime()
}
