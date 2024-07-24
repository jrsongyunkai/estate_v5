<template>
  <div ref="eChart" style="width: 100%" :style="baseStyle"></div>
</template>
<script>
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
      onGetEchartsInstance: {
        type: Function,
        require: false,
      },
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: {
          height: this.$store.state.innerComponentHeight,
        },
        assistLine: [],
      }
    },
    methods: {
      creatNewLine(length, curIndex, cur, item) {
        let threeAline = new Array(length).fill(undefined)
        threeAline[curIndex - 1] = cur
        threeAline[curIndex] = item
        return threeAline
      },
      init() {
        var data1sLength = this.options.data
        let cur
        this.options.data
          .map(v => {
            if (v === 0) return 0
            if (v === 1) return 1
            if (v === 2) return 2
            if (v === 3) return 3
            if (v === 4) return 4
            if (!v) return 0
            return v
          })
          .forEach((item, index) => {
            if (index === 0) {
              cur = item
              return
            }
            if (cur !== item && (item !== 0 || item !== 1 || item !== 2 || item !== 3 || item !== 4)) {
              this.assistLine.push(this.creatNewLine(this.options.data.length, index, cur, item))
            }
            cur = item
          })
        let normal = []
        let normalLine = []
        let lowanomaly = []
        let lowanomalyLine = []
        let moderateanomaly = []
        let moderateanomalyLine = []
        let higheranomaly = []
        let higheranomalyLine = []
        let highanomaly = []
        let highanomalyLine = []
        data1sLength.forEach((item, index) => {
          if (item === 0) {
            normal[index] = 0
          } else {
            normal[index] = undefined
          }
          if (item === 1) {
            lowanomaly[index] = 1
          } else {
            lowanomaly[index] = undefined
          }
          if (item === 2) {
            moderateanomaly[index] = 2
          } else {
            moderateanomaly[index] = undefined
          }
          if (item === 3) {
            higheranomaly[index] = 3
          } else {
            higheranomaly[index] = undefined
          }
          if (item === 4) {
            highanomaly[index] = 4
          } else {
            highanomaly[index] = undefined
          }
          normalLine[index] = 0
          lowanomalyLine[index] = 1
          moderateanomalyLine[index] = 2
          higheranomalyLine[index] = 3
          highanomalyLine[index] = 4
        })
        var options = {
          grid: { top: '10%', left: '10%', right: '5%', bottom: '20%', borderWidth: 0 },
          xAxis: [
            {
              axisTick: { show: true, textStyle: { color: '#fff' } },
              axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } },
              axisLine: { lineStyle: { color: '#fff' } },
              data: this.options.time,
            },
            {
              type: 'value',
              gridIndex: 0,
              splitLine: { show: false, textStyle: { color: '#fff' } },
              axisLine: { show: false },
              axisTick: { show: false },
            },
          ],
          yAxis: [
            {
              type: 'category',
              position: 'left',
              axisLabel: { show: true },
              axisLine: { show: false, lineStyle: { color: '#fff', type: 'solid' } },
              axisTick: { show: false },
              data: [this.$t('normal'), this.$t('lowAbnormal'), this.$t('mediumAbnormal'), this.$t('higherAbnormal'), this.$t('highAbnormal')],
            },
          ],
          series: [
            {
              type: 'line',
              stack: this.$t('highAbnormal'),
              silent: false,
              data: highanomaly,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#e03c3a', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('higherAbnormal'),
              silent: false,
              data: higheranomaly,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#ea903a', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('mediumAbnormal'),
              silent: false,
              data: moderateanomaly,
              barMinHeight: 1,
              lineStyle: { normal: { type: 'solid' } },
              itemStyle: {
                normal: { color: '#0096ff', shadowColor: 'transparent', shadowBlur: 10, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('lowAbnormal'),
              silent: false,
              data: lowanomaly,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#e0e71c', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('normal'),
              silent: false,
              data: normal,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#0DD667', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('highAbnormal'),
              silent: false,
              data: highanomalyLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('higherAbnormal'),
              silent: false,
              data: higheranomalyLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('mediumAbnormal'),
              silent: false,
              data: moderateanomalyLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('lowAbnormal'),
              silent: false,
              data: lowanomalyLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('normal'),
              silent: false,
              data: normalLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
          ],
        }
        if (this.assistLine.length) {
          options.series.push(
            ...this.assistLine.map(item => ({
              type: 'line',
              stack: 'dotted',
              silent: false,
              data: item,
              lineStyle: { normal: { type: 'dashed' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: { normal: { color: 'rgba(255, 255, 255,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 } },
            }))
          )
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
