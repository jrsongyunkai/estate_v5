// 能耗监管
import smartEnergy from './smartEnergy'
import energySaving from './energySaving'
const pre = '/energyMonitor/'

export default {
  path: '/energyMonitor',
  title: '$t:energyMonitor',
  header: 'home',
  custom: 'icon-v5 icon-v5-jieneng',
  children: [
    {
      path: `${pre}power`,
      title: '$t:electricQuantity',
      custom: 'icon-v5 icon-v5-dianliang1',
      isVisibleValue: 0,
    },
    {
      path: `${pre}load`,
      title: '$t:load',
      custom: 'icon-v5 icon-v5-fuzai1',
      isVisibleValue: 1,
    },
    {
      path: `${pre}report`,
      title: '$t:electricityStatistics',
      custom: 'icon-v5 icon-v5-dianliangbaobiao',
      isVisibleValue: 3,
    },
    {
      path: `${pre}targetConfig`,
      title: '$t:configurationOfEnergyStatisticsObjects',
      custom: 'icon-v5 icon-v5-nenghaoduixiang',
      isVisibleValue: 13,
    },
    {
      path: `${pre}carbon`,
      title: '$t:carbonEmissionAnalysis',
      custom: 'icon-v5 icon-v5-tanpaifang',
      isVisibleValue: 5,
    },
    { ...smartEnergy, isVisibleValue: 7 },
    { ...energySaving, isVisibleValue: 8 },
    {
      path: `${pre}prediction`,
      title: '$t:batteryDiviner',
      custom: 'icon-v5 icon-v5-dianliangyuce',
      isVisibleValue: 6,
    },
  ],
}
