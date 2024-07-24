<template>
  <div class="chart-box-trend" v-resize="eChartResize">
    <div class="header">
      <div class="left">{{ title }}</div>
      <div class="right">
        <Button type="primary" v-if="model === 'table'" ghost @click.stop="downloadExcel">{{ $t('export') }}</Button>
        <RadioGroup class="ml-10" v-model="model" type="button">
          <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
          <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
        </RadioGroup>
      </div>
    </div>
    <div style="height: 520px">
      <div class="table-box" style="padding-top: 10px" v-if="model === 'table'">
        <Table border class="ranking-table" :data="tableData.list" :maxHeight="458" :columns="columnsList" style="width: 100%">
          <template #ranking="{ row }">{{ (row._index + 1 + (tableData.currentPage - 1) * tableData.pageSize).toString().padStart(2, '0') }}</template>
          <template #objName="{ row }">{{ getRowNameTable(row) }}</template>
        </Table>
        <Page @on-change="changCurrentPage" :current="tableData.currentPage" :total="tableData.total" show-elevator show-total></Page>
      </div>
      <div v-show="model === 'echart'" class="chart-content" ref="chartRef"></div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import { energyRank } from '@/api/smartEnergy/statistics'
  import qs from 'qs'
  export default {
    props: {
      timeValue: { type: Object, default: () => {} },
      queryParams: { type: Object, default: () => {} },
      energyType: { type: Number, default: 1 },
      unit: { type: String, default: 'kW·h' },
      rankType: { type: String, default: 'mac' },
      dataType: { type: String, default: 'energy' },
    },
    data() {
      return {
        chart: null,
        options: { xAxisData: [], seriesData: [] },
        model: 'echart',
        tableData: { list: [], currentPage: 1, total: 0, pageSize: 10 },
        colorList: ['#d9001b', '#d92e00', '#d95600', '#d98900', '#d9bc00', '#b9d900', '#9ad900', '#5dd900', '#72d900', '#37b603'],
        postParams: null,
      }
    },
    computed: {
      params() {
        return {
          energyType: this.energyType,
          rankType: this.rankType,
          dataType: this.dataType,
          groupId: this.queryParams.groupId || '',
          timeType: this.timeValue.timeType,
          startTime: this.timeValue.dataRange[0],
          endTime: this.$func.getEndTime(this.timeValue.dataRange[1]),
          projectCode: this.$store.state.projectCode,
        }
      },
      title() {
        const typesMap = { mac: this.$t('device'), channel: this.$t('line'), node: this.$t('group') }
        const useTextMap = ['', this.$t('electricEnergy'), this.$t('hydroenergy'), this.$t('pneumaticEnergy'), this.$t('heatEnergy')]
        return this.dataType === 'carbon'
          ? this.$t('carbonEmissionRankingTitleValue', { date: this.timeValue.dateValueText, rankType: typesMap[this.rankType], energyType: useTextMap[this.energyType] })
          : this.$t('rankingTitleValue', { date: this.timeValue.dateValueText, rankType: typesMap[this.rankType], energyType: useTextMap[this.energyType] })
      },
      columnsList() {
        const useTextMap = ['', this.$t('electricityConsumption1'), this.$t('useWater'), this.$t('gasConsumption1'), this.$t('usingHeat')]
        return [
          { title: this.$t('ranking'), align: 'center', slot: 'ranking', width: 90 },
          { title: this.$t('objectInformation'), align: 'center', slot: 'objName' },
          {
            title: `${this.dataType === 'carbon' ? this.$t('carbonEmission') : `${useTextMap[this.energyType]}`}（${this.dataType === 'carbon' ? 'kgCO₂' : this.unit}）`,
            key: 'data',
            align: 'center',
            width: 200,
          },
        ]
      },
    },
    methods: {
      drawChart() {
        const option = {
          color: ['#00FFFF', '#0da7ed'],
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            showContent: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderWidth: 0,
            confine: true,
            textStyle: { color: '#fff' },
            formatter: item => {
              const { name, marker, seriesName, value } = item[0]
              const { marker: marker1, seriesName: seriesName1, value: value1 } = item[1] || { marker: null, seriesName: null, value: null }
              return `${name}<br/>${marker} ${seriesName}:${value}${this.dataType === 'carbon' ? 'kgCO₂' : this.unit}${marker1 ? `<br/>${marker1} ${seriesName1}:${value1}${this.unit}` : ''} `
            },
          },
          grid: { left: 1, containLabel: true, right: 20, top: 30, bottom: 10 },
          legend: { show: false, right: 30, top: 0, textStyle: { color: '#fff' } },
          yAxis: {
            type: 'category',
            offset: 2,
            inverse: true,
            axisLine: { show: true, onZero: true, lineStyle: { color: '#4b4e55', width: 2 } },
            axisTick: { onGap: 0, alignWithLabel: true, lineStyle: { color: '#767d8f' } },
            splitArea: { show: true, areaStyle: { color: ['rgba(242, 242, 242, 0.1)', 'rgba(242, 242, 242, 0.1)'] } },
            splitLine: { show: true, lineStyle: { color: '#1a202e', width: 5 } },
            axisLabel: { show: true, interval: 0, textStyle: { color: '#fff', fontSize: 12 }, overflow: 'breakAll', align: 'right' },
            data: [...this.options.xAxisData],
          },
          xAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#4b4e55' } },
            splitLine: { lineStyle: { type: 'dashed', color: ['#666'] } },
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            position: 'top',
          },
          series: this.options.seriesData,
        }
        this.chart && this.chart.clear()
        this.chart && this.chart.setOption(option)
      },
      eChartResize() {
        this.chart && this.chart.resize()
      },
      changCurrentPage(e) {
        this.tableData.currentPage = e
        this.init()
      },
      async init(isOne = false) {
        this.options.xAxisData = []
        this.options.seriesData = {}
        this.chart && this.chart.showLoading({ text: this.$t('loading'), color: '#fff', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.4)' })
        this.postParams = { ...this.params, page: this.tableData.currentPage, rows: this.tableData.pageSize }
        const res = await energyRank(this.postParams)
        if (res.success) {
          const list = res.data.datas
          this.tableData.list = list
          this.tableData.total = res.data.total
          if (this.tableData.currentPage === 1 && isOne) {
            this.options.xAxisData = list.map(it => this.getRowName(it))
            this.options.seriesData = {
              name: this.timeValue.dateValueText,
              type: 'bar',
              data: list.map((it, index) => {
                let name = this.getRowName(it)
                return {
                  name,
                  value: it.data || 0,
                  itemStyle: { color: this.colorList[index] },
                  // label: { show: true, align: 'right', verticalAlign: 'middle', position: 'left', fontSize: 16, color: '#fff', offset: [-165, 0], formatter: () => (index + 1).toString().padStart(2, '0') },
                }
              }),
            }
            this.drawChart()
          }
          this.chart && this.chart.hideLoading()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getRowName(it) {
        return it.nodeId ? it.nodeName : it.addr ? `${it.devName || this.$t('unknown2')}(${it.mac})\n/${it.addrName || this.$t('unknown2')}(${it.mac}-${it.addr.toString().padStart(2, '0')})` : `${it.devName}\n(${it.mac})`
      },
      getRowNameTable(it) {
        return it.nodeId ? it.nodeName : it.addr ? `${it.devName || this.$t('unknown2')}(${it.mac})/${it.addrName || this.$t('unknown2')}(${it.mac}-${it.addr.toString().padStart(2, '0')})` : `${it.devName}\n(${it.mac})`
      },
      downloadExcel() {
        if (this.tableData.list.length === 0) return this.$Message.error({ content: this.$t('exportedDataCannotEmpty') })
        this.$func.windowCountDown(`/smartEnergy/energy/export/rank.as?${qs.stringify(this.postParams)}`)
      },
    },
    mounted() {
      this.chart = echarts.init(this.$refs.chartRef)
      this.init(true)
    },
    beforeDestroy() {
      this.chart && this.chart.dispose()
      this.chart = null
    },
  }
</script>
<style lang="less" scoped>
  .chart-box-trend {
    margin-top: 10px;
    background: #1a202e;
    padding: 10px 15px;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
    }
    .chart-content {
      height: 520px;
      width: 100%;
    }
  }
</style>
