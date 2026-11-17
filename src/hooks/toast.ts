import type { ToastItem } from "@/types/toast"
import { useToastStore } from "@/stores/toast"

export interface UseToastResult {
  /** 当前提示 */
  current: ToastItem | null
  /** 移除提示 */
  hide: () => void
}

/** 提示状态 */
export function useToast(): UseToastResult {
  const current = useToastStore(state => state.current)
  const hide = useToastStore(state => state.hide)

  return { current, hide }
}
