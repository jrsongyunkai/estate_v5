<template>
  <div class="ranking-box" v-resize="resize">
    <div class="search-bar">
      <Form ref="searchForm" label-position="right" style="display: flex">
        <FormItem>
          <Select v-model="model" v-width="200" transfer>
            <Option v-for="item in models" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <MKindDatePick class="ml-10" v-model="timeValue" :typeRange="typeRange" />
        <Button class="b-blue ml-10" @click.stop="search">{{ $t('query') }}</Button>
        <Button class="b-info ml-10" @click.stop="reset">{{ $t('reset') }}</Button>
        <Button class="b-blue ml-10" @click.stop="downloadExcel">{{ $t('export') }}</Button>
      </Form>
    </div>
    <div class="chart-box">
      <div class="left-box" ref="rankingBoxPie"></div>
      <div class="right-box" ref="rankingBoxLine"></div>
    </div>
    <div class="table-box">
      <div class="header">{{ $t('conditionMonitoringEnergyRanking') }}</div>
      <div class="mt-10">
        <Table :columns="rankingColumns" :data="tableData" :max-height="400" border>
          <template #name="{ row }">{{ row.name || $t('unknown2') }}</template>
          <template #rankIndex="{ row }">
            <span :class="{ yellow: row._index < 3 }">{{ (row._index + 1).toString().padStart(2, '0') }}</span>
          </template>
          <template #conditionPercent="{ row }">{{ row.conditionPercent }}%</template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script>
  import * as echarts from 'echarts5'
  import { conditionEnergyRank, conditionEnergyRankExport } from '@/api/energySaving/index'

  export default {
    props: {
      energyType: { type: Number, default: 1 },
      models: { type: Array, default: () => [] },
      unit: { type: String, default: 'kW·h' },
    },
    data() {
      return {
        model: 'location',
        tempModel: 'location',
        timeValue: {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        },
        pieData: [],
        allData: [],
        djData: [],
        xCategory: [],
        tableData: [],
        chartPie: null,
        chart: null,
      }
    },
    computed: {
      rankingColumns() {
        return [
          { title: this.$t('ranking'), key: 'time', align: 'center', slot: 'rankIndex' },
          { title: this.tempModel === 'location' ? this.$t('regionName') : this.$t('groupName'), key: 'name', align: 'center', slot: 'name' },
          { title: this.$t('conditionMonitoringEnergyConsumption'), key: 'conditionEnergy', align: 'center' },
          { title: this.$t('totalEnergyConsumption'), key: 'statEnergy', align: 'center' },
          { title: this.$t('conditionMonitoringEnergyProportion'), slot: 'conditionPercent', align: 'center' },
        ]
      },
      typeRange() {
        return this.energyType !== 1 ? [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week')] : [this.$t('year'), this.$t('season'), this.$t('month'), this.$t('week'), this.$t('day')]
      },
    },
    methods: {
      async downloadExcel() {
        const params = {
          projectCode: this.$store.state.projectCode,
          statType: this.model === 'location' ? 2 : 3,
          groupId: !['location'].includes(this.model) ? this.model : '',
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          energyType: this.energyType,
        }
        const res = await conditionEnergyRankExport(params)
        this.$func.getPostResFile(res, this.$t('conditionMonitoringEnergyRanking'))
      },
      drawChartPie() {
        const sumValue = this.pieData.reduce((a, b) => a + b.value, 0)
        const options = {
          title: { text: this.$t('conditionMonitoringEnergyProportion'), textStyle: { color: '#fff', fontSize: 16, fontWeight: 'normal' } },
          legend: { bottom: 10, left: 'center', itemWidth: 10, icon: 'circle', textStyle: { color: '#fff' } },
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(50,50,50,0.7)',
            valueFormatter: value => `${this.$t('proportion')}${sumValue ? ((value / sumValue) * 100).toFixed(2) : '0'}`,
            borderWidth: 0,
            textStyle: { color: '#fff' },
          },
          series: [{ type: 'pie', avoidLabelOverlap: false, itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 1 }, label: { show: false, position: 'center' }, labelLine: { show: false }, data: this.pieData }],
        }
        this.chartPie && this.chartPie.setOption(options, true)
      },
      drawChartBar() {
        let barWidth = 30
        let options = {
          title: { text: this.$t('conditionMonitoringEnergyConsumption'), textStyle: { color: '#fff', fontSize: 16, fontWeight: 'normal' } },
          color: ['#00FFFF', '#0da7ed'],
          grid: { left: '5%', right: 30, top: 70, bottom: 70 },
          legend: { show: true, left: 'center', bottom: 10, textStyle: { color: '#fff' }, itemWidth: 10, icon: 'circle', selectedMode: false },
          tooltip: { trigger: 'axis', backgroundColor: 'rgba(50,50,50,0.7)', borderWidth: 0, textStyle: { color: '#fff' }, axisPointer: { type: 'cross', crossStyle: { color: '#999' } }, valueFormatter: value => value + 'kW·h' },
          yAxis: { type: 'value', name: this.$t('unitLabelWithValue', { unit: this.unit }), splitLine: { lineStyle: { color: '#333' } } },
          xAxis: { type: 'category', data: this.xCategory, axisLabel: { margin: 20 }, axisPointer: { type: 'shadow' }, boundaryGap: true },
          series: [
            { name: this.$t('totalEnergyConsumption'), type: 'bar', data: this.allData, barGap: 0, barWidth, label: { show: true, position: 'insideTop', color: '#fff' }, z: 2 },
            { name: this.$t('conditionMonitoringEnergyConsumption'), type: 'bar', data: this.djData, stack: 'Total', barWidth, label: { show: true, position: 'insideTop', color: '#fff' }, barGap: 0 },
            {
              type: 'bar',
              stack: 'Total',
              barWidth,
              silent: true,
              data: this.allData.map((value, index) => value - this.djData[index]),
              label: { show: true, position: [0, -19], color: '#fff', formatter: v => `{a|-${this.allData[v.dataIndex] > 0 ? ((v.data / this.allData[v.dataIndex]) * 100).toFixed(2) : 0}%}`, rich: { a: { lineHeight: 20, width: '100%', align: 'center' } } },
              barGap: 0,
              itemStyle: { borderColor: 'transparent', color: 'transparent' },
              tooltip: { show: false },
              emphasis: { itemStyle: { borderColor: 'transparent', color: 'transparent' } },
            },
            {
              type: 'custom',
              tooltip: { show: false },
              renderItem: (params, api) => {
                let xValue = api.value(0)
                let highPoint = api.coord([xValue, api.value(1)])
                let lowPoint = api.coord([xValue, api.value(2)])
                return {
                  type: 'group',
                  originY: lowPoint[1],
                  children: [
                    { type: 'path', transition: ['shape'], shape: { pathData: 'M 100 100 L 300 100 L 200 300 z', width: 8, height: 8, x: lowPoint[0] + 11, y: highPoint[1] - 8 }, style: { fill: '#e75a58' } },
                    { type: 'line', transition: ['shape'], x: 15, shape: { x1: highPoint[0], y1: highPoint[1], x2: lowPoint[0], y2: lowPoint[1] }, style: { stroke: '#e75a58', lineWidth: 1 } },
                    { type: 'line', transition: ['shape'], shape: { x1: highPoint[0], y1: lowPoint[1], x2: highPoint[0] + 30, y2: lowPoint[1] }, style: { stroke: '#999', lineWidth: 1 } },
                  ],
                  enterFrom: { scaleY: 0 },
                  enterAnimation: { delay: 1000, duration: 500 },
                }
              },
              encode: { x: 0, y: [1, 2] },
              data: this.allData.map((value, index) => [index, this.djData[index], value]),
              z: 1,
            },
          ],
        }
        this.chart && this.chart.setOption(options, true)
      },
      async search() {
        let params = {
          projectCode: this.$store.state.projectCode,
          statType: this.model === 'location' ? 2 : 3,
          groupId: this.model === 'location' ? null : +this.model,
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          energyType: this.energyType,
        }
        let res = await conditionEnergyRank(params)
        if (res.success) {
          this.tempModel = this.model
          this.pieData = res.data.map(it => ({ name: it.name || this.$t('unknown2'), value: it.conditionEnergy }))
          this.xCategory = res.data.map(it => it.name || this.$t('unknown2'))
          this.allData = res.data.map(it => it.statEnergy)
          this.djData = res.data.map(it => it.conditionEnergy)
          this.drawChartBar()
          this.drawChartPie()
          this.tableData = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      resize() {
        this.chartPie && this.chartPie.resize()
        this.chart && this.chart.resize()
      },
      reset() {
        this.timeValue = {
          levelRange: 'month',
          timeType: 3,
          dateValue: this.$Date().format('YYYY-MM-01'),
          dataRange: [this.$Date().startOf('month').format('YYYY-MM-DD HH:mm:ss'), this.$Date().endOf('month').format('YYYY-MM-DD HH:mm:ss')],
        }
        this.model = 'location'
      },
    },
    mounted() {
      this.chartPie = echarts.init(this.$refs.rankingBoxPie)
      this.chart = echarts.init(this.$refs.rankingBoxLine, null)
      this.search()
    },
    beforeDestroy() {
      this.chartPie && this.chartPie.dispose()
      this.chart && this.chart.dispose()
      this.chart = null
      this.chartPie = null
    },
  }
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
