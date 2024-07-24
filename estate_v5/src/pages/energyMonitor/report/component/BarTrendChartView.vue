<template>
  <div class="echart-box" v-resize="echartResize" ref="chartRef"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    props: {
      xAxisData: { type: Array, default: () => [] },
      powerList: { type: Array, default: () => [] },
    },
    data() {
      return {
        chart: null,
        echartItem: { type: 'bar', emphasis: { focus: 'self' } },
      }
    },
    methods: {
      getNumber(str) {
        return str === '-' ? '0' : +str
      },
      init() {
        const options = {
          title: { show: !!this.title, text: this.title, textStyle: { color: '#fff', fontSize: 14, fontWeight: 'normal' } },
          legend: { type: 'plain', show: true, left: 'right', top: 15, right: 0, textStyle: { color: '#fff' } },
          grid: { x: 45, y: 60, x2: 30, y2: 60, borderWidth: 0, bottom: 70 },
          tooltip: { trigger: 'axis', showContent: true, backgroundColor: 'rgba(0,0,0,0.8)', borderWidth: 0, axisPointer: { type: 'shadow' }, confine: true, textStyle: { color: '#fff' } },
          xAxis: {
            type: 'category',
            data: this.xAxisData,
            axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } },
            axisTick: { onGap: 0, alignWithLabel: true, lineStyle: { color: '#767d8f' } },
            axisLine: { lineStyle: { color: '#666' } },
            splitLine: { show: false },
            boundaryGap: true,
          },
          yAxis: {
            name: `${this.$t('electricQuantity')}（kW·h）`,
            nameGap: 25,
            type: 'value',
            nameTextStyle: { color: '#fff' },
            splitArea: { show: false },
            axisLine: { show: true, lineStyle: { color: '#666' } },
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisTick: { show: false },
            splitLine: { show: true, interval: 1, lineStyle: { color: '#555', type: 'dashed' } },
          },
          series: [
            { name: this.$t('sharp'), color: '#e03c3a', ...this.echartItem, data: this.powerList.map(it => this.getNumber(it.topPeakPower)) },
            { name: this.$t('peak'), color: '#ffa854', ...this.echartItem, data: this.powerList.map(it => this.getNumber(it.peakPower)) },
            { name: this.$t('performance'), color: '#007fff', ...this.echartItem, data: this.powerList.map(it => this.getNumber(it.flatPower)) },
            { name: this.$t('valley'), color: '#0dd667', ...this.echartItem, data: this.powerList.map(it => this.getNumber(it.valleyPower)) },
            { name: this.$t('totalPowerOfUser'), color: '#0da7ed', type: 'line', symbol: 'none', symbolSize: 0, smooth: true, data: this.powerList.map(it => this.getNumber(it.value1)) },
          ],
        }
        this.chart && this.chart.setOption(options)
      },
      echartResize() {
        this.chart && this.chart.resize()
      },
    },
    mounted() {
      this.chart = echarts.init(this.$refs.chartRef)
      this.init()
    },
    beforeDestroy() {
      this.chart && this.chart.dispose()
      this.chart = null
    },
  }
</script>

<style lang="less" scoped>
  .echart-box {
    height: calc(~'100vh - 336px');
    width: 100%;
  }
</style>
