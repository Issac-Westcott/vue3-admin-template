<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :scroll-x="true"
    >
      <el-table-column align="center" label="序号" width="80" fixed="left">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="200px" label="标题" align="center" fixed="left">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.question" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" type="warning" @click="cancelEdit(row)">
              <el-icon><Refresh /></el-icon>
              cancel
            </el-button>
          </template>
          <el-tooltip v-else :content="row.question" placement="top" :disabled="!isTextOverflow(row.question, 200)">
            <span class="text-ellipsis">{{ row.question }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="问题类别" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.typeValue" class="edit-input" size="small" />
          </template>
          <el-tooltip v-else :content="row.typeValue" placement="top" :disabled="!isTextOverflow(row.typeValue, 120)">
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
          <el-tooltip v-else :content="row.lineValue" placement="top" :disabled="!isTextOverflow(row.lineValue, 120)">
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
            :disabled="!isTextOverflow(row.owningSystem, 150)"
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
          <el-tooltip v-else :content="row.project" placement="top" :disabled="!isTextOverflow(row.project, 150)">
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
            :disabled="!isTextOverflow(row.platformValue, 150)"
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
          <el-tooltip v-else :content="row.proposer" placement="top" :disabled="!isTextOverflow(row.proposer, 120)">
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
            :disabled="!isTextOverflow(row.proposerType, 120)"
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
            :disabled="!isTextOverflow(row.proposerDepartment, 150)"
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
          <el-tooltip v-else :content="row.solver" placement="top" :disabled="!isTextOverflow(row.solver, 120)">
            <span class="text-ellipsis">{{ row.solver }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column width="180px" label="提出时间" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.createTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.edit" type="success" size="small" :icon="Check" @click="confirmEdit(row)">Ok</el-button>
          <el-button v-else type="primary" size="small" :icon="Edit" @click="row.edit = !row.edit">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Check, Edit, Refresh } from '@element-plus/icons-vue'
import { parseTime } from '@/utils/date-util'
import { elMessage } from '@/hooks/use-element'

// 响应式数据
const list = ref<any[]>([])
const listLoading = ref(true)
const listQuery = ref({
  page: 1,
  limit: 10
})

// 检测文本是否超出指定宽度
const isTextOverflow = (text: string, maxWidth: number) => {
  if (!text) return false
  // 简单估算：中文字符约14px，英文字符约8px，考虑padding等因素
  const chineseChars = (text.match(/[\u4E00-\u9FA5]/g) || []).length
  const otherChars = text.length - chineseChars
  const estimatedWidth = chineseChars * 14 + otherChars * 8 + 20 // 20px for padding
  return estimatedWidth > maxWidth
}

// 状态过滤器
const statusFilter = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: 'warning',
    processing: 'info',
    resolved: 'success',
    closed: 'danger'
  }
  return statusMap[status]
}

// 模拟数据
const mockData = [
  {
    id: 1,
    question: '系统登录异常问题',
    typeValue: '技术问题',
    levelValue: 3,
    lineValue: '技术条线',
    owningSystem: '用户管理系统',
    project: '用户中心项目',
    platformValue: 'Vue3+Element Plus',
    status: 'pending',
    proposer: '张三',
    proposerType: '内部员工',
    proposerDepartment: '技术部',
    solver: '李四',
    createTime: Date.now() - 86400000
  },
  {
    id: 2,
    question: '数据同步延迟问题',
    typeValue: '性能问题',
    levelValue: 2,
    lineValue: '数据条线',
    owningSystem: '数据同步系统',
    project: '数据中台项目',
    platformValue: 'Spring Boot',
    status: 'processing',
    proposer: '王五',
    proposerType: '外部合作方',
    proposerDepartment: '产品部',
    solver: '赵六',
    createTime: Date.now() - 172800000
  },
  {
    id: 3,
    question: '界面显示错乱',
    typeValue: 'UI问题',
    levelValue: 1,
    lineValue: '前端条线',
    owningSystem: '前端展示系统',
    project: '用户界面项目',
    platformValue: 'React',
    status: 'resolved',
    proposer: '孙七',
    proposerType: '内部员工',
    proposerDepartment: '设计部',
    solver: '周八',
    createTime: Date.now() - 259200000
  }
]

// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const items = mockData
    list.value = items.map((v: any) => {
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
  } catch (error) {
    console.error('获取列表失败:', error)
  } finally {
    listLoading.value = false
  }
}

// 取消编辑
const cancelEdit = (row: any) => {
  row.question = row.originalQuestion
  row.typeValue = row.originalTypeValue
  row.lineValue = row.originalLineValue
  row.owningSystem = row.originalOwningSystem
  row.project = row.originalProject
  row.platformValue = row.originalPlatformValue
  row.proposer = row.originalProposer
  row.proposerType = row.originalProposerType
  row.proposerDepartment = row.originalProposerDepartment
  row.solver = row.originalSolver
  row.edit = false
  elMessage('内容已恢复为原始值', 'warning')
}

// 确认编辑
const confirmEdit = async (row: any) => {
  row.edit = false
  row.originalQuestion = row.question
  row.originalTypeValue = row.typeValue
  row.originalLineValue = row.lineValue
  row.originalOwningSystem = row.owningSystem
  row.originalProject = row.project
  row.originalPlatformValue = row.platformValue
  row.originalProposer = row.proposer
  row.originalProposerType = row.proposerType
  row.originalProposerDepartment = row.proposerDepartment
  row.originalSolver = row.solver
  try {
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 500))
    elMessage('编辑成功', 'success')
  } catch (error) {
    console.error('更新失败:', error)
    elMessage('更新失败', 'error')
  }
}

// 组件挂载时获取数据
onMounted(() => {
  getList()
})

// 导出所有需要在模板中使用的变量和函数
defineExpose({
  list,
  listLoading,
  statusFilter,
  cancelEdit,
  confirmEdit,
  isTextOverflow,
  parseTime,
  Check,
  Edit,
  Refresh
})
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.priority-star {
  color: #f7ba2a;
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
}
</style>
