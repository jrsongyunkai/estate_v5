<template>
  <div class="">
    <div style="margin-left: 30px; display: flex; color: #dddddd; font-size: 16px">{{ title }}</div>
    <div :id="uniqueID" ref="eChart" class="line" :style="baseStyle"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'Tc-equipment-line',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
      title: { type: String, default: '' },
      onGetEchartsInstance: {
        type: Function,
        require: false,
      },
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: { height: '300px' },
      }
    },
    methods: {
      init() {
        let that = this
        const options = {
          grid: { x: 60, y: 10, x2: 30, y2: this.options.grid ? this.options.grid : 80, borderWidth: 0 },
          tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: datas => {
              let res = ''
              for (let i = 0, length = datas.length; i < length; i++) {
                if (that.options.time && i === 0) {
                  res = that.$t('time') + ': ' + datas[i].axisValue + '<br/>'
                }
                res += datas[i].marker + datas[i].seriesName + '：' + (datas[i].value !== undefined ? (datas[i].value === true ? that.$t('closing') : datas[i].value === false ? that.$t('opening') : datas[i].value) : '') + '<br/>'
              }
              return res
            },
          },
          legend: {
            show: this.options.legendDisplay === false ? this.options.legendDisplay : true,
            y: 'bottom',
            data: this.options.series.name,
            padding: 10,
            selectedMode: this.options.legendSelect ? this.options.legendSelect : false,
            textStyle: { color: '#fff' },
          },
          xAxis: [
            {
              type: 'category',
              data: this.options.xAxis,
              axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } },
              axisTick: { onGap: 0, lineStyle: { color: '#767d8f' } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              splitLine: { show: false },
            },
          ],
          yAxis: [
            {
              type: 'value',
              splitArea: { show: true, areaStyle: { color: ['transparent', 'transparent'] } },
              splitLine: { show: this.options.splitLine ? this.options.splitLine : false, lineStyle: { color: '#274473' } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisLabel: { show: true, textStyle: { color: '#fff' } },
            },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
        this.onGetEchartsInstance && this.onGetEchartsInstance(this.eChart)
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
    },
  }
</script>
<style lang="less" scoped>
  .line {
    width: 100%;
  }
</style>
