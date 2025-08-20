<template>
  <div class="app-container">
    <!-- 页面头部 -->
    <div class="detail-header">
      <el-button type="primary" :icon="ArrowLeft" @click="goBack">返回列表</el-button>
      <h2 class="detail-title">问题详情</h2>
    </div>

    <!-- 详情内容 -->
    <div v-if="questionDetail" class="detail-content">
      <el- class="detail-card">
        <div class="detail-grid">
          <!-- 左列 -->
          <div class="detail-column">
            <div class="detail-item">
              <span class="detail-label">问题标题：</span>
              <span class="detail-value">{{ questionDetail.question }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">问题类别：</span>
              <span class="detail-value">
                <el-tag type="info">{{ questionDetail.typeValue }}</el-tag>
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">优先级：</span>
              <span class="detail-value">
                <span v-for="n in +questionDetail.levelValue" :key="n" class="priority-star">★</span>
                <span class="priority-text">({{ questionDetail.levelValue }}级)</span>
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">所属条线：</span>
              <span class="detail-value">{{ questionDetail.lineValue }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">所属系统：</span>
              <span class="detail-value">{{ questionDetail.owningSystem }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">所属项目：</span>
              <span class="detail-value">{{ questionDetail.project }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">关联框架/平台：</span>
              <span class="detail-value">
                <el-tag type="success">{{ questionDetail.platformValue }}</el-tag>
              </span>
            </div>
          </div>

          <!-- 右列 -->
          <div class="detail-column">
            <div class="detail-item">
              <span class="detail-label">当前状态：</span>
              <span class="detail-value">
                <el-tag :type="getStatusType(questionDetail.status)">{{ getStatusText(questionDetail.status) }}</el-tag>
              </span>
            </div>

            <div class="detail-item">
              <span class="detail-label">提出人：</span>
              <span class="detail-value">{{ questionDetail.proposer }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">所属公司：</span>
              <span class="detail-value">{{ questionDetail.proposerType }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">所属部门：</span>
              <span class="detail-value">{{ questionDetail.proposerDepartment }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">解决人：</span>
              <span class="detail-value">{{ questionDetail.solver || '待分配' }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">提出时间：</span>
              <span class="detail-value">{{ parseTime(questionDetail.createTime) }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">最后更新：</span>
              <span class="detail-value">{{ parseTime(questionDetail.updateTime || questionDetail.createTime) }}</span>
            </div>
          </div>
        </div>
      </el-
      <!-- 问题描述 -->
      <el- class="detail-card description-card">
        <template #header>
          <div class="card-header">
            <span>问题描述</span>
          </div>
        </template>
        <div class="description-content">
          {{ questionDetail.description || '暂无详细描述' }}
        </div>
      </el-
      <!-- 解决方案 -->
      <el-card class="detail-card solution-card">
        <template #header>
          <div class="card-header">
            <span>解决方案</span>
          </div>
        </template>
        <div class="solution-content">
          {{ questionDetail.solution || '暂无解决方案' }}
        </div>
      </el-card>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" :icon="Edit" @click="editQuestion">编辑问题</el-button>
        <el-button type="success" :icon="Check" @click="resolveQuestion" v-if="questionDetail.status === 'pending'">标记为已解决</el-button>
        <el-button type="warning" :icon="Clock" @click="processQuestion" v-if="questionDetail.status === 'pending'">开始处理</el-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-else class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Edit, Check, Clock } from '@element-plus/icons-vue'
import { parseTime } from '@/utils/date-util'

const route = useRoute()
const router = useRouter()

// 响应式数据
const questionDetail = ref(null)

// 模拟详细数据
const mockDetailData = {
  '1': {
    id: 1,
    question: '系统登录异常问题，用户无法正常登录系统',
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
    createTime: Date.now() - 86400000,
    updateTime: Date.now() - 3600000,
    description: '用户在登录系统时出现异常，具体表现为：1. 输入正确的用户名和密码后，系统提示"登录失败"；2. 有时会出现页面卡死的情况；3. 在Chrome浏览器下问题更为明显。该问题影响了大约30%的用户正常使用系统。',
    solution: '经过排查发现是前端Session管理机制存在问题，建议：1. 优化前端Session存储逻辑；2. 增加登录重试机制；3. 添加详细的错误日志记录。'
  },
  '2': {
    id: 2,
    question: '数据同步延迟问题，影响业务正常运行',
    typeValue: '性能问题',
    levelValue: 2,
    lineValue: '数据条线',
    owningSystem: '数据同步系统',
    project: '数据中台项目',
    platformValue: 'Spring Boot + MySQL',
    status: 'processing',
    proposer: '王五',
    proposerType: '外部合作方',
    proposerDepartment: '产品部',
    solver: '赵六',
    createTime: Date.now() - 172800000,
    updateTime: Date.now() - 7200000,
    description: '数据同步系统在处理大批量数据时出现明显延迟，从原来的实时同步变为延迟5-10分钟。主要影响订单数据和用户行为数据的同步。',
    solution: '正在优化数据库查询语句和增加缓存机制，预计本周内完成修复。'
  },
  '3': {
    id: 3,
    question: '界面显示错乱，部分组件无法正常显示',
    typeValue: 'UI问题',
    levelValue: 1,
    lineValue: '前端条线',
    owningSystem: '前端展示系统',
    project: '用户界面项目',
    platformValue: 'React + Ant Design',
    status: 'resolved',
    proposer: '孙七',
    proposerType: '内部员工',
    proposerDepartment: '设计部',
    solver: '周八',
    createTime: Date.now() - 259200000,
    updateTime: Date.now() - 86400000,
    description: '在移动端设备上，部分页面元素显示错乱，主要表现为按钮重叠、文字溢出等问题。',
    solution: '已修复CSS响应式布局问题，更新了移动端适配规则。问题已解决。'
  },
  '4': {
    id: 4,
    question: 'API接口响应超时，影响前端页面加载',
    typeValue: '性能问题',
    levelValue: 3,
    lineValue: '后端条线',
    owningSystem: 'API网关系统',
    project: '微服务架构项目',
    platformValue: 'Spring Cloud Gateway',
    status: 'pending',
    proposer: '钱九',
    proposerType: '内部员工',
    proposerDepartment: '后端开发部',
    solver: '吴十',
    createTime: Date.now() - 345600000,
    updateTime: Date.now() - 345600000,
    description: 'API网关在高并发情况下出现响应超时，导致前端页面加载缓慢或失败。主要影响用户登录、数据查询等核心功能。',
    solution: '暂无解决方案，正在分析问题原因。'
  },
  '5': {
    id: 5,
    question: '数据库连接池配置不当，导致连接泄露',
    typeValue: '配置问题',
    levelValue: 2,
    lineValue: '运维条线',
    owningSystem: '数据库管理系统',
    project: '基础设施项目',
    platformValue: 'MySQL + Druid',
    status: 'processing',
    proposer: '郑十一',
    proposerType: '内部员工',
    proposerDepartment: '运维部',
    solver: '王十二',
    createTime: Date.now() - 432000000,
    updateTime: Date.now() - 86400000,
    description: '数据库连接池配置参数不合理，在高负载情况下出现连接泄露，导致系统性能下降。',
    solution: '正在调整连接池配置参数，增加连接监控和自动回收机制。'
  },
  '6': {
    id: 6,
    question: '移动端适配问题，在小屏幕设备上显示异常',
    typeValue: 'UI问题',
    levelValue: 2,
    lineValue: '移动端条线',
    owningSystem: '移动端应用',
    project: 'H5应用项目',
    platformValue: 'Vue3 + Vant',
    status: 'pending',
    proposer: '李十三',
    proposerType: '外部合作方',
    proposerDepartment: '移动开发部',
    solver: '张十四',
    createTime: Date.now() - 518400000,
    updateTime: Date.now() - 518400000,
    description: '在小屏幕移动设备上，页面布局出现错乱，部分按钮和文字无法正常显示。',
    solution: '暂无解决方案，需要重新设计移动端适配方案。'
  }
}

// 获取问题详情
const getQuestionDetail = async () => {
  const id = route.params.id
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 800))
    questionDetail.value = mockDetailData[id] || null
    if (!questionDetail.value) {
      ElMessage.error('问题不存在')
      router.push('/table/question-table')
    }
  } catch {
    ElMessage.error('获取问题详情失败')
  }
}

// 返回列表
const goBack = () => {
  router.push('/table/question-table')
}

// 编辑问题
const editQuestion = () => {
  ElMessage.info('编辑功能开发中...')
}

// 解决问题
const resolveQuestion = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    if (questionDetail.value) {
      questionDetail.value.status = 'resolved'
      questionDetail.value.updateTime = Date.now()
    }
    ElMessage.success('问题已标记为已解决')
  } catch {
    ElMessage.error('操作失败')
  }
}

// 开始处理问题
const processQuestion = async () => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    if (questionDetail.value) {
      questionDetail.value.status = 'processing'
      questionDetail.value.updateTime = Date.now()
    }
    ElMessage.success('问题已开始处理')
  } catch {
    ElMessage.error('操作失败')
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    processing: 'warning',
    resolved: 'info',
    closed: 'info',
    '待处理': 'danger',
    '处理中': 'warning',
    '已解决': 'success',
    '已关闭': 'info',
    '未处理': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

// 组件挂载时获取数据
onMounted(() => {
  getQuestionDetail()
})
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.detail-title {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  max-width: 1200px;
  margin: 0 auto 20px auto;
}

.detail-card {
  margin-bottom: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.detail-column {
  display: flex;
  flex-direction: column;
}

.detail-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px; /* 调整行间距 */
}

.detail-label {
  font-weight: bold;
  color: #1f4e79;
  font-size: 14px;
  white-space: nowrap;
  width: 120px;
  min-width: 120px;
  display: inline-block;
}

.detail-value {
  color: #303133;
  font-size: 14px;
  line-height: 1.5;
  min-height: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.priority-star {
  color: #f7ba2a;
  font-size: 16px;
}

.priority-text {
  color: #909399;
  font-size: 12px;
}

.description-card,
.solution-card {
  margin-top: 20px;
}

.card-header {
  font-weight: 600;
  color: #303133;
}

.description-content,
.solution-content {
  color: #606266;
  line-height: 1.6;
  font-size: 14px;
  min-height: 60px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.solution-content {
  border-left-color: #67c23a;
}

.action-buttons {
  margin-top: 30px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.loading-container {
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>