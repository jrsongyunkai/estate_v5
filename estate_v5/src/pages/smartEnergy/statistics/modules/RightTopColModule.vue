<template>
  <div class="top-cols">
    <div class="col-item" v-for="item in topColMapData" :key="item.type">
      <div class="item-image"><MImage :src="item.image" :preview="false" /></div>
      <div class="item-content">
        <div class="title">{{ item.title }}</div>
        <div class="value"><MCountUp :end="item.data" :decimals="3" /></div>
        <div class="trend">
          <MTrend type="yoy" :value="item.yoy" />
          <MTrend type="qoq" :value="item.qoq" v-if="item.type != 'year'" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { energyOverView } from '@/api/smartEnergy/statistics'
  export default {
    props: {
      energyType: { type: Number, default: 1 },
      queryParams: { type: Object, default: () => {} },
    },
    data() {
      return {
        topColInfo: {
          currentYearData: { data: 0, yoy: 0, qoq: 0 },
          currentQuarterData: { data: 0, yoy: 0, qoq: 0 },
          currentMonthData: { data: 0, yoy: 0, qoq: 0 },
          lastDayData: { data: 0, yoy: 0, qoq: 0 },
        },
      }
    },
    computed: {
      topColMapData() {
        const { currentYearData, currentQuarterData, currentMonthData, lastDayData } = this.topColInfo
        let title1 = this.energyType === 1 ? this.$t('ns_energyOverview.elecLabel1') : this.energyType === 2 ? this.$t('ns_energyOverview.waterLabel1') : this.energyType === 3 ? this.$t('ns_energyOverview.gasLabel1') : this.$t('ns_energyOverview.heatingLabel1')
        let title2 = this.energyType === 1 ? this.$t('ns_energyOverview.elecLabel2') : this.energyType === 2 ? this.$t('ns_energyOverview.waterLabel2') : this.energyType === 3 ? this.$t('ns_energyOverview.gasLabel2') : this.$t('ns_energyOverview.heatingLabel2')
        let title3 = this.energyType === 1 ? this.$t('ns_energyOverview.elecLabel3') : this.energyType === 2 ? this.$t('ns_energyOverview.waterLabel3') : this.energyType === 3 ? this.$t('ns_energyOverview.gasLabel3') : this.$t('ns_energyOverview.heatingLabel3')
        let title4 = this.energyType === 1 ? this.$t('ns_energyOverview.elecLabel4') : this.energyType === 2 ? this.$t('ns_energyOverview.waterLabel4') : this.energyType === 3 ? this.$t('ns_energyOverview.gasLabel4') : this.$t('ns_energyOverview.heatingLabel4')
        return [
          { title: title1, type: 'year', image: require('@/assets/energyImages/nian_nenghao@1x.png'), ...currentYearData },
          { title: title2, type: 'quarter', image: require('@/assets/energyImages/ji_nenghao@1x.png'), ...currentQuarterData },
          { title: title3, type: 'month', image: require('@/assets/energyImages/yue_nenghao@1x.png'), ...currentMonthData },
          { title: title4, type: 'yesterday', image: require('@/assets/energyImages/ri_nenghao@1x.png'), ...lastDayData },
        ]
      },
    },
    methods: {
      // 顶部统计数据查询
      async getTopColSpanData() {
        let params = { ...this.queryParams, projectCode: this.$store.state.projectCode, energyType: this.energyType }
        let res = await energyOverView(params)
        if (res.success) {
          this.topColInfo = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .top-cols {
    width: 100%;
    display: flex;
    justify-content: space-between;
    overflow: auto;
    &::-webkit-scrollbar {
      height: 0px;
    }
    .col-item {
      width: calc(~'25% - 8px');
      background: #1a202e;
      border-radius: 5px;
      padding: 15px 0px 15px 15px;
      display: flex;
      align-items: center;
      min-width: 268px;
      margin-right: 8px;
      &:last-of-type {
        margin-right: 0;
      }
      .item-image {
        width: 60px;
        height: 60px;
        margin-right: 5px;
      }
      .item-content {
        width: calc(~'100% - 70px');
        .title {
          width: 100%;
          font-size: 14px;
        }
        .value {
          font-size: 20px;
          line-height: 34px;
        }
        .trend {
          font-size: 12px;
          line-height: 1;
          display: flex;
          .trend-span:first-of-type {
            margin-right: 5px;
          }
        }
      }
    }
  }
</style>
