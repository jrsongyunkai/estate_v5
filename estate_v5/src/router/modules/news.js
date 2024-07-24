import BasicLayout from '@/pages/News'

const meta = {
  auth: true,
  title: '$t:messageList',
}

export default {
  path: '/news',
  name: 'news',
  meta,
  component: BasicLayout,
}
