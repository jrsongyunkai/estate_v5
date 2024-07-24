<template>
  <div>
    <ActiveElectTrendChartView @exportExcel="exportExcel" :electDataList="electDataList" />
    <ReactiveElectTrendChartView @exportExcel="exportExcel" :electDataList="electDataList" />
    <ApparentElectTrendChartView @exportExcel="exportExcel" :electDataList="electDataList" />
  </div>
</template>

<script>
  import useQualityMixin from '../mixins/useQualityMixin'
  import { elecPowerTrend, xLRExportStatisticsMeter } from '@/api/console/elecQuality'
  import ActiveElectTrendChartView from './electTrendChart/ActiveElectTrendChartView.vue'
  import ReactiveElectTrendChartView from './electTrendChart/ReactiveElectTrendChartView.vue'
  import ApparentElectTrendChartView from './electTrendChart/ApparentElectTrendChartView.vue'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash'
  export default {
    mixins: [useQualityMixin],
    components: { ActiveElectTrendChartView, ReactiveElectTrendChartView, ApparentElectTrendChartView },
    data() {
      return {
        electDataList: [],
        ableMapLable: {
          meterPE: this.$t('phaseCoincidenceCombinedActiveEnergy'),
          meterPEp: this.$t('positiveActiveElectricalEnergyCombinedPhase'),
          meterPEn: this.$t('reverseActiveElectricalEnergyCombinedPhase'),
          meterQE1: this.$t('combinedReactivePowerOneElectricalEnergy'),
          meterQE2: this.$t('combinedReactivePowerTwoElectricalEnergy'),
          meterQEq1: this.$t('phaseFirstQuadrantReactiveEnergy'),
          meterQEq2: this.$t('phaseSecondQuadrantReactiveEnergy'),
          meterQEq3: this.$t('phaseThirdQuadrantReactiveEnergy'),
          meterQEq4: this.$t('phaseFourthQuadrantReactiveEnergy'),
          meterSEp: this.$t('meterSEp'),
          meterSEn: this.$t('meterSEn'),
          meterPAE: this.$t('meterPAE'),
          meterPAEp: this.$t('meterPAEp'),
          meterPAEn: this.$t('meterPAEn'),
          meterQAE1: this.$t('meterQAE1'),
          meterQAE2: this.$t('meterQAE2'),
          meterQAEq1: this.$t('meterQAEq1'),
          meterQAEq2: this.$t('meterQAEq2'),
          meterQAEq3: this.$t('meterQAEq3'),
          meterQAEq4: this.$t('meterQAEq4'),
          meterSAEp: this.$t('meterSAEp'),
          meterSAEn: this.$t('meterSAEn'),
          meterPBE: this.$t('meterPBE'),
          meterPBEp: this.$t('meterPBEp'),
          meterPBEn: this.$t('meterPBEn'),
          meterQBE1: this.$t('meterQBE1'),
          meterQBE2: this.$t('meterQBE2'),
          meterQBEq1: this.$t('meterQBEq1'),
          meterQBEq2: this.$t('meterQBEq2'),
          meterQBEq3: this.$t('meterQBEq3'),
          meterQBEq4: this.$t('meterQBEq4'),
          meterSBEp: this.$t('meterSBEp'),
          meterSBEn: this.$t('meterSBEn'),
          meterPCE: this.$t('meterPCE'),
          meterPCEp: this.$t('meterPCEp'),
          meterPCEn: this.$t('meterPCEn'),
          meterQCE1: this.$t('meterQCE1'),
          meterQCE2: this.$t('meterQCE2'),
          meterQCEq1: this.$t('meterQCEq1'),
          meterQCEq2: this.$t('meterQCEq2'),
          meterQCEq3: this.$t('meterQCEq3'),
          meterQCEq4: this.$t('meterQCEq4'),
          meterSCEp: this.$t('meterSCEp'),
          meterSCEn: this.$t('meterSCEn'),
        },
        queryResultParams: {},
      }
    },
    methods: {
      async init() {
        const params = {
          ...this.addrParams,
          startTime: dayjs(this.dateValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(this.dateValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
        const res = await elecPowerTrend(params)
        if (res.success) {
          this.queryResultParams = cloneDeep(params)
          this.electDataList = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      // 导出
      async exportExcel(meterType) {
        let fileName = meterType === 1 ? this.$t('powerElectricalEnergy') : meterType === 2 ? this.$t('reactiveEnergyPower') : this.$t('apparentElectricalPower')
        if (this.electDataList.length === 0) return this.$Message.error(this.$t('currentlyNoDataCheckFirst'))
        const res = await xLRExportStatisticsMeter({ meterType, statisticsMeter: cloneDeep(this.electDataList).reverse() })
        this.getPostResFile(res, fileName)
      },
    },
    mounted() {
      this.init()
    },
    watch: {
      dateValue: {
        handler() {
          this.changeQueryParams()
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less">
  .device-wrap-electTrend {
    .ivu-table td {
      height: 36px;
    }
    .ivu-table-cell {
      padding-left: 0;
      padding-right: 0;
    }
    tr.ivu-table-row.row-first td {
      border-top: 1px solid #a8a8ba;
    }
    tr.ivu-table-row.row-odd td {
      // background: #fff;
    }
    tr.ivu-table-row td.column-time {
      background: #28313f;
      border-top: 1px solid #a8a8ba;
    }
    tr.ivu-table-row.row-even td {
      background: #28313f;
    }
  }
</style>
