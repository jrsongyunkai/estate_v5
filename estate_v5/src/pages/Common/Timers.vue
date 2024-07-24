<template>
  <div>
    <div :id="uniqueID" :style="baseStyle" style="width: '100%'"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    props: {
      options: { type: Array, default: () => [] },
    },
    data() {
      return {
        uniqueID: '',
        echart: '',
        baseStyle: {
          height: this.$store.state.heightOne + 'px',
        },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        setTimeout(() => {
          let _this = this
          var data = _this.options
          var colors = ['rgba(17, 165, 88,.8)', 'rgba(7, 101, 199,.8)', 'rgba(171, 53, 55,.8)', 'rgba(255, 168, 84, 0.8)']
          var colors2 = ['rgba(17, 165, 88,.2)', 'rgba(7, 101, 199,.2)', 'rgba(171, 53, 55,.2)', 'rgba(255, 168, 84, 0.2)']
          var lineColors = data.map((value, index) => {
            var lineNumber = (1 / 1440) * (index + 1)
            return [lineNumber, colors[value - 1]]
          })
          var lineColors2 = data.map((value, index) => {
            var lineNumber = (1 / 1440) * (index + 1)
            return [lineNumber, colors2[value - 1]]
          })
          const options = {
            series: [
              {
                name: 'color',
                type: 'gauge',
                center: ['50%', '50%'],
                radius: '90%',
                min: 0,
                startAngle: 90,
                endAngle: -269.9999,
                animation: 0,
                pointer: { show: true },
                axisLine: { lineStyle: { color: lineColors2, width: 300 } },
                splitLine: { show: false, length: 18, lineStyle: { width: 1 } },
                axisTick: { show: false },
                axisLabel: { show: false },
                title: { show: false },
                detail: { show: false },
                data: [],
              },
              {
                name: 'hours',
                type: 'gauge',
                radius: '82%',
                min: 0,
                max: 24,
                startAngle: 90,
                endAngle: -269.99999,
                splitNumber: 24,
                axisLine: { lineStyle: { color: [[1, '#fff']], width: 0 } },
                axisLabel: {
                  show: true,
                  distance: 2,
                  formatter: function (t) {
                    return t || ''
                  },
                  fontSize: 12,
                  color: '#fff',
                },
                axisTick: { length: 12, lineStyle: { color: 'auto', width: 1 } },
                splitLine: { length: 16, lineStyle: { color: 'auto', width: 2 } },
                detail: { show: false },
              },
              {
                name: 'minute',
                type: 'gauge',
                radius: '90%',
                min: 0,
                max: 60,
                startAngle: 90,
                endAngle: -269.99999,
                splitNumber: 60,
                axisLine: { show: true, lineStyle: { color: lineColors, width: 10 } },
                axisLabel: { show: false, distance: 10 },
                axisTick: { show: false, length: 4, lineStyle: { color: 'auto', width: 1 } },
                splitLine: { show: false, length: 4, lineStyle: { color: 'auto', width: 1 } },
                detail: { show: false },
              },
            ],
          }
          this.eChartSetOption(options)
        }, 1500)
      },
      eChartResize() {
        if (document.getElementById(this.uniqueID)) document.getElementById(this.uniqueID).style.width = window.innerWidth * 0.2083333 - 22 + 'px'
        this.eChart && this.eChart.resize()
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
      '$store.state.heightOne': {
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
  .length {
    display: flex;
    justify-content: center;
    margin-right: 20px;
    span {
      display: flex;
      align-items: center;
      margin: 0 20px;
      i {
        width: 10px;
        height: 10px;
        display: block;
        margin-right: 5px;
      }
    }
  }
  .length span:nth-child(1) {
    i {
      background: #e03c3a;
    }
  }
  .length span:nth-child(2) {
    i {
      background: #ffa854;
    }
  }
  .length span:nth-child(3) {
    i {
      background: #007fff;
    }
  }
  .length span:nth-child(4) {
    i {
      background: #0dd667;
    }
  }
</style>
