<template>
  <div ref="eChart" class="bar"></div>
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
    },
    mixins: [eChartMixins],
    data() {
      return {}
    },
    methods: {
      init() {
        const options = {
          title: {
            show: false,
            text: '',
            textStyle: { color: '#fff', fontSize: 16 },
            left: 20,
            top: 0,
          },
          color: ['#d70720', '#f2920a', '#0076ff', '#02c35b'],
          grid: {
            left: 50,
            right: 30,
            top: 100,
            bottom: 20,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          xAxis: [
            {
              type: 'category',
              data: this.options.xAxis,
              axisTick: { onGap: 0, lineStyle: { color: '#767d8f' } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              splitLine: { show: false },
            },
          ],
          legend: {
            orient: 'horizontal',
            align: 'left',
            top: 0,
            right: 0,
            icon: 'circle',
            textStyle: {
              color: '#fff',
            },
          },
          yAxis: [
            {
              name: `${this.$t('electricQuantity')}(kW·h)`,
              nameTextStyle: { color: '#acb1b8', fontSize: 12, padding: [0, 0, 0, 0] },
              type: 'value',
              splitLine: { show: true, lineStyle: { type: 'dashed', color: ['#4e5159'] } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisLabel: { show: true, textStyle: { color: '#fff' } },
            },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
    },
    watch: {
      options: {
        handler(newVal) {
          !!newVal && !!newVal.series && this.init()
        },
        deep: true,
      },
    },
  }
</script>
<style scoped>
  .bar {
    width: 100%;
    height: 330px;
  }
</style>
