const meta = {
  auth: true,
  closable: true,
  cache: true,
}

const pre = 'energyMonitor-'

export default {
  path: '/energyMonitor',
  name: 'energyMonitor',
  redirect: {
    name: `${pre}power`,
  },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'power',
      name: `${pre}power`,
      meta: {
        ...meta,
        title: '$t:electricQuantity',
        cache: true,
      },
      component: () => import('@/pages/energyMonitor/power'),
    },
    {
      path: 'load',
      name: `${pre}load`,
      meta: {
        ...meta,
        title: '$t:load',
      },
      component: () => import('@/pages/energyMonitor/load'),
    },
    {
      path: 'report',
      name: `${pre}report`,
      meta: {
        ...meta,
        title: '$t:electricityStatistics',
        cache: true,
      },
      component: () => import('@/pages/energyMonitor/report/index.vue'),
    },
    {
      path: 'targetConfig',
      name: `${pre}targetConfig`,
      meta: {
        ...meta,
        title: '$t:configurationOfEnergyStatisticsObjects',
      },
      component: () => import('@/pages/energyMonitor/targetConfig/index.vue'),
    },
    {
      path: 'carbon',
      name: `${pre}carbon`,
      meta: {
        ...meta,
        title: '$t:carbonEmissionAnalysis',
      },
      component: () => import('@/pages/energyMonitor/carbon/index.vue'),
    },
    {
      path: 'prediction',
      name: `${pre}prediction`,
      meta: {
        ...meta,
        title: '$t:batteryDiviner',
      },
      component: () => import('@/pages/energyMonitor/prediction/index.vue'),
    },
  ],
}
