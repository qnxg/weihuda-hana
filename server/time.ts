/** 当前时间, 格式 YYYY-MM-DD HH:mm:ss */
export function now(): string {
  const date = new Date()
  const pad = (value: number): string => String(value).padStart(2, "0")

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
