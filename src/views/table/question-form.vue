<template>
  <div class="question-form-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <el-card class="header-card">
        <div class="header-content">
          <h1 class="page-title">新建工单</h1>
          <el-button
            type="default"
            :icon="ArrowLeft"
            aria-label="返回工单列表"
            @click="goBack"
          >
            返回列表
          </el-button>
        </div>
      </el-card>
    </div>

    <!-- 基础表单部分 -->
    <div class="form-section">
      <el-card class="form-card">
        <template #header>
          <div class="card-header">
            <span class="form-section-title">基础信息</span>
          </div>
        </template>
        
        <el-form
          ref="questionFormRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          label-position="right"
          size="large"
          aria-label="工单基础信息表单"
        >
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="问题标题" prop="question" required>
                <el-input
                  v-model="formData.question"
                  placeholder="请输入问题标题"
                  clearable
                  maxlength="200"
                  show-word-limit
                  aria-describedby="question-help"
                />
                <span id="question-help" class="sr-only">请输入5-200个字符的问题标题</span>
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="问题类别" prop="typeValue" required>
                <el-select
                  v-model="formData.typeValue"
                  placeholder="请选择问题类别"
                  clearable
                  style="width: 100%"
                  aria-label="选择问题类别"
                >
                  <el-option label="功能问题" value="功能问题" />
                  <el-option label="性能问题" value="性能问题" />
                  <el-option label="界面问题" value="界面问题" />
                  <el-option label="数据问题" value="数据问题" />
                  <el-option label="权限问题" value="权限问题" />
                  <el-option label="其他" value="其他" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="优先级" prop="levelValue" required>
                <el-select
                  v-model="formData.levelValue"
                  placeholder="请选择优先级"
                  clearable
                  style="width: 100%"
                  aria-label="选择优先级"
                >
                  <el-option label="低" value="低" />
                  <el-option label="中" value="中" />
                  <el-option label="高" value="高" />
                  <el-option label="紧急" value="紧急" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="所属条线" prop="lineValue" required>
                <el-select
                  v-model="formData.lineValue"
                  placeholder="请选择所属条线"
                  clearable
                  style="width: 100%"
                  aria-label="选择所属条线"
                >
                  <el-option label="内部" value="内部" />
                  <el-option label="外部" value="外部" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="所属系统" prop="owningSystem" required>
                <el-input
                  v-model="formData.owningSystem"
                  placeholder="请输入所属系统"
                  clearable
                  aria-label="输入所属系统"
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="所属项目" prop="project">
                <el-input
                  v-model="formData.project"
                  placeholder="请输入所属项目"
                  clearable
                  aria-label="输入所属项目"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="关联框架/平台" prop="platformValue">
                <el-input
                  v-model="formData.platformValue"
                  placeholder="请输入关联框架/平台"
                  clearable
                  aria-label="输入关联框架或平台"
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="formData.status"
                  placeholder="请选择状态"
                  style="width: 100%"
                  aria-label="选择状态"
                >
                  <el-option label="未处理" value="未处理" />
                  <el-option label="处理中" value="处理中" />
                  <el-option label="已解决" value="已解决" />
                  <el-option label="已关闭" value="已关闭" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="提出人" prop="proposer" required>
                <el-input
                  v-model="formData.proposer"
                  placeholder="请输入提出人姓名"
                  clearable
                  aria-label="输入提出人姓名"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="所属公司" prop="proposerType">
                <el-select
                  v-model="formData.proposerType"
                  placeholder="请选择所属公司"
                  clearable
                  style="width: 100%"
                  aria-label="选择所属公司"
                >
                  <el-option label="内部" value="内部" />
                  <el-option label="外部" value="外部" />
                </el-select>
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="所属部门" prop="proposerDepartment">
                <el-input
                  v-model="formData.proposerDepartment"
                  placeholder="请输入所属部门"
                  clearable
                  aria-label="输入所属部门"
                />
              </el-form-item>
            </el-col>
            
            <el-col :xs="24" :sm="12" :md="8">
              <el-form-item label="解决人" prop="solver">
                <el-input
                  v-model="formData.solver"
                  placeholder="请输入解决人姓名"
                  clearable
                  aria-label="输入解决人姓名"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="问题描述" prop="description">
                <el-input
                  v-model="formData.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请详细描述问题的具体情况、出现频率、影响范围等"
                  maxlength="1000"
                  show-word-limit
                  aria-label="输入问题描述"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </div>

    <!-- 附件工单部分 -->
    <div class="attachment-section">
      <el-card class="attachment-card">
        <template #header>
          <div class="card-header">
            <span class="form-section-title">附件工单</span>
          </div>
        </template>
        
        <div class="attachment-selector">
          <el-form-item label="附件工单类型" label-width="120px">
            <el-select
              v-model="selectedAttachmentType"
              placeholder="请选择需要填写的附件工单类型（可选）"
              clearable
              style="width: 100%"
              aria-label="选择附件工单类型"
              @change="handleAttachmentTypeChange"
            >
              <el-option
                v-for="config in attachmentConfigs"
                :key="config.id"
                :label="config.name"
                :value="config.id"
              />
            </el-select>
          </el-form-item>
        </div>

        <div class="dynamic-form-container">
          <div v-if="!selectedAttachmentType" class="empty-state">
            <el-empty description="请选择附件工单类型以显示相应表单" />
          </div>
          
          <div v-else-if="attachmentFormLoading" class="loading-state">
            <el-skeleton :rows="3" animated />
          </div>
          
          <div v-else-if="attachmentFormError" class="error-state">
            <el-alert
              :title="attachmentFormError"
              type="error"
              show-icon
              :closable="false"
            />
          </div>
          
          <div v-else class="attachment-form-content">
            <el-divider>
              <el-text size="large" tag="strong">{{ currentAttachmentTypeName }}</el-text>
            </el-divider>
            
            <FormCreate
              v-model="attachmentFormData"
              :rule="attachmentFormRule"
              :option="attachmentFormOption"
              @change="handleAttachmentFormChange"
            />
          </div>
        </div>
      </el-card>
    </div>

    <!-- 操作按钮部分 -->
    <div class="action-section">
      <el-card class="action-card">
        <div class="action-buttons">
          <el-button
            size="large"
            aria-label="清空所有表单内容"
            @click="resetForm"
          >
            清空
          </el-button>
          <el-button
            type="primary"
            size="large"
            :loading="isSubmitting"
            aria-label="提交工单"
            @click="submitForm"
          >
            提交工单
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormCreate from '@form-create/element-ui'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'

const router = useRouter()

// 表单引用
const questionFormRef = ref<FormInstance>()

// 表单数据
const formData = reactive({
  question: '',
  typeValue: '',
  levelValue: '',
  lineValue: '',
  owningSystem: '',
  project: '',
  platformValue: '',
  status: '未处理', // 默认状态
  proposer: '',
  proposerType: '',
  proposerDepartment: '',
  solver: '',
  description: ''
})

// 表单验证规则
const formRules: FormRules = {
  question: [
    { required: true, message: '请输入问题标题', trigger: 'blur' },
    { min: 5, max: 200, message: '标题长度应在5-200个字符之间', trigger: 'blur' }
  ],
  typeValue: [
    { required: true, message: '请选择问题类别', trigger: 'change' }
  ],
  levelValue: [
    { required: true, message: '请选择优先级', trigger: 'change' }
  ],
  lineValue: [
    { required: true, message: '请选择所属条线', trigger: 'change' }
  ],
  owningSystem: [
    { required: true, message: '请输入所属系统', trigger: 'blur' }
  ],
  proposer: [
    { required: true, message: '请输入提出人姓名', trigger: 'blur' }
  ]
}

// 附件工单相关
const selectedAttachmentType = ref('')
const attachmentFormData = ref({})
const attachmentFormRule = ref([])
const attachmentFormLoading = ref(false)
const attachmentFormError = ref('')
const isSubmitting = ref(false)

// 附件工单配置选项
const attachmentFormOption = reactive({
  submitBtn: false, // 隐藏默认提交按钮
  resetBtn: false,  // 隐藏默认重置按钮
  form: {
    labelWidth: '120px',
    labelPosition: 'right',
    size: 'large'
  }
})

// 计算当前附件工单类型名称
const currentAttachmentTypeName = computed(() => {
  if (!selectedAttachmentType.value) return ''
  const config = attachmentConfigs.value.find(c => c.id === selectedAttachmentType.value)
  return config ? config.name : ''
})

// 模拟附件工单配置数据（参考dynamic-form-generator.vue）
const attachmentConfigs = ref([
  {
    id: 'user-info',
    name: '用户信息补充',
    rule: [
      {
        type: 'input',
        field: 'userAccount',
        title: '用户账号',
        value: '',
        props: {
          placeholder: '请输入用户账号'
        },
        validate: [
          { required: true, message: '请输入用户账号', trigger: 'blur' }
        ]
      },
      {
        type: 'input',
        field: 'userRole',
        title: '用户角色',
        value: '',
        props: {
          placeholder: '请输入用户角色'
        }
      },
      {
        type: 'select',
        field: 'accessLevel',
        title: '访问权限级别',
        value: '',
        options: [
          { label: '普通用户', value: 'normal' },
          { label: '管理员', value: 'admin' },
          { label: '超级管理员', value: 'super_admin' }
        ],
        props: {
          placeholder: '请选择访问权限级别'
        }
      }
    ]
  },
  {
    id: 'technical-details',
    name: '技术详情',
    rule: [
      {
        type: 'select',
        field: 'browserType',
        title: '浏览器类型',
        value: '',
        options: [
          { label: 'Chrome', value: 'chrome' },
          { label: 'Firefox', value: 'firefox' },
          { label: 'Safari', value: 'safari' },
          { label: 'Edge', value: 'edge' },
          { label: '其他', value: 'other' }
        ],
        props: {
          placeholder: '请选择浏览器类型'
        }
      },
      {
        type: 'input',
        field: 'browserVersion',
        title: '浏览器版本',
        value: '',
        props: {
          placeholder: '请输入浏览器版本'
        }
      },
      {
        type: 'select',
        field: 'operatingSystem',
        title: '操作系统',
        value: '',
        options: [
          { label: 'Windows 10', value: 'win10' },
          { label: 'Windows 11', value: 'win11' },
          { label: 'macOS', value: 'macos' },
          { label: 'Linux', value: 'linux' },
          { label: '其他', value: 'other' }
        ],
        props: {
          placeholder: '请选择操作系统'
        }
      },
      {
        type: 'textarea',
        field: 'errorMessage',
        title: '错误信息',
        value: '',
        props: {
          placeholder: '请粘贴具体的错误信息',
          rows: 4
        }
      },
      {
        type: 'textarea',
        field: 'reproductionSteps',
        title: '复现步骤',
        value: '',
        props: {
          placeholder: '请详细描述问题的复现步骤',
          rows: 5
        }
      }
    ]
  },
  {
    id: 'business-impact',
    name: '业务影响评估',
    rule: [
      {
        type: 'select',
        field: 'impactScope',
        title: '影响范围',
        value: '',
        options: [
          { label: '个人用户', value: 'individual' },
          { label: '部门用户', value: 'department' },
          { label: '全公司用户', value: 'company' },
          { label: '外部客户', value: 'external' }
        ],
        props: {
          placeholder: '请选择影响范围'
        },
        validate: [
          { required: true, message: '请选择影响范围', trigger: 'change' }
        ]
      },
      {
        type: 'select',
        field: 'businessCriticality',
        title: '业务重要性',
        value: '',
        options: [
          { label: '低', value: 'low' },
          { label: '中', value: 'medium' },
          { label: '高', value: 'high' },
          { label: '关键', value: 'critical' }
        ],
        props: {
          placeholder: '请选择业务重要性'
        }
      },
      {
        type: 'datePicker',
        field: 'expectedResolutionDate',
        title: '期望解决时间',
        value: '',
        props: {
          type: 'datetime',
          placeholder: '请选择期望解决时间',
          format: 'YYYY-MM-DD HH:mm'
        }
      },
      {
        type: 'textarea',
        field: 'businessImpactDescription',
        title: '业务影响描述',
        value: '',
        props: {
          placeholder: '请描述此问题对业务造成的具体影响',
          rows: 4
        }
      }
    ]
  }
])

// 方法定义
const goBack = () => {
  router.push('/table/question-table')
}

const handleAttachmentTypeChange = async (configId: string) => {
  if (!configId) {
    attachmentFormRule.value = []
    attachmentFormData.value = {}
    return
  }

  try {
    attachmentFormLoading.value = true
    attachmentFormError.value = ''

    // 模拟异步加载
    await new Promise(resolve => setTimeout(resolve, 300))

    const config = attachmentConfigs.value.find(c => c.id === configId)
    if (!config) {
      throw new Error('未找到对应的附件工单配置')
    }

    // 深拷贝规则以避免引用问题
    attachmentFormRule.value = JSON.parse(JSON.stringify(config.rule))

    // 重置附件表单数据
    await nextTick()
    resetAttachmentFormData()

    ElMessage.success('附件工单加载成功')
  } catch (error: any) {
    attachmentFormError.value = error.message || '加载附件工单配置失败'
    ElMessage.error(attachmentFormError.value)
  } finally {
    attachmentFormLoading.value = false
  }
}

const resetAttachmentFormData = () => {
  const newData = {}
  attachmentFormRule.value.forEach((rule: any) => {
    // 根据字段类型设置正确的空值
    switch (rule.type) {
      case 'input':
      case 'textarea':
      case 'select':
      case 'datePicker':
        newData[rule.field] = ''
        break
      case 'checkbox':
        newData[rule.field] = []
        break
      case 'radio':
        newData[rule.field] = ''
        break
      case 'inputNumber':
      case 'rate':
      case 'slider':
        newData[rule.field] = 0
        break
      case 'switch':
        newData[rule.field] = false
        break
      default:
        newData[rule.field] = rule.value || ''
    }
  })
  attachmentFormData.value = newData
}

const handleAttachmentFormChange = (field: string, value: any) => {
  console.log('附件表单变化:', { field, value })
}

const resetForm = async () => {
  try {
    const result = await ElMessageBox.confirm(
      '确定要清空所有表单内容吗？此操作不可恢复。',
      '确认清空',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    if (result === 'confirm') {
      // 重置基础表单
      questionFormRef.value?.resetFields()
      
      // 重置附件工单
      selectedAttachmentType.value = ''
      attachmentFormData.value = {}
      attachmentFormRule.value = []
      
      ElMessage.success('表单已清空')
    }
  } catch {
    // 用户取消操作
  }
}

const submitForm = async () => {
  try {
    isSubmitting.value = true

    // 验证基础表单
    const isValid = await questionFormRef.value?.validate()
    if (!isValid) {
      ElMessage.error('请完善基础信息')
      return
    }

    // 准备提交数据
    const submitData = {
      ...formData,
      attachmentType: selectedAttachmentType.value,
      attachmentData: selectedAttachmentType.value ? attachmentFormData.value : null,
      createTime: Date.now()
    }

    // 模拟提交到后端
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElNotification({
      title: '提交成功',
      message: '工单已成功创建，系统将为您分配工单编号',
      type: 'success',
      duration: 3000
    })

    // 提交成功后跳转回列表页
    router.push('/table/question-table')
  } catch (error: any) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 组件挂载时的初始化
onMounted(() => {
  // 可以在这里添加初始化逻辑，比如获取用户信息等
})
</script>

<style lang="scss" scoped>
.question-form-container {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.form-section,
.attachment-section,
.action-section {
  margin-bottom: 20px;
}

.form-card,
.attachment-card,
.action-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.attachment-selector {
  margin-bottom: 20px;
}

.dynamic-form-container {
  border-top: 1px solid #dcdfe6;
  padding-top: 20px;
}

.loading-state,
.error-state {
  padding: 20px;
}

.attachment-form-content {
  :deep(.form-create) {
    .el-form-item {
      margin-bottom: 20px;
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

/* 无障碍访问样式 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 焦点状态增强 */
:deep(.el-input__wrapper) {
  transition: all 0.2s ease;
  
  &:focus-within {
    box-shadow: 0 0 0 2px #4285f4;
    border-color: #4285f4;
  }
}

:deep(.el-select) {
  .el-input__wrapper:focus-within {
    box-shadow: 0 0 0 2px #4285f4;
    border-color: #4285f4;
  }
}

:deep(.el-textarea__inner) {
  transition: all 0.2s ease;
  
  &:focus {
    box-shadow: 0 0 0 2px #4285f4;
    border-color: #4285f4;
  }
}

:deep(.el-button) {
  transition: all 0.2s ease;
  
  &:focus {
    outline: 2px solid #4285f4;
    outline-offset: 2px;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .page-title {
    color: #000;
  }
  
  .form-section-title {
    color: #000;
  }
  
  :deep(.el-button) {
    border-width: 2px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .question-form-container {
    padding: 10px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  :deep(.el-col) {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .question-form-container {
    padding: 5px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  :deep(.el-form) {
    .el-form-item__label {
      font-size: 14px;
    }
  }
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>