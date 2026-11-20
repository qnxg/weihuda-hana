/** 整数部分加千分位 */
export function groupOf(integer: string): string {
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/** 拆分数值的整数与小数部分 */
export function splitOf(value: number, digits = 2): { integer: string, decimal: string } {
  const [integer, decimal = ""] = Number(value).toFixed(digits).split(".")

  return {
    integer: groupOf(integer),
    decimal,
  }
}
