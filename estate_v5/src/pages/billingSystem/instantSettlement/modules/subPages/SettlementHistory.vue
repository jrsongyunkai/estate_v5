<template>
  <div class="config">
    <BackTopTitle :title="$t('settlementHistory')" @close="$emit('close')"></BackTopTitle>
    <div class="config-view">
      <div class="search bgColor">
        <div class="left">
          <MKindDatePick v-model="timeValue" :typeRange="[$t('year'), $t('month'), $t('day')]" />
          <Button class="b-blue ml-10" @click.stop="searchPage">{{ $t('query') }}</Button>
          <Button class="b-info ml-10" @click.stop="resetDate">{{ $t('reset') }}</Button>
        </div>
      </div>
      <div class="trend-chart bgColor" ref="trendChart" v-resize="changeSize"></div>
      <div class="trend bgColor" style="margin-top: 10px">
        <div class="header">{{ $t('settlementList') }}</div>
        <div class="search-list">
          <Select v-model="searchData.orderStatus" v-width="140" :transfer="true" :placeholder="$t('orderState')">
            <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <Input v-width="200" v-model="searchData.orderNo" class="ml-10" :placeholder="$t('pleaseEnterOrderNo')" />
          <Input v-width="200" v-model="searchData.accountName" class="ml-10" :placeholder="$t('pleaseEnterAccountName')" />
          <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
          <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
          <Button class="b-blue ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
        </div>
        <div class="table" style="margin-top: 10px">
          <ConsumeTable :list="tableData.list" isObject :sumData="sumData" @refresh="search" />
          <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import * as echarts from 'echarts5'
  import tableMixins from '../mixins/tableMixins'
  import ConsumeTable from '../components/ConsumeTable.vue'
  import { queryConsumption, exportConsumption, realTimeSettlementChart } from '@/api/billingSystem/instantSettlement'
  import { cloneDeep } from 'lodash'
  import { MONTHS } from '@/untils/configuration'
  export default {
    props: {
      record: { type: Object, default: () => {} },
    },
    mixins: [noMarginTop, tableMixins],
    components: { BackTopTitle, ConsumeTable },
    data() {
      return {
        timeValue: {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM'),
          dateValueText: this.$Date().format('YYYY-MM'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        },
        statusOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('inProgress'), value: '1' },
          { label: this.$t('completed'), value: '2' },
          { label: this.$t('toBePaid'), value: '3' },
          { label: this.$t('billingSuspended'), value: '4' },
        ],
        searchData: { orderNo: '', accountName: '', orderStatus: '' },
        trendChart: null,
        handSeriesData: {
          date: index => this.$t('periodOfTime', { num: index.toString().padStart(2, '0') }),
          year: index => MONTHS[index],
          month: index => this.$t('numberThValue', { num: (index + 1).toString() }),
        },
        sumData: {},
      }
    },
    computed: {
      queryParams() {
        return {
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          ...this.searchData,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          targetValue: `${this.record.resId}:${this.record.addr}`,
        }
      },
    },
    methods: {
      searchPage() {
        this.searchOverView()
        this.changePageNo(1)
      },
      async searchOverView() {
        const res = await realTimeSettlementChart({
          projectCode: this.$store.state.projectCode,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          timeType: this.timeValue.timeType,
          targetValue: `${this.record.resId}:${this.record.addr}`,
        })
        if (res.success) {
          let { levelRange, dateValueText } = this.timeValue
          let title = this.$t('settlementHistoryChartTitle', { date: dateValueText })
          let xAxisData = res.data.map(it => this.handSeriesData[levelRange](it.index))
          let seriesData = [
            {
              name: levelRange === 'month' ? this.$t('dailySettlementAmount') : levelRange === 'year' ? this.$t('monthlySettlementAmount') : this.$t('hourlySettlementAmount'),
              type: 'bar',
              color: '#6db626',
              tooltip: { valueFormatter: value => this.$t('moneyWithUnit', { num: value }) },
              data: res.data.map(it => +it.amount),
            },
          ]
          let yAxisData = [{ type: 'value', name: this.$t('settlementAmountWithUnit'), nameTextStyle: { fontSize: 12, color: '#fff', align: 'center' }, splitLine: { show: levelRange !== 'month', lineStyle: { type: 'dashed' } }, axisLabel: { color: '#fff' } }]
          if (levelRange === 'month') {
            yAxisData.push({ type: 'value', name: `${this.$t('dailyAverageUtilizationRate')}(%)`, max: 100, min: 0, nameTextStyle: { fontSize: 12, color: '#fff', align: 'center' }, splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { color: '#fff' } })
            seriesData.push({ name: this.$t('dailyAverageUtilizationRate'), type: 'line', color: '#0da8ed', yAxisIndex: 1, tooltip: { valueFormatter: value => value + '%' }, data: res.data.map(it => +it.usePercent) })
          }
          this.drawTrendChart(xAxisData, yAxisData, seriesData, title)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async exportExcel() {
        const res = await exportConsumption({ ...this.resultQueryParams, pageSize: 9999999, pageNo: 1 })
        this.$func.getPostResFile(res, this.$t('settlementList'))
      },
      async search() {
        const res = await queryConsumption({ ...this.queryParams })
        if (res.success) {
          this.resultQueryParams = cloneDeep(this.queryParams)
          this.tableData.list = []
          if (res.datas) {
            res.datas.forEach(item => {
              if (item.periodList && item.periodList.length) {
                this.tableData.list.push(...item.periodList.map(it => ({ ...item, ...it })))
              } else {
                this.tableData.list.push(item)
              }
            })
          }
          this.sumData = res.sumData
          this.tableData.total = res.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      resetDate() {
        this.timeValue = {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM'),
          dateValueText: this.$Date().format('YYYY-MM'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        }
        this.searchPage()
      },
      secondsToHms(seconds) {
        let h = Math.floor(seconds / 3600)
        let m = Math.floor((seconds % 3600) / 60)
        let s = Math.floor((seconds % 3600) % 60)
        return this.$t('timeLongValue', { hours: h, minute: m, seconds: s })
      },
      reset() {
        this.searchData = { orderNo: '', accountName: '', orderStatus: '' }
        this.changePageNo(1)
      },
      drawTrendChart(xAxisData, yAxisData, seriesData, title = 'Monthly data trend of objects') {
        let option = {
          title: { text: title, textStyle: { color: '#fff', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14 }, top: 15, left: 15 },
          grid: { left: 80, top: 80, bottom: 40, right: 70 },
          tooltip: { trigger: 'axis', axisPointer: { type: 'cross', crossStyle: { color: '#999' } } },
          legend: { textStyle: { color: '#fff' }, top: 15, right: 15 },
          xAxis: [{ type: 'category', data: xAxisData, axisTick: { lineStyle: { color: '#fff' }, alignWithLabel: true }, axisPointer: { type: 'shadow' }, axisLabel: { color: '#fff' } }],
          yAxis: yAxisData,
          series: seriesData,
        }
        this.trendChart && this.trendChart.clear()
        this.trendChart && this.trendChart.setOption(option)
      },
      changeSize() {
        this.trendChart && this.trendChart.resize()
      },
    },
    mounted() {
      this.trendChart = echarts.init(this.$refs.trendChart)
      this.searchPage()
    },
    beforeDestroy() {
      this.trendChart && this.trendChart.dispose()
      this.trendChart = null
    },
  }
</script>
<style lang="less" scoped>
  .config {
    .config-view {
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      padding: 0 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
      .search {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        border-radius: 4px;
        .left {
          display: flex;
        }
      }
      .trend-chart {
        height: 300px;
        width: 100%;
      }
      .trend {
        padding: 15px;
        .header {
          font-size: 14px;
          margin-bottom: 10px;
        }
        .search-list {
          display: flex;
        }
      }
    }
    .bgColor {
      background: var(--card-bg-color);
    }
  }
</style>
