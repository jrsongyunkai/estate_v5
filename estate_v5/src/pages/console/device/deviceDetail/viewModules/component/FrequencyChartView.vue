<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('Frequency') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup class="ml-5" v-model="frequencySetting.model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" ghost v-if="frequencySetting.model === 'table'" class="ml-5" @click.stop="exportExcel">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <QualityChart v-if="frequencySetting.model === 'echart'" :options="frequencyData"></QualityChart>
      <div v-else>
        <Table border class="device-wrap" :data="tableData" :columns="frequencyColumnsList" style="width: 100%"></Table>
        <div style="margin-top: 10px"><Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
      </div>
    </div>
  </div>
</template>

<script>
  import QualityChart from '../common/QualityChart.vue'
  import useQualityMixin from '../mixins/useQualityMixin'
  import { freqTrend, xLRExportStatisticsFreq } from '@/api/console/elecQuality'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash'
  export default {
    components: { QualityChart },
    mixins: [useQualityMixin],
    data() {
      return {
        frequencySetting: { model: 'echart' },
        frequencyColumnsList: [
          { title: this.$t('collectionTime'), key: 'createTime', align: 'center' },
          { title: 'Fr（Hz）', key: 'freq', align: 'center' },
        ],
        frequencyDataList: [],
        queryResultParams: null,
      }
    },
    computed: {
      frequencyData() {
        return {
          type: 'line',
          yAxisName: this.$t('unitPercentage'),
          xAxisData: this.frequencyDataList.map(it => it.createTime),
          unit: 'Hz',
          series: [{ type: 'line', name: 'Fr', color: '#2180db', showSymbol: false, data: this.frequencyDataList.map(it => [it.createTime, +it.freq]), markPoint: this.markPoint }],
        }
      },
      total() {
        return this.frequencyDataList.length
      },
      tableData() {
        const frequencyDataList = cloneDeep(this.frequencyDataList)
        return frequencyDataList.reverse().slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
      },
    },
    methods: {
      async init() {
        const params = {
          ...this.addrParams,
          startTime: dayjs(this.dateValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(this.dateValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
        const res = await freqTrend(params)
        if (res.success) {
          this.pageNo = 1
          this.queryResultParams = cloneDeep(params)
          this.frequencyDataList = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      async exportExcel() {
        if (this.frequencyDataList.length === 0) return this.$Message.error(this.$t('currentlyNoDataCheckFirst'))
        const res = await xLRExportStatisticsFreq({ statisticsFreq: cloneDeep(this.frequencyDataList).reverse() })
        this.getPostResFile(res, this.$t('frequency'))
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
