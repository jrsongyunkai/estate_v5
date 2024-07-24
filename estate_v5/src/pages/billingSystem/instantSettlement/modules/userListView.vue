<template>
  <div class="userList-page">
    <Row class="top-col" :wrap="false" :gutter="5">
      <Col :span="4" v-for="item in overviewList" :key="item.label" class="item">
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
    <div class="chart-col">
      <div class="left">
        <div class="header">{{ $t('activeUserDistributionTable') }}</div>
        <div class="echart-content">
          <div class="pie" ref="pieRef"></div>
        </div>
      </div>
      <div class="right">
        <div class="header">{{ $t('thisMonthDataTrend') }}</div>
        <div class="line" ref="barRef" v-resize="changeSize"></div>
      </div>
    </div>
    <div class="table-col">
      <div class="header">{{ $t('userList') }}</div>
      <div class="search-box">
        <Input v-model="keyword" :placeholder="$t('enterUserInformation')" v-width="250" />
        <Select class="ml-10" v-model="userType" v-width="200" :transfer="true" :placeholder="$t('accountStatus')">
          <Option v-for="item in accountStatusOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button class="b-blue ml-10" @click.stop="changePageNo(1)">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
        <Button class="b-blue ml-10" @click.stop="exportExcel">{{ $t('export') }}</Button>
      </div>
      <div>
        <Table :columns="columns" :data="tableData.list" style="margin-top: 10px">
          <template #currentAmount="{ row }">
            <span :class="{ textError: row.currentAmount < 0 }">{{ row.currentAmount }}</span>
          </template>
          <template #userType="{ row }">
            {{ row.userType === 1 ? $t('na_instantSettlementUserType.label1') : row.userType === 2 ? $t('na_instantSettlementUserType.label2') : row.userType === 0 ? $t('na_instantSettlementUserType.label3') : row.userType === -1 ? $t('na_instantSettlementUserType.label4') : $t('unknown2') }}
          </template>
          <template #action="{ row }">
            <Button type="text" size="small" :disabled="[-1, 0].includes(row.userType)" class="text-btn-primary" @click.stop="openModal('offLineRechargeModal', row, search)">{{ $t('offlineRecharge') }}</Button>
            <Button type="text" size="small" :disabled="[-1, 0].includes(row.userType)" class="text-btn-primary" @click.stop="openModal('offLineRefundModal', row, search)">{{ $t('offlineRefund') }}</Button>
            <Button type="text" size="small" :disabled="[-1, 0].includes(row.userType)" class="text-btn-primary" @click.stop="openModal('giftDiscountsModal', row, search)">{{ $t('giftsOrDiscounts') }}</Button>
            <Button type="text" size="small" :disabled="row.userType === 0" class="text-btn-primary" @click.stop="openSubPage('FlowRecordView', row)">{{ $t('flowRecord') }}</Button>
          </template>
        </Table>
        <Page :page-size="tableData.pageSize" :page-size-opts="[10, 20, 50, 100, 200]" transfer @on-page-size-change="changePageSize" @on-change="changePageNo" :current="tableData.pageNo" :total="tableData.total" show-total show-sizer></Page>
      </div>
    </div>
  </div>
</template>

<script>
  import { userOverview, queryUserPage, userChart, exportUser } from '@/api/billingSystem/instantSettlement'
  import * as echarts from 'echarts5'
  import tableMixins from './mixins/tableMixins'
  import { cloneDeep } from 'lodash'
  export default {
    inject: ['openSubPage', 'openModal'],
    mixins: [tableMixins],
    data() {
      return {
        keyword: '',
        userType: null,
        columns: [
          { title: this.$t('userInformation'), key: 'username', minWidth: 200 },
          { title: this.$t('accountStatus'), key: 'userType', slot: 'userType', minWidth: 150 },
          { title: this.$t('lastActiveTime'), key: 'lastOrderTime', minWidth: 180 },
          { title: this.$t('accountBalanceWithUnit'), key: 'currentAmount', slot: 'currentAmount', minWidth: 180 },
          { title: this.$t('totalConsumptionAmount'), key: 'totalPayAmount', minWidth: 180 },
          { title: this.$t('totalNumberOfOrders'), key: 'totalOrder', minWidth: 140 },
          { title: `${this.$t('totalPowerOfUser')}(kW·h)`, key: 'totalPower', minWidth: 180 },
          { title: this.$t('averageAmountOfOrdersWithUnit'), key: 'avgOrderAmount', minWidth: 200 },
          { title: `${this.$t('averageElectricityOfOrders')}(kW·h)`, key: 'avgOrderPower', minWidth: 200 },
          { title: this.$t('operation'), slot: 'action', fixed: 'right', align: 'center', width: 340 },
        ],
        accountStatusOptions: [
          { label: this.$t('allUsers'), value: null },
          { label: this.$t('na_instantSettlementUserType.label3'), value: 0 },
          { label: this.$t('na_instantSettlementUserType.label2'), value: 2 },
          { label: this.$t('na_instantSettlementUserType.label1'), value: 1 },
          { label: this.$t('na_instantSettlementUserType.label4'), value: -1 },
        ],
        pieChart: null,
        barChart: null,
        selectedPieIndexList: [],
        overviewInfo: null,
      }
    },
    computed: {
      queryParams() {
        return {
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          keyword: this.keyword,
          userType: this.userType,
          projectCode: this.$store.state.projectCode,
        }
      },
      overviewList() {
        let { totalUser, monthlyTotalOrder, monthlyTotalAmount, monthlyAvgUserOrder, monthlyAvgUserAmount, monthlyAvgOrderAmount } = this.overviewInfo || { totalUser: null, monthlyTotalOrder: null, monthlyTotalAmount: null, monthlyAvgUserOrder: null, monthlyAvgUserAmount: null }
        return [
          { label: this.$t('totalUsers'), value: 0, image: '/static/img/instantSettlement/userTotal.png', ...totalUser },
          { label: this.$t('na_instantSettlementUserOverView.series1'), value: 0, yoy: 0, qoq: 0, image: '/static/img/instantSettlement/qbdd.png', hasYq: true, ...monthlyTotalOrder },
          { label: this.$t('na_instantSettlementUserOverView.series2'), prefix: '¥', value: 0, yoy: 0, qoq: 0, decimals: 2, image: '/static/img/instantSettlement/ddzl.png', hasYq: true, ...monthlyTotalAmount },
          { label: this.$t('na_instantSettlementUserOverView.series3'), value: 0, decimals: 1, image: '/static/img/instantSettlement/yhpjdd.png', ...monthlyAvgUserOrder },
          { label: this.$t('na_instantSettlementUserOverView.series4'), prefix: '¥', value: 0, decimals: 2, image: '/static/img/instantSettlement/yhpjje.png', ...monthlyAvgUserAmount },
          { label: this.$t('na_instantSettlementUserOverView.series5'), prefix: '¥', value: 0, decimals: 2, image: '/static/img/instantSettlement/ddpjje.png', ...monthlyAvgOrderAmount },
        ]
      },
      seriesData() {
        let { userDistribution } = this.overviewInfo || { userDistribution: null }
        return [
          { name: this.$t('na_instantSettlementUserChart.series1'), value: (userDistribution && userDistribution.currentMonth) || 0 },
          { name: this.$t('na_instantSettlementUserChart.series2'), value: (userDistribution && userDistribution.last3Month) || 0 },
          { name: this.$t('na_instantSettlementUserChart.series3'), value: (userDistribution && userDistribution.last6Month) || 0 },
          { name: this.$t('na_instantSettlementUserChart.series4'), value: (userDistribution && userDistribution.currentYear) || 0 },
          { name: this.$t('na_instantSettlementUserChart.series5'), value: (userDistribution && userDistribution.other) || 0 },
        ]
      },
    },
    methods: {
      async queryUserOverview() {
        const res = await userOverview({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.overviewInfo = res.data
          this.$nextTick(() => {
            this.drawPieChart()
          })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getUserChart() {
        const res = await userChart({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          let xAxisData = []
          let daysAmount = []
          let daysOrder = []
          if (Array.isArray(res.data) && res.data.length) {
            res.data.forEach(item => {
              xAxisData.push(this.$t('numberThValue', { num: item.index + 1 }))
              daysAmount.push(item.amount)
              daysOrder.push(item.order)
            })
          }
          this.drawBarChart(xAxisData, daysAmount, daysOrder)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async exportExcel() {
        const res = await exportUser({ ...this.resultQueryParams, pageSize: 9999999, pageNo: 1 })
        this.$func.getPostResFile(res, this.$t('userList'))
      },
      reset() {
        this.keyword = ''
        this.userType = null
        this.changePageNo(1)
      },
      async search() {
        const res = await queryUserPage(this.queryParams)
        if (res.success) {
          this.resultQueryParams = cloneDeep(this.queryParams)
          this.tableData.list = res.datas || []
          this.tableData.total = res.total || 0
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      drawPieChart() {
        let option = {
          tooltip: {
            show: true,
            confine: true,
            textStyle: { color: '#fff' },
            backgroundColor: 'rgba(0,0,0,0.9)',
            borderWidth: 0,
            formatter: params => {
              let { marker, name, value, percent } = params
              return `${marker} ${name}: &nbsp${value} &nbsp&nbsp ${percent}%`
            },
          },
          legend: { show: true, type: 'scroll', orient: 'vertical', right: 10, top: 'middle', icon: 'circle', textStyle: { color: '#fff' } },
          series: [
            {
              type: 'pie',
              label: { show: false },
              center: ['35%', '50%'],
              radius: ['55%', '80%'],
              emphasis: { scaleSize: 1.5, itemStyle: { borderWidth: 0 } },
              itemStyle: { borderRadius: 0, borderWidth: 0, borderColor: '#fff' },
              data: [...this.seriesData.sort((a, b) => b.value - a.value)],
            },
          ],
        }
        this.pieChart && this.pieChart.clear()
        this.pieChart && this.pieChart.setOption(option)
      },
      drawBarChart(xAxisData, daysAmount, daysOrder) {
        let option = {
          grid: { left: 20, bottom: 20, right: 20, containLabel: true },
          tooltip: { trigger: 'axis', textStyle: { color: '#fff' }, backgroundColor: 'rgba(0,0,0,0.8)', borderWidth: 0, axisPointer: { type: 'cross', crossStyle: { color: '#999' } } },
          legend: { data: [this.$t('na_instantSettlementUserChart.series6'), this.$t('na_instantSettlementUserChart.series7')], textStyle: { color: '#fff' }, right: 15 },
          xAxis: [{ type: 'category', data: xAxisData, axisTick: { lineStyle: { color: '#fff' } }, axisPointer: { type: 'shadow' }, axisLabel: { color: '#fff' } }],
          yAxis: [
            { type: 'value', name: this.$t('amountWithUnit'), nameTextStyle: { fontSize: 12, color: '#fff' }, splitLine: { lineStyle: { type: 'dashed' } }, axisLabel: { color: '#fff' } },
            { type: 'value', name: this.$t('orderQuantity'), nameTextStyle: { fontSize: 12, color: '#fff' }, splitLine: { show: false, lineStyle: { type: 'dashed' } }, axisLabel: { color: '#fff' } },
          ],
          series: [
            { name: this.$t('na_instantSettlementUserChart.series6'), type: 'bar', color: '#6db626', tooltip: { valueFormatter: value => this.$t('moneyWithUnit', { num: value }) }, data: daysAmount },
            { name: this.$t('na_instantSettlementUserChart.series7'), type: 'bar', color: '#0da8ed', yAxisIndex: 1, data: daysOrder },
          ],
        }
        this.barChart && this.barChart.clear()
        this.barChart && this.barChart.setOption(option)
      },
      changeSize() {
        this.barChart && this.barChart.resize()
      },
    },
    mounted() {
      this.pieChart = echarts.init(this.$refs.pieRef)
      this.barChart = echarts.init(this.$refs.barRef)
      this.queryUserOverview()
      this.getUserChart()
      this.search()
    },
    beforeDestroy() {
      this.pieChart && this.pieChart.dispose()
      this.barChart && this.barChart.dispose()
      this.pieChart = null
      this.barChart = null
    },
  }
</script>

<style lang="less" scoped>
  .userList-page {
    height: calc(~'100vh - 201px');
    overflow: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
    .top-col {
      padding: 0px;
      overflow: auto;
      .item {
        min-width: 242px;
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
            .info-content {
              width: 100%;
              overflow: hidden;
              .label {
                font-size: 12px;
                width: 100%;
              }
              .value {
                font-size: 14px;
                line-height: 28px;
              }
              .trend {
                font-size: 12px;
                display: flex;
                transform: scale(0.9);
                transform-origin: left;
              }
            }
          }
        }
      }
    }
    .chart-col {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 10px;
      .left {
        background: var(--card-bg-color);
        padding: 15px;
        width: 400px;
        .header {
          font-size: 14px;
        }
        .echart-content {
          width: 100%;
          height: 250px;
          display: flex;
          .pie {
            width: 100%;
          }
        }
      }
      .right {
        background: var(--card-bg-color);
        padding: 15px;
        width: calc(~'100% - 410px');
        .header {
          font-size: 14px;
        }
        .line {
          width: 100%;
          height: 250px;
        }
      }
    }
    .table-col {
      padding: 15px;
      margin-top: 10px;
      background: var(--card-bg-color);
      .header {
        font-size: 14px;
        margin-bottom: 10px;
      }
      .search-box {
        display: flex;
        margin-bottom: 10px;
      }
    }
  }
</style>
