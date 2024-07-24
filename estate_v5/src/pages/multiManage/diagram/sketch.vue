<template>
  <div class="preview-box">
    <ConfigurationCanvas class="configuration-canvas" :editable="false" @init="init" hideLookDevice />
  </div>
</template>
<script>
  import ConfigurationCanvas from './modules/component/ConfigurationCanvas.vue'
  import { getSketchBaseInfoShare } from '@/api/multiManage/diagram'
  import { httpRequest } from './modules/util/http'
  import mixins from './modules/util/mixins'
  export default {
    components: { ConfigurationCanvas },
    name: 'sketch',
    data() {
      return {
        info: null,
        projectCode: null,
      }
    },
    mixins: [mixins],
    methods: {
      async getBaseInfo(code) {
        this.$Spin.show({
          render: h => {
            return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', 'Loading')])
          },
        })
        let res = await getSketchBaseInfoShare({ code })
        if (res.success) {
          this.info = res.data
          this.projectCode = res.data.projectCode
          if (this.info.filePath) {
            let url =
              window.location.host.startsWith('localhost') && this.info.filePath.indexOf('/upload') > -1
                ? `/upload${this.info.filePath.split('/upload')[1]}`
                : this.info.filePath.indexOf('/upload') > -1
                ? `${window.location.origin}/upload/${this.info.filePath.split('/upload/')[1]}`
                : this.info.filePath
            let jsonData = await httpRequest.getJsonData(`${url}?v=${Date.now()}`)
            this.macAddrs = []
            this.attrMap = {}
            jsonData.pens.forEach(v => {
              v.locked = 1
              if (v.resId && v.addr && !this.macAddrs.find(it => it === `${v.resId}-${v.addr}`)) {
                this.macAddrs.push(`${v.resId}-${v.addr}`)
              }
              if (v.attr) {
                this.attrMap[v.id] = v.attr
              }
            })
            window.meta2d.open(jsonData)
            window.meta2d.lock(1)
            // window.meta2d.fitView(true, 20)
            this.loop()
            this.loopTimer = setInterval(this.loop, 10 * 1000)
          }
        } else {
          this.$Message.error(res.message || this.$t('loadFail'))
        }
        this.$Spin.hide()
      },
      init() {
        this.getBaseInfo(this.$route.query.code)
      },
    },
    mounted() {},
    destroyed() {
      clearInterval(this.loopTimer)
    },
  }
</script>
<style lang="less" scoped>
  .preview-box {
    width: 100vw;
    height: 100vh;
    position: relative;
  }
</style>
