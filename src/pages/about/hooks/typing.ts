import { useEffect, useMemo, useReducer, useRef } from "react"

/** 打字机阶段 */
type Phase = "init" | "typing" | "printed" | "deleting"

/** 状态机状态 */
interface State {
  /** 阶段 */
  phase: Phase
  /** 当前文本 */
  text: string
  /** 切换中的下一条文本 */
  nextText: string | null
  /** 已展示的字符数, 初始等待阶段为负 */
  i: number
}

/** 状态机动作 */
type Action = { type: "TICK" } | { type: "SET_TEXT", text: string }

/** 推进或切换文本, 打满后停住等待外部切换 */
function reducer(state: State, action: Action): State {
  if (action.type === "SET_TEXT") {
    if (action.text === state.text || action.text === state.nextText)
      return state

    if (state.phase === "init") {
      return {
        ...state,
        phase: "typing",
        text: action.text,
        i: 0,
      }
    }

    if (state.phase === "deleting")
      return { ...state, nextText: action.text }

    return { ...state, phase: "deleting", nextText: action.text }
  }

  switch (state.phase) {
    case "init":
      if (state.i < 0)
        return { ...state, i: state.i + 1 }

      return { ...state, phase: "typing", i: 0 }
    case "typing":
      if (state.i < state.text.length)
        return { ...state, i: state.i + 1 }

      return { ...state, phase: "printed", i: state.text.length }
    case "deleting":
      if (state.i > 0)
        return { ...state, i: state.i - 1 }

      if (state.nextText === null)
        return state

      return {
        ...state,
        phase: "typing",
        text: state.nextText,
        nextText: null,
        i: 0,
      }
    default:
      return state
  }
}

/** 打字机配置 */
export interface TypingOptions {
  /** 初始等待的 tick 数, 每 tick 为打字间隔 */
  initialDelay?: number
  /** 打字间隔, 毫秒 */
  typingSpeed?: number
  /** 删除间隔, 毫秒 */
  deletingSpeed?: number
  /** 是否启动, 为假时不推进 */
  enabled?: boolean
}

/** 打字机结果 */
export interface TypingResult {
  /** 当前展示的文本 */
  displayed: string
  /** 是否仍在动画中 */
  animating: boolean
}

/** 打字机效果, 文本变化时先删后打 */
export function useTyping(text: string, options: TypingOptions = {}): TypingResult {
  const { initialDelay = 15, typingSpeed = 100, deletingSpeed = 50, enabled = true } = options

  const [state, dispatch] = useReducer(
    reducer,
    text,
    (initial): State => ({
      phase: "init",
      text: initial,
      nextText: null,
      i: -initialDelay,
    }),
  )

  const displayed = useMemo(() => {
    if (state.phase === "printed")
      return state.text

    return state.phase === "init" || state.i <= 0
      ? ""
      : state.text.slice(0, state.i)
  }, [state.phase, state.text, state.i])

  const speedsRef = useRef({ typingSpeed, deletingSpeed })
  speedsRef.current = { typingSpeed, deletingSpeed }

  useEffect(() => {
    if (!enabled || state.phase === "printed")
      return

    const speeds = speedsRef.current
    const interval = state.phase === "deleting"
      ? speeds.deletingSpeed
      : speeds.typingSpeed
    const timer = setInterval(dispatch, interval, { type: "TICK" })

    return () => clearInterval(timer)
  }, [enabled, state.phase])

  useEffect(() => {
    dispatch({ type: "SET_TEXT", text })
  }, [text])

  return {
    displayed,
    animating: state.phase !== "printed",
  }
}
