const meta = {
  auth: true,
  closable: true,
  cache: true,
}

export default {
  path: '/quicklyMenu',
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: '/',
      name: 'quicklyMenu',
      meta: {
        ...meta,
        // title: '$t:customizeQuickLinks',
      },
      component: () => import('@/pages/quicklyMenu'),
    },
  ],
}
