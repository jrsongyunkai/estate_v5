<template>
  <div class="details-box">
    <div class="top-box">
      <div class="left">
        <div class="back-btn" v-if="!isNoBack">
          <div class="details-menu" @click.stop="$emit('close')">
            <div class="details-menu-btn"><Icon custom="icon-v5 icon-v5-back1" /></div>
            <div class="details-menu-text">{{ $t('back') }}</div>
          </div>
        </div>
        <span class="ml-10">{{ sketchInfo.name }}</span>
        <Select v-model="selectGroup" style="width: 250px; margin-left: 10px" multiple :max-tag-count="2" transfer>
          <Option v-for="item in IconGroupsRef" :value="item.name" :key="item.name">{{ item.name }}</Option>
        </Select>
      </div>
      <div class="right">
        <div class="btn" @click.stop="share">
          <Icon type="ios-send" size="16" />
          <div>{{ $t('share') }}</div>
        </div>
        <div class="btn" @click.stop="edit">
          <Icon type="md-create" size="16" />
          <div>{{ $t('edit') }}</div>
        </div>
        <Dropdown @on-click="exportClick">
          <div class="btn">
            <Icon type="ios-cloud-download" size="16" />
            <div>{{ $t('download') }}</div>
          </div>
          <template #list>
            <DropdownMenu>
              <DropdownItem name="JSON">JSON</DropdownItem>
              <DropdownItem name="PNG">PNG</DropdownItem>
            </DropdownMenu>
          </template>
        </Dropdown>
        <div class="btn" @click="onPreview" v-if="jsonData">
          <Icon custom="icon-v5 icon-v5-quanping" />
          <div>{{ $t('fullScreen') }}</div>
        </div>
      </div>
    </div>
    <ConfigurationCanvas class="configuration-canvas" :editable="false" isLook @init="drawJson" />
  </div>
</template>

<script>
  import ConfigurationCanvas from './component/ConfigurationCanvas.vue'
  import { IconGroups } from './util/process'
  import { httpRequest } from './util/http'
  import { diagramPreviewIndexDB } from '@/plugins/indexDB/index'
  import mixins from './util/mixins'
  import { cloneDeep } from 'lodash'
  export default {
    components: { ConfigurationCanvas },
    props: {
      sketchInfo: {
        type: Object,
        default: () => {},
      },
      isNoBack: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [mixins],
    data() {
      return {
        info: this.sketchInfo,
        selectGroup: [],
        IconGroupsRef: IconGroups,
        jsonData: null,
        loopTimer: null,
        projectCode: this.$store.state.projectCode,
      }
    },
    methods: {
      share() {
        this.$parent.shareItem(this.sketchInfo)
      },
      edit() {
        this.$parent.editDiagram(this.sketchInfo)
      },
      exportClick(name) {
        this.$parent.exportClick(this.sketchInfo, name)
      },
      async drawJson() {
        if (this.sketchInfo.filePath) {
          this.$Spin.show({
            render: h => {
              return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', 'Loading')])
            },
          })
          let url = window.location.host.startsWith('localhost') && this.sketchInfo.filePath.indexOf('/upload') > -1 ? `/upload${this.sketchInfo.filePath.split('/upload')[1]}` : this.sketchInfo.filePath
          this.jsonData = await httpRequest.getJsonData(`${url}?v=${Date.now()}`)
          try {
            this.macAddrs = []
            this.attrMap = {}
            this.jsonData.pens.forEach(v => {
              v.locked = 1
              if (v.resId && v.addr && !this.macAddrs.find(it => it === `${v.resId}-${v.addr}`)) {
                this.macAddrs.push(`${v.resId}-${v.addr}`)
              }
              if (v.attr) {
                this.attrMap[v.id] = v.attr
              }
            })
            window.meta2d.open(cloneDeep(this.jsonData))
            window.meta2d.lock(1)
            this.macAddrs.length && this.loop()
            this.loopTimer = setInterval(() => {
              this.macAddrs.length && this.loop()
            }, 10 * 1000)
            this.$Spin.hide()
          } catch (e) {
            this.$message.error(this.$t('dataLoadingException'))
          }
        }
      },
      onPreview() {
        diagramPreviewIndexDB.setItem(this.sketchInfo.code, JSON.stringify(window.meta2d.data())).then(() => {
          window.open(`/sketch/preview?code=${this.sketchInfo.code}`, '_blank')
        })
      },
    },
    created() {
      this.setViewSize()
    },
    beforeDestroy() {
      this.reSetViewSize()
    },
    destroyed() {
      clearInterval(this.loopTimer)
    },
    activated() {
      this.setViewSize()
    },
    deactivated() {
      this.reSetViewSize()
    },
    watch: {
      selectGroup: {
        handler(value) {
          const data = window.meta2d.data()
          data.pens.forEach(v => {
            v.globalAlpha = value.length ? (value.includes(v.tag) ? 1 : 0.2) : 1
          })
          window.meta2d.open(data)
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .details-box {
    width: 100%;
    height: 100%;
    position: relative;
    .top-box {
      height: 50px;
      display: flex;
      align-items: center;
      padding-left: 10px;
      justify-content: space-between;
      background: #1a202e;
      border-bottom: 1px solid #424b5f;
      .left {
        display: flex;
        align-items: center;
        .details-menu {
          text-align: center;
          padding: 0px 10px;
          border-right: 1px solid #424b5f;
          cursor: pointer;
          margin-right: 10px;
        }
        .details-menu:hover,
        .details-menu:active {
          color: #2d8cf0;
        }
      }
      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        .btn {
          margin-left: 15px;
          text-align: center;
          padding: 5px;
          font-size: 12px;
          padding-top: 5px;
          cursor: pointer;
          &:hover,
          &:active {
            color: #2d8cf0;
          }
        }
      }
    }
    .configuration-canvas {
      height: calc(~'100% - 50px');
    }
  }
</style>
