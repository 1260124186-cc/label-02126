<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { LoginForm, LoginErrors } from '@/types/user'
import { validateLogin, saveUser } from '@/utils/auth'

const emit = defineEmits<{
  loginSuccess: [user: { username: string; name: string; role: string }]
}>()

const form = reactive<LoginForm>({
  username: '',
  password: ''
})

const errors = reactive<LoginErrors>({})
const isLoading = ref(false)
const showPassword = ref(false)

const toast = ref({
  show: false,
  message: ''
})

function showToast(message: string) {
  toast.value = { show: true, message }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

function handleForgotPassword() {
  showToast('请联系管理员重置密码')
}

function validate(): boolean {
  errors.username = undefined
  errors.password = undefined
  errors.general = undefined

  let valid = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    valid = false
  }

  if (!form.password) {
    errors.password = '请输入密码'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = '密码长度至少6位'
    valid = false
  }

  return valid
}

async function handleLogin() {
  if (!validate()) return

  isLoading.value = true
  errors.general = undefined

  await new Promise(resolve => setTimeout(resolve, 500))

  const user = validateLogin(form.username, form.password)

  if (user) {
    saveUser(user)
    emit('loginSuccess', user)
  } else {
    errors.general = '用户名或密码错误'
  }

  isLoading.value = false
}
</script>

<template>
  <div class="login-page">
    <!-- 左侧介绍区域 -->
    <div class="login-banner">
      <div class="banner-content">
        <h1 class="brand-title">🌾 智慧农田</h1>
        <p class="brand-subtitle">专业作物种植数据管理平台</p>

        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">10K+</span>
            <span class="stat-label">农田数据</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">500+</span>
            <span class="stat-label">作物种类</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">99%</span>
            <span class="stat-label">准确率</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-form-wrapper">
      <div class="form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>请登录您的账号</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <Transition name="fade">
            <div v-if="errors.general" class="error-alert">
              <span>⚠</span> {{ errors.general }}
            </div>
          </Transition>

          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                v-model="form.username"
                type="text"
                class="form-input"
                :class="{ 'has-error': errors.username }"
                placeholder="请输入用户名"
                autocomplete="username"
              />
            </div>
            <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                :class="{ 'has-error': errors.password }"
                placeholder="请输入密码"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? '🙈' : '👁' }}
              </button>
            </div>
            <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <a href="#" class="forgot-password" @click.prevent="handleForgotPassword">忘记密码?</a>
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading" class="btn-spinner"></span>
            {{ isLoading ? '登录中...' : '立即登录' }}
          </button>
        </form>

        <!-- Toast 提示 -->
        <Transition name="toast">
          <div v-if="toast.show" class="toast">
            <span>💡</span> {{ toast.message }}
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
}

/* 左侧介绍区域 */
.login-banner {
  flex: 1;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%);
  padding: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  max-width: 420px;
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  color: #2e7d32;
  margin-bottom: 8px;
}

.brand-subtitle {
  font-size: 16px;
  color: #388e3c;
  margin-bottom: 48px;
}

.stats-row {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #2e7d32;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

/* 右侧表单区域 */
.login-form-wrapper {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
}

.form-container {
  width: 100%;
  max-width: 360px;
}

.form-header {
  margin-bottom: 32px;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.form-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-alert {
  background: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  font-size: 16px;
  color: #999;
  pointer-events: none;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  color: #333;
  background: #fafafa;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4CAF50;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input.has-error {
  border-color: #f44336;
  background: #fff;
}

.form-input::placeholder {
  color: #bbb;
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.toggle-password:hover {
  opacity: 1;
}

.error-text {
  font-size: 12px;
  color: #f44336;
  padding-left: 4px;
}

.form-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.remember-me input {
  width: 16px;
  height: 16px;
  accent-color: #4CAF50;
}

.forgot-password {
  font-size: 14px;
  color: #4CAF50;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #66bb6a 0%, #4CAF50 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.login-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4CAF50 0%, #388e3c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Toast 提示 */
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 14px 20px;
  background: #4CAF50;
  color: #fff;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

/* 响应式 */
@media (max-width: 900px) {
  .login-page {
    flex-direction: column;
  }

  .login-banner {
    padding: 40px 24px;
  }

  .banner-content {
    max-width: 100%;
  }

  .brand-title {
    font-size: 28px;
  }

  .brand-subtitle {
    margin-bottom: 32px;
  }

  .login-form-wrapper {
    padding: 40px 24px;
  }
}
</style>
