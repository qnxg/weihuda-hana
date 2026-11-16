/** 主题 */
export type Theme = "spring" | "summer" | "autumn"

/** 主题选择, auto 按学期推断 */
export type ThemeChoice = Theme | "auto"

/** 色彩模式 */
export type Mode = "light" | "dark"

/** 色彩模式选择, auto 跟随系统 */
export type ModeChoice = Mode | "auto"
