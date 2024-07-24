<template>
  <div>
    <div :id="uniqueID" class="line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'line-area-chart',
    props: {
      title: String,
      refreshFlag: Boolean,
      lineAreaChartFlag: Boolean,
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
          height: this.$store.state.heightOne + 'px',
        },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        const options = {
          tooltip: {
            trigger: 'axis',
          },
          title: {
            show: this.options.title.show,
            text: this.options.title.text ? this.options.title.text : '',
            textStyle: {
              color: '#fff',
              fontSize: 14,
            },
            left: 0,
            top: 10,
          },
          legend: {
            orient: 'vertical',
            align: 'left',
            top: 10,
            x: 'right',
            icon: 'circle',
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            data: this.options.xAxis,
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            splitLine: {
              show: false,
            },
          },
          grid: {
            left: 50,
            top: '20%',
            bottom: '20%',
          },
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
      eChartResize() {
        if (document.getElementById(this.uniqueID)) document.getElementById(this.uniqueID).style.width = 976 + 'px'
        this.eChart.resize()
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options = newVal
            this.init()
          } else {
            this.options = oldVal
            this.init()
          }
        },
        deep: true,
      },
      '$store.state.heightOne': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal + 'px'
          }
        },
      },
      '$store.state.systemFlag': {
        handler(newVal, oldVal) {
          if (newVal && this.$store.state.toPath !== '') this.echart.resize()
        },
      },
      // '$store.state.toPath': {
      //     handler (newVal, oldVal) {
      //         document.getElementById(this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
      //         if (newVal) this.echart.resize()
      //     }
      // }
    },
  }
</script>
<style lang="less" scoped>
  .line-area {
    width: 82%;
  }

  .loading {
    position: relative;
  }

  .el-icon-loading {
    position: absolute;
    left: 43%;
    top: 39%;
    font-size: 50px;
    opacity: 0.5;
  }
</style>
