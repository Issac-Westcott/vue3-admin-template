<template>
  <div class="app-container">
    <el-button
      :loading="downloadLoading"
      style="margin-bottom:20px"
      type="primary"
      :icon="Document"
      @click="handleDownload"
    >
      Export
    </el-button>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template #default="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Main Information" align="center">
        <el-table-column label="Title" align="center">
          <template #default="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Author" width="150" align="center">
          <template #default="scope">
            <el-tag>{{ scope.row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Readings" width="115" align="center">
          <template #default="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template #default="scope">
          <div style="display: flex; align-items: center; justify-content: center;">
            <el-icon style="margin-right: 5px;"><Clock /></el-icon>
            <span>{{ formatTime(scope.row.timestamp) }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Clock, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { exportJsonToExcel } from '@/utils/Export2Excel'

// 响应式数据
const list = ref(null)
const listLoading = ref(true)
const downloadLoading = ref(false)

// 格式化时间函数
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 模拟数据获取
const fetchData = async () => {
  listLoading.value = true
  try {
    // 模拟 API 调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    list.value = [
      {
        id: 1,
        title: 'Sample Article 1',
        author: 'John Doe',
        pageviews: 1234,
        timestamp: Date.now() - 86400000,
        display_time: formatTime(Date.now() - 86400000)
      },
      {
        id: 2,
        title: 'Sample Article 2',
        author: 'Jane Smith',
        pageviews: 5678,
        timestamp: Date.now() - 172800000,
        display_time: formatTime(Date.now() - 172800000)
      },
      {
        id: 3,
        title: 'Sample Article 3',
        author: 'Bob Johnson',
        pageviews: 9012,
        timestamp: Date.now() - 259200000,
        display_time: formatTime(Date.now() - 259200000)
      }
    ]
  } catch {
    ElMessage.error('Failed to fetch data')
  } finally {
    listLoading.value = false
  }
}

// 处理下载
const handleDownload = () => {
  if (!list.value || list.value.length === 0) {
    ElMessage.warning('No data to export')
    return
  }

  downloadLoading.value = true
  try {
    const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
    const header = ['', 'Title', 'Author', 'Readings', '']
    const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
    const data = formatJson(filterVal, list.value)
    const merges = ['A1:A2', 'B1:D1', 'E1:E2']

    exportJsonToExcel({
      multiHeader,
      header,
      merges,
      data,
      filename: 'merge-header-excel'
    })
  } catch {
    ElMessage.error('Export failed')
  } finally {
    downloadLoading.value = false
  }
}

// 格式化 JSON 数据
const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => {
    if (j === 'timestamp') {
      return formatTime(v[j])
    }
    return v[j]
  }))
}

// 组件挂载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>