import type { SnackbarItem, SnackbarOptions } from "@/types/snackbar"
import { create } from "zustand"
import { snackbar as snackbarDuration } from "@/config/duration"
import { createId } from "@/utils/id"

/** 队列上限 */
const max = 5

interface SnackbarState {
  /** 通知队列, 队首为当前展示 */
  queue: SnackbarItem[]
  /** 新增通知 */
  show: (message: string, options?: SnackbarOptions) => string
  /** 移除当前通知 */
  hide: () => void
}

/** 通知状态, 排队展示 */
export const useSnackbarStore = create<SnackbarState>()(set => ({
  queue: [],
  show: (message, options = {}) => {
    const id = createId("snackbar")
    const item: SnackbarItem = {
      id,
      message,
      action: options.action,
      startAt: 0,
      duration: options.duration ?? snackbarDuration,
    }

    set((state) => {
      if (state.queue.some(entry => entry.message === message))
        return state

      const queue = [...state.queue, item].slice(-max)
      const head = queue[0]

      return {
        queue: head.startAt === 0
          ? [
              {
                ...head,
                startAt: Date.now(),
              },
              ...queue.slice(1),
            ]
          : queue,
      }
    })

    return id
  },
  hide: () => set((state) => {
    const rest = state.queue.slice(1)

    if (rest.length === 0)
      return { queue: [] }

    return {
      queue: [
        {
          ...rest[0],
          startAt: Date.now(),
        },
        ...rest.slice(1),
      ],
    }
  }),
}))
