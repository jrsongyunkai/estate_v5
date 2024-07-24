<script>
  import { Table } from 'view-design'
  import { mapState, mapMutations } from 'vuex'
  export default {
    extends: Table,
    computed: {
      ...mapState('admin/i18n', ['locale']),
    },
    methods: {
      ...mapMutations('OverFlowTips', ['setLoadOverflowTableFirst']),
      handleWidthSpan() {
        if (this.$route.meta.isFrame) return
        if (this.$children[0].$el.offsetWidth - this.$el.offsetWidth > 1 && this.$store.state.OverFlowTips.loadOverflowTableFirst) {
          this.$Spin.show({
            render: h => {
              return h('div', [h('img', { attrs: { src: `/static/img/sysyemTips/tableOverflowTips${this.locale === 'zh-CN' ? 'CN' : ''}.png` } })])
            },
          })
          this.setLoadOverflowTableFirst(false)
          this.spinTimeOutHide = setTimeout(() => {
            this.removeSpin()
          }, 10 * 1000)
          document.addEventListener('click', this.removeSpin)
        }
      },
      removeSpin() {
        this.$Spin.hide()
        clearTimeout(this.spinTimeOutHide)
        this.setLoadOverflowTableFirst(false)
        document.removeEventListener('click', this.removeSpin)
      },
    },
    mounted() {
      this.$nextTick(() => {
        this.resizeObserverTable = new ResizeObserver(this.handleWidthSpan)
        this.resizeObserverTable.observe(this.$el)
        this.resizeObserverTable.observe(this.$children[0].$el)
      })
    },
    destroyed() {
      this.resizeObserverTable.disconnect()
      this.resizeObserverTable = null
    },
  }
</script>
