import type { AuthPromptKind } from "@/types/auth"
import { create } from "zustand"

/** 初始锁定状态 */
function initialLocks(): Record<AuthPromptKind, boolean> {
  return { loginLost: false, verify: false }
}

interface AuthPromptState {
  /** 已锁定的提示 */
  locks: Record<AuthPromptKind, boolean>
  /** 正在展示的提示 */
  showing: AuthPromptKind | null
  /** 请求弹窗, 已锁定则静默跳过 */
  ask: (kind: AuthPromptKind) => void
  /** 收起弹窗, 锁定保留 */
  dismiss: () => void
  /** 解锁全部并收起 */
  unlock: () => void
}

/** 鉴权弹窗状态 */
export const useAuthStore = create<AuthPromptState>()((set, get) => ({
  locks: initialLocks(),
  showing: null,
  ask: (kind) => {
    if (get().locks[kind])
      return

    set(state => ({
      locks: { ...state.locks, [kind]: true },
      showing: kind,
    }))
  },
  dismiss: () => set({ showing: null }),
  unlock: () => set({
    locks: initialLocks(),
    showing: null,
  }),
}))
