<template>
  <div class="chart-view-box" v-resize="echartResize">
    <div class="bar-line-chart" ref="echartRef"></div>
    <div class="tips-title">{{ $t('ns_batteryDiviner.algorithmEquation') }}:{{ `y=${intercept.toFixed(4)}+ ${slope.toFixed(4)}*x` }}</div>
  </div>
</template>

<script>
  import * as echarts from 'echarts5'
  import dayjs from 'dayjs'
  const duration = require('dayjs/plugin/duration')
  dayjs.extend(duration)
  export default {
    data() {
      return {
        echart: null,
        observations: null,
        intercept: 0,
        slope: 0,
        seatEmpty: ['#', '#', '#'],
      }
    },
    methods: {
      echartResize() {
        this.echart && this.echart.resize()
      },
      transformArray(arr) {
        for (let i = 1; i < arr.length; i++) {
          arr[i][1] += +arr[i - 1][1]
        }
        return arr
      },
      transformData(arr, type = 'hour') {
        let first = arr.find(it => it[1] > 0)
        let end = arr[arr.length - 1]
        // let xValue = (first && dayjs(end[0]).diff(first[0], type)) || 0
        return [
          [(first && first[0]) || arr[0][0], this.intercept],
          [end[0], end[1]],
          // [end[0], this.slope * xValue + this.intercept],
        ]
      },
      echartSetOption(data, timeType) {
        const seatEmptyLength = this.seatEmpty.length
        let { observations, predictions, intercept, slope } = data
        this.observations = observations || []
        this.slope = slope || 0
        this.intercept = intercept || 0
        let keys = observations ? observations.map(it => Object.keys(it)[0]) : []
        let values = observations ? observations.map(it => [Object.keys(it)[0], Object.values(it)[0].realPower || 0]) : []
        this.transformArray(values)
        let keysPre = predictions ? predictions.map(it => Object.keys(it)[0]) : []
        let valuesPre = predictions ? predictions.map(it => [Object.keys(it)[0], Object.values(it)[0].sumPower]) : []
        let xAxisData = [...keys, ...this.seatEmpty, ...keysPre]
        let seriesData1 = [...values]
        let seriesData3 = [...valuesPre]
        let seriesData4 = this.transformData([...values, ...valuesPre], timeType)
        let option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            textStyle: { color: '#fff' },
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderWidth: 0,
            formatter: datas => {
              let name = datas[0].name
              let seriesName = datas[0].seriesName
              let value = datas[0].value[1]
              let marker = datas[0].marker
              let res = `${name}<br/>${marker}${seriesName}:${value === void 0 ? `<span style="color:#f59a23">${this.$t('ns_batteryDiviner.predictionFailed')}</span>` : value.toFixed(3) + 'kW·h'}`
              return res
            },
          },
          grid: { left: 60, right: 50, bottom: 130 },
          legend: {
            data: [
              { name: this.$t('ns_batteryDiviner.observation'), itemStyle: { color: '#02a7f0' }, icon: 'circle' },
              { name: this.$t('ns_batteryDiviner.predictionPoint'), itemStyle: { color: '#f59a36' }, icon: 'circle' },
              { name: this.$t('ns_batteryDiviner.regressionLine'), itemStyle: { opacity: 0 }, lineStyle: { color: '#c20425' } },
            ],
            right: 30,
            textStyle: { color: '#fff' },
          },
          dataZoom: [
            { show: true, start: 0, end: 100, filterMode: 'none', height: 20, bottom: 40 },
            // { type: 'inside', start: 0, end: 100, filterMode: 'none' },
          ],
          xAxis: {
            name: `${this.$t('ns_batteryDiviner.argument')}(x)`,
            nameLocation: 'middle',
            nameGap: 105,
            nameTextStyle: { color: '#fff' },
            type: 'category',
            axisLine: { onZero: false },
            axisTick: { alignWithLabel: true, interval: (index, value) => !value.startsWith('#') },
            axisLabel: { color: '#fff', show: true, rotate: 35, formatter: it => (it.startsWith('#') ? '' : it) },
            data: xAxisData,
          },
          yAxis: { name: `${this.$t('ns_batteryDiviner.dependentVariable')}(y)`, nameLocation: 'middle', nameGap: 45, type: 'value', nameTextStyle: { color: '#fff' }, axisLabel: { color: '#fff', show: true }, splitLine: { lineStyle: { type: 'dashed', color: '#dedede' } } },
          series: [
            { name: this.$t('ns_batteryDiviner.observation'), type: 'scatter', color: '#02a7f0', data: seriesData1 },
            { name: this.$t('ns_batteryDiviner.predictionPoint'), type: 'scatter', color: '#f59a36', data: seriesData3 },
            { name: this.$t('ns_batteryDiviner.regressionLine'), type: 'line', color: '#c20425', data: seriesData4, symbol: 'none', zlevel: 11 },
            {
              type: 'custom',
              renderItem: function (params, api) {
                let length = seatEmptyLength - 1
                let start = api.coord([api.value(0) - length, 1])
                let end = api.coord([api.value(0), 1])
                let barWidth = (end[0] - start[0]) / length
                let halfWidth = barWidth / 2
                let height = params.coordSys.y + params.coordSys.height
                return {
                  type: 'group',
                  emphasisDisabled: true,
                  children: [
                    {
                      type: 'rect',
                      shape: {
                        x: start[0] - halfWidth - 1,
                        y: 0,
                        width: end[0] - start[0] + barWidth + 2,
                        height,
                      },
                      style: { fill: '#1a202e' },
                      tooltip: false,
                    },
                    {
                      type: 'text',
                      x: start[0] + length * halfWidth,
                      y: height / 2 + 20,
                      style: { text: '......', font: `bolder ${(28 / 18) * halfWidth}px "Microsoft YaHei", sans-serif`, textAlign: 'center', fill: '#fff' },
                    },
                  ],
                }
              },
              clip: true,
              silent: false,
              zlevel: 10,
              data: [['#', null]],
              tooltip: { show: false },
            },
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
      left: 0px;
      .ml-5 {
        margin-left: 5px;
      }
    }
  }
</style>
