<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/types/user'
import { getStoredUser, clearUser } from '@/utils/auth'
import LoginPage from './components/LoginPage.vue'
import FarmManagement from './components/FarmManagement.vue'

const currentUser = ref<User | null>(null)

function handleLoginSuccess(user: User) {
  currentUser.value = user
}

function handleLogout() {
  clearUser()
  currentUser.value = null
}

onMounted(() => {
  currentUser.value = getStoredUser()
})
</script>

<template>
  <div class="app">
    <FarmManagement
      v-if="currentUser"
      :user="currentUser"
      @logout="handleLogout"
    />
    <LoginPage v-else @login-success="handleLoginSuccess" />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>
