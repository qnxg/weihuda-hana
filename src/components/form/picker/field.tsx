import type { ITouchEvent } from "@tarojs/components"
import type { ReactNode } from "react"
import { Text, View } from "@tarojs/components"
import { ChevronRight, CircleX } from "lucide-react-taro"
import Icon from "@/components/common/icon"
import { cn } from "@/utils/cn"

export interface PickerFieldProps {
  /** 标签 */
  label?: string
  /** 占位 */
  placeholder: string
  /** 显示文本 */
  display: string
  /** 错误文本 */
  message: string
  /** 是否有值 */
  hasValue: boolean
  /** 可清除 */
  clearable?: boolean
  /** 禁用 */
  disabled?: boolean
  /** 追加样式 */
  className?: string
  /** 打开 */
  onOpen: () => void
  /** 清除 */
  onClear: () => void
}

/** 选择器触发区 */
export default function PickerField({
  label,
  placeholder,
  display,
  message,
  hasValue,
  clearable = false,
  disabled = false,
  className,
  onOpen,
  onClear,
}: Readonly<PickerFieldProps>): ReactNode {
  function clear(event: ITouchEvent): void {
    event.stopPropagation()
    onClear()
  }

  return (
    <View className={cn("flex flex-col gap-1", className)}>
      {label && <Text className="text-sm text-soft">{label}</Text>}
      <View
        className={cn(
          "flex items-center gap-2 rounded-md border px-2h py-1h bg-strong",
          message ? "border-error" : "border-default",
          disabled && "opacity-soft",
        )}
        onClick={disabled ? undefined : onOpen}
      >
        <Text className={cn("flex-1 text-sm", hasValue ? "text-default" : "text-soft")}>
          {hasValue ? display : placeholder}
        </Text>
        {clearable && hasValue && (
          <View className="flex h-2h w-2h items-center justify-center" onClick={clear}>
            <Icon icon={CircleX} color="ink" className="h-2h w-2h" />
          </View>
        )}
        <Icon icon={ChevronRight} color="ink" className="h-2h w-2h shrink-0" />
      </View>
      {message && <Text className="text-xs text-error">{message}</Text>}
    </View>
  )
}
