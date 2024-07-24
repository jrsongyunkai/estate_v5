const pre = '/energySaving/'

export default {
  path: '/energySaving',
  title: '$t:energySavingManagement',
  custom: 'icon-v5 icon-v5-shouye',
  children: [
    {
      path: `${pre}standby`,
      title: '$t:conditionMonitoringEnergyConsumption',
      custom: 'icon-v5 icon-v5-daijinenghao',
      isVisibleValue: 11,
    },
    {
      path: `${pre}modeConfig`,
      title: '$t:modeConfiguration',
      custom: 'icon-v5 icon-v5-moshipeizhi',
      isVisibleValue: 12,
    },
  ],
}
