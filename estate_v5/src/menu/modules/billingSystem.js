const pre = '/billingSystem/'
export default {
  path: '/billingSystem',
  title: '$t:billingSystem',
  header: 'home',
  custom: 'icon-v5 icon-v5-jifeixitong1',
  children: [
    {
      path: `${pre}instantSettlement`,
      title: '$t:instantSettlementSystem',
      custom: 'icon-v5 icon-v5-dianjiapeizhi',
      isVisibleValue: 5,
    },
    {
      title: '$t:electricityBillingSystem',
      custom: 'icon-v5 icon-v5-jifeixitong',
      isVisibleValue: 4,
      path: '/billingSystem/electric',
      children: [
        {
          path: `${pre}electric-charging`,
          title: '$t:electricityBillingSystem',
          custom: 'icon-v5 icon-v5-jifeixitong',
          isVisibleValue: 1,
        },
        {
          path: `${pre}electric-price`,
          title: '$t:unitPriceConfig',
          custom: 'icon-v5 icon-v5-dianjiapeizhi',
          isVisibleValue: 2,
        },
        {
          path: `${pre}electric-period`,
          title: '$t:electricityCostStatistics',
          custom: 'icon-v5 icon-v5-fenshiduandianliang1',
          isVisibleValue: 3,
        },
      ],
    },
  ],
}
