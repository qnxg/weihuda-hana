import type { EntryTintKey } from "@/config/entry"
import { PAGE } from "@/config/page"

/** 分组标题 */
export const TOOL_GROUP = {
  score: "成绩排名",
  teaching: "教学安排",
  life: "校园生活",
} as const

/** 工具分组 */
export type ToolGroup = keyof typeof TOOL_GROUP

/** 工具项 */
export interface ToolItem {
  /** 标题 */
  title: string
  /** 一句说明 */
  description: string
  /** 搜索关键词 */
  keywords: readonly string[]
  /** 图标与颜色语义键 */
  tint: EntryTintKey
  /** 目标页面, 未实现时指向调试页 */
  path: string
}

/** 工具目录, 顺序即展示顺序 */
export const TOOLS: Record<ToolGroup, readonly ToolItem[]> = {
  score: [
    {
      title: "学业成绩",
      description: "课程与考试成绩",
      keywords: ["学业", "课程", "考试", "成绩", "分数"],
      tint: "grade",
      path: PAGE.debug.index,
    },
    {
      title: "实验成绩",
      description: "大物实验成绩",
      keywords: ["大物", "实验", "成绩"],
      tint: "experimentGrade",
      path: PAGE.debug.index,
    },
    {
      title: "体测成绩",
      description: "体测项目与总分",
      keywords: ["体测", "体育", "成绩", "测试"],
      tint: "physicalGrade",
      path: PAGE.debug.index,
    },
    {
      title: "成绩排名",
      description: "学分与加权排名",
      keywords: ["排名", "名次", "绩点", "gpa", "加权", "算术"],
      tint: "rank",
      path: PAGE.debug.index,
    },
  ],
  teaching: [
    {
      title: "实验安排",
      description: "实验时间与地点",
      keywords: ["实验", "安排", "时间", "地点", "实验室"],
      tint: "experimentSchedule",
      path: PAGE.debug.index,
    },
    {
      title: "考试安排",
      description: "考场与考试时间",
      keywords: ["考试", "安排", "考场", "时间", "地点"],
      tint: "examSchedule",
      path: PAGE.debug.index,
    },
    {
      title: "校历",
      description: "周次与假期",
      keywords: [
        "校历",
        "日历",
        "周次",
        "开学",
        "放假",
        "假期",
        "查看",
      ],
      tint: "calendar",
      path: PAGE.debug.index,
    },
    {
      title: "空教室查询",
      description: "按时间找自习室",
      keywords: ["空教室", "自习", "教室", "空闲", "查询"],
      tint: "classroom",
      path: PAGE.debug.index,
    },
  ],
  life: [
    {
      title: "体测标准",
      description: "评分标准与对照",
      keywords: ["体测", "标准", "评分", "体育"],
      tint: "physicalStandard",
      path: PAGE.debug.index,
    },
    {
      title: "校园卡",
      description: "余额与流水",
      keywords: [
        "校园卡",
        "饭卡",
        "余额",
        "流水",
        "账单",
        "消费",
        "充值",
        "整单",
      ],
      tint: "card",
      path: PAGE.debug.index,
    },
    {
      title: "校园网",
      description: "流量与账单",
      keywords: [
        "校园网",
        "流量",
        "网费",
        "账单",
        "明细",
        "上网",
        "详情",
      ],
      tint: "netflow",
      path: PAGE.debug.index,
    },
    {
      title: "宿舍用电",
      description: "剩余电量与电费",
      keywords: ["宿舍", "用电", "电量", "电费", "剩余"],
      tint: "electricity",
      path: PAGE.debug.index,
    },
  ],
}
