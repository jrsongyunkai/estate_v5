const meta = {
  auth: true,
  cache: true,
  closable: true,
}

const pre = 'console-'

export default {
  path: '/console',
  name: 'console',
  redirect: {
    name: `${pre}project`,
  },
  meta,
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'project',
      name: `${pre}project`,
      meta: {
        ...meta,
        title: '$t:projectHomepage',
        closable: false,
      },
      component: () => import('@/pages/console/project'),
    },
    {
      path: 'device',
      name: `${pre}device`,
      meta: {
        ...meta,
        title: '$t:deviceOverview',
      },
      component: () => import('@/pages/console/device'),
    },

    {
      path: 'topology',
      name: `${pre}topology`,
      meta: {
        ...meta,
        title: '$t:topology',
      },
      component: () => import('@/pages/console/topology/index'),
      // component: () => import('@/pages/console/topology/settings/index'),
    },
  ],
}
