<template>
  <div :id="uniqueID" class="screenBar" :style="baseStyle"></div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'screenBar',
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
        uniqueID: '',
        chart: '',
        baseStyle: {
          height: this.$store.state.heightTwo + 'px',
        },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        const options = {
          title: {
            show: this.options.title.show,
            text: this.options.title.text,
            textStyle: {
              color: '#000',
              fontSize: 14,
            },
            left: 22,
            top: 5,
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            confine: true,
            formatter: datas => {
              let res = ''
              for (let i = 0, length = datas.length; i < length; i++) {
                if (i === 0) res = datas[i].axisValue + this.$t('day') + '<br/>'
                res += datas[i].seriesName + '：' + (datas[i].value !== undefined ? datas[i].value : '') + this.$t('times') + '<br/>'
              }
              return res
            },
          },
          grid: {
            x: 50,
            y: 40,
            x2: 20,
            y2: 20,
            bottom: '80',
            borderWidth: 0,
          },
          legend: {
            show: true,
            orient: 'horizontal',
            align: 'left',
            data: this.options.series.name,
            x: 'right',
            y: 'top',
            padding: [0, 50, 0, 0],
            icon: 'circle',
            textStyle: {
              color: '#000',
            },
          },
          xAxis: [
            {
              type: 'category',
              offset: 2,
              data: this.options.xAxis,
              axisPointer: {
                type: 'shadow',
              },
              axisTick: {
                show: false,
              },
              boundaryGap: true,
              axisLine: {
                lineStyle: {
                  color: '#000',
                  width: 1,
                },
              },
            },
          ],
          yAxis: [
            {
              scale: true,
              type: 'value',
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: ['#4e5159'],
                },
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#767d8f',
                },
              },
              axisTick: {
                show: true,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#000',
                },
              },
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
      '$store.state.heightTwo': {
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
  .screenBar {
    width: 100%;
    background-color: transparent;
  }
</style>
