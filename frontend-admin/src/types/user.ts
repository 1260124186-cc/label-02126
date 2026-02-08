export interface User {
  username: string
  name: string
  role: string
}

export interface LoginForm {
  username: string
  password: string
}

export interface LoginErrors {
  username?: string
  password?: string
  general?: string
}
