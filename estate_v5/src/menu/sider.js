// 菜单，侧边栏
import visualScreen from './modules/visualScreen'
import console from './modules/console'
import safetyMonitor from './modules/safetyMonitor'
import energyMonitor from './modules/energyMonitor'
import multiManage from './modules/multiManage'
import billingSystem from './modules/billingSystem'
// 系统
import log from './modules/log'

export default [
  visualScreen,
  console,
  safetyMonitor,
  energyMonitor,
  billingSystem,
  multiManage,
  log,
  {
    header: 'quicklyMenu',
    path: '/quicklyMenu',
    title: '$t:customizeQuickLinks',
  },
]
