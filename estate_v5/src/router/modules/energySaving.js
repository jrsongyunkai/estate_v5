const meta = {
  auth: true,
  closable: true,
  cache: true,
}

const pre = 'energySaving-'

export default {
  path: '/energySaving',
  name: 'energySaving',
  redirect: {
    name: `${pre}standby`,
  },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'standby',
      name: `${pre}standby`,
      meta: {
        ...meta,
        title: '$t:conditionMonitoringEnergyConsumption',
      },
      component: () => import('@/pages/energySaving/standby'),
    },
    {
      path: 'modeConfig',
      name: `${pre}modeConfig`,
      meta: {
        ...meta,
        title: '$t:modeConfiguration',
      },
      component: () => import('@/pages/energySaving/modeConfig'),
    },
  ],
}
