<template>
  <div ref="chartDom" v-resize="onResize"></div>
</template>

<script>
  import * as echarts from 'echarts5'

  export default {
    props: {
      data: {
        type: Array,
        default() {
          return []
        },
      },
    },
    computed: {
      option() {
        const markPoint = {
          data: [
            {
              type: 'max',
              symbol: this.$func.echartsSymbolMax,
              symbolOffset: [0, -30],
              label: {
                fontSize: 11,
                align: 'center',
                color: '#ff4f4f',
                offset: [0, -16],
              },
            },
            {
              type: 'min',
              symbolOffset: [0, -30],
              symbol: this.$func.echartsSymbolMin,
              label: {
                color: '#00ba8a',
                fontSize: 11,
                align: 'center',
                offset: [0, -16],
              },
            },
          ],
        }
        const maxPoint = {
          data: [
            {
              type: 'max',
              symbol: this.$func.echartsSymbolOverlap,
              symbolOffset: [0, -30],

              label: {
                fontSize: 11,
                align: 'center',
                color: '#007eff',
                offset: [0, -16],
              },
            },
          ],
        }
        return {
          color: ['#02c35b', '#0076ff', '#f2920a', '#d70720'],
          legend: {
            show: true,
            selectedMode: false,
            right: 20,
            top: 20,
            textStyle: {
              color: '#fff',
            },
            data: [this.$t('sharpHourElectricityConsumption'), this.$t('peakHourElectricityConsumption'), this.$t('regularElectricityConsumption'), this.$t('electricityConsumptionDuringValleyHours')],
          },
          grid: {
            left: 80,
            right: 20,
            top: 76,
            bottom: 100,
          },
          tooltip: {
            show: true,
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          dataZoom: [
            {
              type: 'inside',
              startValue: 0,
              endValue: 9,
              filterMode: 'empty',
            },
            {
              type: 'slider',
              height: 20,
              bottom: 20,
              brushSelect: false,
            },
          ],
          xAxis: [
            {
              type: 'category',
              axisLine: {
                lineStyle: {
                  color: '#fff',
                },
              },
              axisLabel: {
                interval: 0,
                overflow: 'breakAll',
                width: 100,
              },
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: `${this.$t('electricQuantity')}（kW·h）`,
              nameTextStyle: {
                // y轴name的样式调整
                color: '#acb1b8',
                fontSize: 12,
                padding: [0, 0, 0, 0], // 加上padding可以调整其位置
              },
              splitLine: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: ['#4e5159'],
                },
              },
              axisLabel: {
                show: true,
                color: '#fff',
              },
            },
          ],
          dataset: {
            sourceHeader: false,
            source: this.data,
          },
          series: [
            {
              name: this.$t('totalElectricityConsumption1'),
              silent: true,
              tooltip: {
                show: true,
              },
              type: 'bar',
              barGap: '-100%',
              encode: {
                x: 1,
                y: 6,
              },
              itemStyle: {
                color: 'transparent',
              },
              markPoint: this.$func.isSameArray(this.data.map(item => item[2])) ? maxPoint : markPoint,
            },
            ...[this.$t('sharpHourElectricityConsumption'), this.$t('peakHourElectricityConsumption'), this.$t('regularElectricityConsumption'), this.$t('electricityConsumptionDuringValleyHours')].map((name, i) => ({
              name,
              type: 'bar',
              barGap: '-100%',
              stack: 'project',
              encode: {
                x: 1,
                y: 5 - i,
              },
            })),
          ],
        }
      },
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.chart && this.chart.dispose()
    },
    watch: {
      data: {
        handler(newVal) {
          this.chart && this.chart.setOption(this.option, true)
        },
        deep: true,
      },
    },
    methods: {
      init() {
        this.chart = echarts.init(this.$refs.chartDom)
        this.chart.setOption(this.option)
      },
      onResize() {
        this.chart && this.chart.resize()
      },
    },
  }
</script>

<style lang="less" scoped></style>
