<template>
  <div class="configuration-container">
    <ConfigurationHeader class="configuration-header" @close="closeViewTip" />
    <div class="configuration-main">
      <ConfigurationElements class="configuration-elements" v-if="!disabled" />
      <ConfigurationCanvas class="configuration-canvas" :editable="!disabled" @init="initDrawData" />
      <ConfigurationProps class="configuration-setting" ref="configurationPropsRef" v-if="!disabled" />
    </div>
  </div>
</template>

<script>
  import ConfigurationHeader from './component/ConfigurationHeader.vue'
  import ConfigurationElements from './component/ConfigurationElements.vue'
  import ConfigurationCanvas from './component/ConfigurationCanvas.vue'
  import ConfigurationProps from './component/ConfigurationProps.vue'
  import { httpRequest } from './util/http'
  import { diagramIndexedDB } from '@/plugins/indexDB/index'
  import mixins from './util/mixins'
  import { cloneDeep } from 'lodash'
  export default {
    components: { ConfigurationHeader, ConfigurationElements, ConfigurationCanvas, ConfigurationProps },
    props: {
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [mixins],
    data() {
      return {
        loopTimer: null,
        editItem: null,
        setTimeoutVal: null,
        projectCode: this.$store.state.projectCode,
      }
    },
    provide() {
      return {
        syncLoopConfig: this.syncLoopConfig,
      }
    },
    methods: {
      syncLoopConfig() {
        if (window.meta2d) {
          const data = window.meta2d.data()
          this.macAddrs = []
          this.attrMap = {}
          data.pens.forEach(v => {
            if (v.resId && v.addr && !this.macAddrs.find(it => it === `${v.resId}-${v.addr}`)) {
              this.macAddrs.push(`${v.resId}-${v.addr}`)
            }
            if (v.attr) {
              this.attrMap[v.id] = v.attr
            }
          })
          this.macAddrs.length && this.loop()
        }
      },
      closeViewTip() {
        this.$Modal.confirm({
          title: this.$t('tip'),
          content: this.$t('editingLeaveTip'),
          onOk: () => {
            this.closeView()
          },
        })
      },
      closeView() {
        diagramIndexedDB.clear()
        this.$emit('close')
      },
      closeWidowTab(event) {
        // 在这里执行你想要的操作，比如弹出确认对话框或保存数据等
        // 可以通过修改event.returnValue属性来显示确认对话框
        event.returnValue = this.$t('closeWindowTip')
      },
      async initDrawData() {
        this.$Spin.show({
          render: h => {
            return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', 'Loading')])
          },
        })
        this.editItem = await diagramIndexedDB.getItem('EditDiagram')
        let jsonText = await diagramIndexedDB.getItem(this.editItem.code)
        try {
          if (jsonText) {
            window.meta2d.open(JSON.parse(jsonText))
          } else if (this.editItem.filePath) {
            let url = window.location.host.startsWith('localhost') && this.editItem.filePath.indexOf('/upload') > -1 ? `/upload${this.editItem.filePath.split('/upload')[1]}` : this.editItem.filePath
            let jsonData = await httpRequest.getJsonData(`${url}?v=${Date.now()}`)
            window.meta2d.open(cloneDeep(jsonData))
            diagramIndexedDB.setItem(this.editItem.code, JSON.stringify(jsonData))
          }
        } catch (error) {
          this.$message.error(this.$t('dataLoadingException'))
        }
        this.$Spin.hide()
        this.$nextTick(() => {
          this.loop()
          this.loopTimer = setInterval(this.loop, 10 * 1000)
          this.$refs.configurationPropsRef.updateTree()
        })
      },
      updateTree() {
        this.$refs.configurationPropsRef.updateTree()
      },
    },
    created() {
      this.setViewSize()
    },
    mounted() {
      window.addEventListener('beforeunload', this.closeWidowTab)
      window.addEventListener('unload', this.closeView)
    },
    beforeDestroy() {
      this.reSetViewSize()
    },
    activated() {
      this.setViewSize()
    },
    deactivated() {
      this.reSetViewSize()
    },
    destroyed() {
      clearInterval(this.loopTimer)
      window.removeEventListener('beforeunload', this.closeWidowTab)
      window.removeEventListener('unload', this.closeView)
    },
  }
</script>
<style lang="less" scoped>
  .configuration-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: unset;
    .configuration-header {
      width: 100%;
      height: 50px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1a202e;
      border-bottom: 1px solid #424b5f;
    }
    .configuration-main {
      height: calc(~'100% - 50px');
      overflow: hidden;
      position: relative;
      display: flex;
      &.not-editable {
        padding-top: 0;
      }
      .configuration-elements {
        flex: none;
        width: 200px;
        height: 100%;
        overflow-y: hidden;
        border-right: 1px solid #424b5f;
        z-index: 10;
        background: #1a202e;
        padding-top: 5px;
        user-select: none;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }
      .configuration-canvas {
        flex: 1;
        position: relative;
      }
      .configuration-setting {
        flex: none;
        width: 240px;
        height: 100%;
        overflow-y: auto;
        border-left: 1px solid #424b5f;
        z-index: 10;
        background: #1a202e;
        user-select: none;
      }
    }
    /deep/.ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    }
    /deep/.ivu-collapse-content {
      padding: 0 10px;
    }
  }
</style>
<style lang="less">
  .configuration-header-menu {
    margin-left: 8px;
    margin-right: 8px;
    cursor: pointer;
    user-select: none;
    .configuration-header-menu-btn {
      text-align: center;
    }
    .configuration-header-menu-text {
      white-space: nowrap;
    }
    &:hover,
    &:active {
      color: #007eff;
    }
  }
</style>
