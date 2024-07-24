<template>
  <div>
    <div :id="uniqueID" class="manage-line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
  import uuid from 'uuid/v1'
  import echarts from 'echarts'
  import dayjs from 'dayjs'
  export default {
    name: 'manage-line-area',
    props: {
      title: String,
      options: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        echart: '',
        uniqueID: '',
        baseStyle: {
          height: 170 + 'px',
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
        let tooltip = {
          trigger: 'axis',
          formatter: data => {
            let res
            for (let i = 0; i < data.length; i++) {
              if (i === 0) {
                res = (this.options.customTime ? dayjs(this.options.customTime[data[0].dataIndex]).format('YYYY-MM-DD') : '') + '  ' + data[i].axisValue + '<br/>'
              }
              res += data[i].marker + (this.options.customTime ? '' : data[i].seriesName + ': ') + (data[i].value || '-')
            }
            return res
          },
        }
        const options = {
          tooltip,
          title: {
            show: this.options.title.show,
            text: this.options.title.text,
            textStyle: {
              color: '#fff',
              fontSize: 14,
            },
            left: 0,
            top: 10,
          },
          legend: {
            orient: 'horizontal',
            align: 'left',
            top: 10,
            right: 10,
            icon: 'circle',
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#99B3C8',
              },
            },
            axisTick: {
              show: false,
            },

            data: this.options.xAxis,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: false,
              lineStyle: {
                color: '#99B3C8',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed', // 设置分割线类型，可以是 'solid', 'dotted', 'dashed' 等
                color: '#232f43', // 设置分割线颜色
              },
            },
          },
          grid: {
            left: '1%',
            right: '10',
            bottom: '10',
            containLabel: true,
          },
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
            this.options = newVal
            this.setChartOption()
          } else {
            this.options = oldVal
            this.setChartOption()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .manage-line-area {
    width: 100%;
  }
</style>
