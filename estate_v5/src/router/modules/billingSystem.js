const meta = {
  auth: true,
  cache: true,
  closable: true,
}

const pre = 'billingSystem-'

export default {
  path: '/billingSystem',
  name: 'billingSystem',
  redirect: { name: `${pre}electric-charging` },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'instantSettlement',
      name: `${pre}instantSettlement`,
      meta: { ...meta, title: '$t:instantSettlementSystem' },
      component: () => import('@/pages/billingSystem/instantSettlement'),
    },
    {
      path: 'electric-charging',
      name: `${pre}electric-charging`,
      meta: { ...meta, title: '$t:electricityBillingSystem' },
      component: () => import('@/pages/billingSystem/electric/charging'),
    },
    {
      path: 'electric-price',
      name: `${pre}price`,
      meta: { ...meta, title: '$t:unitPriceConfig' },
      component: () => import('@/pages/billingSystem/electric/price'),
    },
    {
      path: 'electric-period',
      name: `${pre}period`,
      meta: { ...meta, title: '$t:electricityCostStatistics' },
      component: () => import('@/pages/billingSystem/electric/period'),
    },
    {
      path: 'electric-priceConfig',
      name: `${pre}priceConfig`,
      meta: { ...meta, title: '$t:unitPriceConfig' },
      component: () => import('@/pages/billingSystem/electric/priceConfig'),
    },
  ],
}
