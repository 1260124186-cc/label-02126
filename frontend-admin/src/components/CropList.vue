<script setup lang="ts">
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import type { Crop } from '@/types/crop'
import { formatDate, formatYield, formatArea } from '@/utils/format'

defineProps<{
  crops: Crop[]
}>()

const emit = defineEmits<{
  deleteCrop: [id: number]
}>()

const deletingId = ref<number | null>(null)

function handleDelete(id: number) {
  deletingId.value = id
  setTimeout(() => {
    emit('deleteCrop', id)
    deletingId.value = null
  }, 300)
}
</script>

<template>
  <div class="crop-list">
    <!-- 空状态 -->
    <el-empty v-if="crops.length === 0" description="暂无作物数据，请在左侧添加">
      <template #image>
        <span style="font-size: 64px;">🌱</span>
      </template>
    </el-empty>

    <!-- 作物列表 -->
    <TransitionGroup v-else name="list" tag="div" class="list-container">
      <div
        v-for="crop in crops"
        :key="crop.id"
        :class="['crop-item', { 'deleting': deletingId === crop.id }]"
      >
        <div class="crop-header">
          <span class="crop-name">{{ crop.name }}</span>
          <el-button
            type="danger"
            :icon="Delete"
            circle
            size="small"
            :loading="deletingId === crop.id"
            @click="handleDelete(crop.id)"
          />
        </div>
        <div class="crop-details">
          <div class="detail-item">
            <span class="detail-label">种植面积</span>
            <span class="detail-value">{{ formatArea(crop.area) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">亩产量</span>
            <span class="detail-value highlight">{{ formatYield(crop.yield) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">种植日期</span>
            <span class="detail-value">{{ formatDate(crop.plantDate) }}</span>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.crop-list {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.crop-item {
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  padding: 16px;
  transition: all 0.2s;
}

.crop-item:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.crop-item.deleting {
  opacity: 0.5;
  transform: scale(0.98);
}

.crop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #e0e0e0;
}

.crop-name {
  font-size: 17px;
  font-weight: 600;
  color: #4CAF50;
}

.crop-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: #999;
}

.detail-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.detail-value.highlight {
  color: #4CAF50;
}

/* 列表动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.list-move {
  transition: transform 0.25s ease;
}
</style>
