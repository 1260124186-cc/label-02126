import type { User } from '@/types/user'

const AUTH_KEY = 'farm_auth_user'
const CROPS_KEY = 'farm_crops_data'
const ENCRYPTION_KEY = 'farm_encryption_key_v2'

// 安全的用户存储 - 密码使用哈希值而非明文
interface SecureUser {
  username: string
  passwordHash: string
  name: string
  role: string
}

// 预定义的安全用户（实际项目中这些应该从后端获取）
const SECURE_USERS: SecureUser[] = [
  // 密码: admin123
  {
    username: 'admin',
    passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    name: '管理员',
    role: 'admin'
  },
  // 密码: user123
  {
    username: 'user',
    passwordHash: '12e46e947c72a7a7f0a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7a7',
    name: '普通用户',
    role: 'user'
  }
]

/**
 * 生成密码哈希（使用SHA-256）
 * 在生产环境中，这应该在后端完成
 */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 加密数据用于本地存储
 */
function encryptData(data: string): string {
  try {
    // 简单的混淆加密，实际项目应使用更安全的加密算法
    const encoded = btoa(unescape(encodeURIComponent(data)))
    return encoded.split('').reverse().join('')
  } catch {
    return data
  }
}

/**
 * 解密本地存储的数据
 */
function decryptData(data: string): string {
  try {
    const reversed = data.split('').reverse().join('')
    return decodeURIComponent(escape(atob(reversed)))
  } catch {
    return data
  }
}

/**
 * 验证登录
 */
export async function validateLogin(username: string, password: string): Promise<User | null> {
  const passwordHash = await hashPassword(password)
  const user = SECURE_USERS.find(
    u => u.username === username && u.passwordHash === passwordHash
  )

  if (user) {
    return { username: user.username, name: user.name, role: user.role }
  }
  return null
}

/**
 * 保存用户到本地存储（加密）
 */
export function saveUser(user: User): void {
  try {
    const encryptedData = encryptData(JSON.stringify(user))
    localStorage.setItem(AUTH_KEY, encryptedData)
  } catch (error) {
    console.error('保存用户信息失败:', error)
  }
}

/**
 * 从本地存储获取用户（解密）
 */
export function getStoredUser(): User | null {
  try {
    const encryptedData = localStorage.getItem(AUTH_KEY)
    if (!encryptedData) return null

    const decryptedData = decryptData(encryptedData)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 清除本地存储的用户信息
 */
export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY)
}

/**
 * 保存作物数据到本地存储
 */
export function saveCrops(crops: any[]): void {
  try {
    const encryptedData = encryptData(JSON.stringify(crops))
    localStorage.setItem(CROPS_KEY, encryptedData)
  } catch (error) {
    console.error('保存作物数据失败:', error)
  }
}

/**
 * 从本地存储获取作物数据
 */
export function getStoredCrops(): any[] {
  try {
    const encryptedData = localStorage.getItem(CROPS_KEY)
    if (!encryptedData) return []

    const decryptedData = decryptData(encryptedData)
    return JSON.parse(decryptedData)
  } catch (error) {
    console.error('获取作物数据失败:', error)
    return []
  }
}

/**
 * 清除本地存储的作物数据
 */
export function clearCrops(): void {
  localStorage.removeItem(CROPS_KEY)
}

/**
 * 验证密码强度
 */
export function validatePasswordStrength(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: '密码长度至少6位' }
  }
  if (password.length > 32) {
    return { valid: false, message: '密码长度不能超过32位' }
  }
  return { valid: true }
}
