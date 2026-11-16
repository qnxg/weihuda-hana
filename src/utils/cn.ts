import { twMerge } from "tailwind-merge"

/** 合并 class, 后者的同类样式覆盖前者 */
export function cn(...values: (string | false | null | undefined)[]): string {
  return twMerge(values.filter(Boolean).join(" "))
}
