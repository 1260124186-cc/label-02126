<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { Crop } from '@/types/crop'
import { generateId } from '@/utils/format'
import CropList from './CropList.vue'
import CropForm from './CropForm.vue'

// 作物数据列表
const crops = ref<Crop[]>([])

// 计算属性：总种植面积
const totalArea = computed(() => {
  return crops.value.reduce((sum, crop) => sum + crop.area, 0)
})

// 计算属性：平均亩产量
const averageYield = computed(() => {
  if (crops.value.length === 0) return 0
  const total = crops.value.reduce((sum, crop) => sum + crop.yield, 0)
  return total / crops.value.length
})

// 新增作物
function handleAddCrop(cropData: Omit<Crop, 'id'>) {
  const newCrop: Crop = {
    id: generateId(),
    ...cropData
  }
  crops.value.push(newCrop)
  ElMessage.success(`成功添加作物：${cropData.name}`)
}

// 删除作物
function handleDeleteCrop(id: number) {
  const index = crops.value.findIndex(c => c.id === id)
  if (index !== -1) {
    const cropName = crops.value[index].name
    crops.value.splice(index, 1)
    ElMessage.success(`已删除作物：${cropName}`)
  }
}

// 初始化模拟数据
onMounted(() => {
  crops.value = [
    { id: 1, name: '水稻', area: 150, yield: 550, plantDate: '2025-03-15' },
    { id: 2, name: '小麦', area: 200, yield: 480, plantDate: '2025-10-20' },
    { id: 3, name: '玉米', area: 180, yield: 620, plantDate: '2025-04-10' },
    { id: 4, name: '大豆', area: 100, yield: 180, plantDate: '2025-05-01' },
    { id: 5, name: '棉花', area: 120, yield: 95, plantDate: '2025-04-25' }
  ]
})
</script>

<template>
  <div class="farm-management">
    <!-- 页面头部 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🌾</span>
          <h1>农田作物种植数据管理系统</h1>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 统计卡片区 -->
      <section class="stats-section">
        <div class="stats-card">
          <div class="stats-icon area-icon">📐</div>
          <div class="stats-info">
            <span class="stats-label">总种植面积</span>
            <span class="stats-value">{{ totalArea.toFixed(1) }} <small>亩</small></span>
          </div>
        </div>
        <div class="stats-row">
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
        </div>
      </section>

      <!-- 内容区域 -->
      <div class="content-grid">
        <!-- 新增作物表单 -->
        <section class="form-section">
          <div class="section-header">
            <h2>➕ 新增作物</h2>
          </div>
          <CropForm @add-crop="handleAddCrop" />
        </section>

        <!-- 作物列表 -->
        <section class="list-section">
          <div class="section-header">
            <h2>📋 作物列表</h2>
            <el-tag type="success" effect="plain">共 {{ crops.length }} 条记录</el-tag>
          </div>
          <CropList :crops="crops" @delete-crop="handleDeleteCrop" />
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.farm-management {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

/* 头部样式 */
.header {
  background: linear-gradient(135deg, #4CAF50 0%, #2e7d32 100%);
  color: #fff;
  padding: 20px 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
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

/* 主内容区 */
.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
}

/* 统计卡片区 - 与下方内容对齐 */
.stats-section {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 900px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: 1fr;
  }
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}

.area-icon {
  background: #e3f2fd;
}

.yield-icon {
  background: #fff3e0;
}

.count-icon {
  background: #e8f5e9;
}

.stats-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stats-label {
  font-size: 13px;
  color: #666;
}

.stats-value {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  line-height: 1.2;
}

.stats-value small {
  font-size: 13px;
  font-weight: 400;
  color: #999;
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

/* 区块样式 */
.form-section,
.list-section {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #e8e8e8;
  overflow: hidden;
}

.list-section {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 280px);
}

.section-header {
  background: #fafafa;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-header h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #333;
}
</style>
