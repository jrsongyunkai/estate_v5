<template>
  <div>
    <div :id="uniqueID" class="nest-pie" :style="baseStyle"></div>
  </div>
</template>
<script>
  import uuid from 'uuid/v1'
  import * as echarts from 'echarts5'
  // import 'echarts/lib/chart/pie'
  // import 'echarts/lib/component/tooltip';
  // import 'echarts/lib/component/title'
  // import 'echarts/lib/component/legendScroll'
  export default {
    name: 'nest-pie-chart',
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
        echart: '',
        uniqueID: '',
        legendLeft: '50%',
        baseStyle: {
          height: 180 + 'px',
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
        // if (document.getElementById(this.uniqueID)) {
        //   document.getElementById(this.uniqueID).style.width = window.innerWidth * 0.2083333 - 22 + 'px'
        // }
        this.echart.resize()
      },
      init() {
        this.echart = echarts.init(document.getElementById(this.uniqueID))
        this.setChartOption()
      },
      setChartOption() {
        if (document.documentElement.clientWidth > 1366) {
          this.legendLeft = '45%'
        } else {
          this.legendLeft = '40%'
        }
        const options = {
          tooltip: {
            trigger: 'item',
            formatter: '{b}',
            backgroundColor: 'transparent',
            textStyle: {
              color: '#fff',
            },
          },
          graphic: {
            elements: [
              {
                type: 'group',
                z: -1,
                left: '25%',
                top: '50%',
                bounding: 'raw',
                children: [
                  { type: 'image', style: { image: require('../../../assets/images/pieBgc.png'), width: 132, height: 132, x: -66, y: -66 } },
                  { type: 'text', left: 'center', style: { text: this.$t('deviceType'), textAlign: 'center', width: 132, textVerticalAlign: 'middle', fill: '#73AFEC', font: '14px' } },
                ],
              },
            ],
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            align: 'left',
            top: '7%',
            left: this.legendLeft,
            icon: 'circle',
            itemHeight: '10',
            textStyle: {
              color: '#99b3c8',
            },
            data: this.options.legend.data,
          },
          color: ['#0AABFE', '#8591FF', '#52FFE2', '#FFDD45', '#BC85FF', '#33a3dc', '#ffe600', '#45b97c', '#f3715c', '#0000FF', '#2E64FE', '#00FF80', '#FE9A2E'],
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
            this.options.series = newVal.series
            this.setChartOption()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .nest-pie {
    width: 100%;
  }
</style>
