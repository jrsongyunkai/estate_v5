<template>
  <div ref="eChart" class="group-chart"></div>
</template>

<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    mixins: [eChartMixins],
    data() {
      return {}
    },
    props: {
      options: {
        type: Object,
        default: () => {},
      },
    },
    methods: {
      init() {
        const options = {
          grid: {
            left: 50,
            right: 30,
            top: 80,
            bottom: 100,
          },
          title: {
            show: true,
            text: this.$t('groupPower'),
            textStyle: { color: '#fff', fontSize: 16 },
            left: 10,
            top: 20,
          },
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
              type: 'none',
            },
            formatter: data => {
              let res
              for (let i = 0; i < data.length - 1; i++) {
                if (i === 0) {
                  res = data[i].axisValue + '<br/>' + `${this.$t('totalElectricityConsumption1')}:` + data[data.length - 1].value + '<br/>'
                }
                res += data[i].marker + data[i].seriesName + ':' + data[i].value + '<br/>'
              }
              return res
            },
          },
          dataZoom: [
            {
              type: 'inside',
              startValue: 0,
              endValue: 9,
              filterMode: 'empty',
              zoomOnMouseWheel: false,
            },
            {
              type: 'slider',
              height: 20,
              bottom: 20,
              brushSelect: false,
            },
          ],
          legend: {
            orient: 'horizontal',
            align: 'left',
            top: 25,
            right: 0,
            icon: 'circle',
            textStyle: {
              color: '#fff',
            },
          },
          color: ['#d70720', '#f2920a', '#0076ff', '#02c35b', '#bc85ff'],
          yAxis: [
            {
              name: this.$t('leakageKwh'),
              nameTextStyle: { color: '#acb1b8', fontSize: 12, padding: [0, 0, 0, 0] },
              type: 'value',
              splitLine: { show: true, lineStyle: { type: 'dashed', color: ['#4e5159'] } },
              axisLine: { show: false, lineStyle: { color: '#767d8f' } },
            },
          ],
          xAxis: [
            {
              type: 'category',
              axisLabel: {
                interval: 0,
                overflow: 'breakAll',
                width: 100,
              },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisTick: { alignWithLabel: true },
              data: this.options.xAxis,
            },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
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

<style scoped>
  .group-chart {
    width: 100%;
    height: 430px;
  }
</style>
