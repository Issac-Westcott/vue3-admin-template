<template>
  <div>
    <input ref="excelUploadInput" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick" />
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <el-icon class="el-icon-upload">
        <UploadFilled />
      </el-icon>
      Drop excel file here or
      <el-button :loading="loading" style="margin-left: 16px" size="default" type="primary" @click="handleUpload">
        Browse
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as XLSX from 'xlsx'

// Props
const props = defineProps({
  beforeUpload: {
    type: Function,
    default: () => true
  },
  onSuccess: {
    type: Function,
    default: () => {}
  }
})

// 响应式数据
const loading = ref(false)
const excelUploadInput = ref(null)

// 生成数据
const generateData = ({ header, results }) => {
  const excelData = []
  results.forEach((row, index) => {
    if (row.length === 0) return
    const data = {}
    row.forEach((cell, cellIndex) => {
      data[header[cellIndex]] = cell
    })
    excelData.push(data)
  })
  return excelData
}

// 处理上传
const handleUpload = () => {
  excelUploadInput.value.click()
}

// 处理点击
const handleClick = (e) => {
  const files = e.target.files
  const rawFile = files[0] // only use files[0]
  if (!rawFile) return
  upload(rawFile)
}

// 处理拖拽
const handleDrop = (e) => {
  e.stopPropagation()
  e.preventDefault()
  if (loading.value) return
  const files = e.dataTransfer.files
  if (files.length !== 1) {
    ElMessage.error('Only support uploading one file!')
    return
  }
  const rawFile = files[0] // only use files[0]

  if (!isExcel(rawFile)) {
    ElMessage.error('Only supports upload .xlsx, .xls, .csv suffix files')
    return false
  }
  upload(rawFile)
  e.stopPropagation()
  e.preventDefault()
}

// 处理拖拽悬停
const handleDragover = (e) => {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

// 上传文件
const upload = (rawFile) => {
  excelUploadInput.value.value = null // fix can't select the same excel

  if (!props.beforeUpload) {
    readerData(rawFile)
    return
  }
  const before = props.beforeUpload(rawFile)
  if (before) {
    readerData(rawFile)
  }
}

// 读取数据
const readerData = (rawFile) => {
  loading.value = true
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const header = getHeaderRow(worksheet)
      const results = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      const generatedData = generateData({ header, results })
      props.onSuccess && props.onSuccess({ results: generatedData, header })
      loading.value = false
      resolve()
    }
    reader.readAsArrayBuffer(rawFile)
  })
}

// 获取表头
const getHeaderRow = (sheet) => {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = `UNKNOWN ${C}` // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

// 检查是否为 Excel 文件
const isExcel = (file) => {
  return /\.(xlsx|xls|csv)$/.test(file.name)
}
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  line-height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  text-align: center;
  color: #bbb;
  position: relative;
}

.drop:hover {
  border-color: #409eff;
  color: #409eff;
}
</style>
