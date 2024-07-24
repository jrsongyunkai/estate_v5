const pre = '/safetyMonitor/'

export default {
  path: '/safetyMonitor',
  title: '$t:safetyMonitor',
  header: 'home',
  custom: 'icon-v5 icon-v5-anquanjianguan',
  children: [
    {
      path: `${pre}monitoringReport`,
      title: '$t:monitoringReport',
      custom: 'icon-v5 icon-v5-menu_lrtx',
      isVisibleValue: 13,
    },
    {
      path: `${pre}allWarn`,
      title: '$t:allAlarm',
      custom: 'icon-v5 icon-v5-quanbubaojing1',
      isVisibleValue: 0,
    },
    {
      path: `${pre}leakage`,
      title: '$t:leakage',
      custom: 'icon-v5 icon-v5-loudianliu1',
      isVisibleValue: 1,
    },
    {
      path: `${pre}temperature`,
      title: '$t:temperature',
      custom: 'icon-v5 icon-v5-wendu2',
      isVisibleValue: 2,
    },
    {
      path: `${pre}leakageWarm`,
      title: '$t:leakageAlarm',
      custom: 'icon-v5 icon-v5-loudianbaojing1',
      isVisibleValue: 4,
    },
    {
      path: `${pre}stealingElectricity`,
      title: '$t:electricityTheftAlarm',
      custom: 'icon-v5 icon-v5-qiedian',
      isVisibleValue: 14,
    },
    {
      path: `${pre}temperatureWarn`,
      title: '$t:temperatureAlarm',
      custom: 'icon-v5 icon-v5-wendubaojing1',
      isVisibleValue: 3,
    },
    {
      path: `${pre}leakageSelfChecking`,
      title: '$t:leakageSelfCheck',
      custom: 'icon-v5 icon-v5-loubaozijian1',
      isVisibleValue: 6,
    },
    {
      path: `${pre}shortCircuitWarn`,
      title: '$t:shortCircuitAlarm',
      custom: 'icon-v5 icon-v5-duanlubaojing1',
      isVisibleValue: 5,
    },
    {
      path: `${pre}abnormalVoltage`,
      title: '$t:overUnderVoltage',
      custom: 'icon-v5 icon-v5-guoqianya1',
      isVisibleValue: 8,
    },
    {
      path: `${pre}abnormalCurrent`,
      title: '$t:overCurrentOverload',
      custom: 'icon-v5 icon-v5-guoliuguozai1',
      isVisibleValue: 7,
    },
    {
      path: `${pre}SparkWarn`,
      title: '$t:arcAlarm',
      custom: 'icon-v5 icon-v5-dianhubaojing1',
      isVisibleValue: 10,
    },
    {
      path: `${pre}phaseWarn`,
      title: '$t:threePhaseAlarm',
      custom: 'icon-v5 icon-v5-sanxiangbaojing1',
      isVisibleValue: 9,
    },
    {
      path: `${pre}abnormalState`,
      title: '$t:abnormalState',
      custom: 'icon-v5 icon-v5-yichangzhuangtai1',
      isVisibleValue: 11,
    },
    {
      path: `${pre}ocWarn`,
      title: '$t:ocWarn',
      custom: 'icon-v5 icon-v5-fenhezha',
      isVisibleValue: 12,
    },
  ],
}
