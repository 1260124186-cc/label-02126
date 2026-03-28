import type { User } from '@/types/user'

// 安全警告：
// 1. 此文件包含硬编码的模拟用户凭据，仅用于开发/演示目的
// 2. 在生产环境中，应该：
//    - 使用后端API进行身份验证
//    - 密码应进行哈希处理（如bcrypt），不应明文存储
//    - 使用JWT或其他安全的令牌机制
//    - 实现适当的会话管理和超时机制
//    - 考虑使用HTTPS加密传输
// 3. localStorage存储的用户数据可以被用户访问和修改，不应存储敏感信息

const AUTH_KEY = 'farm_auth_user'

const MOCK_USERS = [
  { username: 'admin', password: 'admin123', name: '管理员', role: 'admin' },
  { username: 'user', password: 'user123', name: '普通用户', role: 'user' }
]

export function validateLogin(username: string, password: string): User | null {
  const user = MOCK_USERS.find(
    u => u.username === username && u.password === password
  )
  if (user) {
    return { username: user.username, name: user.name, role: user.role }
  }
  return null
}

export function saveUser(user: User): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(AUTH_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  return null
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY)
}
