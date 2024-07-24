<template>
  <div>
    <div :id="uniqueID" :class="unit === 'W' ? 'line' : 'line-song'" :style="baseStyle"></div>
  </div>
</template>
<script>
  import uuid from 'uuid/v1'
  import * as echarts from 'echarts5'

  export default {
    name: 'line-chart',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
      unit: { type: String, default: '' },
    },
    data() {
      return {
        uniqueID: '',
        echart: '',
        baseStyle: {
          height: this.options.height ? this.options.height : this.$store.state.innerComponentHeight,
        },
      }
    },
    created() {
      this.uniqueID = uuid()
    },
    mounted() {
      this.init()
      window.addEventListener('resize', this.chartResize)
    },
    methods: {
      init() {
        this.echart = echarts.init(document.getElementById(this.uniqueID))
        this.setChartOption()
      },
      setChartOption() {
        let that = this
        let datas = this.options
        const options = {
          title: {
            text: `${this.$t('unit')}：` + this.unit,
            textStyle: {
              color: '#999',
              fontSize: 12,
            },
            left: 19,
            top: 15,
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              data: datas.xAxis,
              axisLabel: {
                show: true,
                rotate: 0,
                color: '#fff',
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
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#999',
            },
            axisLine: {
              lineStyle: {
                color: '#999',
              },
              show: false,
              width: 5,
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#999',
              },
            },
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            backgroundColor: 'rgba(43, 45, 49,0.5)',
            textStyle: {
              color: '#fff',
            },
            borderWidth: '0',
            formatter: function (datas) {
              let res = ''
              for (let i = 0, length = datas.length; i < length; i++) {
                if (i === 0) {
                  res = that.$t('time') + ': ' + (datas[i].axisValue.length > 5 ? '' : '2023-') + datas[i].axisValue + '<br/>'
                }
                res += datas[i].marker + datas[i].seriesName + '：' + (datas[i].value !== undefined ? (datas[i].value === true ? that.$t('closing') : datas[i].value === false ? that.$t('opening') : datas[i].value) : '') + '<br/>'
              }
              return res
            },
          },
          series: datas.series,
        }
        this.echart.clear()
        this.echart.setOption(options, true)
      },
      chartResize() {
        if (document.getElementById(this.uniqueID)) {
          document.getElementById(this.uniqueID).style.width = window.innerWidth * 0.2083333 - 22 + 'px'
        }
        this.echart.resize()
      },
    },
    destroyed() {
      window.removeEventListener('resize', this.chartResize)
      echarts && echarts.dispose(this.echart)
      this.echart = null
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options.xAxis = newVal.xAxis
            this.options.series = newVal.series
            setTimeout(this.init, 500)
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
  .line-song {
    width: 800px;
  }
</style>
