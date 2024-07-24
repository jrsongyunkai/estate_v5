<template>
  <div :id="uniqueID" class="bar" :style="baseStyle"></div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'OpenCloseImitate',
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
        baseStyle: { height: '300px' },
        assistLine: [],
      }
    },
    methods: {
      createdNewLine(length, curIndex, cur) {
        let threeAline = new Array(length).fill(undefined)
        threeAline[curIndex - 1] = cur
        threeAline[curIndex] = cur === 0 ? 1 : 0
        return threeAline
      },
      init() {
        var data1sLength = this.options.data
        let cur
        this.options.data
          .map(v => {
            if (v === 100) return 0
            if (v === 101) return 1
            if (!v) return 0
            return v
          })
          .forEach((item, index) => {
            if (index === 0) {
              cur = item
              return
            }
            if (cur !== item && (item !== 100 || item !== 101)) {
              this.assistLine.push(this.createdNewLine(this.options.data.length, index, cur))
            }
            cur = item
          })
        let arr = []
        let newArr = []
        let dashedOneArr = []
        let dashedTwoArr = []
        let zeroLine = []
        let dshedLine = []
        data1sLength.forEach((item, index) => {
          if (item === 0) {
            newArr[index] = 0
          } else {
            newArr[index] = undefined
          }
          if (item === 100) {
            dashedOneArr[index] = 0
          } else {
            dashedOneArr[index] = undefined
          }
          if (item === 1) {
            arr[index] = 1
          } else {
            arr[index] = undefined
          }
          if (item === 101) {
            dashedTwoArr[index] = 1
          } else {
            dashedTwoArr[index] = undefined
          }
          zeroLine[index] = 0
          dshedLine[index] = 1
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
              axisLine: {
                show: false,
                lineStyle: { color: '#fff', type: 'dashed' },
              },
              axisTick: {
                show: false, // 刻度线
              },
              data: ['OFF', 'ON'],
            },
          ],
          series: [
            {
              type: 'line',
              stack: this.$t('valveStatus'),
              silent: true,
              data: arr,
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#0DD667', shadowColor: 'transparent', shadowBlur: 10, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: `${this.$t('valveStatus')}2`,
              silent: false,
              data: newArr,
              barMinHeight: 1,
              itemStyle: {
                normal: { color: 'red', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: `${this.$t('valveStatus')}3`,
              silent: false,
              data: dashedTwoArr,
              lineStyle: { normal: { type: 'dashed' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#999999', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: `${this.$t('valveStatus')}3`,
              silent: false,
              data: dashedOneArr,
              lineStyle: { normal: { type: 'dashed' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#999999', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: `${this.$t('valveStatus')}3`,
              silent: false,
              data: zeroLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: `${this.$t('valveStatus')}3`,
              silent: false,
              data: dshedLine,
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
              stack: `${this.$t('valveStatus')}3`,
              silent: false,
              data: item,
              lineStyle: { normal: { type: 'dashed' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: {
                normal: { color: 'rgba(255, 255, 255,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            }))
          )
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
    },
  }
</script>
<style scoped>
  .bar {
    width: 100%;
  }
</style>
