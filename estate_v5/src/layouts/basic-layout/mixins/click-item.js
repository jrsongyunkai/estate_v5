import { findComponentUpward } from 'view-design/src/utils/assist'
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('admin/layout', ['menuSiderReload', 'menuHeaderReload']),
  },
  methods: {
    handleClick(path, type = 'sider') {
      // 组件缓存
      if (path === '/visualScreen') {
        this.$store.commit('closeTable', false)
      } else {
        this.$store.commit('closeTable', true)
      }
      const current = this.$route.path
      if (current === path) {
        if (type === 'sider' && this.menuSiderReload) this.handleReload()
        else if (type === 'header' && this.menuHeaderReload) this.handleReload()
      }
    },
    handleReload() {
      const $layout = findComponentUpward(this, 'BasicLayout')
      if ($layout) $layout.handleReload()
    },
  },
}
