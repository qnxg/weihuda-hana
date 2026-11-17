import type { contract } from "@contract/routes"
import type { Handlers } from "@server/endpoint"
import { ok } from "@server/endpoint"

export const announcement: Handlers<typeof contract.announcement> = {
  list: () => ok([
    {
      id: 2,
      title: "微生活新版上线",
      url: null,
      content: "Hana 版正在逐步替换旧版, 欢迎反馈",
      createdAt: "2025-11-01 10:00:00",
    },
    {
      id: 1,
      title: "期末成绩查询开放",
      url: "https://weihuda.qnxg.net/grade",
      content: "成绩已同步, 可在工具箱查看",
      createdAt: "2025-10-20 08:30:00",
    },
  ]),
}
