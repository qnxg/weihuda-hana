/** 间距阶, 与 tune.config 的 size 同步 */
export const SPACING = ["", "x", "h", "r"].flatMap(
  unit => Array.from({ length: 9 }, (_, index) => `${index}${unit}`),
)

/** 不透明度阶, 与 tune.config 的 opacity 同步 */
export const OPACITY = ["default", "weak", "soft", "ghost"]
