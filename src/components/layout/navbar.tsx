import type { IconProps } from "lucide-react-taro"
import type { ComponentProps, FC, ReactElement, ReactNode } from "react"
import type { IconColor } from "@/components/common/icon"
import { Text, View } from "@tarojs/components"
import { getMenuButtonBoundingClientRect, getWindowInfo } from "@tarojs/taro"
import { ChevronLeft } from "lucide-react-taro"
import Icon from "@/components/common/icon"
import SafeArea from "@/components/common/safe-area"
import { cn } from "@/utils/cn"
import { navigateBack } from "@/utils/navigate"

/** 操作项 */
export interface NavbarActionProps {
  /** 图标, 与 text 二选一 */
  icon?: FC<IconProps>
  /** 文本, 与 icon 二选一 */
  text?: string
  /** 语义色, 默认 ink */
  color?: IconColor
  /** 点击 */
  onClick?: ComponentProps<typeof View>["onClick"]
}

/** 文本操作的语义色 class */
const textTone: Record<IconColor, string> = {
  primary: "text-primary",
  error: "text-error",
  ink: "text-default",
  invert: "text-invert",
}

/** 单个操作 */
export function NavbarAction({ icon, text, color = "ink", onClick }: Readonly<NavbarActionProps>): ReactNode {
  return (
    <View className="flex items-center" onClick={onClick}>
      {icon
        ? <Icon icon={icon} color={color} className="h-3h w-3h" />
        : <Text className={cn("text-sm", textTone[color])}>{text}</Text>}
    </View>
  )
}

export interface NavbarProps {
  /** 顶部状态栏安全区 */
  safeArea?: boolean
  /** 居中标题 */
  title?: string
  /** 返回操作 */
  back?: boolean | ReactElement<NavbarActionProps>
  /** 操作列表 */
  children?: ReactElement<NavbarActionProps> | ReactElement<NavbarActionProps>[]
}

interface NavMetrics {
  /** 内容区高度 = 按钮高 + 间距*2 */
  contentHeight: number
  /** 右操作区避让胶囊的右边距 */
  capsuleGap: number
}

let metrics: NavMetrics | null = null

/** 胶囊按钮对齐尺寸 */
function navMetrics(): NavMetrics {
  if (metrics)
    return metrics

  const { statusBarHeight, windowWidth } = getWindowInfo()
  const button = getMenuButtonBoundingClientRect()
  const gap = button.top - (statusBarHeight ?? 0)
  metrics = {
    contentHeight: button.height + gap * 2,
    capsuleGap: windowWidth - button.left,
  }
  return metrics
}

/** 导航栏 */
export default function Navbar({ safeArea = true, title, back = true, children }: Readonly<NavbarProps>): ReactNode {
  const { contentHeight, capsuleGap } = navMetrics()
  const hasChildren = children !== undefined

  return (
    <View>
      {safeArea && <SafeArea edge="top" />}
      <View style={{ height: contentHeight }} className="relative flex items-center">
        {back !== false && (
          <View className="pl-1r">
            {back === true
              ? <NavbarAction icon={ChevronLeft} onClick={() => { navigateBack() }} />
              : back}
          </View>
        )}
        {hasChildren
          ? (
              <View className="ml-auto" style={{ paddingRight: capsuleGap }}>
                <View className="flex items-center gap-2 pr-2">
                  {children}
                </View>
              </View>
            )
          : title && (
            <View className="pointer-events-none absolute inset-x-0 flex justify-center overflow-hidden">
              <Text className="truncate text-base text-strong">{title}</Text>
            </View>
          )}
      </View>
    </View>
  )
}
