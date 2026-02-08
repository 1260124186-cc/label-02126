<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import type { CropFormData, FormErrors, Crop } from '@/types/crop'

// Emits 定义
const emit = defineEmits<{
  addCrop: [crop: Omit<Crop, 'id'>]
}>()

// 表单数据
const formData = reactive<CropFormData>({
  name: '',
  area: '',
  yield: '',
  plantDate: ''
})

// 表单错误
const errors = reactive<FormErrors>({})

// 提交状态
const isSubmitting = ref(false)

// 验证表单
function validateForm(): boolean {
  errors.name = undefined
  errors.area = undefined
  errors.yield = undefined
  errors.plantDate = undefined

  let isValid = true

  if (!formData.name.trim()) {
    errors.name = '请输入作物名称'
    isValid = false
  }

  const area = Number(formData.area)
  if (!formData.area) {
    errors.area = '请输入种植面积'
    isValid = false
  } else if (isNaN(area) || area <= 0) {
    errors.area = '种植面积必须为正数'
    isValid = false
  }

  const yieldValue = Number(formData.yield)
  if (!formData.yield) {
    errors.yield = '请输入产量'
    isValid = false
  } else if (isNaN(yieldValue) || yieldValue <= 0) {
    errors.yield = '产量必须为正数'
    isValid = false
  }

  if (!formData.plantDate) {
    errors.plantDate = '请选择种植日期'
    isValid = false
  }

  return isValid
}

// 重置表单
function resetForm() {
  formData.name = ''
  formData.area = ''
  formData.yield = ''
  formData.plantDate = ''
  errors.name = undefined
  errors.area = undefined
  errors.yield = undefined
  errors.plantDate = undefined
}

// 提交表单
async function handleSubmit() {
  if (!validateForm()) return

  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 300))

  const cropData: Omit<Crop, 'id'> = {
    name: formData.name.trim(),
    area: Number(formData.area),
    yield: Number(formData.yield),
    plantDate: formData.plantDate
  }

  emit('addCrop', cropData)
  resetForm()
  isSubmitting.value = false
}
</script>

<template>
  <form class="crop-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <label class="form-label">
        <span class="label-text">作物名称</span>
        <span class="required">*</span>
      </label>
      <el-input
        v-model="formData.name"
        placeholder="请输入作物名称，如：水稻"
        maxlength="20"
        :class="{ 'is-error': errors.name }"
        clearable
      />
      <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label class="form-label">
        <span class="label-text">种植面积（亩）</span>
        <span class="required">*</span>
      </label>
      <el-input
        v-model="formData.area"
        type="number"
        placeholder="请输入种植面积"
        :class="{ 'is-error': errors.area }"
        clearable
      />
      <span v-if="errors.area" class="error-message">{{ errors.area }}</span>
    </div>

    <div class="form-group">
      <label class="form-label">
        <span class="label-text">产量（公斤/亩）</span>
        <span class="required">*</span>
      </label>
      <el-input
        v-model="formData.yield"
        type="number"
        placeholder="请输入亩产量"
        :class="{ 'is-error': errors.yield }"
        clearable
      />
      <span v-if="errors.yield" class="error-message">{{ errors.yield }}</span>
    </div>

    <div class="form-group">
      <label class="form-label">
        <span class="label-text">种植日期</span>
        <span class="required">*</span>
      </label>
      <el-date-picker
        v-model="formData.plantDate"
        type="date"
        placeholder="请选择种植日期"
        format="YYYY-MM-DD"
        value-format="YYYY-MM-DD"
        :prefix-icon="Calendar"
        :class="{ 'is-error': errors.plantDate }"
        style="width: 100%"
        clearable
      />
      <span v-if="errors.plantDate" class="error-message">{{ errors.plantDate }}</span>
    </div>

    <div class="form-actions">
      <el-button
        type="primary"
        native-type="submit"
        :loading="isSubmitting"
        class="submit-btn"
      >
        <template #icon>
          <span v-if="!isSubmitting">✓</span>
        </template>
        {{ isSubmitting ? '提交中...' : '添加作物' }}
      </el-button>
      <el-button
        :disabled="isSubmitting"
        @click="resetForm"
        class="reset-btn"
      >
        重置
      </el-button>
    </div>
  </form>
</template>

<style scoped>
.crop-form {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 20px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.label-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #f56c6c;
  font-weight: 600;
}

.form-group :deep(.el-input),
.form-group :deep(.el-date-editor) {
  width: 100%;
}

.form-group :deep(.el-input__wrapper),
.form-group :deep(.el-date-editor .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
  border-radius: 8px;
  padding: 4px 12px;
}

.form-group :deep(.el-input__wrapper:hover),
.form-group :deep(.el-date-editor .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

.form-group :deep(.el-input__wrapper.is-focus),
.form-group :deep(.el-date-editor .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #4CAF50 inset;
}

.form-group :deep(.is-error .el-input__wrapper),
.form-group :deep(.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c inset;
}

.error-message {
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 12px;
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message::before {
  content: '⚠';
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 4px;
}

.submit-btn {
  flex: 1;
  background: #4CAF50;
  border-color: #4CAF50;
  border-radius: 8px;
  height: 40px;
}

.submit-btn:hover {
  background: #45a049;
  border-color: #45a049;
}

.reset-btn {
  flex: 1;
  border-radius: 8px;
  height: 40px;
}
</style>
