<template>
  <div class="consume-record-view">
    <div class="search-view">
      <MKindDatePick v-model="timeValue" :typeRange="[$t('year'), $t('month'), $t('day')]" />
      <Button class="b-blue ml-10" @click.stop="searchOverview">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click.stop="resetDate">{{ $t('reset') }}</Button>
    </div>
    <Row class="top-col" :wrap="false" :gutter="10">
      <Col :span="6" v-for="item in overViewList" :key="item.label" class="item">
        <div class="card-content">
          <div class="lf-pic"><img :src="item.image" alt="" /></div>
          <div class="rg-info">
            <div class="info-content">
              <div class="label" v-textRoll>{{ item.label }}</div>
              <div class="value">
                {{ item.prefix || '' }}
                <MCountUp :end="item.value" :decimals="item.decimals || 0" />
              </div>
              <div class="trend" v-if="item.hasYq">
                <MTrend type="yoy" :value="item.yoy" />
                <MTrend type="qoq" style="margin-left: 5px" :value="item.qoq" />
              </div>
            </div>
          </div>
        </div>
      </Col>
    </Row>
    <div class="chart-view">
      <div class="trend" ref="trendRef" v-resize="changeSize"></div>
      <div class="rank">
        <div class="header">
          <div>{{ $t('rankingList') }}</div>
          <div v-if="queryTimeValue.levelRange === 'month'">
            <RadioGroup v-model="tableRankType" type="button" @on-change="changeRankType">
              <Radio label="value">{{ $t('settlementAmount') }}</Radio>
              <Radio label="rate">{{ $t('dailyAverageUtilizationRate') }}</Radio>
            </RadioGroup>
          </div>
        </div>
        <div style="margin-top: 10px">
          <Table :columns="columnsRank" maxHeight="330" :data="tableDataRank">
            <template #Rank="{ row }">{{ row._index + 1 }}</template>
            <template #deviceAddr="{ row }">
              <div>{{ `${row.targetName1}` }}/</div>
              <div>{{ `${row.targetName2}` }}</div>
            </template>
            <template #usePercent="{ row }">{{ `${row.usePercent}%` }}</template>
          </Table>
        </div>
      </div>
    </div>
    <div class="table-view">
      <div class="header">{{ $t('consumptionRecords') }}</div>
      <div class="search-box">
        <LineCascader v-model="searchData.macAddr" />
        <Select class="ml-10" v-model="searchData.orderStatus" v-width="140" :transfer="true" :placeholder="$t('orderState')">
          <Option v-for="item in statusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Input v-model="searchData.orderNo" class="ml-10" :placeholder="$t('pleaseEnterOrderNo')" v-width="200" />
        <Input v-model="searchData.accountName" class="ml-10" :placeholder="$t('pleaseEnterAccountName')" v-width="200" />
        <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
        <Button class="b-blue ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
      </div>
      <div class="table">
        <ConsumeTable :list="tableData.list" :sumData="sumData" @refresh="search"></ConsumeTable>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import LineCascader from '@/pages/billingSystem/component/LineCascader.vue'
  import ConsumeTable from './components/ConsumeTable.vue'
  import * as echarts from 'echarts5'
  import { queryConsumption, exportConsumption, consumptionOverview, consumptionChart, consumptionRank } from '@/api/billingSystem/instantSettlement'
  import tableMixins from './mixins/tableMixins'
  import { cloneDeep } from 'lodash'
  import { MONTHS } from '@/untils/configuration'
  export default {
    components: { LineCascader, ConsumeTable },
    mixins: [tableMixins],
    data() {
      return {
        searchData: { macAddr: [], orderNo: '', accountName: '', orderStatus: '' },
        statusOptions: [
          { label: this.$t('whole'), value: '' },
          { label: this.$t('inProgress'), value: '1' },
          { label: this.$t('completed'), value: '2' },
          { label: this.$t('toBePaid'), value: '3' },
          { label: this.$t('billingSuspended'), value: '4' },
        ],
        tableRankType: 'value',
        tableDataRank: [],
        trendChart: null,
        queryTimeValue: { levelRange: 'month' },
        overViewInfo: null,
        handSeriesData: {
          date: index => this.$t('periodOfTime', { num: index.toString().padStart(2, '0') }),
          year: index => MONTHS[index],
          month: index => this.$t('numberThValue', { num: (index + 1).toString() }),
        },
        sumData: {},
      }
    },
    computed: {
      columnsRank() {
        return this.tableRankType === 'value'
          ? [
              { title: this.$t('ranking'), minWidth: 90, slot: 'Rank' },
              { title: this.$t('objectInformation'), minWidth: 150, slot: 'deviceAddr' },
              { title: this.$t('settlementAmount'), key: 'amount', minWidth: 100 },
            ]
          : [
              { title: this.$t('ranking'), minWidth: 90, slot: 'Rank' },
              { title: this.$t('objectInformation'), minWidth: 130, slot: 'deviceAddr' },
              { title: this.$t('dailyAverageUtilizationRate'), key: 'usePercent', slot: 'usePercent', minWidth: 140 },
            ]
      },
      queryParams() {
        return {
          projectCode: this.$store.state.projectCode,
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          orderNo: this.searchData.orderNo,
          accountName: this.searchData.accountName,
          targetValue: this.searchData.macAddr.join(':'),
          orderStatus: this.searchData.orderStatus,
        }
      },
      overViewList() {
        let { totalAmount, avgAmount, totalTime, avgTime } = this.overViewInfo || { totalAmount: null, avgAmount: null, totalTime: null, avgTime: null }
        return [
          { label: this.$t('totalSettlementAmountPeriod'), value: 0, prefix: '¥', decimals: 2, image: '/static/img/instantSettlement/ddzl.png', hasYq: true, yoy: 0, qoq: 0, ...totalAmount },
          { label: this.$t('averageSettlementAmountPeriod'), value: 0, prefix: '¥', decimals: 2, image: '/static/img/instantSettlement/ddpjje.png', ...avgAmount },
          { label: this.$t('totalDurationPeriod'), value: 0, decimals: 2, image: '/static/img/instantSettlement/trendUp.png', hasYq: true, yoy: 0, qoq: 0, ...totalTime },
          { label: this.$t('averageDurationperiodObject'), value: 0, decimals: 2, image: '/static/img/instantSettlement/load.png', ...avgTime },
        ]
      },
    },
    methods: {
      resetDate() {
        this.timeValue = cloneDeep(this.initTimeValue)
        this.searchOverview()
      },
      searchOverview() {
        this.tableRankType = 'value'
        this.consumptionOverview()
        this.consumptionChart()
        this.consumptionRank()
        this.changePageNo(1)
      },
      async consumptionChart() {
        const res = await consumptionChart({
          projectCode: this.$store.state.projectCode,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          timeType: this.timeValue.timeType,
        })
        if (res.success) {
          let { levelRange } = this.timeValue
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
          let yAxisData = [
            {
              type: 'value',
              name: this.$t('settlementAmountWithUnit'),
              nameTextStyle: { fontSize: 12, color: '#fff', align: 'center' },
              splitLine: { show: levelRange !== 'month', lineStyle: { type: 'dashed' } },
              axisLabel: { color: '#fff' },
            },
          ]
          if (levelRange === 'month') {
            yAxisData.push({
              type: 'value',
              name: `${this.$t('dailyAverageUtilizationRate')}(%)`,
              max: 100,
              min: 0,
              nameTextStyle: { fontSize: 12, color: '#fff', align: 'center' },
              splitLine: { show: true, lineStyle: { type: 'dashed' } },
              axisLabel: { color: '#fff' },
            })
            seriesData.push({ name: this.$t('dailyAverageUtilizationRate'), type: 'line', color: '#0da8ed', yAxisIndex: 1, tooltip: { valueFormatter: value => value + '%' }, data: res.data.map(it => +it.usePercent) })
          }
          this.drawTrendChart(xAxisData, yAxisData, seriesData)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async consumptionOverview() {
        const res = await consumptionOverview({
          projectCode: this.$store.state.projectCode,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          timeType: this.timeValue.timeType,
        })
        if (res.success) {
          this.overViewInfo = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async consumptionRank(rankType = 2) {
        const res = await consumptionRank({
          projectCode: this.$store.state.projectCode,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          timeType: this.timeValue.timeType,
          rankType,
        })
        if (res.success) {
          this.queryTimeValue = cloneDeep(this.timeValue)
          this.tableDataRank = res.data || []
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      reset() {
        this.searchData = { macAddr: [], orderNo: '', accountName: '', orderStatus: '' }
        this.changePageNo(1)
      },
      async exportExcel() {
        const res = await exportConsumption({ ...this.resultQueryParams, pageSize: 9999999, pageNo: 1 })
        this.$func.getPostResFile(res, this.$t('consumptionRecords'))
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
      changeSize() {
        this.trendChart && this.trendChart.resize()
      },
      drawTrendChart(xAxisData, yAxisData, seriesData) {
        let option = {
          title: { text: this.$t('trendOfOverallProject'), textStyle: { color: '#fff', fontStyle: 'normal', fontWeight: 'normal', fontSize: 14 }, top: 15, left: 15 },
          grid: { left: 30, top: '20%', bottom: 40, right: yAxisData.length > 1 ? 40 : 15, containLabel: true },
          tooltip: { trigger: 'axis', textStyle: { color: '#fff' }, backgroundColor: 'rgba(0,0,0,0.8)', borderWidth: 0, axisPointer: { type: 'cross', crossStyle: { color: '#999' } } },
          legend: { textStyle: { color: '#fff' }, top: 15, right: 10 },
          xAxis: [{ type: 'category', data: xAxisData, axisTick: { lineStyle: { color: '#fff' }, alignWithLabel: true }, axisPointer: { type: 'shadow' }, axisLabel: { color: '#fff' } }],
          yAxis: [...yAxisData],
          series: [...seriesData],
        }
        this.trendChart && this.trendChart.clear()
        this.trendChart && this.trendChart.setOption(option)
      },
      changeRankType(e) {
        this.consumptionRank(e === 'rate' ? 1 : 2)
      },
    },
    mounted() {
      this.trendChart = echarts.init(this.$refs.trendRef)
      this.changePageNo(1)
      this.searchOverview()
    },
    beforeDestroy() {
      this.trendChart && this.trendChart.dispose()
      this.trendChart = null
    },
  }
</script>

<style lang="less" scoped>
  .consume-record-view {
    height: calc(~'100vh - 201px');
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .search-view {
      display: flex;
      padding: 10px;
      background: var(--card-bg-color);
    }
    .top-col {
      padding: 0px;
      overflow: auto;
      margin-top: 10px;
      .item {
        min-width: 260px;
        .card-content {
          padding: 10px;
          background: var(--card-bg-color);
          display: flex;
          .lf-pic {
            width: 70px;
            height: 70px;
            margin-right: 5px;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .rg-info {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: start;
            overflow: hidden;
            height: 70px;
            .info-content {
              width: 100%;
              overflow: hidden;
              .label {
                font-size: 12px;
                width: 100%;
              }
              .value {
                font-size: 14px;
                line-height: 30px;
              }
              .trend {
                font-size: 12px;
                display: flex;
              }
            }
          }
        }
      }
    }
    .chart-view {
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      .trend {
        width: calc(~'100% - 410px');
        background: var(--card-bg-color);
      }
      .rank {
        background: var(--card-bg-color);
        width: 400px;
        height: 400px;
        padding: 10px;
        .header {
          font-size: 14px;
          display: flex;
          height: 40px;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .table-view {
      margin-top: 10px;
      background: var(--card-bg-color);
      padding: 10px;
      .search-box {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
      }
      .text-center {
        text-align: center;
      }
    }
  }
</style>
