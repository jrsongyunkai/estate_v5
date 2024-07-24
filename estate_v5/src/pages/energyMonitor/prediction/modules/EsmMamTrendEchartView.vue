<template>
  <div class="chart-view-box" v-resize="echartResize">
    <div class="bar-line-chart" ref="echartRef"></div>
  </div>
</template>

<script>
  import * as echarts from 'echarts5'
  export default {
    data() {
      return {
        echart: null,
        observations: null,
      }
    },
    methods: {
      echartResize() {
        this.echart && this.echart.resize()
      },
      echartSetOption(observations, predictions) {
        this.observations = observations
        let keys = observations ? observations.map(it => Object.keys(it)[0]) : []
        let values = observations ? observations.map(it => [Object.keys(it)[0], Object.values(it) && Object.values(it)[0] && Object.values(it)[0].realPower]) : []
        let keysPre = predictions ? predictions.map(it => Object.keys(it)[0]) : []
        let valuesPre = predictions ? predictions.map(it => [Object.keys(it)[0], Object.values(it) && Object.values(it)[0] && Object.values(it)[0].predictPower]) : []
        let xAxisData = [...keys, ...keysPre]
        let seriesData1 = [...values]
        let seriesData3 = [...valuesPre]
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            textStyle: { color: '#fff' },
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 0,
            formatter: datas => {
              let name = datas[0].name
              let seriesName = datas[0].seriesName
              let value = datas[0].value[1]
              let isActualElectricity = seriesName === this.$t('actualElectricityConsumption')
              let marker = `<span style="display:inline-block;margin-right:4px;border:1px #07c1c4 dashed;border-radius:10px;width:10px;height:10px;background-color:transparent;"></span>`
              marker = isActualElectricity ? datas[0].marker : marker
              let valueEndSpan = value === void 0 ? (isActualElectricity ? '<span style="color:#d9001b">-</span>' : `<span style="color:#f59a23">${this.$t('ns_batteryDiviner.predictionFailed')}</span>`) : value.toFixed(3) + 'kW·h'
              let res = `${name}<br/>${marker}${seriesName}:${valueEndSpan}`
              return res
            },
          },
          grid: { left: 60, right: 50, bottom: 120 },
          legend: {
            data: [
              { name: this.$t('actualElectricityConsumption'), itemStyle: { color: '#02a7f0' } },
              { name: this.$t('predictedElectricityConsumption'), icon: 'circle', itemStyle: { color: 'transparent', borderWidth: 1, borderColor: '#07c1c4', borderType: 'dashed' }, backgroundColor: 'transparent' },
            ],
            right: 30,
            textStyle: { color: '#fff' },
            icon: 'circle',
          },
          dataZoom: [
            { show: true, start: 0, end: 100, filterMode: 'none' },
            // { type: 'inside', start: 90, end: 100, filterMode: 'none' },
          ],
          xAxis: { type: 'category', axisLine: { onZero: false }, axisTick: { alignWithLabel: true }, axisLabel: { color: '#fff', show: true, rotate: 35 }, data: xAxisData },
          yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#dedede' } }, axisLabel: { color: '#fff', show: true } },
          series: [
            { name: this.$t('actualElectricityConsumption'), type: 'bar', color: '#02a7f0', data: seriesData1, stack: 'Total' },
            { name: this.$t('predictedElectricityConsumption'), type: 'bar', data: seriesData3, stack: 'Total', itemStyle: { color: 'transparent', borderColor: '#07c1c4', borderWidth: 1, borderType: 'dashed' } },
          ],
        }
        this.echart && this.echart.setOption(option)
      },
    },
    mounted() {
      this.echart = echarts.init(this.$refs.echartRef, null)
    },
    destroyed() {
      this.echart && this.echart.dispose()
    },
  }
</script>

<style lang="less" scoped>
  .chart-view-box {
    position: relative;
    .bar-line-chart {
      width: 100%;
      height: 400px;
    }
    .tips-title {
      position: absolute;
      top: 4px;
      font-size: 12px;
      right: 210px;
      .ml-5 {
        margin-left: 5px;
      }
    }
  }
</style>
