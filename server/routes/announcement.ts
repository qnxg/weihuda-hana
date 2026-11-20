import type { AnnouncementItem, contract } from "@contract/routes"
import type { HandlerInput, Handlers } from "@server/endpoint"
import { fail, ok } from "@server/endpoint"
import { sessionFrom } from "@server/session"
import { CODE } from "@shared/codes"

const items: Omit<AnnouncementItem, "read">[] = [
  {
    id: 2,
    title: "微生活新版上线",
    url: null,
    content: "Hana 版正在逐步替换旧版, 欢迎反馈",
    createdAt: "2026-11-01 10:00:00",
  },
  {
    id: 1,
    title: "期末成绩查询开放",
    url: "https://weihuda.qnxg.net/grade",
    content: "成绩已同步, 可在工具箱查看",
    createdAt: "2026-10-20 08:30:00",
  },
]

/** 已读公告 id, 按会话区分, 无记录的会话视为全未读 */
const readIds = new Map<number, Set<number>>()

/** 会话的已读集合 */
function readSetOf(header: HandlerInput<never>["header"]): Set<number> | null {
  const session = sessionFrom(header)

  if (!session)
    return null

  let set = readIds.get(session.id)

  if (!set) {
    set = new Set()
    readIds.set(session.id, set)
  }

  return set
}

export const announcement: Handlers<typeof contract.announcement> = {
  list: ({ header }) => {
    const set = readSetOf(header)

    return ok(items.map(item => ({
      ...item,
      read: set?.has(item.id) ?? false,
    })))
  },
  read: ({ params, header }) => {
    const item = items.find(entry => entry.id === Number(params.id))

    if (!item)
      return fail(CODE.notFound, "公告不存在")

    readSetOf(header)?.add(item.id)
    return ok(null)
  },
  readAll: ({ header }) => {
    const set = readSetOf(header)

    if (set)
      items.forEach(item => set.add(item.id))

    return ok(null)
  },
}
