const meta = {
  auth: true,
  closable: true,
  cache: true,
}

const pre = 'smartEnergy-'

export default {
  path: '/smartEnergy',
  name: 'smartEnergy',
  redirect: {
    name: `${pre}statistics`,
  },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'statistics',
      name: `${pre}statistics`,
      meta: {
        ...meta,
        title: '$t:energyConsumptionStatistics',
      },
      component: () => import('@/pages/smartEnergy/statistics'),
    },
    {
      path: 'diagram',
      name: `${pre}diagram`,
      meta: {
        ...meta,
        title: '$t:energyFlowDiagram',
      },
      component: () => import('@/pages/smartEnergy/diagram'),
    },
  ],
}
