/**
 * 作物数据类型定义
 */
export interface Crop {
  id: number
  name: string           // 作物名称
  area: number           // 种植面积（亩）
  yield: number          // 产量（公斤/亩）
  plantDate: string      // 种植日期
}

/**
 * 新增作物表单数据类型
 */
export interface CropFormData {
  name: string
  area: number | string
  yield: number | string
  plantDate: string
}

/**
 * 严格的数值类型，只允许数字
 */
export interface StrictCropFormData {
  name: string
  area: number
  yield: number
  plantDate: string
}

/**
 * 表单验证错误类型
 */
export interface FormErrors {
  name?: string
  area?: string
  yield?: string
  plantDate?: string
}
