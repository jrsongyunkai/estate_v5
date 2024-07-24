<template>
  <div>
    <div :id="uniqueID" ref="eChart" class="line-area" :style="baseStyle"></div>
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
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: {
          height: this.$route.path !== '/energyMonitor/load' ? this.$store.state.heightOne + 'px' : '300px',
        },
      }
    },
    methods: {
      init() {
        const options = {
          tooltip: {
            trigger: 'axis',
          },
          title: {
            show: this.options.title.show,
            text: this.options.title.text ? this.options.title.text : '',
            textStyle: { color: '#fff', fontSize: 16 },
            left: 0,
            top: 10,
          },
          legend: {
            show: true,
            orient: 'horizontal',
            align: 'left',
            right: 10,
            data: this.options.series.name,
            icon: 'emptycircle',
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 10, // 设置间距
            textStyle: { color: '#fff' },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: { lineStyle: { color: '#DDDDDD' } },
            data: this.options.xAxis,
          },
          yAxis: [{ name: this.options.yAxis.name, type: 'value', axisLine: { lineStyle: { color: '#DDDDDD' } }, splitLine: { show: true, lineStyle: { type: 'dashed', color: ['#4e5159'] } } }],
          grid: { left: this.options.left !== undefined ? this.options.left : 70, right: '2%', top: '20%', bottom: '10%' },
          series: this.options.series,
        }
        this.eChartSetOption(options)
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
          if (newVal && this.$store.state.toPath !== '') this.eChartResize()
        },
      },
      '$store.state.toPath': {
        handler(newVal, oldVal) {
          document.getElementById(this.uniqueID).style.width = window.innerWidth * 0.2083333 - 22 + 'px'
          if (newVal) this.eChartResize()
        },
      },
    },
  }
</script>
<style lang="less" scoped>
  .line-area {
    width: 100%;
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
