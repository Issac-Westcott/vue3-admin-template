<template>
  <div class="app-container" role="main">
    <!-- 查询表单区域 -->
    <div class="filter-container">
      <el-card class="box-card">
        <div class="search-form" role="search" aria-label="问题查询表单">
          <el-row :gutter="20">
            <el-col :span="4">
              <el-input
                v-model="searchForm.question"
                placeholder="标题关键词"
                clearable
                aria-label="输入标题关键词进行搜索"
                tabindex="1"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="searchForm.typeValue"
                placeholder="问题类别"
                clearable
                aria-label="输入问题类别进行筛选"
                tabindex="2"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="searchForm.lineValue"
                placeholder="所属条线"
                clearable
                aria-label="输入所属条线进行筛选"
                tabindex="3"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="searchForm.owningSystem"
                placeholder="所属系统"
                clearable
                aria-label="输入所属系统进行筛选"
                tabindex="4"
              />
            </el-col>
            <el-col :span="3">
              <el-input
                v-model="searchForm.proposer"
                placeholder="提出人"
                clearable
                aria-label="输入提出人姓名进行筛选"
                tabindex="5"
              />
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="searchForm.status"
                placeholder="问题状态"
                clearable
                style="width: 100%"
                aria-label="选择问题状态进行筛选"
                tabindex="6"
              >
                <el-option label="未处理" value="未处理" />
                <el-option label="处理中" value="处理中" />
                <el-option label="关闭" value="关闭" />
              </el-select>
            </el-col>
            <el-col :span="5">
              <el-button 
                type="primary" 
                :icon="Search" 
                aria-label="执行查询操作"
                tabindex="7"
                @click="handleSearch"
              >
                查询
              </el-button>
              <el-button 
                type="success" 
                :icon="Plus" 
                aria-label="创建新问题"
                tabindex="8"
                @click="handleCreate"
              >
                新建
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </div>

    <!-- 表格区域 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :scroll-x="true"
      role="table"
      aria-label="问题列表表格"
      aria-describedby="table-description"
      tabindex="9"
    >
      <div id="table-description" class="sr-only">包含问题标题、类别、优先级、状态等信息的数据表格，支持编辑和查看详情</div>
      <el-table-column align="center" label="序号" width="80" fixed="left" header-align="center">
        <template #default="{ row, $index }">
          <span role="cell" :aria-describedby="`row-${$index}-id`">{{ row.id }}</span>
          <span :id="`row-${$index}-id`" class="sr-only">第{{ row.id }}行</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="标题" align="center" fixed="left" header-align="center">
        <template #default="{ row, $index }">
          <template v-if="row.edit">
            <el-input 
              v-model="row.question" 
              class="edit-input" 
              size="small" 
              :aria-label="`编辑第${$index + 1}行的问题标题`"
              :tabindex="100 + $index * 10 + 1"
            />
            <el-button 
              class="cancel-btn" 
              size="small" 
              type="warning" 
              :aria-label="`取消编辑第${$index + 1}行`"
              :tabindex="100 + $index * 10 + 2"
              @click="cancelEdit(row)"
            >
              <el-icon><Refresh /></el-icon>
              cancel
            </el-button>
          </template>
          <el-tooltip v-else :content="row.question" placement="top" :disabled="!isTextOverflow(row.question, 180)">
            <el-link
              type="primary"
              class="question-link text-ellipsis"
              :underline="false"
              :aria-label="`查看问题详情：${row.question}`"
              :tabindex="100 + $index * 10 + 1"
              role="button"
              @click="goToDetail(row)"
            >
              {{ row.question }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="问题类别" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.typeValue" class="edit-input" size="small" />
          </template>
          <el-tooltip v-else :content="row.typeValue" placement="top" :disabled="!isTextOverflow(row.typeValue, 100)">
            <span class="text-ellipsis">{{ row.typeValue }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="100px" label="优先级" align="center">
        <template #default="{ row }">
          <span v-for="n in +row.levelValue" :key="n" class="priority-star">★</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="所属条线" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.lineValue" class="edit-input" size="small" />
          </template>
          <el-tooltip v-else :content="row.lineValue" placement="top" :disabled="!isTextOverflow(row.lineValue, 100)">
            <span class="text-ellipsis">{{ row.lineValue }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="所属系统" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.owningSystem" class="edit-input" size="small" />
          </template>
          <el-tooltip
            v-else
            :content="row.owningSystem"
            placement="top"
            :disabled="!isTextOverflow(row.owningSystem, 130)"
          >
            <span class="text-ellipsis">{{ row.owningSystem }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="所属项目" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.project" class="edit-input" size="small" />
          </template>
          <el-tooltip v-else :content="row.project" placement="top" :disabled="!isTextOverflow(row.project, 130)">
            <span class="text-ellipsis">{{ row.project }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="关联框架/平台" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.platformValue" class="edit-input" size="small" />
          </template>
          <el-tooltip
            v-else
            :content="row.platformValue"
            placement="top"
            :disabled="!isTextOverflow(row.platformValue, 130)"
          >
            <span class="text-ellipsis">{{ row.platformValue }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusFilter(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="提出人" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.proposer" class="edit-input" size="small" />
          </template>
          <el-tooltip v-else :content="row.proposer" placement="top" :disabled="!isTextOverflow(row.proposer, 100)">
            <span class="text-ellipsis">{{ row.proposer }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="所属公司" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.proposerType" class="edit-input" size="small" />
          </template>
          <el-tooltip
            v-else
            :content="row.proposerType"
            placement="top"
            :disabled="!isTextOverflow(row.proposerType, 100)"
          >
            <span class="text-ellipsis">{{ row.proposerType }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="150px" label="所属部门" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.proposerDepartment" class="edit-input" size="small" />
          </template>
          <el-tooltip
            v-else
            :content="row.proposerDepartment"
            placement="top"
            :disabled="!isTextOverflow(row.proposerDepartment, 130)"
          >
            <span class="text-ellipsis">{{ row.proposerDepartment }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="解决人" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.solver" class="edit-input" size="small" />
          </template>
          <el-tooltip v-else :content="row.solver" placement="top" :disabled="!isTextOverflow(row.solver, 100)">
            <span class="text-ellipsis">{{ row.solver }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="180px" label="提出时间" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>


    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Close, Edit, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { parseTime } from '@/utils/date-util'
import { getQuestionList } from '@/api/article'

const router = useRouter()

const list = ref([])
const originalList = ref([]) // 保存原始数据
const listLoading = ref(true)
const listQuery = ref({
  page: 1,
  limit: 20
})

// 搜索表单数据
const searchForm = ref({
  question: '',
  typeValue: '',
  lineValue: '',
  owningSystem: '',
  proposer: '',
  status: ''
})

// 检测文本是否会溢出
const isTextOverflow = (text, maxWidth) => {
  if (!text) return false
  // 简单的字符长度检测，考虑中文字符占用更多空间
  const chineseCharCount = (text.match(/[\u4E00-\u9FA5]/g) || []).length
  const otherCharCount = text.length - chineseCharCount
  const estimatedWidth = chineseCharCount * 14 + otherCharCount * 8 // 中文字符约14px，英文字符约8px
  return estimatedWidth > maxWidth - 40 // 减去padding和其他空间
}

// 状态过滤器
const statusFilter = (status) => {
  const statusMap = {
    '未处理': 'danger',
    '处理中': 'warning',
    '关闭': 'info'
  }
  return statusMap[status]
}



// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const response = await getQuestionList(listQuery.value)
    const items = response.data?.list || []
    const processedItems = items.map((v) => {
      v.edit = false
      v.originalQuestion = v.question
      v.originalTypeValue = v.typeValue
      v.originalLineValue = v.lineValue
      v.originalOwningSystem = v.owningSystem
      v.originalProject = v.project
      v.originalPlatformValue = v.platformValue
      v.originalProposer = v.proposer
      v.originalProposerType = v.proposerType
      v.originalProposerDepartment = v.proposerDepartment
      v.originalSolver = v.solver
      return v
    })
    originalList.value = processedItems // 保存原始数据
    list.value = processedItems // 显示数据
  } catch (error) {
    console.error('获取列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    listLoading.value = false
  }
}

// 搜索功能
const handleSearch = () => {
  const form = searchForm.value
  let filteredData = originalList.value

  // 根据各个字段进行筛选
  if (form.question) {
    filteredData = filteredData.filter(item => 
      item.question && item.question.toLowerCase().includes(form.question.toLowerCase())
    )
  }
  
  if (form.typeValue) {
    filteredData = filteredData.filter(item => 
      item.typeValue && item.typeValue.toLowerCase().includes(form.typeValue.toLowerCase())
    )
  }
  
  if (form.lineValue) {
    filteredData = filteredData.filter(item => 
      item.lineValue && item.lineValue.toLowerCase().includes(form.lineValue.toLowerCase())
    )
  }
  
  if (form.owningSystem) {
    filteredData = filteredData.filter(item => 
      item.owningSystem && item.owningSystem.toLowerCase().includes(form.owningSystem.toLowerCase())
    )
  }
  
  if (form.proposer) {
    filteredData = filteredData.filter(item => 
      item.proposer && item.proposer.toLowerCase().includes(form.proposer.toLowerCase())
    )
  }
  
  if (form.status) {
    filteredData = filteredData.filter(item => 
      item.status === form.status
    )
  }

  list.value = filteredData
}

// 新建功能
const handleCreate = () => {
  router.push('/table/question-form')
}

// 取消编辑
const cancelEdit = (row) => {
  row.edit = false
  row.originalQuestion = row.question
}

// 确认编辑
const confirmEdit = (row) => {
  row.edit = false
  row.originalQuestion = row.question
  ElMessage.success('编辑成功')
}

// 跳转到详情页面
const goToDetail = (row) => {
  router.push(`/table/question-detail/${row.id}`)
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

// 所有变量和函数已在setup中定义，无需额外导出
</script>

<style lang="scss" scoped>
/* 查询表单样式 */
.filter-container {
  margin-bottom: 20px;
}

.box-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-form {
  padding: 10px 0;
}

.search-form .el-input,
.search-form .el-select {
  width: 100%;
}

.search-form .el-button {
  margin-right: 10px;
}

/* 调整状态下拉框箭头位置 */
.search-form :deep(.el-select .el-input__wrapper) {
  padding-right: 32px; /* 给文字留出空间 */
}
.search-form :deep(.el-select .el-input__suffix) {
  right: 8px;
  height: 100%;
  display: flex;
  align-items: center; /* 垂直居中箭头 */
}
.search-form :deep(.el-select .el-input__suffix .el-select__caret) {
  margin-top: 0; /* 防止 caret 漂浮 */
}

.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.priority-star {
  color: #d93025; /* 提高对比度 */
  margin-right: 2px;
}

/* 表格标题栏背景色 */
:deep(.el-table__header-wrapper .el-table__header) {
  background-color: #f5f7fa;
}
:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa !important;
}

/* 表格水平滚动样式 */
:deep(.el-table__body-wrapper) {
  overflow-x: auto;
}

/* 表格行高设置 */
:deep(.el-table .el-table__row) {
  height: auto;
  min-height: 48px;
}

:deep(.el-table td.el-table__cell) {
  padding: 12px 0;
  height: auto;
  min-height: 48px;
  vertical-align: middle;
}

/* 文本截断样式 */
.text-ellipsis {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.5;
  cursor: pointer;
}

/* Tooltip样式优化 */
:deep(.el-tooltip__trigger) {
  width: 100%;
  display: inline-block;
}

:deep(.el-tooltip__popper) {
  max-width: 300px;
  word-wrap: break-word;
  word-break: break-all;
}

.question-link {
  max-width: 100%;
  font-weight: 500;
  color: #1a73e8; /* 提高对比度 */
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #1557b0;
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid #4285f4;
    outline-offset: 2px;
    border-radius: 2px;
  }
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

/* 表格无障碍访问增强 */
:deep(.el-table) {
  th {
    background-color: #f5f7fa;
    color: #303133;
    font-weight: 600;
  }
  
  tr:hover {
    background-color: #f5f7fa;
  }
  
  .el-table__cell {
    border-color: #dcdfe6;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .question-link {
    color: #000080;
    
    &:hover {
      color: #000040;
    }
  }
  
  .priority-star {
    color: #8b0000;
  }
  
  :deep(.el-button) {
    border-width: 2px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-container {
    .search-form {
      padding: 15px;
      
      .el-row {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
  
  :deep(.el-table) {
    font-size: 14px;
    
    .el-table__cell {
      padding: 8px 5px;
    }
  }
}

@media (max-width: 480px) {
  .filter-container {
    .search-form {
      padding: 10px;
    }
  }
  
  :deep(.el-table) {
    font-size: 12px;
    
    .el-table__cell {
      padding: 6px 3px;
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
