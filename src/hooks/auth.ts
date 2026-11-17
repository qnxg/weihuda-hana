import type { AuthPromptKind } from "@/types/auth"
import { useCallback } from "react"
import { useAuthStore } from "@/stores/auth"
import { navigate } from "@/utils/navigate"

/** 登录页路径 */
const LOGIN_PAGE = "/pages/auth/index"

/** 验证页路径 */
const VERIFY_PAGE = "/pages/auth/index?mode=verify"

interface UseAuthPromptResult {
  /** 正在展示的提示 */
  showing: AuthPromptKind | null
  /** 确认, 跳对应的鉴权页 */
  confirm: () => void
  /** 取消, 收起并保持锁定 */
  cancel: () => void
}

/** 鉴权弹窗 */
export function useAuthPrompt(): UseAuthPromptResult {
  const showing = useAuthStore(state => state.showing)

  const confirm = useCallback(() => {
    const { showing: kind, dismiss } = useAuthStore.getState()

    if (!kind)
      return

    dismiss()
    navigate(kind === "loginLost"
      ? LOGIN_PAGE
      : VERIFY_PAGE)
  }, [])

  const cancel = useCallback(() => useAuthStore.getState().dismiss(), [])

  return { showing, confirm, cancel }
}
