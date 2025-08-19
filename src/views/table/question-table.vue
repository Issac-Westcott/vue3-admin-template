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
          <el-tooltip v-else :content="row.question" placement="top" :disabled="!isTextOverflow(row.question, 180)">
            <el-link
              type="primary"
              class="question-link text-ellipsis"
              @click="goToDetail(row)"
              :underline="false"
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

      <el-table-column align="center" label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.edit" type="success" size="small" :icon="Check" @click="confirmEdit(row)">Ok</el-button>
          <el-button v-else type="primary" size="small" :icon="Edit" @click="row.edit = !row.edit">Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Edit, Check, Close, Search } from '@element-plus/icons-vue'
import { parseTime } from '@/utils/date-util'
import { getQuestionList } from '@/api/article'

const router = useRouter()

const list = ref([])
const listLoading = ref(true)
const listQuery = ref({
  page: 1,
  limit: 20
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
    list.value = items.map((v) => {
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
    ElMessage.error('获取数据失败')
  } finally {
    listLoading.value = false
  }
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
}

.question-link:hover {
  color: #409eff;
  text-decoration: underline;
}
</style>
