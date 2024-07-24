import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('admin/i18n', ['locale']),
  },
  methods: {
    ...mapMutations('OverFlowTips', ['setLoadZoomPageFirst']),
    handleZoomTips() {
      if (this.$route.meta.isFrame) return
      if (this.$store.state.OverFlowTips.loadZoomPageFirst) {
        this.$Spin.show({
          render: h => {
            return h('div', [h('img', { attrs: { src: `/static/img/sysyemTips/scalcTips${this.locale === 'zh-CN' ? 'CN' : ''}.png` } })])
          },
        })
        this.setLoadZoomPageFirst(false)
        this.spinTimeOutHide = setTimeout(() => {
          this.removeSpin()
        }, 10 * 1000)
        document.addEventListener('click', this.removeSpin)
      }
    },
    removeSpin() {
      this.$Spin.hide()
      clearTimeout(this.spinTimeOutHide)
      this.setLoadZoomPageFirst(false)
      document.removeEventListener('click', this.removeSpin)
    },
  },
  mounted() {
    this.handleZoomTips()
  },
}
