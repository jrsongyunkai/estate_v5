import instantSettlement from './frameOutModules/instantSettlement'
/**
 * 在主框架之外显示
 */
export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: '$t:loginSystem',
    },
    component: () => import('@/pages/account/login'),
  },
  {
    path: '/loading',
    name: 'loading',
    meta: {
      title: '$t:load1',
    },
    component: () => import('@/pages/account/login/loading.vue'),
  },
  // 系统大屏
  {
    path: '/visualScreen',
    name: 'visualScreen',
    meta: {
      // cache: true,
      title: '$t:dashboard',
    },
    component: () => import('@/pages/visualScreen'),
  },
  {
    path: '/MaintenanceRecords',
    name: 'MaintenanceRecords',
    meta: {
      title: '$t:maintenanceRecords',
      closable: true,
    },
    component: () => import('@/pages/Control/MaintenanceRecords.vue'),
  },
  {
    path: '/Report',
    name: 'Report',
    meta: {
      title: '$t:electricityReport',
      closable: true,
    },
    component: () => import('@/pages/Report/index.vue'),
  },
  {
    path: '/deviceList',
    name: 'deviceList',
    meta: {
      title: '$t:deviceList',
      closable: true,
    },
    component: () => import('@/pages/Control/deviceList.vue'),
  },
  {
    path: '/ChannelList',
    name: 'ChannelList',
    meta: {
      title: '$t:channelList',
      closable: true,
    },
    component: () => import('@/pages/Control/ChannelList.vue'),
  },
  {
    path: '/Overviews',
    name: 'Overviews',
    meta: {
      title: '$t:deviceOverview',
      closable: true,
    },
    component: () => import('@/pages/visualScreen/Overview.vue'),
  },
  // {
  //   path: '/ProjectOverview',
  //   name: 'ProjectOverview',
  //   meta: {
  //     title: '$t:page.visualScreen.ProjectOverview.title',
  //     closable: true,
  //   },
  //   component: () => import('@/pages/visualScreen/projectOverview/index.vue'),
  // },
  {
    path: '/Alarm',
    name: 'Alarm',
    meta: {
      title: '$t:alarmWarningList',
      closable: true,
    },
    component: () => import('@/pages/Control/Alarm.vue'),
  },
  {
    path: '/HistoryList',
    name: 'HistoryList',
    meta: {
      title: '$t:firmwareOperationHistory',
      closable: true,
    },
    component: () => import('@/pages/Control/HistoryList.vue'),
  },
  {
    path: '/AirDisinfectioOperationLog',
    name: 'AirDisinfectioOperationLog',
    meta: {
      title: '$t:airDisinfector',
      closable: true,
    },
    component: () => import('@/pages/Control/AirDisinfectioOperationLog.vue'),
  },
  {
    path: '/nurse',
    name: 'nurse',
    meta: {
      title: '',
      closable: true,
    },
    component: () => import('@/pages/multiManage/nurseList/nurseqrCode.vue'),
  },
  {
    path: '/charging',
    name: 'charging',
    meta: {
      title: '$t:billingSystem',
      closable: true,
    },
    component: () => import('@/pages/billingSystem/electric/charging/index.vue'),
  },
  {
    path: '/billPayment',
    name: 'billPayment',
    meta: {
      title: '$t:billPayment',
      closable: true,
    },
    component: () => import('@/pages/billingSystem/electric/charging/billPayment.vue'),
  },
  {
    path: '/AlarmHistory',
    name: 'AlarmHistory',
    meta: {
      title: '$t:alarmWarningListHistoryData',
      closable: true,
    },
    component: () => import('@/pages/Control/AlarmHistory.vue'),
  },
  {
    path: '/TuoqParameter',
    name: 'TuoqParameter',
    meta: {
      title: '$t:parameterReporting',
      closable: true,
    },
    component: () => import('@/pages/console/device/tuoqParameter.vue'),
  },
  {
    path: '/sketch',
    name: 'sketch',
    meta: {
      title: '$t:systemDiagram',
      closable: true,
    },
    component: () => import('@/pages/multiManage/diagram/sketch.vue'),
  },
  {
    path: '/sketch/preview',
    name: 'sketchPreview',
    meta: {
      title: '$t:systemDiagramPreview',
      closable: true,
    },
    component: () => import('@/pages/multiManage/diagram/preview.vue'),
  },
  {
    path: '/power-trend',
    name: 'powerTrend',
    meta: {
      title: '$t:powerDetails',
      closable: true,
    },
    component: () => import('@/pages/power-trend'),
  },
  // 即时结算,后管使用iframe
  ...instantSettlement,
]
