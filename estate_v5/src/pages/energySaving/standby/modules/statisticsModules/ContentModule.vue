<template>
  <div class="content-box">
    <div class="left" :class="{ fold: isFoldLeft }">
      <EnergyDeviceTree @clickNode="selectTreeNode" treeHeight="calc(100vh - 368px)" isChangeFold @fold="changeFold" :energyType="energyType" strictMode></EnergyDeviceTree>
    </div>
    <div class="right" v-resize="resize">
      <div class="search-bar">
        <Form ref="searchForm" class="form-search" label-position="right">
          <div class="icon-v5 icon-v5-shouqi2-01 pointer" v-if="isFoldLeft" @click.stop="changeFold"></div>
          <MKindDatePick class="ml-10" v-model="timeValue" :typeRange="typeRange" />
          <Button class="b-blue ml-10" @click.stop="search">{{ $t('query') }}</Button>
          <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
        </Form>
      </div>
      <div class="chart-box">
        <div class="left-box">
          <div class="title">{{ $t('conditionMonitoringEnergyProportion') }}</div>
          <div class="pie-chart" ref="chartBoxPie" id="chart_box_pie"></div>
          <div class="legend-pie">
            <div class="legend-item">
              <div class="title">{{ $t('conditionMonitoringEnergyConsumption') }}</div>
              <div class="value" v-textRoll>{{ standbyEnergy }}{{ unit }}</div>
            </div>
            <div class="legend-item">
              <div class="title">{{ $t('totalEnergyConsumption') }}</div>
              <div class="value all" v-textRoll>{{ allEnergy }}{{ unit }}</div>
            </div>
          </div>
        </div>
        <div class="right-box" ref="chartBoxLine" id="chart_box_line"></div>
      </div>
      <div class="table-box">
        <div class="header">
          <div class="title">{{ $t('energyConsumptionList') }}</div>
          <div>
            <Button type="primary" ghost @click.stop="downloadExcel">{{ $t('export') }}</Button>
          </div>
        </div>
        <div class="mt-10">
          <Table :columns="columns" :data="tableData" border>
            <template #value="{ row, column }">{{ (row[column.key] && row[column.key].data && row[column.key].data.toFixed(3)) || '-' }}</template>
            <template #qoq="{ row, column }"><MTrend isHideType type="qoq" :value="(row[column.key] && row[column.key]['yoy'] && row[column.key]['yoy']) || 0" /></template>
            <template #yoy="{ row, column }"><MTrend isHideType type="yoy" :value="(row[column.key] && row[column.key]['qoq'] && row[column.key]['qoq']) || 0" /></template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import * as echarts from 'echarts5'
  import EnergyDeviceTree from '@/components/deviceTree/EnergyDeviceTree.vue'
  import { conditionEnergyChart, conditionEnergyChartExport } from '@/api/energySaving/index'
  import { MONTHS, WEEKS } from '@/untils/configuration'
  export default {
    props: {
      energyType: { type: Number, default: 1 },
      unit: { type: String, default: 'kW·h' },
    },
    components: { EnergyDeviceTree },
    data() {
      return {
        model: '1',
        tableData: [],
        standbyEnergy: 0,
        allEnergy: 0,
        percert: 0,
        xAxisData: [],
        searchMarkPoint: {
          data: [
            { type: 'max', symbol: this.$func.echartsSymbolMax, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', offset: [0, -17], padding: [0, 5, 33, 5], color: '#ee4c4f' } },
            { type: 'min', symbol: this.$func.echartsSymbolMin, symbolOffset: [0, -30], label: { fontSize: 11, align: 'center', offset: [0, -17], padding: [0, 5, 33, 5], color: '#02b085' } },
          ],
          label: { normal: { show: true } },
        },
        timeValue: {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM-01'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        },
        chartLine: null,
        chartPie: null,
        isFoldLeft: false,
        nodeParams: { statType: 1, groupId: null, nodeId: null, mac: null, addr: null, cityName: '', countyName: '', provinceName: '' },
        handSeriesData: {
          date: index => this.$t('periodOfTime', { num: index.toString().padStart(2, '0') }),
          year: index => MONTHS[index],
          month: index => this.$t('numberThValue', { num: (index + 1).toString() }),
          quarter: index => [this.$t('firstMonth'), this.$t('secondMonth'), this.$t('thirdMonth')][index],
          week: index => WEEKS[index],
        },
      }
    },
    computed: {
      columns() {
        return [
          { title: this.$t('time'), key: 'time', align: 'center' },
          {
            title: this.$t('conditionMonitoringEnergyConsumption'),
            align: 'center',
            children: [
              { title: `${this.$t('energyConsumptionValue')}(${this.unit})`, key: 'conditionEnergy', slot: 'value', align: 'center', minWidth: 90 },
              { title: this.$t('YoY'), key: 'conditionEnergy', slot: 'yoy', align: 'center' },
              { title: this.$t('monthOnMonthRatio1'), key: 'conditionEnergy', slot: 'qoq', align: 'center' },
            ],
          },
          {
            title: this.$t('totalEnergyConsumption'),
            align: 'center',
            children: [
              { title: `${this.$t('energyConsumptionValue')}(${this.unit})`, key: 'statEnergy', align: 'center', slot: 'value', minWidth: 90 },
              { title: this.$t('YoY'), key: 'statEnergy', align: 'center', slot: 'yoy' },
              { title: this.$t('monthOnMonthRatio1'), key: 'statEnergy', align: 'center', slot: 'qoq' },
            ],
          },
          {
            title: this.$t('conditionMonitoringEnergyProportion'),
            align: 'center',
            children: [
              { title: this.$t('proportion'), key: 'conditionPercent', slot: 'value', align: 'center' },
              { title: this.$t('YoY'), key: 'conditionPercent', slot: 'yoy', align: 'center' },
              { title: this.$t('monthOnMonthRatio1'), key: 'conditionPercent', slot: 'qoq', align: 'center' },
            ],
          },
        ]
      },
      typeRange() {
        return this.energyType !== 1 ? [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week')] : [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week'), this.$t('day')]
      },
    },
    methods: {
      drawChart(data) {
        let xAxisData = [...data.map((it, index) => this.handSeriesData[this.timeValue.levelRange](index))]
        let standbyEnergyAll = [...data.map(it => it.conditionEnergy.data)]
        let energyAll = [...data.map(it => it.statEnergy.data)]
        let options = {
          title: { text: this.$t('energyConsumptionTrend2'), textStyle: { color: '#fff', fontSize: 14, fontWeight: 'normal' } },
          color: ['#00FFFF', '#0da7ed'],
          tooltip: { show: true, trigger: 'axis' },
          grid: { left: 80, right: 30, top: 100, bottom: 30 },
          legend: { show: true, right: 30, top: 20, textStyle: { color: '#fff' } },
          xAxis: { type: 'category', boundaryGap: false, axisLine: { lineStyle: { color: '#fff' } }, data: xAxisData },
          yAxis: { type: 'value', name: `${this.$t('electricQuantity')}：${this.unit}`, nameGap: 50, axisLine: { lineStyle: { color: '#fff' } }, splitLine: { lineStyle: { type: 'dashed', color: ['#666'] } } },
          series: [
            { name: this.$t('conditionMonitoringEnergyConsumption'), type: 'line', data: standbyEnergyAll, smooth: true, itemStyle: { opacity: 0 }, markPoint: this.searchMarkPoint },
            { name: this.$t('totalEnergyConsumption'), type: 'line', data: energyAll, smooth: true, itemStyle: { opacity: 0 }, markPoint: this.searchMarkPoint },
          ],
        }
        this.chartLine && this.chartLine.setOption(options, true)
      },
      async downloadExcel() {
        let params = {
          ...this.nodeParams,
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
        }
        const res = await conditionEnergyChartExport(params)
        this.$func.getPostResFile(res, this.$t('energyConsumptionList'))
      },
      async search() {
        let params = {
          ...this.nodeParams,
          energyType: this.energyType,
          projectCode: this.$store.state.projectCode,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
        }
        let res = await conditionEnergyChart(params)
        if (res.success) {
          this.tableData = [...res.data.map((it, index) => ({ ...it, time: this.handSeriesData[this.timeValue.levelRange](index) }))]
          let allEnergy = 0
          let standbyEnergy = 0
          for (let item of res.data) {
            allEnergy += item.statEnergy.data || 0
            standbyEnergy += item.conditionEnergy.data || 0
          }
          this.percert = allEnergy ? ((standbyEnergy / allEnergy) * 100).toFixed(2) : 0
          this.allEnergy = allEnergy.toFixed(3)
          this.standbyEnergy = standbyEnergy.toFixed(3)
          this.drawChart(res.data)
          this.drawChartPie()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      selectTreeNode(e) {
        this.nodeParams.mac = e.mac
        this.nodeParams.addr = e.addr || null
        this.nodeParams.groupId = e.groupId
        this.nodeParams.nodeId = e.nodeId
        this.nodeParams.provinceName = e.provinceName
        this.nodeParams.cityName = e.cityName
        this.nodeParams.countyName = e.countyName
        this.nodeParams.statType = e.statType
        this.search()
      },
      changeFold() {
        this.isFoldLeft = !this.isFoldLeft
      },
      drawChartPie() {
        const options = {
          angleAxis: { max: 100, clockwise: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
          radiusAxis: { type: 'category', axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: false }, splitLine: { show: false } },
          polar: { center: ['30%', '50%'], radius: '80%' },
          graphic: {
            elements: [{ type: 'group', z: -1, left: '30%', top: '50%', bounding: 'raw', children: [{ type: 'text', left: 'center', y: 30, style: { text: this.$t('totalProportion'), textAlign: 'center', width: 132, textVerticalAlign: 'middle', fill: '#999', fontSize: 14 } }] }],
          },
          series: [
            {
              type: 'gauge',
              axisLine: { show: false },
              splitLine: { show: false },
              anchor: { show: false },
              pointer: { show: false },
              axisLabel: { show: false },
              axisTick: { show: false },
              center: ['30%', '50%'],
              radius: '80%',
              detail: {
                valueAnimation: true,
                width: '100%',
                offsetCenter: ['1', '0'],
                formatter: '{value}%',
                color: '#fff',
                baseline: 'middle',
                fontSize: 20,
              },
              title: { show: false },
              data: [{ name: this.$t('totalProportion'), value: this.percert }],
            },
            {
              type: 'bar',
              itemStyle: { shadowColor: `#ffffff50`, shadowBlur: 10 },
              data: [
                {
                  value: this.percert,
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
                        { offset: 1, color: '#c1c5cc' },
                        { offset: 0, color: '#1d63cb' },
                      ]),
                    },
                  },
                },
              ],
              coordinateSystem: 'polar',
              roundCap: true,
              barWidth: 15,
              barGap: '-100%', // 两环重叠
              z: 2,
            },
            {
              type: 'bar',
              data: [{ value: 100, itemStyle: { color: '#20242d' } }],
              coordinateSystem: 'polar',
              barWidth: 15,
              barGap: '-100%',
              z: 1,
              animation: false,
            },
          ],
        }
        this.chartPie && this.chartPie.setOption(options, true)
      },
      reset() {
        this.timeValue = {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM-01'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        }
        this.search()
      },
      resize() {
        this.chartPie && this.chartPie.resize()
        this.chartLine && this.chartLine.resize()
      },
    },
    mounted() {
      this.chartLine = echarts.init(this.$refs.chartBoxLine)
      this.chartPie = echarts.init(this.$refs.chartBoxPie)
      this.search()
    },
    beforeDestroy() {
      this.chartPie && this.chartPie.dispose()
      this.chartLine && this.chartLine.dispose()
      this.chartLine = null
      this.chartPie = null
    },
  }
</script>
<style lang="less" scoped>
  @import './style.less';
</style>
