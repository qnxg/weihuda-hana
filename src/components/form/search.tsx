import type { ReactNode } from "react"
import { Input as TaroInput, Text, View } from "@tarojs/components"
import { hideKeyboard } from "@tarojs/taro"
import { CircleX, Search as SearchIcon } from "lucide-react-taro"
import Button from "@/components/common/button"
import Icon from "@/components/common/icon"
import { cn } from "@/utils/cn"

export interface SearchProps {
  /** 当前值 */
  value: string
  /** 占位 */
  placeholder?: string
  /** 追加样式 */
  className?: string
  /** 变更回调 */
  onChange: (value: string) => void
  /** 提交回调 */
  onSearch?: () => void
}

/** 搜索框, 受控 */
export default function Search({
  value,
  placeholder = "搜索",
  className,
  onChange,
  onSearch,
}: Readonly<SearchProps>): ReactNode {
  function submit(): void {
    void hideKeyboard()
    onSearch?.()
  }

  return (
    <View className={cn("flex items-center gap-2 rounded-full border border-default bg-strong p-1 pl-3", className)}>
      <Icon icon={SearchIcon} color="primary" className="h-2h w-2h shrink-0" />
      <TaroInput
        className="min-w-0 flex-1 text-sm text-default"
        value={value}
        placeholder={placeholder}
        placeholderClass="text-soft"
        onInput={event => onChange(event.detail.value)}
      />
      {value && (
        <View className="flex h-2h w-2h shrink-0 items-center justify-center" onClick={() => onChange("")}>
          <Icon icon={CircleX} color="ink" className="h-2h w-2h" />
        </View>
      )}
      <Button variant="solid" color="primary" className="shrink-0 rounded-full px-3 py-1" onClick={submit}>
        <Text className="text-sm">搜索</Text>
      </Button>
    </View>
  )
}
