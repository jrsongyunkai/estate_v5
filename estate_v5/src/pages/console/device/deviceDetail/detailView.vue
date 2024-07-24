<template>
  <div class="device-detail">
    <div class="top-title">
      <div>
        <Icon type="md-arrow-back" size="20" @click.stop="closeView" />
        <span class="title-text">{{ $t('deviceInfo') }} （{{ rowInfo.mac }}）</span>
        <span class="offline-attention c-danger" v-if="rowInfo.others.online !== 1">{{ $t('offlineAttention') }}</span>
      </div>
      <div class="op-btn" v-if="showSwitch">
        <Button type="primary" ghost :disabled="currentIndex === 0 && pageNo === 1" @click.stop="prevDevice">{{ $t('previousDevice') }}</Button>
        <Button class="ml-10" type="primary" ghost :disabled="pageNo === totalPage && currentIndex === cycleDataList.length - 1" @click.stop="nextDevice">{{ $t('nextDevice') }}</Button>
      </div>
    </div>
    <div class="content-view" v-if="[1, 2, 8, 19].includes(rowInfo.equipmentType)">
      <Tabs :animated="false" v-model="activeName" @on-click="handleClick">
        <template #extra>
          <Button style="margin-right: 15px" class="pointer detailsBtn" type="primary" @click.stop="refreshModule" ghost>
            <Icon custom="icon-v5 icon-v5-refresh"></Icon>
          </Button>
        </template>
        <TabPane :label="$t('deviceInfo')" name="deviceInfo">
          <device-info-module ref="deviceInfoRef" v-if="activeName === 'deviceInfo'" :key="moduleKey"></device-info-module>
        </TabPane>
        <TabPane :label="$t('channelList')" name="addrLines">
          <addr-lines-module ref="addrLinesRef" v-if="activeName === 'addrLines'" :key="moduleKey"></addr-lines-module>
        </TabPane>
        <TabPane :label="$t('runTrend')" name="runTrend">
          <run-trend-module ref="runTrendRef" v-if="activeName === 'runTrend'" :key="moduleKey"></run-trend-module>
        </TabPane>
        <TabPane :label="$t('parameterConfiguration')" name="config">
          <config-module ref="configRef" v-if="activeName === 'config'" :key="moduleKey"></config-module>
        </TabPane>
        <TabPane :label="$t('threeLevelTHresoldAlarm')" name="threeLevelConfig" v-if="isFuTian">
          <three-threshold-config-module ref="runTrendRef" v-if="activeName === 'threeLevelConfig'" :key="moduleKey"></three-threshold-config-module>
        </TabPane>
        <TabPane :label="$t('electricityQuality')" name="quality">
          <quality-module ref="qualityRef" v-if="activeName === 'quality'" :key="moduleKey"></quality-module>
        </TabPane>
        <TabPane :label="$t('commandHistory')" name="instruct">
          <instruct-module ref="instructRef" v-if="activeName === 'instruct'" :key="moduleKey"></instruct-module>
        </TabPane>
      </Tabs>
    </div>
    <div class="content-view scroll" v-else>
      <device-info-module></device-info-module>
    </div>
  </div>
</template>
<script>
  import deviceInfoModule from './viewModules/deviceInfoModule.vue'
  import threeThresholdConfigModule from './viewModules/threeThresholdConfigModule.vue'
  import addrLinesModule from './viewModules/addrLinesModule.vue'
  import runTrendModule from './viewModules/runTrendModule.vue'
  import configModule from './viewModules/configModule.vue'
  import qualityModule from './viewModules/qualityModule.vue'
  import instructModule from './viewModules/instructModule.vue'
  import { modifyMacRate } from '@/api/public'
  import noMarginTop from '@/mixins/noMarginTop'
  import { mapMutations } from 'vuex'

  export default {
    components: {
      deviceInfoModule,
      addrLinesModule,
      runTrendModule,
      configModule,
      qualityModule,
      instructModule,
      threeThresholdConfigModule,
    },
    mixins: [noMarginTop],
    props: {
      rowInfo: {
        type: Object,
        default: () => {},
      },
      deviceList: {
        type: Array,
        default: () => [],
      },
      deviceCycleData: {
        type: Object,
        default: () => {},
      },
      initTab: {
        type: String,
        default: 'deviceInfo',
      },
      showSwitch: { type: Boolean, default: true },
    },
    computed: {
      currentIndex() {
        return (this.deviceCycleData && this.deviceCycleData.list && this.deviceCycleData.list.findIndex(item => item.mac === this.rowInfo.mac)) || 0
      },
      cycleDataList() {
        return (this.deviceCycleData && this.deviceCycleData.list) || []
      },
      pageNo() {
        return this.deviceCycleData && this.deviceCycleData.pageNo
      },
      totalPage() {
        return this.deviceCycleData && this.deviceCycleData.totalPage
      },
    },
    provide() {
      return {
        rowDeviceInfo: this.rowInfo,
      }
    },
    data() {
      return {
        activeName: 'deviceInfo',
        moduleKey: 0,
        hasQuality: false,
        isFuTian: null,
      }
    },
    methods: {
      ...mapMutations('device', ['setDeviceAddr']),
      closeView() {
        this.setDeviceAddr(null)
        this.$emit('closeView')
      },
      handleClick(name) {
        this.setDeviceAddr(null)
        this.activeName = name
      },
      prevDevice() {
        this.setDeviceAddr(null)
        this.$emit('switchDevice', this.currentIndex - 1)
      },
      nextDevice() {
        this.setDeviceAddr(null)
        this.$emit('switchDevice', this.currentIndex + 1)
      },
      refreshModule() {
        this.moduleKey = Math.random()
      },
      handleModifyMacRate(mac, flag) {
        if (!mac) return false
        modifyMacRate({
          fastMac: flag === true ? mac : '',
          slowMac: flag === true ? '' : mac,
        })
      },
    },
    created() {},
    mounted() {
      this.activeName = this.initTab
      this.handleModifyMacRate(this.rowInfo.mac, true)
      this.isFuTian = window.sessionStorage.getItem('isFuTian')
    },
    beforeDestroy() {
      this.handleModifyMacRate(this.rowInfo.mac, false)
    },
  }
</script>

<style lang="less" scoped>
  .device-detail {
    .top-title {
      width: 100%;
      height: 45px;
      display: flex;
      background: #1a202e;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      .title-text {
        color: #fff;
        font-size: 16px;
        margin-left: 10px;
        font-weight: 600;
      }
      .op-btn {
        /deep/ .ivu-btn-primary[disabled] {
          color: #999;
        }
      }
    }
    .content-view {
      width: 100%;
      height: calc(~'100vh - 168px');
      padding: 10px;
      overflow: hidden;
      /deep/.ivu-tabs {
        height: 100%;
        .ivu-tabs-bar {
          background: #1a202e;
          margin-bottom: 10px;
        }
        .ivu-tabs-tab-disabled {
          display: none;
        }
        .ivu-tabs-nav-right {
          display: flex;
          align-items: center;
          height: 50px;
        }
        .ivu-tabs-nav {
          font-size: 16px;
        }
        .ivu-tabs-nav-container {
          padding: 5px;
        }
        .ivu-tabs-content {
          height: calc(~'100% - 56px');
          overflow: hidden;
          .ivu-tabs-tabpane {
            height: 100%;
            overflow: auto;
            scrollbar-width: none;
            &::-webkit-scrollbar {
              height: 0px;
              width: 0px;
            }
          }
        }
      }
    }
    .content-view.scroll {
      overflow-y: auto;
      width: 100%;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  }
</style>
