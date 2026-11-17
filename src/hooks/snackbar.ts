import type { SnackbarItem } from "@/types/snackbar"
import { useSnackbarStore } from "@/stores/snackbar"

export interface UseSnackbarResult {
  /** 当前通知 */
  current: SnackbarItem | null
  /** 移除当前 */
  hide: () => void
}

/** 通知状态 */
export function useSnackbar(): UseSnackbarResult {
  const current = useSnackbarStore(state => state.queue[0] ?? null)
  const hide = useSnackbarStore(state => state.hide)

  return { current, hide }
}
