<template>
  <div class="dynamic-form-generator">
    <!-- 顶部导航区域 -->
    <div class="header-section">
      <el-card class="selector-card">
        <div class="selector-container">
          <label class="selector-label">选择表单配置：</label>
          <el-select
            v-model="selectedConfigId"
            placeholder="请选择表单配置"
            size="large"
            class="config-selector"
            @change="handleConfigChange"
          >
            <el-option v-for="config in formConfigs" :key="config.id" :label="config.name" :value="config.id" />
          </el-select>
          <el-button type="primary" size="large" :disabled="!selectedConfigId" @click="refreshForm">刷新表单</el-button>
        </div>
      </el-card>
    </div>

    <!-- 表单预览区域 -->
    <div class="preview-section">
      <el-card class="form-preview-card">
        <template #header>
          <div class="card-header">
            <span class="form-title">{{ currentFormTitle }}</span>
            <div class="form-actions">
              <el-button size="small" @click="viewFormData">查看数据</el-button>
              <el-button size="small" @click="resetForm">重置表单</el-button>
            </div>
          </div>
        </template>

        <div class="form-container">
          <div v-if="!selectedConfigId" class="empty-state">
            <el-empty description="请选择表单配置以开始预览" />
          </div>

          <div v-else-if="formLoading" class="loading-state">
            <el-skeleton :rows="8" animated />
          </div>

          <div v-else-if="formError" class="error-state">
            <el-alert title="表单加载失败" :description="formError" type="error" show-icon />
          </div>

          <div v-else class="form-content">
            <!-- 提交状态提示 -->
            <div v-if="submitError" class="submit-status-alert">
              <el-alert
                :title="submitError"
                type="error"
                :closable="false"
                show-icon
                class="mb-4"
              />
            </div>
            
            <!-- 自动保存状态 -->
            <div v-if="lastSaveTime" class="auto-save-status">
              <el-text size="small" type="info">
                <el-icon><Clock /></el-icon>
                草稿已保存于 {{ formatTime(lastSaveTime) }}
              </el-text>
            </div>
            
            <form-create
              v-model="formData"
              :rule="formRule"
              :option="formOption"
              @submit="handleSubmit"
              @change="handleFormChange"
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 数据预览弹窗 -->
    <el-dialog v-model="dataDialogVisible" title="表单数据预览" width="60%" :before-close="handleDataDialogClose">
      <div class="data-preview">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="表单数据" name="formData">
            <pre class="json-display">{{ JSON.stringify(formData, null, 2) }}</pre>
          </el-tab-pane>
          <el-tab-pane label="表单规则" name="formRule">
            <pre class="json-display">{{ JSON.stringify(formRule, null, 2) }}</pre>
          </el-tab-pane>
        </el-tabs>
      </div>
      <template #footer>
        <el-button @click="dataDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="copyToClipboard">复制数据</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Clock } from '@element-plus/icons-vue'
import useClipboard from 'vue-clipboard3'
import { type FormSubmitData, saveFormDraft, submitFormData, validateFormData } from '@/api/form'

// 响应式数据
const selectedConfigId = ref('')
const formData = ref({})
const formRule = ref([])
const formLoading = ref(false)
const formError = ref('')
const dataDialogVisible = ref(false)
const activeTab = ref('formData')
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'validating' | 'submitting' | 'success' | 'error'>('idle')
const submitError = ref('')
const autoSaveTimer = ref<NodeJS.Timeout | null>(null)
const lastSaveTime = ref<Date | null>(null)

// 表单配置选项
const formOption = reactive({
  submitBtn: {
    text: computed(() => {
      switch (submitStatus.value) {
        case 'validating': return '验证中...'
        case 'submitting': return '提交中...'
        case 'success': return '提交成功'
        default: return '提交表单'
      }
    }),
    type: computed(() => {
      switch (submitStatus.value) {
        case 'success': return 'success'
        case 'error': return 'danger'
        default: return 'primary'
      }
    }),
    size: 'large',
    loading: computed(() => ['validating', 'submitting'].includes(submitStatus.value)),
    disabled: computed(() => ['validating', 'submitting'].includes(submitStatus.value))
  },
  resetBtn: {
    text: '重置',
    size: 'large'
  },
  form: {
    labelWidth: '120px',
    labelPosition: 'right',
    size: 'large',
    validateOnRuleChange: false
  }
})

// 模拟表单配置数据
const formConfigs = ref([
  {
    id: 'user-registration',
    name: '用户注册表单',
    rule: [
      {
        type: 'input',
        field: 'username',
        title: '用户名',
        value: '',
        props: {
          placeholder: '请输入用户名'
        },
        validate: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      {
        type: 'input',
        field: 'email',
        title: '邮箱',
        value: '',
        props: {
          type: 'email',
          placeholder: '请输入邮箱地址'
        },
        validate: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      {
        type: 'input',
        field: 'password',
        title: '密码',
        value: '',
        props: {
          type: 'password',
          placeholder: '请输入密码',
          showPassword: true
        },
        validate: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
        ]
      },
      {
        type: 'select',
        field: 'gender',
        title: '性别',
        value: '',
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' },
          { label: '其他', value: 'other' }
        ],
        props: {
          placeholder: '请选择性别'
        }
      },
      {
        type: 'datePicker',
        field: 'birthday',
        title: '出生日期',
        value: '',
        props: {
          type: 'date',
          placeholder: '请选择出生日期',
          format: 'YYYY-MM-DD'
        }
      },
      {
        type: 'checkbox',
        field: 'interests',
        title: '兴趣爱好',
        value: [],
        options: [
          { label: '阅读', value: 'reading' },
          { label: '运动', value: 'sports' },
          { label: '音乐', value: 'music' },
          { label: '旅行', value: 'travel' },
          { label: '编程', value: 'programming' }
        ]
      }
    ]
  },
  {
    id: 'product-info',
    name: '产品信息表单',
    rule: [
      {
        type: 'input',
        field: 'productName',
        title: '产品名称',
        value: '',
        props: {
          placeholder: '请输入产品名称'
        },
        validate: [{ required: true, message: '请输入产品名称', trigger: 'blur' }]
      },
      {
        type: 'textarea',
        field: 'description',
        title: '产品描述',
        value: '',
        props: {
          placeholder: '请输入产品描述',
          rows: 4
        }
      },
      {
        type: 'inputNumber',
        field: 'price',
        title: '价格',
        value: 0,
        props: {
          min: 0,
          precision: 2,
          step: 0.01,
          placeholder: '请输入价格'
        },
        validate: [{ required: true, message: '请输入价格', trigger: 'blur' }]
      },
      {
        type: 'select',
        field: 'category',
        title: '产品分类',
        value: '',
        options: [
          { label: '电子产品', value: 'electronics' },
          { label: '服装', value: 'clothing' },
          { label: '食品', value: 'food' },
          { label: '图书', value: 'books' },
          { label: '家居', value: 'home' }
        ],
        props: {
          placeholder: '请选择产品分类'
        },
        validate: [{ required: true, message: '请选择产品分类', trigger: 'change' }]
      },
      {
        type: 'switch',
        field: 'isAvailable',
        title: '是否上架',
        value: true
      },
      {
        type: 'rate',
        field: 'rating',
        title: '产品评分',
        value: 0,
        props: {
          max: 5,
          allowHalf: true
        }
      },
      {
        type: 'slider',
        field: 'inventory',
        title: '库存数量',
        value: 100,
        props: {
          min: 0,
          max: 1000,
          step: 10,
          showStops: true
        }
      }
    ]
  },
  {
    id: 'survey-form',
    name: '问卷调查表单',
    rule: [
      {
        type: 'input',
        field: 'name',
        title: '姓名',
        value: '',
        props: {
          placeholder: '请输入您的姓名'
        },
        validate: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
      },
      {
        type: 'radio',
        field: 'age_group',
        title: '年龄段',
        value: '',
        options: [
          { label: '18-25岁', value: '18-25' },
          { label: '26-35岁', value: '26-35' },
          { label: '36-45岁', value: '36-45' },
          { label: '46-55岁', value: '46-55' },
          { label: '55岁以上', value: '55+' }
        ],
        validate: [{ required: true, message: '请选择年龄段', trigger: 'change' }]
      },
      {
        type: 'checkbox',
        field: 'preferences',
        title: '产品偏好',
        value: [],
        options: [
          { label: '功能性', value: 'functional' },
          { label: '美观性', value: 'aesthetic' },
          { label: '性价比', value: 'cost_effective' },
          { label: '品牌知名度', value: 'brand' },
          { label: '用户体验', value: 'user_experience' }
        ]
      },
      {
        type: 'rate',
        field: 'satisfaction',
        title: '满意度评分',
        value: 0,
        props: {
          max: 5,
          showText: true,
          texts: ['很差', '较差', '一般', '较好', '很好']
        }
      },
      {
        type: 'textarea',
        field: 'suggestions',
        title: '意见建议',
        value: '',
        props: {
          placeholder: '请输入您的意见和建议',
          rows: 5
        }
      }
    ]
  }
])

// 计算属性
const currentFormTitle = computed(() => {
  const config = formConfigs.value.find((c) => c.id === selectedConfigId.value)
  return config ? config.name : '表单预览'
})

// 监听配置变化
watch(selectedConfigId, (newId) => {
  if (newId) {
    loadFormConfig(newId)
  } else {
    resetFormState()
  }
})

// 方法定义
const handleConfigChange = (configId: string) => {
  // 由于watch已经监听selectedConfigId的变化，这里不需要重复调用loadFormConfig
  // selectedConfigId的值已经通过v-model自动更新，watch会自动触发loadFormConfig
}

const loadFormConfig = async (configId) => {
  try {
    formLoading.value = true
    formError.value = ''

    // 模拟异步加载
    await new Promise((resolve) => setTimeout(resolve, 300))

    const config = formConfigs.value.find((c) => c.id === configId)
    if (!config) {
      throw new Error('未找到对应的表单配置')
    }

    // 深拷贝规则以避免引用问题
    formRule.value = JSON.parse(JSON.stringify(config.rule))

    // 重置表单数据
    await nextTick()
    resetFormData()

    ElMessage.success('表单加载成功')
  } catch (error: any) {
    formError.value = error.message || '加载表单配置失败'
    ElMessage.error(formError.value)
  } finally {
    formLoading.value = false
  }
}

const resetFormState = () => {
  formRule.value = []
  formData.value = {}
  formError.value = ''
}

const resetFormData = () => {
  const newData = {}
  formRule.value.forEach((rule) => {
    // 根据字段类型设置正确的空值
    switch ((rule as { type: string }).type) {
      case 'input':
      case 'textarea':
      case 'select':
      case 'datePicker':
        newData[(rule as { field: string }).field] = ''
        break
      case 'checkbox':
        newData[(rule as { field: string }).field] = []
        break
      case 'radio':
        newData[(rule as { field: string }).field] = ''
        break
      case 'inputNumber':
      case 'rate':
      case 'slider':
        newData[(rule as { field: string }).field] = 0
        break
      case 'switch':
        newData[(rule as { field: string }).field] = false
        break
      default:
        // 对于其他类型，使用rule中定义的初始值
        newData[(rule as { field: string; value: any }).field] = (rule as { field: string; value: any }).value
    }
  })
  formData.value = newData
}

const refreshForm = () => {
  if (selectedConfigId.value) {
    loadFormConfig(selectedConfigId.value)
  }
}

const resetForm = () => {
  resetFormData()
  ElMessage.success('表单已重置')
}

const handleSubmit = async (formData: any, fApi?: any) => {
  try {
    // 重置状态
    submitStatus.value = 'validating'
    submitError.value = ''
    isSubmitting.value = true

    // 1. 客户端数据验证
    if (!validateClientData(formData)) {
      submitStatus.value = 'error'
      return
    }

    // 2. 服务端数据验证（可选）
    try {
      const validationResult = await validateFormData(selectedConfigId.value, formData)
      if (!validationResult.valid && validationResult.errors) {
        handleValidationErrors(validationResult.errors, fApi)
        submitStatus.value = 'error'
        return
      }
    } catch (error) {
      console.warn('服务端验证失败，继续提交:', error)
    }

    // 3. 准备提交数据
    submitStatus.value = 'submitting'
    const submitData: FormSubmitData = {
      formType: selectedConfigId.value,
      formData: sanitizeFormData(formData),
      timestamp: Date.now(),
      clientInfo: {
        userAgent: navigator.userAgent
      }
    }

    // 4. 提交到后端
    const response = await submitFormData(submitData)

    if (response.success) {
      submitStatus.value = 'success'
      ElNotification({
        title: '提交成功',
        message: response.message || '表单数据已成功提交到服务器',
        type: 'success',
        duration: 3000
      })

      // 清除自动保存的草稿
      clearAutoSave()

      // 3秒后重置按钮状态
      setTimeout(() => {
        if (submitStatus.value === 'success') {
          submitStatus.value = 'idle'
        }
      }, 3000)
    } else {
      throw new Error(response.message || '提交失败')
    }
  } catch (error: any) {
    submitStatus.value = 'error'
    submitError.value = error.message || '网络错误，请检查网络连接'
    
    console.error('表单提交失败:', error)
    
    ElNotification({
      title: '提交失败',
      message: getErrorMessage(error),
      type: 'error',
      duration: 5000
    })

    // 5秒后重置按钮状态
    setTimeout(() => {
      if (submitStatus.value === 'error') {
        submitStatus.value = 'idle'
      }
    }, 5000)
  } finally {
    isSubmitting.value = false
  }
}

const handleFormChange = (field: string, value: any, origin: any, api: any) => {
  console.log('表单变化:', { field, value })
  
  // 自动保存草稿
  scheduleAutoSave()
}

// 客户端数据验证
const validateClientData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    ElMessage.error('表单数据格式错误')
    return false
  }

  // 检查必填字段
  const requiredFields = (formRule.value as any[]).filter((rule: any) => 
    rule.validate?.some((v: any) => v.required)
  )

  for (const field of requiredFields) {
    const value = data[field.field]
    if (value === undefined || value === null || value === '' || 
        (Array.isArray(value) && value.length === 0)) {
      ElMessage.error(`请填写${field.title}`)
      return false
    }
  }

  return true
}

// 处理验证错误
const handleValidationErrors = (errors: Record<string, string[]>, fApi?: any) => {
  const errorMessages = Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n')
  
  ElMessage.error(`数据验证失败:\n${errorMessages}`)
  
  // 如果有FormCreate API，设置字段错误
  if (fApi) {
    Object.entries(errors).forEach(([field, messages]) => {
      fApi.setFieldError(field, messages[0])
    })
  }
}

// 数据清理和安全处理
const sanitizeFormData = (data: any): any => {
  const sanitized = { ...data }
  
  // 移除可能的XSS攻击代码
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitized[key]
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
    }
  })

  return sanitized
}

// 错误消息处理
const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.message) {
    return error.message
  }
  if (error.code === 'NETWORK_ERROR') {
    return '网络连接失败，请检查网络设置'
  }
  if (error.code === 'TIMEOUT') {
    return '请求超时，请重试'
  }
  return '未知错误，请联系管理员'
}

// 自动保存相关函数
const scheduleAutoSave = () => {
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value)
  }

  autoSaveTimer.value = setTimeout(async () => {
    try {
      // 暂时禁用自动保存API调用以避免404错误
      // 后端API '/api/form/draft' 尚未实现，等待后端开发完成后启用
      // await saveFormDraft({
      //   formType: selectedConfigId.value,
      //   formData: formData.value,
      //   timestamp: Date.now()
      // })
      lastSaveTime.value = new Date()
      console.log('草稿已本地保存（API暂未实现）')
    } catch (error) {
      console.warn('自动保存失败:', error)
    }
  }, 3000) // 3秒后保存
}

const clearAutoSave = () => {
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value)
    autoSaveTimer.value = null
  }
  lastSaveTime.value = null
}

// 格式化时间显示
const formatTime = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  if (diff < 60000) { // 小于1分钟
    return '刚刚'
  } else if (diff < 3600000) { // 小于1小时
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) { // 小于1天
    return `${Math.floor(diff / 3600000)}小时前`
  } else {
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const { toClipboard } = useClipboard()

const viewFormData = () => {
  dataDialogVisible.value = true
  activeTab.value = 'formData'
}

const handleDataDialogClose = () => {
  dataDialogVisible.value = false
}

const copyToClipboard = async () => {
  try {
    const data = activeTab.value === 'formData' ? formData.value : formRule.value
    await toClipboard(JSON.stringify(data, null, 2))
    ElMessage.success('数据已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

// 初始化
const init = () => {
  // 可以在这里添加初始化逻辑
}

// 组件卸载时清理
onUnmounted(() => {
  clearAutoSave()
})

init()
</script>

<style scoped>
.dynamic-form-generator {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.header-section {
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.selector-card {
  border: none;
  box-shadow: none;
}

.selector-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selector-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.config-selector {
  min-width: 300px;
  flex: 1;
  max-width: 500px;
}

.preview-section {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}

.form-preview-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.form-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
}

.submit-status-alert {
  margin-bottom: 16px;
}

.auto-save-status {
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #f0f9ff;
  border: 1px solid #e1f5fe;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.auto-save-status .el-icon {
  color: #409eff;
}

.form-content {
  position: relative;
}

.mb-4 {
  margin-bottom: 16px;
}

.empty-state,
.loading-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.form-content {
  max-width: 800px;
  margin: 0 auto;
}

.data-preview {
  max-height: 500px;
  overflow-y: auto;
}

.json-display {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  color: #495057;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .selector-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .config-selector {
    min-width: auto;
    max-width: none;
  }

  .card-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .form-actions {
    justify-content: center;
  }
}

/* 表单样式优化 */
:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
  text-align: right;
  padding-right: 12px;
  line-height: 40px;
  min-width: 120px;
  display: inline-block;
}

:deep(.el-form-item__content) {
  line-height: 40px;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-date-editor),
:deep(.el-textarea) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
  min-height: 40px;
}

:deep(.el-select .el-input__wrapper) {
  min-height: 40px;
}

:deep(.el-checkbox-group),
:deep(.el-radio-group) {
  line-height: 40px;
}

:deep(.el-checkbox),
:deep(.el-radio) {
  margin-right: 16px;
  line-height: 40px;
}

:deep(.el-rate),
:deep(.el-slider) {
  line-height: 40px;
}

:deep(.el-switch) {
  line-height: 40px;
}

:deep(.el-input-number) {
  width: 100%;
}

:deep(.el-input-number .el-input__wrapper) {
  width: 100%;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

:deep(.el-button:before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

:deep(.el-button:hover:before) {
  left: 100%;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  border-color: #1976d2;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #1e88e5 0%, #1976d2 100%);
  border-color: #1e88e5;
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

:deep(.el-button--primary:active) {
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
  border-color: #1565c0;
  color: #ffffff;
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.3);
}

:deep(.el-button--primary.is-loading) {
  background: linear-gradient(135deg, #90caf9 0%, #64b5f6 100%);
  border-color: #90caf9;
  color: #ffffff;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 2px 8px rgba(144, 202, 249, 0.3);
}

:deep(.el-button--primary:disabled) {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border-color: #e3f2fd;
  color: #9e9e9e;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

:deep(.el-button--primary .el-icon) {
  transition: transform 0.3s ease;
}

:deep(.el-button--primary.is-loading .el-icon) {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

:deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 滚动条样式 */
.form-container::-webkit-scrollbar,
.data-preview::-webkit-scrollbar {
  width: 6px;
}

.form-container::-webkit-scrollbar-track,
.data-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.form-container::-webkit-scrollbar-thumb,
.data-preview::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.form-container::-webkit-scrollbar-thumb:hover,
.data-preview::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
