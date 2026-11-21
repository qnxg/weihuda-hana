import type { ITouchEvent } from "@tarojs/components"
import { useRef } from "react"

/** 触发距离 */
const MIN_DISTANCE = 48

/** 横向占优比例 */
const RATIO = 1.2

export interface UseSwipeOptions {
  /** 向前 */
  onPrev: () => void
  /** 向后 */
  onNext: () => void
}

/** 横向滑动 */
export function useSwipe({ onPrev, onNext }: UseSwipeOptions): {
  onTouchStart: (event: ITouchEvent) => void
  onTouchEnd: (event: ITouchEvent) => void
} {
  const startRef = useRef<{ x: number, y: number } | null>(null)

  function onTouchStart(event: ITouchEvent): void {
    const touch = event.touches[0]

    if (touch)
      startRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function onTouchEnd(event: ITouchEvent): void {
    const origin = startRef.current
    const touch = event.changedTouches[0]
    startRef.current = null

    if (!origin || !touch)
      return

    const dx = touch.clientX - origin.x
    const dy = touch.clientY - origin.y

    if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * RATIO)
      return

    if (dx > 0)
      onPrev()
    else
      onNext()
  }

  return { onTouchStart, onTouchEnd }
}
