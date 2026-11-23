import type { AnnouncementItem } from "@contract/routes"

/** 按发布时间倒序 */
export function sortOf(list: readonly AnnouncementItem[]): AnnouncementItem[] {
  return [
    ...list,
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

/** 列表日期文本, 如 2026-11-01 */
export function dateOf(item: AnnouncementItem): string {
  return item.createdAt.slice(0, 10)
}

/** 详情日期时间文本, 如 2026-11-01 10:00 */
export function dateTimeOf(item: AnnouncementItem): string {
  return item.createdAt.slice(0, 16)
}

/** 正文段落 */
export interface AnnouncementSection {
  /** 段落键, 取行首偏移 */
  key: string
  /** 段落文本 */
  text: string
}

/** 正文分段, 按换行拆分并去掉空行 */
export function sectionsOf(content: string): AnnouncementSection[] {
  const sections: AnnouncementSection[] = []
  let offset = 0

  for (const line of content.split("\n")) {
    const text = line.trim()

    if (text)
      sections.push({ key: `${offset}`, text })

    offset += line.length + 1
  }

  return sections
}
