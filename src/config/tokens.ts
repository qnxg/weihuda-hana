/** 间距阶, 与 tune.config 的 size 同步 */
export const spacing = ["", "x", "h", "r"].flatMap(
  unit => Array.from({ length: 9 }, (_, index) => `${index}${unit}`),
)

/** 不透明度阶, 与 tune.config 的 opacity 同步 */
export const opacity = ["default", "weak", "soft", "ghost"]
