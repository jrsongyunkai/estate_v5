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
        observations.reverse()
        let valuesPre = predictions ? predictions.map(it => [Object.keys(it)[0], Object.values(it)[0].predictPower]) : []
        let xAxisData = []
        let seriesData1 = []
        let customList = []
        for (let i = 0; i < valuesPre.length; i++) {
          observations.forEach((item, index) => {
            xAxisData.push(Object.keys(item[i])[0])
            seriesData1.push([Object.keys(item[i])[0], Object.values(item[i])[0].realPower])
          })
          xAxisData.push(valuesPre[i][0])
          if (i < valuesPre.length - 1) {
            xAxisData.push('#', '#', '#' + i.toString())
            customList.push(['#' + i.toString(), null])
          }
        }
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
              let marker = `<span style="display:inline-block;margin-right:4px;border:1px #07c1c4 dashed;border-radius:10px;width:10px;height:10px;background-color:transparent;"></span>`
              marker = seriesName === this.$t('actualElectricityConsumption') ? datas[0].marker : marker
              let valueEndSpan = value === void 0 ? (seriesName === this.$t('actualElectricityConsumption') ? '<span style="color:#d9001b">-</span>' : `<span style="color:#f59a23">${this.$t('ns_batteryDiviner.predictionFailed')}</span>`) : value.toFixed(3) + 'kW·h'
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
            { show: true, startValue: xAxisData.length - 60 > 0 ? xAxisData.length - 60 : 0, endValue: xAxisData.length - 1, filterMode: 'none' },
            // { type: 'inside', start: 90, end: 100, filterMode: 'none' },
          ],
          xAxis: {
            type: 'category',
            axisLine: { onZero: false },
            axisTick: { alignWithLabel: true, interval: (index, value) => !value.startsWith('#') },
            axisLabel: {
              color: '#fff',
              show: true,
              rotate: 35,
              formatter: it => (it.startsWith('#') ? '' : it),
            },
            data: xAxisData,
          },
          yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#dedede' } }, axisLabel: { color: '#fff', show: true } },
          series: [
            { name: this.$t('actualElectricityConsumption'), type: 'bar', color: '#02a7f0', data: seriesData1, stack: 'Total' },
            { name: this.$t('predictedElectricityConsumption'), type: 'bar', data: seriesData3, stack: 'Total', itemStyle: { color: 'transparent', borderColor: '#07c1c4', borderType: 'dashed' } },
            {
              type: 'custom',
              renderItem: function (params, api) {
                let start = api.coord([api.value(0) - 2, 1])
                let end = api.coord([api.value(0), 1])
                let halfWidth = (end[0] - start[0]) / 4
                let height = params.coordSys.y + params.coordSys.height
                return {
                  type: 'group',
                  emphasisDisabled: true,
                  children: [
                    { type: 'rect', shape: { x: start[0] - halfWidth - 1, y: 0, width: end[0] + 2 * halfWidth - start[0] + 2, height }, style: { fill: '#1a202e' }, tooltip: false },
                    { type: 'text', x: start[0] + 2 * halfWidth, y: height / 2 + 20, style: { text: '......', font: `bolder ${(28 / 18) * halfWidth}px "Microsoft YaHei", sans-serif`, textAlign: 'center', fill: '#fff' } },
                  ],
                }
              },
              clip: true,
              silent: false,
              zlevel: 10,
              data: customList,
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
  }
</style>
