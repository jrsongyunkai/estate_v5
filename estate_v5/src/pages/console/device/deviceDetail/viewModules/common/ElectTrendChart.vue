<template>
  <div class="bar-chart" ref="eChart" v-resize="eChartResize"></div>
</template>

<script>
  import * as echarts from 'echarts5'
  export default {
    name: 'elect-trend-chart',
    props: {
      options: { type: Object, default: () => {} },
    },
    data() {
      return {
        eChart: null,
      }
    },
    methods: {
      getRowNumber(num) {
        return num <= 10 ? 1 : num > 10 && num <= 30 ? 4 : num > 30 && num <= 50 ? 6 : 10
      },
      eChartSetOption(option) {
        this.eChart && this.eChart.clear()
        this.eChart && this.eChart.setOption(option, true)
      },
      init() {
        this.eChart && this.eChart.showLoading({ text: this.$t('loading'), color: '#fff', textColor: '#fff', maskColor: 'rgba(0, 0, 0, 0.4)' })
        const unitName = this.options.unit
        const len = this.options.yAxisData.length
        const seriesLen = this.options.seriesData.length
        let options = {
          tooltip: {
            trigger: 'item',
            showContent: true,
            backgroundColor: 'rgba(0,0,0,0.8)',
            borderWidth: 0,
            axisPointer: { type: 'shadow' },
            confine: true,
            textStyle: { color: '#fff' },
            formatter: item => {
              const { name, marker, seriesName, value } = item
              if (seriesName === 'label') return false
              return `${name}<br/>${marker} ${seriesName}:${typeof value === 'object' ? value[1] : value}${unitName || 'kW·h'}${value[2] ? `<br/><span style="display:inline-block;margin-right:18px;"></span>${this.$t('proportion') + value[2]}` : ''}`
            },
          },
          legend: {
            type: 'plain',
            show: true,
            left: 'left',
            top: 0,
            textStyle: { color: '#fff' },
            selectedMode: false,
            data: this.options.seriesData.filter(it => it.name !== 'label').map(item => item.name),
          },
          grid: { x: 80, y: (seriesLen / 10) * 15 + 85, x2: 30, y2: 60, borderWidth: 0, bottom: 0 },
          dataZoom: [
            { show: len > 5, type: 'slider', startValue: len - 5 > 0 ? len - 5 : 0, endValue: len, filterMode: 'filter', width: 20, brushSelect: true, yAxisIndex: 0, left: 0, bottom: 20 },
            { show: len > 5, type: 'inside', filterMode: 'filter', start: 0, end: 100, yAxisIndex: 0, zoomOnMouseWheel: false, moveOnMouseMove: false, moveOnMouseWheel: true },
          ],
          xAxis: [
            {
              type: 'value',
              show: true,
              name: this.options.xAxisUnitName || this.$t('unitKwh'),
              max: value => (+value.max * 1.1).toFixed(0),
              position: 'top',
              nameGap: -60,
              nameTextStyle: { color: '#fff', verticalAlign: 'bottom', lineHeight: 60 },
              axisLine: { show: true, onZero: false, symbol: ['none', 'arrow'], lineStyle: { color: '#4b4e55', width: 2 } },
              axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } },
              splitLine: { show: true, lineStyle: { type: 'dashed', color: '#4b4e55' } },
            },
          ],
          yAxis: [
            {
              type: 'category',
              offset: 2,
              inverse: true,
              axisLine: { show: true, onZero: true, lineStyle: { color: '#4b4e55', width: 2 } },
              axisTick: { onGap: 0, alignWithLabel: true, lineStyle: { color: '#767d8f' } },
              data: this.options.yAxisData,
              splitArea: { show: true, areaStyle: { color: ['rgba(242, 242, 242, 0.1)', 'rgba(242, 242, 242, 0.1)'] } },
              splitLine: { show: true, lineStyle: { color: '#1a202e', width: 5 } },
              axisLabel: { show: true, textStyle: { color: '#fff' } },
            },
          ],
          series: [...this.options.seriesData],
        }

        this.eChart && this.eChart.hideLoading()
        this.eChartSetOption(options)
      },
      eChartResize() {
        this.eChart && this.eChart.resize()
      },
    },
    mounted() {
      this.eChart = echarts.init(this.$refs.eChart || document.getElementById(this.uniqueID))
      window.addEventListener('resize', this.eChartResize)
      this.init()
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.eChartResize)
      this.eChart && this.eChart.dispose()
      this.eChart = null
    },
    watch: {
      options: {
        handler() {
          this.init()
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less">
  .bar-chart {
    width: 100%;
    min-height: 450px;
  }
</style>
