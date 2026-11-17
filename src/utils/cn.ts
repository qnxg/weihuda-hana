import { extendTailwindMerge } from "tailwind-merge"
import { OPACITY, SPACING } from "@/config/tokens"

const twMerge = extendTailwindMerge({
  // opacity 的默认校验只认数字, 需要换成语义键
  override: {
    classGroups: {
      opacity: [
        { opacity: OPACITY },
      ],
    },
  },
  extend: {
    theme: {
      spacing: SPACING,
    },
  },
})

/** 合并 class, 后者的同类样式覆盖前者 */
export function cn(...values: (string | false | null | undefined)[]): string {
  return twMerge(values.filter(Boolean).join(" "))
}
