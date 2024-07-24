<template>
  <div :id="uniqueID" class="screenBar" :style="baseStyle"></div>
</template>
<script>
  import uuid from 'uuid/v1'
  import echarts from 'echarts'
  // import 'echarts/lib/chart/bar'
  // import 'echarts/lib/component/tooltip';
  // import 'echarts/lib/component/title'
  export default {
    name: 'screenBar',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        uniqueID: '',
        chart: '',
        baseStyle: {
          height: (this.$store.state.screenBarHeight || this.$store.state.heightTwo) + 'px',
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
    destroyed() {
      window.removeEventListener('resize', this.chartResize)
      echarts.dispose(this.echart)
      this.echart = null
    },
    methods: {
      chartResize() {
        this.echart.resize()
      },
      init() {
        this.echart = echarts.init(document.getElementById(this.uniqueID))
        this.setChartOption()
      },
      setChartOption() {
        const options = {
          title: {
            show: this.options.title.show,
            text: this.options.title.text,
            textStyle: {
              color: '#fff',
              fontSize: 14,
            },
            left: 22,
            top: 5,
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            confine: true,
            // formatter: function (datas) {
            //   console.log(datas, '--------')
            //   // let res = ''
            //   // for (let i = 0, length = datas.length; i < length; i++) {
            //   //     if (i === 0) res = datas[i].axisValue + '<br/>'
            //   //     res += datas[i].seriesName + '：' + (datas[i].value !== undefined ? datas[i].value : '') + '<br/>'
            //   // }
            //   return 1111
            // },
          },
          grid: {
            x: 50,
            y: 40,
            x2: 20,
            y2: 20,
            bottom: '80',
            top: '60',
            borderWidth: 0,
          },
          legend: {
            show: true,
            orient: 'horizontal',
            align: 'left',
            data: this.options.series.name,
            x: 'right',
            icon: 'circle',
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: [
            {
              type: 'category',
              offset: 2,
              data: this.options.xAxis,
              axisPointer: {
                type: 'shadow',
                show: false, // 禁止第二条 x 轴的 tooltip 显示
              },
              axisTick: {
                show: false,
              },
              boundaryGap: true,
              axisLine: {
                lineStyle: {
                  color: '#99b3c8',
                  width: 1,
                },
              },
            },
            {
              type: 'category',
              offset: 2,
              data: this.options.xAxis,
              axisPointer: {
                type: 'shadow',
              },
              axisTick: {
                show: false,
              },
              show: false,
              axisLine: {
                show: false,
              },
              boundaryGap: true,
            },
          ],
          yAxis: [
            {
              scale: true,
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: ['#4e5159'],
                },
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#767d8f',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#99b3c8',
                },
              },
            },
          ],
          series: this.options.series,
        }
        this.echart.clear()
        this.echart.setOption(options, true)
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options.xAxis = newVal.xAxis
            this.options.series = newVal.series
            this.setChartOption()
          }
        },
        deep: true,
      },
      '$store.state.heightTwo': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal + 'px'
          }
        },
      },
    },
  }
</script>
<style lang="less" scoped>
  .screenBar {
    width: 100%;
    background-color: transparent;
  }
</style>
