<template>
  <div :id="uniqueID" class="line" :style="baseStyle" v-resize="eChartResize"></div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'line-chart',
    props: {
      options: { type: Object, default: () => {} },
      onGetEchartsInstance: { type: Function, require: false },
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: {
          height: this.options.height ? this.options.height : this.$store.state.innerComponentHeight,
        },
      }
    },
    methods: {
      init() {
        let that = this
        const options = {
          title: { show: this.options.title.show, text: this.options.title.text ? this.options.title.text : '', textStyle: { color: '#DDDDDD', fontSize: 16 }, left: 0, top: 0 },
          grid: { x: 60, y: 60, x2: 20, y2: this.options.grid ? this.options.grid : 50, borderWidth: 0 },
          tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: datas => {
              let res = ''
              for (let i = 0, length = datas.length; i < length; i++) {
                if (that.options.time && i === 0) {
                  res = this.$t('time') + ': ' + datas[i].axisValue + '<br/>'
                }
                res += datas[i].marker + datas[i].seriesName + '：' + (datas[i].value !== undefined ? (datas[i].value === true ? this.$t('closing') : datas[i].value === false ? this.$t('opening') : datas[i].value) : '') + '<br/>'
              }
              return res
            },
          },
          legend: { show: this.options.legendDisplay === false ? this.options.legendDisplay : true, y: 'bottom', data: this.options.series.name, padding: 10, selectedMode: this.options.legendSelect ? this.options.legendSelect : false, textStyle: { color: '#fff' } },
          xAxis: [{ type: 'category', data: this.options.xAxis, axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } }, axisTick: { onGap: 0, lineStyle: { color: '#767d8f' } }, axisLine: { lineStyle: { color: '#767d8f' } }, splitLine: { show: false }, rotate: -25 }],
          yAxis: [
            {
              name: `${this.$t('electricQuantity')}(kW·h)`,
              type: 'value',
              splitArea: { show: true, areaStyle: { color: ['transparent', 'transparent'] } },
              splitLine: { show: true, lineStyle: { type: 'dashed', color: '#4e5159' } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisLabel: { show: true, textStyle: { color: '#fff' } },
            },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options.xAxis = newVal.xAxis
            this.options.series = newVal.series
            this.init()
          }
        },
        deep: true,
      },
      '$store.state.innerComponentHeight': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal
          }
        },
      },
    },
  }
</script>
<style lang="less" scoped>
  .line {
    width: 100%;
  }
</style>
