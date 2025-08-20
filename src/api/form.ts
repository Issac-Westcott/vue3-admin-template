import request from '@/utils/axios-req'

// 表单提交接口
export interface FormSubmitData {
  formType: string
  formData: Record<string, any>
  timestamp: number
  clientInfo?: {
    userAgent: string
    ip?: string
  }
}

// 表单提交响应
export interface FormSubmitResponse {
  success: boolean
  message: string
  data?: {
    id: string
    submittedAt: string
  }
  errors?: Record<string, string[]>
}

// 提交表单数据
export const submitFormData = async (data: FormSubmitData): Promise<FormSubmitResponse> => {
  const response = await request({
    url: '/api/form/submit',
    method: 'POST',
    data: {
      ...data,
      clientInfo: {
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      }
    },
    timeout: 30000, // 30秒超时
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  return response.data
}

// 保存表单草稿
export const saveFormDraft = async (data: Partial<FormSubmitData>): Promise<{ success: boolean }> => {
  const response = await request({
    url: '/api/form/draft',
    method: 'POST',
    data,
    timeout: 10000
  })
  return response.data
}

// 验证表单数据
export const validateFormData = async (formType: string, data: Record<string, any>): Promise<{ valid: boolean; errors?: Record<string, string[]> }> => {
  const response = await request({
    url: '/api/form/validate',
    method: 'POST',
    data: {
      formType,
      formData: data
    },
    timeout: 10000
  })
  return response.data
}

// 获取表单配置
export const getFormConfig = async (formId: string): Promise<{ rule: any[]; options?: any }> => {
  const response = await request({
    url: `/api/form/config/${formId}`,
    method: 'GET',
    timeout: 10000
  })
  return response.data
}