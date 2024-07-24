<template>
  <div class="line-chart" ref="eChart" :style="{ height: `${chartHeight}px` }" v-resize="eChartResize"></div>
</template>

<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'QualityChart',
    props: {
      options: { type: Object, default: () => {} },
    },
    mixins: [eChartMixins],
    data() {
      return {
        chartHeight: 400,
      }
    },
    methods: {
      getRowNumber(num) {
        return num <= 10 ? 1 : num > 10 && num <= 30 ? 4 : num > 30 && num <= 50 ? 6 : 10
      },
      init() {
        this.chartHeight = Math.ceil(this.options.series.length / 18) * 26 + 376
        let options = {
          title: { show: !!this.options.title, text: this.options.title, textStyle: { color: '#fff', fontSize: 14, fontWeight: 'normal' } },
          legend: { type: 'plain', show: true, left: 'right', top: 15, right: 0, textStyle: { color: '#fff' }, icon: 'circle', itemWidth: 5, itemHeight: 5 },
          grid: { x: 45, y: Math.ceil(this.options.series.length / 18) * 26 + 36, x2: 30, y2: 60, borderWidth: 0, bottom: 70 },
          colors: this.options.colors,
          xAxis: {
            type: 'category',
            data: this.options.xAxisData,
            axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } },
            axisTick: { onGap: 0, alignWithLabel: true, lineStyle: { color: '#767d8f' } },
            axisLine: { lineStyle: { color: '#666' } },
            splitLine: { show: false },
            boundaryGap: true,
          },
          yAxis: {
            name: this.options.yAxisName || '',
            nameGap: 25,
            type: 'value',
            nameTextStyle: { color: '#fff' },
            splitArea: { show: false },
            axisLine: { show: true, lineStyle: { color: '#666' } },
            axisLabel: { show: true, textStyle: { color: '#fff' } },
            axisTick: { show: false },
            splitLine: { show: true, interval: 1, lineStyle: { color: '#555', type: 'dashed' } },
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            showContent: true,
            confine: true,
            axisPointer: { type: this.options.type === 'bar' ? 'shadow' : 'line' },
            backgroundColor: 'rgba(0,0,0,0.8)',
            formatter: datas => {
              let res = `<h4>${datas[0].axisValueLabel}</h4>`
              let rowNumber = this.getRowNumber(datas.length)
              for (let i = 0, length = datas.length; i < length; i++) {
                let { marker, seriesName, value } = datas[i]
                let unit = this.options.unit || '%'
                if (seriesName.indexOf(this.$t('meritoriousService')) > -1) {
                  unit = 'kW·h'
                } else if (seriesName.indexOf(this.$t('reactivePower')) > -1) {
                  unit = 'Kvar·h'
                } else if (seriesName.indexOf(this.$t('apparent')) > -1) {
                  unit = 'KVA·h'
                }
                res += `<span style="display:inline-block;min-width:200px;text-algin:left">${marker}${seriesName}:${typeof value === 'object' ? (value[1] === void 0 ? '-' : value[1]) : value}${unit}</span> &nbsp;&nbsp;&nbsp;`
                if ((i + 1) % rowNumber === 0) {
                  res += '<br/>'
                }
              }
              return res
            },
          },
          dataZoom: [
            { show: true, start: 0, end: 100, height: 16, brushSelect: true, filterMode: 'filter' },
            // { type: 'inside', start: 0, end: 100, filterMode: 'none' },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
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
  .line-chart {
    width: 100%;
    min-height: 400px;
  }
</style>
