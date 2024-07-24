<template>
  <div class="mo-item">
    <div class="header">
      <div class="left-title">
        <div class="bor"></div>
        <div>{{ $t('threePhaseImBalance') }}</div>
      </div>
      <div class="right-box">
        <RadioGroup class="ml-5" v-model="model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
        <Button type="primary" ghost v-if="model === 'table'" class="ml-5" @click.stop="exportExcel">{{ $t('export') }}</Button>
      </div>
    </div>
    <div class="content">
      <QualityChart v-if="model === 'echart'" :options="threePhaseUnbalanceChartData"></QualityChart>
      <div v-else style="padding-top: 20px">
        <Table class="device-wrap" border :data="tableDataList" :columns="columnsList" style="width: 100%">
          <template #valueSlot="{ row, column }">{{ row[column.key] }}%</template>
        </Table>
        <div style="margin-top: 10px"><Page @on-change="handleCurrentChange" :current="pageNo" :page-size="pageSize" :total="total"></Page></div>
      </div>
    </div>
  </div>
</template>

<script>
  import QualityChart from '../common/QualityChart.vue'
  import useQualityMixin from '../mixins/useQualityMixin'
  import { thirdPhaseInBalanceTrend, xLRExportStatisticsBal } from '@/api/console/elecQuality'
  import dayjs from 'dayjs'
  import { cloneDeep } from 'lodash'
  export default {
    components: { QualityChart },
    data() {
      return {
        model: 'echart',
        tableData: [],
        queryResultParams: {},
      }
    },
    mixins: [useQualityMixin],
    computed: {
      threePhaseUnbalanceChartData() {
        return {
          type: 'line',
          yAxisName: this.$t('unitPercentage'),
          xAxisData: this.tableData.map(it => it.createTime),
          unit: '%',
          series: [
            { type: 'line', name: this.$t('unbalancedThreePhaseCurrent'), color: '#2180db', showSymbol: false, data: this.tableData.map(it => [it.createTime, it.balanceI]), markPoint: this.markPoint },
            { type: 'line', name: this.$t('threePhaseVoltageImbalance'), color: '#e8a835', showSymbol: false, data: this.tableData.map(it => [it.createTime, it.balanceU]), markPoint: this.markPoint },
          ],
        }
      },
      columnsList() {
        return [
          { title: this.$t('collectionTime'), key: 'createTime', align: 'center' },
          { title: this.$t('unbalancedThreePhaseCurrent'), key: 'balanceI', slot: 'valueSlot', align: 'center' },
          { title: this.$t('threePhaseVoltageImbalance'), key: 'balanceU', slot: 'valueSlot', align: 'center' },
        ]
      },
      total() {
        return this.tableData.length
      },
      tableDataList() {
        const tableData = cloneDeep(this.tableData)
        return tableData.reverse().slice((this.pageNo - 1) * this.pageSize, this.pageNo * this.pageSize)
      },
    },
    methods: {
      async init() {
        const params = {
          ...this.addrParams,
          startTime: dayjs(this.dateValue).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
          endTime: dayjs(this.dateValue).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
        }
        const res = await thirdPhaseInBalanceTrend(params)
        if (res.success) {
          this.pageNo = 1
          this.queryResultParams = cloneDeep(params)
          this.tableData = res.data
        } else {
          this.$Message.error(res.message)
        }
      },
      async exportExcel() {
        if (this.tableData.length === 0) return this.$Message.error(this.$t('currentlyNoDataCheckFirst'))
        const res = await xLRExportStatisticsBal({ statisticsBal: cloneDeep(this.tableData).reverse() })
        this.getPostResFile(res, this.$t('threePhaseImBalance'))
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
