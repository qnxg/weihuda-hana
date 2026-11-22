import { create } from "zustand"
import { PAGE } from "@/config/page"

/** 课表视图名 */
export type TableView = Exclude<keyof typeof PAGE.table, "index">

/** 是否课表视图 */
export function isTableView(value: unknown): value is TableView {
  return typeof value === "string" && value !== "index" && value in PAGE.table
}

interface TableState {
  /** 当前视图 */
  view: TableView
  /** 设置视图 */
  setView: (view: TableView) => void
}

/** 课表视图状态, tab 页不能带 query, 跨页指定视图走 navigateTo */
export const useTableStore = create<TableState>()(set => ({
  view: "timetable",
  setView: view => set({ view }),
}))
