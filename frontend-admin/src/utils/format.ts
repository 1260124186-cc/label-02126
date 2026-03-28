/**
 * 格式化日期为 YYYY年MM月DD日 格式
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}年${month}月${day}日`
}

/**
 * 格式化产量显示
 */
export function formatYield(value: number): string {
  return `${value.toFixed(1)} 公斤/亩`
}

/**
 * 格式化面积显示
 */
export function formatArea(value: number): string {
  return `${value.toFixed(1)} 亩`
}

/**
 * 生成唯一ID（增强版）
 */
export function generateId(): number {
  // 使用更安全的随机数生成
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 999999)
  return timestamp * 1000000 + random
}

/**
 * 验证并转换为有效数字
 */
export function toValidNumber(value: string | number, defaultValue = 0): number {
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 验证是否为有效正数
 */
export function isValidPositiveNumber(value: string | number): boolean {
  const num = Number(value)
  return !isNaN(num) && num > 0
}

/**
 * 验证日期格式有效性
 */
export function isValidDate(dateStr: string): boolean {
  if (!dateStr) return false
  const date = new Date(dateStr)
  return !isNaN(date.getTime())
}
