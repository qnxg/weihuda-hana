import type { ReactNode } from "react"
import type { ModeChoice, ThemeChoice } from "@/types/theme"
import { ENV } from "@shared/env"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import { PAGE } from "@/config/page"
import { useTheme } from "@/hooks/theme"
import { navigateTo } from "@/utils/navigate"

/** 可切换的主题 */
const THEMES: readonly { label: string, value: ThemeChoice }[] = [
  { label: "春", value: "spring" },
  { label: "夏", value: "summer" },
  { label: "秋", value: "autumn" },
]

/** 可切换的模式 */
const MODES: readonly { label: string, value: ModeChoice }[] = [
  { label: "亮", value: "light" },
  { label: "暗", value: "dark" },
]

/** 下一个选项 */
function nextOf<T extends { value: string }>(list: readonly T[], current: string): T {
  return list[(list.findIndex(item => item.value === current) + 1) % list.length]
}

/** 当前选项的文本 */
function labelOf<T extends { label: string, value: string }>(list: readonly T[], current: string): string {
  return list.find(item => item.value === current)?.label ?? "自动"
}

/** 调试入口 */
export default function Debug(): ReactNode {
  const { themeChoice, modeChoice, setThemeChoice, setModeChoice } = useTheme()

  if (!ENV.debug)
    return null

  return (
    <View className="absolute bottom-2r right-2r flex items-center gap-1 pointer-events-auto">
      <Button
        className="px-2 py-1 text-xs"
        onClick={() => setThemeChoice(nextOf(THEMES, themeChoice).value)}
      >
        <Text>{labelOf(THEMES, themeChoice)}</Text>
      </Button>
      <Button
        className="px-2 py-1 text-xs"
        onClick={() => setModeChoice(nextOf(MODES, modeChoice).value)}
      >
        <Text>{labelOf(MODES, modeChoice)}</Text>
      </Button>
      <Button
        className="px-2 py-1 text-xs"
        onClick={() => navigateTo(PAGE.debug.index)}
      >
        <Text>调试</Text>
      </Button>
    </View>
  )
}
