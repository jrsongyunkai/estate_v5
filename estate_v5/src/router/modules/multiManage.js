const meta = {
  auth: true,
  closable: true,
  cache: true,
}

const pre = 'multiManage-'

export default {
  path: '/multiManage',
  name: 'multiManage',
  redirect: {
    name: `${pre}sceneControl`,
  },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'threShold',
      name: `${pre}threShold`,
      meta: {
        ...meta,
        title: '$t:smartThresholdConfig',
      },
      component: () => import('@/pages/multiManage/threShold'),
    },
    {
      path: 'stealingElectricity',
      name: `${pre}stealingElectricity`,
      meta: {
        ...meta,
        title: '$t:electricityTheftMonitoringConfiguration',
      },
      component: () => import('@/pages/multiManage/stealingElectricity'),
    },
    {
      path: 'sceneControl',
      name: `${pre}sceneControl`,
      meta: {
        ...meta,
        title: '$t:sceneControl',
      },
      component: () => import('@/pages/multiManage/sceneControl'),
    },
    {
      path: 'builtInTimer',
      name: `${pre}builtInTimer`,
      meta: {
        ...meta,
        title: '$t:builtInTimingConfiguration',
      },
      component: () => import('@/pages/multiManage/builtInTimer'),
    },
    {
      path: 'latlongTimer',
      name: `${pre}latlongTimer`,
      meta: {
        ...meta,
        title: '$t:lnglatTimerConfig',
      },
      component: () => import('@/pages/multiManage/latlongTimer'),
    },
    {
      path: 'batchConfig',
      name: `${pre}batchConfig`,
      meta: {
        ...meta,
        title: '$t:batchConfig',
      },
      component: () => import('@/pages/multiManage/batchConfig'),
    },
    {
      path: 'contrlTasks',
      name: `${pre}contrlTasks`,
      meta: {
        ...meta,
        title: '$t:contrlTaskList',
      },
      component: () => import('@/pages/multiManage/contrlTasks'),
    },
    {
      path: 'groupConfig',
      name: `${pre}groupConfig`,
      meta: {
        ...meta,
        title: '$t:groupManage',
      },
      component: () => import('@/pages/multiManage/groupConfig'),
    },
    {
      path: 'assetManagement',
      name: `${pre}assetManagement`,
      meta: {
        ...meta,
        title: '资产管理',
      },
      component: () => import('@/pages/multiManage/assetManagement'),
    },
    {
      path: 'loadManagement',
      name: `${pre}loadManagement`,
      meta: {
        ...meta,
        title: '$t:loadManage',
      },
      component: () => import('@/pages/multiManage/loadManagement'),
    },
    {
      path: 'deviceListControl',
      name: `${pre}deviceListControl`,
      meta: {
        ...meta,
        title: '$t:deviceListControl',
      },
      component: () => import('@/pages/multiManage/deviceListControl'),
    },
    {
      path: 'dayExecuteList',
      name: `${pre}dayExecuteList`,
      meta: {
        ...meta,
        title: '$t:dailyExecutionList',
      },
      component: () => import('@/pages/multiManage/dayExecuteList'),
    },
    {
      path: 'abnormalStateConfig',
      name: `${pre}abnormalStateConfig`,
      meta: {
        ...meta,
        title: '$t:abnormalStateConfig',
      },
      component: () => import('@/pages/multiManage/abnormalStateConfig'),
    },

    {
      path: 'runningTense',
      name: `${pre}runningTense`,
      meta: {
        ...meta,
        title: '$t:runtimeTense',
      },
      component: () => import('@/pages/multiManage/runningTense'),
    },
    {
      path: 'linkageScene',
      name: `${pre}linkageScene`,
      meta: {
        ...meta,
        title: '$t:linkageConfig',
      },
      component: () => import('@/pages/multiManage/linkageScene/index.vue'),
    },
    {
      path: 'workOrder',
      name: `${pre}workOrder`,
      meta: {
        ...meta,
        title: '$t:workOrderManagement',
      },
      component: () => import('@/pages/multiManage/workOrder'),
    },
    {
      path: 'trafficRenewal',
      name: `${pre}trafficRenewal`,
      meta: {
        ...meta,
        title: '$t:SIMCardManagement',
      },
      component: () => import('@/pages/multiManage/trafficRenewal'),
    },
    {
      path: 'nurseList',
      name: `${pre}nurseList`,
      meta: {
        ...meta,
        title: '$t:electricityCare',
      },
      component: () => import('@/pages/multiManage/nurseList'),
    },
    {
      path: 'report',
      name: `${pre}report`,
      meta: {
        ...meta,
        title: '$t:statisticalReport',
        cache: true,
      },
      component: () => import('@/pages/multiManage/report'),
    },
    {
      path: 'diagram',
      name: `${pre}diagram`,
      meta: {
        ...meta,
        title: '$t:runtimeSystemDiagram',
      },
      component: () => import('@/pages/multiManage/diagram'),
    },
    {
      path: 'diagram/detail/:id',
      name: `${pre}diagramDetail`,
      meta: {
        ...meta,
        title: '$t:runtimeSystemDiagram',
      },
      component: () => import('@/pages/multiManage/diagram/detail'),
    },
  ],
}
