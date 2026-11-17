import { ENV } from "@shared/env"

const LEVEL = {
  error: 0,
  info: 1,
  debug: 2,
} as const

/** 日志输出函数 */
type Output = (...args: unknown[]) => void

/** 日志输出函数 */
function emit(write: Output, level: number, label: string, args: unknown[]): void {
  if (level > ENV.logLevel)
    return

  write(`[${level}][${label}]`, ...args)
}

/** 通用日志 */
export const logger = {
  error: (label: string, ...args: unknown[]) => emit(console.error, LEVEL.error, label, args),
  // eslint-disable-next-line no-console
  info: (label: string, ...args: unknown[]) => emit(console.info, LEVEL.info, label, args),
  // eslint-disable-next-line no-console
  debug: (label: string, ...args: unknown[]) => emit(console.log, LEVEL.debug, label, args),
}
