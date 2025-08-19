import type { MockMethod } from 'vite-plugin-mock'

const List: any[] = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push({
    id: '@increment',
    timestamp: Date.now() + i * 1000 * 60 * 60 * 24,
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    content_short: 'mock data',
    content: '@paragraph',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    type: '@pick(["CN", "US", "JP", "EU"])',
    status: '@pick(["published", "draft", "deleted"])',
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    platforms: ['a-platform']
  })
}

export default [
  {
    url: '/mock/article/list',
    method: 'get',
    response: (config: any) => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && !item.title.includes(title)) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/mock/article/detail',
    method: 'get',
    response: (config: any) => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },
  {
    url: '/mock/article/pv',
    method: 'get',
    response: () => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },
  {
    url: '/mock/article/create',
    method: 'post',
    response: () => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/mock/article/update',
    method: 'post',
    response: () => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
] as MockMethod[]