<template>
  <div ref="eChart" :id="uniqueID" class="line-area" :style="baseStyle"></div>
</template>
<script>
  import uuid from 'uuid/v1'
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'AirTrends',
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
        echart: '',
        uniqueID: '',
        baseStyle: {
          height: this.$route.path !== '/energyMonitor/load' ? this.$store.state.heightOne + 'px' : '300px',
        },
      }
    },
    created() {
      this.uniqueID = uuid()
    },
    methods: {
      init() {
        let unit = ''
        if (this.options.title.text === this.$t('IndoorTemperature')) {
          unit = '℃'
        } else if (this.options.title.text === this.$t('IndoorHumidity')) {
          unit = '%'
        } else if (this.options.title.text === this.$t('CurrentA')) {
          unit = 'A'
        } else if (this.options.title.text === this.$t('methaneConcentration') || this.options.title.text === this.$t('smokeConcentration')) {
          unit = '%'
        } else if (this.options.title.text === this.$t('environmentalTemperature')) {
          unit = '°C'
        } else if (this.options.title.text === this.$t('accumulatedTraffic')) {
          unit = 'm³'
        }
        const options = {
          tooltip: {
            trigger: 'axis',
            formatter: function (data) {
              let time = ''
              var text = ''
              time += data[0].name + '<br/>'
              data.map(val => {
                text += val.marker + val.seriesName + ': ' + val.value + unit + '<br/>'
              })

              return time + text
            },
          },
          title: {
            show: this.options.title.show,
            text: this.options.title.text ? this.options.title.text : '',
            textStyle: {
              color: '#dddddd',
              fontSize: 16,
            },
            left: 0,
            top: 10,
          },
          legend: {
            show: false,
            orient: 'horizontal',
            align: 'left',
            right: 20,

            data: this.options.series.name,
            icon: 'emptycircle',
            itemWidth: 10, // 设置宽度

            itemHeight: 10, // 设置高度

            itemGap: 10, // 设置间距
            textStyle: {
              color: '#fff',
            },
          },

          xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#DDDDDD',
              },
            },

            data: this.options.xAxis,
          },
          yAxis: [
            {
              name: this.options.yAxis.name,
              type: 'value',
              axisLine: {
                lineStyle: {
                  color: '#DDDDDD',
                },
              },
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: ['#4e5159'],
                },
              },
            },
          ],
          grid: {
            left: 70,
            right: '4%',
            top: '20%',
            bottom: '20%',
          },
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
            this.options = newVal
            this.init()
          } else {
            this.options = oldVal
            this.init()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .line-area {
    width: 100%;
  }
</style>
