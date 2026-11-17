import type { IconProps as LucideIconProps } from "lucide-react-taro"
import type { FC, ReactNode } from "react"
import type { ToastType } from "@/types/toast"
import { Text, View } from "@tarojs/components"
import { CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react-taro"
import { useEffect, useState } from "react"
import Icon from "@/components/common/icon"
import { animation } from "@/config/duration"
import { useToast } from "@/hooks/toast"
import { cn } from "@/utils/cn"

/** 刷新间隔 */
const tick = 50

/** 类型图标 */
const icons: Record<ToastType, FC<LucideIconProps>> = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
  loading: LoaderCircle,
}

/** 类型配色 */
const colors: Record<ToastType, "primary" | "error" | "ink"> = {
  success: "primary",
  error: "error",
  info: "ink",
  loading: "primary",
}

/** 居中提示 */
export default function Toast(): ReactNode {
  const { current, hide } = useToast()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!current)
      return

    const timer = setInterval(() => {
      const time = Date.now()
      setNow(time)

      if (current.duration === 0 && time - current.startAt >= animation)
        clearInterval(timer)
    }, tick)

    return () => clearInterval(timer)
  }, [current])

  useEffect(() => {
    if (current && current.duration > 0 && now >= current.startAt + current.duration)
      hide()
  }, [current, hide, now])

  if (!current)
    return null

  const elapsed = now - current.startAt
  const appear = Math.max(0, Math.min(1, elapsed / animation))

  return (
    <View className="absolute inset-0 flex items-center justify-center">
      <View
        className="flex flex-col items-center gap-1 rounded-lg bg-strong px-2r py-1r shadow-float"
        style={{
          opacity: appear,
          transform: `scale(${0.9 + 0.1 * appear})`,
        }}
      >
        <Icon
          icon={icons[current.type]}
          color={colors[current.type]}
          className={cn("h-3h w-3h", current.type === "loading" && "animate-spin")}
        />
        <Text className="text-sm text-strong">{current.message}</Text>
      </View>
    </View>
  )
}
