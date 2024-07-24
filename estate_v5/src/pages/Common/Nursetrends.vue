<template>
  <div>
    <div ref="eChart" class="line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'Nursetrends',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
      trend: Boolean,
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: {
          height: this.trend ? '300px' : '250px',
        },
      }
    },
    methods: {
      init() {
        var data = this.options
        var colors = ['#0DD667', '#E0E71C', '#0097fc', '#e89039', '#E03C3A']
        let options = {
          title: { text: this.$t('unitPieces'), left: 19, top: 15, textStyle: { color: '#999', fontSize: '12px' } },
          color: colors,
          legend: {
            icon: this.trend ? 'circle' : '',
            top: 10,
            right: 0,
            itemWidth: 10,
            itemHeight: 10,
            textStyle: { fontSize: 14, color: '#999', padding: [3, 0, 0, 0] },
            data: data.legend,
          },
          grid: { left: '3%', right: this.trend ? '3%' : '8%', bottom: '0%', containLabel: true },
          xAxis: {
            name: this.$t('age'),
            type: 'category',
            axisLabel: { color: '#999' },
            axisLine: { lineStyle: { color: '#999' }, width: 5 },
            axisTick: { show: false },
            data: data.xdata,
          },
          yAxis: {
            type: 'value',
            axisLabel: { color: '#999' },
            axisLine: { lineStyle: { color: '#999' }, show: false, width: 5 },
            axisTick: { show: false },
            splitLine: { lineStyle: { type: 'dashed', color: '#999' } },
          },
          series: [],
        }
        if (data.legend) {
          for (var i = 0; i < data.legend.length; i++) {
            options.series.push({ name: data.legend[i], type: 'bar', stack: 'total', barWidth: '20%', label: { show: false, position: 'insideRight' }, data: data.data[i] })
          }
          if (this.trend) {
            for (var j = 0; j < data.legend.length; j++) {
              options.series.push({ name: data.legend[j], type: 'line', symbolSize: 6, stack: 'total', barWidth: '20%', label: { show: false, position: 'insideRight' }, data: data.data[j] })
            }
          }
        }
        this.eChartSetOption(options)
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.init()
          }
        },
        deep: true,
      },
    },
  }
</script>
