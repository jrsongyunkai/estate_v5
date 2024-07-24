<template>
  <div ref="eChart" class="bar" :style="baseStyle"></div>
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
      type: {
        type: String,
      },
      onGetEchartsInstance: {
        type: Function,
        require: false,
      },
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: {
          height: '300px',
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
            textStyle: { color: '#000', fontSize: 16 },
            left: 20,
            top: 0,
          },
          grid: {
            x: 50,
            y: this.type === 'warntypeReport' ? 10 : 50,
            x2: 30,
            y2: 80,
            borderWidth: 0,
            bottom: this.options.flag ? '50' : '110',
          },
          tooltip: {},
          legend: {
            selectedMode: false,
            show: this.options.legendStatus,
            y: 'top',
            x: 'right',
            padding: [0, 50, 0, 0],
            data: this.legend,
            textStyle: {
              color: '#000',
            },
          },
          xAxis: [
            {
              type: this.options.xAxisType ? this.options.xAxisType : 'category',
              data: this.options.xAxis,
              max: this.options.xAxis && this.options.xAxis.max ? this.options.xAxis.max : null,
              axisLabel: {
                interval: 0,
                formatter: function (value) {
                  if (_this.type === 'warntypeReport') {
                    return value.split('').join('\n')
                  } else {
                    var ret = '' // 拼接加\n返回的类目项
                    var maxLength = 4 // 每项显示文字个数
                    var valLength = value.length // X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength) // 类目项需要换行的行数
                    if (rowN > 1) {
                      for (var i = 0; i < rowN; i++) {
                        var temp = '' // 每次截取的字符串
                        var start = i * maxLength // 开始截取的位置
                        var end = start + maxLength // 结束截取的位置
                        // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        temp = value.substring(start, end) + '\n'
                        ret += temp // 凭借最终的字符串
                      }
                      return ret
                    } else {
                      return value
                    }
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
              type: this.options.yAxisType ? this.options.yAxisType : 'value',
              data: this.options.yAxisType ? [this.$t('currentYear'), this.$t('lastYear')] : [],
              splitLine: { show: true, lineStyle: { type: 'dashed', color: ['#4e5159'] } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisLabel: { show: true, textStyle: { color: '#000' } },
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
        this.onGetEchartsInstance && this.onGetEchartsInstance(this.eChart)
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
<style scoped>
  .bar {
    width: 100%;
  }
</style>
