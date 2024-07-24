/**
 * 在主框架内显示
 */

import Console from './modules/console'
import SafetyMonitor from './modules/safetyMonitor'
import EnergyMonitor from './modules/energyMonitor'
import MultiManage from './modules/multiManage'
import SetTing from './modules/setting'
import News from './modules/news'
import Logs from './modules/logs'
import settingConfig from './modules/setingConfig'
import quicklyMenu from './modules/quicklyMenu'
import smartEnergy from './modules/smartEnergy'
import energySaving from './modules/energySaving'
import billingSystem from './modules/billingSystem'

export default [
  {
    path: '/',
    redirect: { name: 'login' },
    component: () => import('@/layouts/basic-layout'),
    children: [
      {
        path: 'index',
        name: 'index',
        redirect: { name: 'console-project' },
      },
      {
        path: 'log',
        name: 'log',
        meta: { title: '$t:log', auth: true },
        component: () => import('@/pages/system/log'),
      },
      // 刷新页面 必须保留
      {
        path: 'refresh',
        name: 'refresh',
        hidden: true,
        component: {
          beforeRouteEnter(to, from, next) {
            next(instance => instance.$router.replace(from.fullPath))
          },
          render: h => h(),
        },
      },
      // 页面重定向 必须保留
      {
        path: 'redirect/:route*',
        name: 'redirect',
        hidden: true,
        component: {
          beforeRouteEnter(to, from, next) {
            next(instance => instance.$router.replace(JSON.parse(from.params.route)))
          },
          render: h => h(),
        },
      },
    ],
  },
  Console,
  SafetyMonitor,
  EnergyMonitor,
  MultiManage,
  SetTing,
  News,
  settingConfig,
  Logs,
  quicklyMenu,
  smartEnergy,
  energySaving,
  billingSystem,
]
