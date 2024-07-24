<template>
  <div class="quality-box">
    <div class="left">
      <LinesSelectView ref="LinesSelectViewRef" @nodeClick="nodeClick"></LinesSelectView>
    </div>
    <div class="right" v-if="addrInfo.addr">
      <template v-if="addrInfo.isSupportElecQuality">
        <HarmonicRealTimeView ref="harmonicRealTimeView" :addrInfo="addrInfo" />
        <ThreePhaseUnbalanceChart ref="threePhaseUnbalanceChart" :addrInfo="addrInfo" />
        <div class="content-mo-groups">
          <div class="header">
            <div class="left-title">{{ $t('historicalTrendHarmonics') }}</div>
            <div class="right-box">
              <DatePicker style="width: 135px" :value="dateValue" type="date" @on-change="changeDateValue" :editable="false" format="yyyy-MM-dd" :placeholder="$t('selectDate')" :clearable="false" transfer></DatePicker>
            </div>
          </div>
          <div class="content">
            <HarmonicChartView ref="harmonicChartView" :dateValue="dateValue" :addrInfo="addrInfo" />
            <FrequencyChartView ref="frequencyChartView" :addrInfo="addrInfo" :dateValue="dateValue" />
            <ThreePhaseUnbalanceView ref="ThreePhaseUnbalanceView" :addrInfo="addrInfo" :dateValue="dateValue" />
          </div>
        </div>
        <div class="content-mo-groups">
          <div class="header">
            <div class="left-title">{{ $t('historicalTrendsElectricalEnergy') }}</div>
            <div class="right-box">
              <DatePicker style="width: 135px" :value="dateValue1" type="date" @on-change="changeDateValue1" :editable="false" format="yyyy-MM-dd" :placeholder="$t('selectDate')" :clearable="false" transfer></DatePicker>
            </div>
          </div>
          <div class="content">
            <ElectTrendChartView :dateValue="dateValue1" :addrInfo="addrInfo" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no-info">
          <div>
            <div style="text-align: center"><img src="@/assets/images/noDatas.png" alt="" style="width: 200px" /></div>
            <div style="text-align: center; margin-bottom: 100px">{{ $t('toolTipText16') }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
  import LinesSelectView from './modulesSubView/LinesSelectView.vue'
  import QualityChart from './common/QualityChart.vue'
  import ThreePhaseUnbalanceView from './component/ThreePhaseUnbalanceView.vue'
  import HarmonicChartView from './component/HarmonicChartView.vue'
  import FrequencyChartView from './component/FrequencyChartView.vue'
  import HarmonicRealTimeView from './component/HarmonicRealTimeView.vue'
  import ThreePhaseUnbalanceChart from './component/ThreePhaseUnbalanceChart.vue'
  import ElectTrendChartView from './component/ElectTrendChartView.vue'
  export default {
    components: {
      LinesSelectView,
      HarmonicRealTimeView,
      ThreePhaseUnbalanceChart,
      QualityChart,
      ThreePhaseUnbalanceView,
      HarmonicChartView,
      FrequencyChartView,
      ElectTrendChartView,
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        addrInfo: {},
        dateValue: this.$func.getNowFormatDate(),
        dateValue1: this.$func.getNowFormatDate(),
      }
    },
    mounted() {},
    methods: {
      nodeClick(info) {
        console.log('🚀 ~ file: qualityModule.vue:68 ~ nodeClick ~ info:', info)
        this.addrInfo = info
      },
      changeDateValue(e) {
        this.dateValue = e
      },
      changeDateValue1(e) {
        this.dateValue1 = e
      },
    },
  }
</script>

<style lang="less" scoped>
  .quality-box {
    height: 100%;
    display: flex;
    .left {
      width: 300px;
      height: 100%;
      padding: 15px 10px;
      background: #1a202e;
      margin-right: 10px;
    }
    .right {
      width: calc(~'100% - 310px');
      height: 100%;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        height: 0px;
        width: 0px;
      }
      .content-mo-groups {
        background: #1a202e;
        .header {
          display: flex;
          justify-content: space-between;
          height: 50px;
          padding: 0px 15px;
          align-items: center;
          .left-title {
            font-size: 16px;
            font-weight: bold;
          }
        }
      }
      /deep/.mo-item {
        width: 100%;
        background: #1a202e;
        margin-bottom: 10px;
        padding: 0px 15px;
        .header {
          height: 50px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #5e626c;
          margin-top: 0 !important;
          justify-content: space-between;
          .left-title {
            display: flex;
            align-items: center;
            font-size: 14px;
          }
          .right-box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .ml-5 {
              margin-left: 5px;
            }
          }
        }
        .content {
          padding: 10px;
          .info-box {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            .info-item {
              height: 40px;
              line-height: 40px;
              width: 50%;
              min-width: 200px;
              display: flex;
              .label {
                color: #909399;
              }
            }
          }
          .search-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            margin-top: 10px;
            .right {
              display: flex;
              justify-content: flex-end;
            }
          }
        }
      }
      .no-info {
        background: #1a202e;
        text-align: center;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
      }
    }
    .ml-5 {
      margin-left: 5px;
    }
  }
</style>
