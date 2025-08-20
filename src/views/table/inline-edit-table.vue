<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="ID" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="Date">
        <template #default="{ row }">
          <span>{{ parseTime(row.timestamp) }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="Author">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.author" class="edit-input" size="small" />
          </template>
          <span v-else>{{ row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="120px" label="Importance" align="center">
        <template #default="{ row }">
          <span v-for="n in +row.importance" :key="n" class="importance-star">★</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template #default="{ row }">
          <el-tag :type="statusFilter(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="Title" align="center">
        <template #default="{ row }">
          <template v-if="row.edit">
            <el-input v-model="row.title" class="edit-input" size="small" />
            <el-button class="cancel-btn" size="small" type="warning" @click="cancelEdit(row)">
              <el-icon><Refresh /></el-icon>
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Actions" width="120">
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
import { fetchList, updateArticle } from '@/api/article'
import { parseTime } from '@/utils/date-util'
import { elMessage } from '@/hooks/use-element'

// 响应式数据
const list = ref<any[]>([])
const listLoading = ref(true)
const listQuery = ref({
  page: 1,
  limit: 10
})

// 状态过滤器
const statusFilter = (status: string) => {
  const statusMap: Record<string, string> = {
    published: 'success',
    draft: 'info',
    deleted: 'danger'
  }
  return statusMap[status]
}

// 获取列表数据
const getList = async () => {
  listLoading.value = true
  try {
    const { data } = await fetchList(listQuery.value)
    const items = data.items
    list.value = items.map((v: any) => {
      v.edit = false // https://vuejs.org/v2/guide/reactivity.html
      v.originalTitle = v.title //  will be used when user click the cancel botton
      v.originalAuthor = v.author
      v.originalPageviews = v.pageviews
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
  row.title = row.originalTitle
  row.author = row.originalAuthor
  row.pageviews = row.originalPageviews
  row.edit = false
  elMessage('标题已恢复为原始值', 'warning')
}

// 确认编辑
const confirmEdit = async (row: any) => {
  row.edit = false
  row.originalTitle = row.title
  row.originalAuthor = row.author
  row.originalPageviews = row.pageviews
  try {
    await updateArticle({
      id: row.id,
      title: row.title,
      author: row.author,
      pageviews: row.pageviews
    })
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
.importance-star {
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
</style>
