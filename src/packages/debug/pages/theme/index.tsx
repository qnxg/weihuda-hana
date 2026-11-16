import type { ReactNode } from "react"
import type { ModeChoice, ThemeChoice } from "@/types/theme"
import { Text, View } from "@tarojs/components"
import Button from "@/components/common/button"
import Main from "@/components/layout/main"
import Page from "@/components/layout/page"
import { useTheme } from "@/hooks/theme"

/** 主题选项 */
const themes: { label: string, value: ThemeChoice }[] = [
  { label: "春", value: "spring" },
  { label: "夏", value: "summer" },
  { label: "秋", value: "autumn" },
  { label: "自动", value: "auto" },
]

/** 色彩模式选项 */
const modes: { label: string, value: ModeChoice }[] = [
  { label: "亮", value: "light" },
  { label: "暗", value: "dark" },
  { label: "自动", value: "auto" },
]

function Choice({ label, active, onTap }: Readonly<{ label: string, active: boolean, onTap: () => void }>): ReactNode {
  return (
    <Button
      variant={active ? "solid" : "outline"}
      color={active ? "primary" : "ink"}
      className="flex-1 p-2 text-xs"
      onClick={onTap}
    >
      <Text>{label}</Text>
    </Button>
  )
}

function Section({ title, children }: Readonly<{ title: string, children: ReactNode }>): ReactNode {
  return (
    <View className="mt-3">
      <Text className="text-soft text-xs">{title}</Text>
      <View className="mt-1 flex gap-1">{children}</View>
    </View>
  )
}

export default function ThemeDebug(): ReactNode {
  const { theme, mode, themeChoice, modeChoice, setThemeChoice, setModeChoice } = useTheme()

  return (
    <Page>
      <Main>
        <Text className="text-strong">主题调试</Text>

        <View className="mt-2">
          <Text className="text-soft text-xs">{`${themeChoice} -> ${theme} / ${modeChoice} -> ${mode}`}</Text>
        </View>

        <Section title="主题">
          {themes.map(item => (
            <Choice
              key={item.value}
              label={item.label}
              active={themeChoice === item.value}
              onTap={() => setThemeChoice(item.value)}
            />
          ))}
        </Section>

        <Section title="模式">
          {modes.map(item => (
            <Choice
              key={item.value}
              label={item.label}
              active={modeChoice === item.value}
              onTap={() => setModeChoice(item.value)}
            />
          ))}
        </Section>

        <Section title="前景">
          <View className="flex-1 p-2 border border-default bg-default">
            <Text className="text-xs text-default">default</Text>
          </View>
          <View className="flex-1 p-2 border border-default bg-default">
            <Text className="text-xs text-soft">soft</Text>
          </View>
          <View className="flex-1 p-2 border border-default bg-default">
            <Text className="text-xs text-strong">strong</Text>
          </View>
        </Section>

        <Section title="背景">
          <View className="flex-1 p-2 bg-default border border-default">
            <Text className="text-xs text-default">bg-default</Text>
          </View>
          <View className="flex-1 p-2 bg-strong border border-default">
            <Text className="text-xs text-default">bg-strong</Text>
          </View>
        </Section>

        <Section title="主色与错误">
          <View className="flex-1 p-2 bg-primary">
            <Text className="text-xs text-primary-strong">primary</Text>
          </View>
          <View className="flex-1 p-2 bg-primary-strong">
            <Text className="text-xs text-primary-strong">primary-strong</Text>
          </View>
          <View className="flex-1 p-2 bg-error-strong">
            <Text className="text-xs text-error-strong">error-strong</Text>
          </View>
        </Section>

        <Section title="边框与透明度">
          <View className="flex-1 p-2 border border-primary">
            <Text className="text-xs text-primary">border-primary</Text>
          </View>
          <View className="flex-1 p-2 bg-strong opacity-soft">
            <Text className="text-xs text-default">opacity-soft</Text>
          </View>
          <View className="flex-1 p-2 bg-strong opacity-ghost">
            <Text className="text-xs text-default">opacity-ghost</Text>
          </View>
        </Section>
      </Main>
    </Page>
  )
}
