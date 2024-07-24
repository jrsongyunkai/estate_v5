<template>
  <div ref="chartDom" v-resize="onResize">{{ seriesData }}</div>
</template>

<script>
  import dayjs from 'dayjs'
  import * as echarts from 'echarts5'
  import { compose, chunk, map, reduce } from 'lodash/fp'

  const LEVEL1 = 24 * 4
  const LEVEL2 = 24 * 4 * 30

  const fMap = {
    1: params => {
      const { data } = Array.isArray(params) ? params[0] : params

      return `${data.value}kW<br>${data.time}`
    },
    2: params => {
      const { data } = Array.isArray(params) ? params[0] : params
      const { value, time, realTime } = data
      const end = dayjs(time).add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      // 该值为{startTime}至{endTime}之间的最大瞬时功率，时间为{realTime}
      return `${value}kW<br>${window.$t('powerTrendTooltip', { startTime: time, endTime: end, realTime })}`
    },
    3: params => {
      const { data } = Array.isArray(params) ? params[0] : params
      const { value, time, realTime } = data
      const end = dayjs(time).add(1, 'day').format('YYYY-MM-DD HH:mm:ss')
      // 该值为{startTime}至{endTime}之间的最大瞬时功率，时间为{realTime}
      return `${value}kW<br>${window.$t('powerTrendTooltip', { startTime: time, endTime: end, realTime })}`
    },
  }

  export default {
    props: {
      timeRange: String,
      data: {
        type: Array,
        default() {
          return []
        },
      },
    },
    computed: {
      option() {
        const minMax = [
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
        ]
        const same = [
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
        ]
        return {
          legend: {
            top: 100,
            show: false,
            selected: {
              1: this.timeRange === '1',
              2: this.timeRange === '2',
              3: this.timeRange === '3',
            },
          },
          grid: {
            left: 80,
            right: 20,
            top: 76,
            bottom: 100,
          },
          tooltip: {
            show: true,
            trigger: 'item',
            axisPointer: {
              type: 'line',
            },
            formatter: fMap[this.timeRange],
          },
          dataZoom: [
            {
              type: 'inside',
              filterMode: 'empty',
              start: 0,
              end: 100,
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
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              name: `${this.$t('powerValue')}（kW）`,
              nameTextStyle: {
                color: '#acb1b8',
                fontSize: 12,
                padding: [0, 0, 0, 0],
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
          dataset: this.seriesData.map(source => ({ source })),
          series: this.seriesData.map((data, i) => {
            return {
              datasetIndex: i,
              name: `${i + 1}`,
              encode: {
                x: 'time',
                y: 'value',
              },
              type: 'line',
              // symbolSize: 14,
              // showAllSymbol: true,
              connectNulls: false,
              itemStyle: {
                color: 'rgb(47, 251, 237)',
              },
              markPoint: {
                silent: true,
                data: this.$func.isSameArray(data.map(item => item.value).filter(item => item !== null)) ? same : minMax,
              },
            }
          }),
        }
      },
      seriesData() {
        const ret = [this.data]
        if (this.timeRange > 1) {
          ret.push(this.splitData(4))
        }
        if (this.timeRange > 2) {
          ret.push(this.splitData(4 * 24))
        }
        return ret
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
        handler() {
          this.chart && this.chart.setOption(this.option, true)
        },
        deep: true,
      },
    },
    methods: {
      init() {
        this.chart = echarts.init(this.$refs.chartDom)
        this.chart.setOption(this.option)
        this.chart.on('dataZoom', e => {
          if (this.timeRange === 1) return
          const { start, end } = e.batch ? e.batch[0] : e
          const dataNum = (((end - start) / 100) * this.seriesData[0].length) | 0
          if (dataNum <= LEVEL1) {
            this.selectLegend('1')
          } else if (dataNum <= LEVEL2) {
            this.selectLegend('2')
          } else {
            this.selectLegend('3')
          }
        })
      },
      selectLegend(name) {
        ;['1', '2', '3'].forEach(item => {
          this.chart.dispatchAction({
            type: item === name ? 'legendSelect' : 'legendUnSelect',
            name: item,
          })
        })
        this.chart.setOption({
          tooltip: {
            formatter: fMap[name],
          },
        })
      },
      onResize() {
        this.chart && this.chart.resize()
      },
      splitData(n) {
        const getMax = reduce((ret, item) => {
          if (!ret) ret = { ...item, realTime: item.time }
          if (item.value !== null && (item.value > ret.value || ret.value === null)) {
            ret.value = item.value
            ret.realTime = item.time
          }
          return ret
        }, null)
        const process = compose([map(getMax), chunk(n)])
        return process(this.data)
      },
    },
  }
</script>

<style lang="less" scoped></style>
