const pre = '/console/'

export default {
  path: '/console',
  title: '$t:mainConsole',
  header: 'home',
  custom: 'icon-v5 icon-v5-shouye',
  children: [
    {
      path: `${pre}project`,
      title: '$t:projectHomepage',
      custom: 'icon-v5 icon-v5-xiangmuzhuye1',
      isVisibleValue: 0,
    },
    {
      path: `${pre}device`,
      title: '$t:deviceOverview',
      custom: 'icon-v5 icon-v5-shebeigaikuang1',
      isVisibleValue: 1,
    },
    {
      path: `${pre}topology`,
      title: '$t:topology',
      custom: 'icon-v5 icon-v5-tuoputu1',
      isVisibleValue: 2,
    },
    //    {
    //        path: `${pre}topology2`,
    //        title: '$t:page.console.topology.title',
    //        custom: 'icon-v5 icon-v5-tuoputu1'
    //    }
  ],
}
