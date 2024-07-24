<template>
  <div ref="eChart" class="bar" :style="baseStyle"></div>
</template>
<script>
  import echarts from 'echarts'
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'OpecoStatus',
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
        var data1sLength = this.options.data.length
        var ner = []
        var nes = []
        for (var i = 0; i <= data1sLength; i++) {
          ner.push(0)
          nes.push(10)
        }
        var options = {
          grid: { top: '0%', left: '5%', right: '5%', bottom: '20%', borderWidth: 0 },
          xAxis: [
            {
              axisTick: { show: true, textStyle: { color: '#fff' } },
              axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } },
              axisLine: { lineStyle: { color: '#fff' } },
              data: this.options.time,
            },
            { type: 'value', min: 20, max: 80, gridIndex: 0, splitLine: { show: false, textStyle: { color: '#fff' } }, axisLine: { show: false }, axisTick: { show: false } },
          ],
          yAxis: [
            { show: false, min: 0, max: 20, position: 'right', splitLine: { show: false }, axisLabel: { show: false } },
            {
              type: 'category',
              position: 'left',
              axisLabel: { show: true },
              axisLine: { show: false, lineStyle: { color: '#fff', type: 'solid' } },
              axisTick: { show: false },
              splitLine: { show: false },
              data: [this.$t('close'), this.$t('open3')],
            },
          ],
          series: [
            { type: 'line', name: this.$t('close'), symbol: 'none', z: 2, lineStyle: { normal: { width: 0, opacity: 0 } }, data: ner },
            { type: 'line', name: this.$t('open3'), symbol: 'none', z: 0, lineStyle: { normal: { width: 0, opacity: 0 } }, data: nes },
            {
              name: this.$t('valveStatus'),
              type: 'bar',
              stack: this.$t('valveStatus'),
              barCategoryGap: 0,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: 'transparent' },
                    { offset: 0.5, color: 'transparent' },
                    { offset: 0.8, color: 'rgba(0, 0, 0, 0)' },
                    { offset: 0.92, color: 'rgba(0, 0, 0, 0)' },
                    { offset: 1, color: 'rgba(0, 0, 0, 0)' },
                  ]),
                },
              },
              data: this.options.data,
            },
            {
              type: 'bar',
              stack: this.$t('valveStatus'),
              silent: true,
              data: ner,
              barMinHeight: 1,
              itemStyle: { normal: { color: '#007eff', shadowColor: 'rgba(0, 0, 0, 1)', shadowBlur: 10, shadowOffsetX: 0 } },
            },
          ],
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
