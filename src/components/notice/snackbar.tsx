import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { Info } from "lucide-react-taro"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import { animation } from "@/config/duration"
import { useExpire } from "@/hooks/notice"
import { useSnackbar } from "@/hooks/snackbar"

/** 底部通知条 */
export default function Snackbar(): ReactNode {
  const { current, hide } = useSnackbar()
  const now = useExpire(current, hide)

  if (!current)
    return null

  const elapsed = now - current.startAt
  const appear = Math.max(0, Math.min(1, elapsed / animation))

  return (
    <View className="absolute bottom-0 left-0 right-0 flex px-2r">
      <View
        className="mb-2r flex w-full items-center gap-2 rounded-md border border-default bg-strong p-1h shadow-float"
        style={{
          opacity: appear,
          transform: `translateY(${(1 - appear) * 8}px)`,
        }}
      >
        <Icon icon={Info} className="h-3h w-3h" />
        <Text className="flex-1 text-sm text-default">{current.message}</Text>
        {current.action && (
          <Button
            variant="ghost"
            className="pointer-events-auto px-1 py-0 text-sm"
            onClick={current.action.onTap}
          >
            <Text>{current.action.text}</Text>
          </Button>
        )}
      </View>
    </View>
  )
}
