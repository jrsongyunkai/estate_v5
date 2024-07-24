<template>
  <div :id="uniqueID" class="bar" :style="baseStyle" v-resize="eChartResize"></div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'bar-charts',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: {
          height: this.$store.state.innerComponentHeight,
        },
      }
    },
    methods: {
      init() {
        let _this = this
        const options = {
          title: {
            show: this.options.title && this.options.title.show,
            text: this.options.title && this.options.title.text,
            textStyle: { color: '#fff', fontSize: 16 },
            left: 20,
            top: 0,
          },
          grid: { x: 60, y: 50, x2: 30, y2: 35, top: '60', borderWidth: 0 },
          tooltip: { show: this.options.tooltip.show, trigger: this.options.tooltip.trigger ? this.options.tooltip.trigger : 'axis', axisPointer: { type: 'shadow' }, formatter: this.options.tooltip.formatter ? this.options.tooltip.formatter : '{b} <br/>{c}' },
          xAxis: [
            {
              type: this.options.xAxisType ? this.options.xAxisType : 'category',
              data: this.options.xAxis,
              max: this.options.xAxis.max ? this.options.xAxis.max : null,
              axisLabel: {
                interval: 0,
                textStyle: { color: '#fff' },
                formatter: function (value, index) {
                  let ret = ''
                  let maxLength = 8
                  let valLength = value.length
                  let row = Math.ceil(valLength / maxLength)
                  if (row > 1) {
                    for (let i = 0; i < row; i++) {
                      let tmp = ''
                      let start = i * maxLength
                      let end = start + maxLength
                      tmp = value.substring(start, end) + '\n'
                      ret += tmp
                    }
                    return ret
                  } else {
                    return value
                  }
                },
              },
              axisTick: { onGap: 0, lineStyle: { color: '#767d8f' } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              splitLine: { show: false },
            },
          ],
          yAxis: [
            {
              name: `${this.$t('electricQuantity')}(kW·h)`,
              nameTextStyle: { color: '#acb1b8', fontSize: 12, padding: [0, 0, 0, 0] },
              type: this.options.yAxisType ? this.options.yAxisType : 'value',
              data: this.options.yAxisType ? [this.$t('currentYear'), this.$t('lastYear')] : [],
              splitLine: { show: true, lineStyle: { type: 'dashed', color: ['#4e5159'] } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisLabel: { show: true, textStyle: { color: '#fff' } },
            },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
        if (this.options.monitor) {
          this.eChart.on('click', function (params) {
            if (_this.options.dateType === 2) {
              _this.$emit('passIndex', params.dataIndex + 1)
            } else {
              _this.$emit('passIndex', params.dataIndex)
            }
          })
        }
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
    },
  }
</script>
<style scoped>
  .bar {
    width: 100%;
  }
</style>
