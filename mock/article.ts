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
    response: ({ query }) => {
      const { importance, type, title, page = 1, limit = 20, sort } = query

      let mockList = List.filter((item) => {
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
    url: '/mock/question/list',
    method: 'get',
    response: ({ query }) => {
      const { page = 1, limit = 20 } = query

      const questionList = [
        {
          id: 1,
          question: '系统登录异常问题，用户无法正常登录系统',
          typeValue: '技术问题',
          levelValue: 3,
          lineValue: '技术条线',
          owningSystem: '用户管理系统',
          project: '用户中心项目',
          platformValue: 'Vue3+Element Plus',
          status: '未处理',
          proposer: '张三',
          proposerType: '内部员工',
          proposerDepartment: '技术部',
          solver: '李四',
          createTime: Date.now() - 86400000
        },
        {
          id: 2,
          question: '数据同步延迟问题，影响业务正常运行',
          typeValue: '性能问题',
          levelValue: 2,
          lineValue: '数据条线',
          owningSystem: '数据同步系统',
          project: '数据中台项目',
          platformValue: 'Spring Boot + MySQL',
          status: '处理中',
          proposer: '王五',
          proposerType: '外部合作方',
          proposerDepartment: '产品部',
          solver: '赵六',
          createTime: Date.now() - 172800000
        },
        {
          id: 3,
          question: '界面显示错乱，部分组件无法正常显示',
          typeValue: 'UI问题',
          levelValue: 1,
          lineValue: '前端条线',
          owningSystem: '前端展示系统',
          project: '用户界面项目',
          platformValue: 'React + Ant Design',
          status: '关闭',
          proposer: '孙七',
          proposerType: '内部员工',
          proposerDepartment: '设计部',
          solver: '周八',
          createTime: Date.now() - 259200000
        },
        {
          id: 4,
          question: 'API接口响应超时，影响前端页面加载',
          typeValue: '性能问题',
          levelValue: 3,
          lineValue: '后端条线',
          owningSystem: 'API网关系统',
          project: '微服务架构项目',
          platformValue: 'Spring Cloud Gateway',
          status: '未处理',
          proposer: '钱九',
          proposerType: '内部员工',
          proposerDepartment: '后端开发部',
          solver: '吴十',
          createTime: Date.now() - 345600000
        },
        {
          id: 5,
          question: '数据库连接池配置不当，导致连接泄露',
          typeValue: '配置问题',
          levelValue: 2,
          lineValue: '运维条线',
          owningSystem: '数据库管理系统',
          project: '基础设施项目',
          platformValue: 'MySQL + Druid',
          status: '处理中',
          proposer: '郑十一',
          proposerType: '内部员工',
          proposerDepartment: '运维部',
          solver: '王十二',
          createTime: Date.now() - 432000000
        },
        {
          id: 6,
          question: '移动端适配问题，在小屏幕设备上显示异常',
          typeValue: 'UI问题',
          levelValue: 2,
          lineValue: '移动端条线',
          owningSystem: '移动端应用',
          project: 'H5应用项目',
          platformValue: 'Vue3 + Vant',
          status: '未处理',
          proposer: '李十三',
          proposerType: '外部合作方',
          proposerDepartment: '移动开发部',
          solver: '张十四',
          createTime: Date.now() - 518400000
        }
      ]

      const pageList = questionList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          list: pageList,
          total: questionList.length
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