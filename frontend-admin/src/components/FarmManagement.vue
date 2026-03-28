<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type { Crop } from '@/types/crop'
import type { User } from '@/types/user'
import { generateId } from '@/utils/format'
import CropList from './CropList.vue'
import CropForm from './CropForm.vue'

defineProps<{
  user: User
}>()

const emit = defineEmits<{
  logout: []
}>()

const CROPS_STORAGE_KEY = 'farm_crops_data'
const crops = ref<Crop[]>([])
const showUserMenu = ref(false)
let toastTimeout: ReturnType<typeof setTimeout> | null = null

const toast = ref({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const totalArea = computed(() => {
  return crops.value.reduce((sum, crop) => sum + crop.area, 0)
})

const totalYield = computed(() => {
  return crops.value.reduce((sum, crop) => sum + crop.area * crop.yield, 0)
})

const averageYield = computed(() => {
  if (totalArea.value === 0) return 0
  return totalYield.value / totalArea.value
})

function showToast(message: string, type: 'success' | 'error' = 'success') {
  toast.value = { show: true, message, type }
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
  toastTimeout = setTimeout(() => {
    toast.value.show = false
    toastTimeout = null
  }, 3000)
}

function saveCropsToStorage() {
  try {
    localStorage.setItem(CROPS_STORAGE_KEY, JSON.stringify(crops.value))
  } catch (error) {
    console.error('保存作物数据失败:', error)
  }
}

function loadCropsFromStorage() {
  try {
    const data = localStorage.getItem(CROPS_STORAGE_KEY)
    if (data) {
      crops.value = JSON.parse(data)
    }
  } catch (error) {
    console.error('加载作物数据失败:', error)
    crops.value = []
  }
}

function handleAddCrop(cropData: Omit<Crop, 'id'>) {
  const newCrop: Crop = {
    id: generateId(),
    ...cropData
  }
  crops.value.push(newCrop)
  showToast(`成功添加作物：${cropData.name}`, 'success')
}

function handleDeleteCrop(id: number) {
  const index = crops.value.findIndex(c => c.id === id)
  if (index !== -1) {
    const cropName = crops.value[index].name
    crops.value.splice(index, 1)
    showToast(`已删除作物：${cropName}`, 'success')
  }
}

function handleLogout() {
  showUserMenu.value = false
  emit('logout')
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu() {
  showUserMenu.value = false
}

watch(crops, () => {
  saveCropsToStorage()
}, { deep: true })

onMounted(() => {
  loadCropsFromStorage()
  if (crops.value.length === 0) {
    crops.value = [
      { id: 1, name: '水稻', area: 150, yield: 550, plantDate: '2025-03-15' },
      { id: 2, name: '小麦', area: 200, yield: 480, plantDate: '2025-10-20' },
      { id: 3, name: '玉米', area: 180, yield: 620, plantDate: '2025-04-10' },
      { id: 4, name: '大豆', area: 100, yield: 180, plantDate: '2025-05-01' },
      { id: 5, name: '棉花', area: 120, yield: 95, plantDate: '2025-04-25' }
    ]
  }
})

onUnmounted(() => {
  if (toastTimeout) {
    clearTimeout(toastTimeout)
  }
})
</script>

<template>
  <div class="farm-management">
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🌾</span>
          <h1>农田作物种植数据管理系统</h1>
        </div>
        <div class="user-dropdown" @click.stop>
          <button class="user-trigger" @click="toggleUserMenu">
            <span class="user-avatar">👤</span>
            <span class="user-name">{{ user.name }}</span>
            <span class="dropdown-arrow" :class="{ 'open': showUserMenu }">▼</span>
          </button>
          <Transition name="dropdown">
            <div v-if="showUserMenu" class="dropdown-menu">
              <button class="dropdown-item logout-item" @click="handleLogout">
                <span class="item-icon">🚪</span>
                退出登录
              </button>
            </div>
          </Transition>
        </div>
        <div v-if="showUserMenu" class="dropdown-overlay" @click="closeUserMenu"></div>
      </div>
    </header>

    <main class="main-content">
      <section class="stats-section">
        <div class="stats-card">
          <div class="stats-icon area-icon">📐</div>
          <div class="stats-info">
            <span class="stats-label">总种植面积</span>
            <span class="stats-value">{{ totalArea.toFixed(1) }} <small>亩</small></span>
          </div>
        </div>
        <div class="stats-card">
          <div class="stats-icon yield-icon">📊</div>
          <div class="stats-info">
            <span class="stats-label">平均亩产量</span>
            <span class="stats-value">{{ averageYield.toFixed(1) }} <small>公斤/亩</small></span>
          </div>
        </div>
        <div class="stats-card">
          <div class="stats-icon count-icon">🌱</div>
          <div class="stats-info">
            <span class="stats-label">作物种类</span>
            <span class="stats-value">{{ crops.length }} <small>种</small></span>
          </div>
        </div>
      </section>

      <div class="content-grid">
        <section class="form-section">
          <div class="section-header">
            <h2>➕ 新增作物</h2>
          </div>
          <CropForm @add-crop="handleAddCrop" />
        </section>

        <section class="list-section">
          <div class="section-header">
            <h2>📋 作物列表</h2>
            <span class="badge">共 {{ crops.length }} 条记录</span>
          </div>
          <CropList :crops="crops" @delete-crop="handleDeleteCrop" />
        </section>
      </div>
    </main>

    <Transition name="toast">
      <div v-if="toast.show" :class="['toast', `toast-${toast.type}`]">
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        {{ toast.message }}
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.farm-management {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.header {
  background: linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%);
  color: #fff;
  padding: 20px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-icon {
  font-size: 36px;
}

.logo h1 {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
}

/* 用户下拉菜单 */
.user-dropdown {
  position: relative;
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.15s ease;
}

.user-trigger:hover {
  background: rgba(255, 255, 255, 0.25);
}

.user-avatar {
  font-size: 20px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.15s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 120px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1001;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.15s ease;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.logout-item {
  color: #f44336;
}

.item-icon {
  font-size: 16px;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stats-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.area-icon { background: #e3f2fd; }
.yield-icon { background: #fff3e0; }
.count-icon { background: #e8f5e9; }

.stats-info {
  display: flex;
  flex-direction: column;
}

.stats-label {
  font-size: 14px;
  color: #666;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #333;
}

.stats-value small {
  font-size: 14px;
  font-weight: 400;
  color: #999;
}

.content-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  .header-content {
    flex-direction: column;
    gap: 16px;
  }
}

.form-section,
.list-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.section-header {
  background: #fafafa;
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.badge {
  background: #e8f5e9;
  color: #4CAF50;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 8px;
  color: #fff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  z-index: 1000;
}

.toast-success { background: #4CAF50; }
.toast-error { background: #f44336; }

.toast-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
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
</style>
