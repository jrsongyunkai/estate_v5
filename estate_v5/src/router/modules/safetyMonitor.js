const meta = {
  auth: true,
  closable: true,
  cache: true,
}

const pre = 'safetyMonitor-'

export default {
  path: '/safetyMonitor',
  name: 'safetyMonitor',
  redirect: {
    name: `${pre}allWarn`,
  },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'monitoringReport',
      name: `${pre}monitoringReport`,
      meta: {
        ...meta,
        title: '$t:monitoringReport',
      },
      component: () => import('@/pages/safetyMonitor/monitoringReport'),
    },
    {
      path: 'stealingElectricity',
      name: `${pre}stealingElectricity`,
      meta: {
        ...meta,
        title: '$t:electricityTheftAlarm',
      },
      component: () => import('@/pages/safetyMonitor/stealingElectricity'),
    },
    {
      path: 'allWarn',
      name: `${pre}allWarn`,
      meta: {
        ...meta,
        title: '$t:allAlarm',
      },
      component: () => import('@/pages/safetyMonitor/allWarn'),
    },
    {
      path: 'leakage',
      name: `${pre}leakage`,
      meta: {
        ...meta,
        title: '$t:leakage',
      },
      component: () => import('@/pages/safetyMonitor/leakage'),
    },
    {
      path: 'temperature',
      name: `${pre}temperature`,
      meta: {
        ...meta,
        title: '$t:temperature',
      },
      component: () => import('@/pages/safetyMonitor/temperature'),
    },
    {
      path: 'leakageWarm',
      name: `${pre}leakageWarm`,
      meta: {
        ...meta,
        title: '$t:leakageAlarm',
        isShowtabbar: true,
      },
      component: () => import('@/pages/safetyMonitor/leakageWarm'),
    },
    {
      path: 'temperatureWarn',
      name: `${pre}temperatureWarn`,
      meta: {
        ...meta,
        title: '$t:temperatureAlarm',
        isShowtabbar: true,
      },
      component: () => import('@/pages/safetyMonitor/temperatureWarn'),
    },
    {
      path: 'leakageSelfChecking',
      name: `${pre}leakageSelfChecking`,
      meta: {
        ...meta,
        title: '$t:leakageSelfCheck',
        isShowtabbar: true,
      },
      component: () => import('@/pages/safetyMonitor/leakageSelfChecking'),
    },
    {
      path: 'shortCircuitWarn',
      name: `${pre}shortCircuitWarn`,
      meta: {
        ...meta,
        title: '$t:shortCircuitAlarm',
        isShowtabbar: true,
      },
      component: () => import('@/pages/safetyMonitor/shortCircuitWarn'),
    },
    {
      path: 'abnormalVoltage',
      name: `${pre}abnormalVoltage`,
      meta: {
        ...meta,
        title: '$t:overUnderVoltage',
      },
      component: () => import('@/pages/safetyMonitor/abnormalVoltage'),
    },
    {
      path: 'abnormalCurrent',
      name: `${pre}abnormalCurrent`,
      meta: {
        ...meta,
        title: '$t:overCurrentOverload',
      },
      component: () => import('@/pages/safetyMonitor/abnormalCurrent'),
    },
    {
      path: 'SparkWarn',
      name: `${pre}SparkWarn`,
      meta: {
        ...meta,
        title: '$t:arcAlarm',
        isShowtabbar: true,
      },
      component: () => import('@/pages/safetyMonitor/SparkWarn'),
    },
    {
      path: 'phaseWarn',
      name: `${pre}phaseWarn`,
      meta: {
        ...meta,
        title: '$t:threePhaseAlarm',
        isShowtabbar: true,
      },
      component: () => import('@/pages/safetyMonitor/phaseWarn'),
    },
    {
      path: 'abnormalState',
      name: `${pre}abnormalState`,
      meta: {
        ...meta,
        title: '$t:abnormalState',
      },
      component: () => import('@/pages/safetyMonitor/abnormalState'),
    },
    {
      path: 'ocWarn',
      name: `${pre}ocWarn`,
      meta: {
        ...meta,
        title: '$t:ocWarn',
      },
      component: () => import('@/pages/safetyMonitor/ocWarn'),
    },
  ],
}
