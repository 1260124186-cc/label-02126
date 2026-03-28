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
 * 生成唯一ID
 */
let idCounter = 0
export function generateId(): number {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  idCounter = (idCounter + 1) % 1000
  return timestamp * 1000000 + random * 1000 + idCounter
}
