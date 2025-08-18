<template>
  <div class="app-container">
    <upload-excel-component
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
    />

    <el-table
      v-if="tableData.length > 0"
      :data="tableData"
      border
      highlight-current-row
      style="width: 100%;margin-top:20px;"
    >
      <el-table-column
        v-for="item in tableHeader"
        :key="item"
        :prop="item"
        :label="item"
      />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import UploadExcelComponent from './components/UploadExcelComponent.vue'

// 响应式数据
const tableData = ref([])
const tableHeader = ref([])

// 上传前验证
const beforeUpload = (file) => {
  const isLt1M = file.size / 1024 / 1024 < 1

  if (isLt1M) {
    return true
  }

  ElMessage({
    message: 'Please do not upload files larger than 1m in size.',
    type: 'warning'
  })
  return false
}

// 上传成功处理
const handleSuccess = ({ results, header }) => {
  tableData.value = results
  tableHeader.value = header
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>