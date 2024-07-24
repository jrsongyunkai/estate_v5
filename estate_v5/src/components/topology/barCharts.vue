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
      onGetEchartsInstance: {
        type: Function,
        require: false,
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
            show: this.options.title.show,
            text: this.options.title.text,
            textStyle: {
              color: '#fff',
              fontSize: 16,
            },
            left: 20,
            top: 0,
          },
          grid: {
            x: 60,
            y: 50,
            x2: 30,
            y2: 35,
            top: '60',
            borderWidth: 0,
          },
          tooltip: {
            show: this.options.tooltip.show,
            trigger: this.options.tooltip.trigger ? this.options.tooltip.trigger : 'axis',
            axisPointer: {
              type: 'shadow',
            },
            formatter: this.options.tooltip.formatter ? this.options.tooltip.formatter : '{b} <br/>{c}',
          },
          xAxis: [
            {
              type: this.options.xAxisType ? this.options.xAxisType : 'category',
              data: this.options.xAxis.data,
              max: this.options.xAxis.max ? this.options.xAxis.max : null,
              axisLabel: {
                interval: 2,
                textStyle: {
                  color: '#fff',
                },
              },
              axisTick: {
                onGap: 0,
                lineStyle: {
                  color: '#767d8f',
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#767d8f',
                },
              },
              splitLine: {
                show: false,
              },
            },
          ],
          yAxis: [
            {
              name: this.$t('leakageKwh'),
              nameTextStyle: {
                // y轴name的样式调整
                color: '#acb1b8',
                fontSize: 12,
                padding: [0, 0, 0, 0], // 加上padding可以调整其位置
              },
              type: this.options.yAxisType ? this.options.yAxisType : 'value',
              data: this.options.yAxisType ? [this.$t('currentYear'), this.$t('lastYear')] : [],
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: ['#4e5159'],
                },
              },
              axisLine: {
                lineStyle: {
                  color: '#767d8f',
                },
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff',
                },
              },
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
