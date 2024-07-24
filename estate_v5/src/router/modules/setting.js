const meta = {
  auth: true,
  cache: false,
  closable: true,
}
const pre = 'setting-'
export default {
  path: '/setting',
  name: 'setting',
  meta,
  redirect: {
    name: `${pre}userInfo`,
  },
  component: () => import('@/layouts/basic-layout'),
  children: [
    {
      path: 'userInfo',
      name: `${pre}userInfo`,
      meta: {
        ...meta,
        title: '$t:setting',
      },
      component: () => import('@/pages/setting/userInfo'),
    },
    {
      path: 'projectInfo',
      name: `${pre}projectInfo`,
      meta: {
        ...meta,
        title: '$t:projectConfiguration',
      },
      component: () => import('@/pages/setting/projectInfo'),
    },
  ],
}
