<template>
  <div class="preview-box">
    <ConfigurationCanvas v-show="!showDetail" class="configuration-canvas" :editable="false" @init="init" />
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>

<script>
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import ConfigurationCanvas from './modules/component/ConfigurationCanvas.vue'
  import { diagramPreviewIndexDB } from '@/plugins/indexDB/index'
  import mixins from './modules/util/mixins'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'sketchPreview',
    components: {
      ConfigurationCanvas,
      detailView,
    },
    data() {
      return {
        loopTimer: null,
        projectCode: null,
      }
    },
    provide() {
      return {
        lookDeviceDetail: this.lookDeviceDetail,
      }
    },
    mixins: [mixins, deviceDetails],
    methods: {
      clear() {
        diagramPreviewIndexDB.removeItem(this.$route.query.code)
      },
      init() {
        let code = this.$route.query.code
        this.projectCode = this.$route.query.projectCode
        diagramPreviewIndexDB.getItem(code).then(res => {
          let JsonData = JSON.parse(res)
          this.macAddrs = []
          this.attrMap = {}
          JsonData.pens.forEach(v => {
            v.locked = 1
            if (v.resId && v.addr && !this.macAddrs.find(it => it === `${v.resId}-${v.addr}`)) {
              this.macAddrs.push(`${v.resId}-${v.addr}`)
            }
            if (v.attr) {
              this.attrMap[v.id] = v.attr
            }
          })
          window.meta2d.open(JsonData)
          window.meta2d.lock(1)
          // window.meta2d.fitView(true, 20)
          this.loop()
          this.loopTimer = setInterval(this.loop, 10 * 1000)
        })
      },
      lookDeviceDetail(mac) {
        console.log('🚀 ~ lookDeviceDetail ~ mac:', mac)
        window.leaveDeviceHideTip && window.leaveDeviceHideTip()
        this.handle({ mac })
      },
    },
    mounted() {
      window.addEventListener('unload', this.clear)
    },
    destroyed() {
      clearInterval(this.loopTimer)
    },
  }
</script>

<style lang="less" scoped>
  .preview-box {
    width: 100vw;
    height: 100vh;
  }
</style>
