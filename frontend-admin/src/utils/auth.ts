import type { User } from '@/types/user'

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
