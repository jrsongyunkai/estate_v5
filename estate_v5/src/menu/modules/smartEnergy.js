const pre = '/smartEnergy/'

export default {
  path: '/smartEnergy',
  title: '$t:smartEnergyConsumption',
  header: 'home',
  custom: 'icon-v5 icon-v5-jieneng',
  children: [
    {
      path: `${pre}statistics`,
      title: '$t:energyConsumptionStatistics',
      custom: 'icon-v5 icon-v5-nenghaotongji1',
      isVisibleValue: 9,
    },
    {
      path: `${pre}diagram`,
      title: '$t:energyFlowDiagram',
      custom: 'icon-v5 icon-v5-nengyuanliuxiang',
      isVisibleValue: 10,
    },
  ],
}
