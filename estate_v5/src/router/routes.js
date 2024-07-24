import frameInRoutes from './frameInRouter'
import frameOutRouter from './frameOutRouter'

/**
 * 错误页面
 */
const errorPage = [
  {
    path: '/403',
    name: '403',
    meta: {
      title: '403',
    },
    component: () => import('@/pages/system/error/403'),
  },
  {
    path: '/500',
    name: '500',
    meta: {
      title: '500',
    },
    component: () => import('@/pages/system/error/500'),
  },
  {
    path: '*',
    name: '404',
    meta: {
      title: '404',
    },
    component: () => import('@/pages/system/error/404'),
  },
]

// 重新组织后导出
export default [...frameInRoutes, ...frameOutRouter, ...errorPage]
