import axiosReq from '@/utils/axios-req'

// 获取文章列表
export const fetchList = (params: any) => {
  return axiosReq({
    url: '/mock/article/list',
    method: 'get',
    params
  })
}

// 创建文章
export const createArticle = (data: any) => {
  return axiosReq({
    url: '/mock/article/create',
    method: 'post',
    data
  })
}

// 更新文章
export const updateArticle = (data: any) => {
  return axiosReq({
    url: '/mock/article/update',
    method: 'post',
    data
  })
}

// 获取问题列表
export const getQuestionList = (params: any) => {
  return axiosReq({
    url: '/mock/question/list',
    method: 'get',
    params
  })
}