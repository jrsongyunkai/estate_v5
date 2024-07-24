<template>
  <div ref="eChart" class="bar" :style="baseStyle"></div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'AirStatus',
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
        baseStyle: {
          height: this.$store.state.innerComponentHeight,
        },
        assistLine: [],
      }
    },
    mixins: [eChartMixins],
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
            if (v === 100) return 3
            if (v === 101) return 2
            if (v === 102) return 0
            if (v === 103) return 1
            if (!v) return 0
            return v
          })
          .forEach((item, index) => {
            if (index === 0) {
              cur = item
              return
            }
            if (cur !== item && (item !== 0 || item !== 1 || item !== 2 || item !== 3)) {
              this.assistLine.push(this.creatNewLine(this.options.data.length, index, cur, item))
            }
            cur = item
          })
        let arr = []
        let newArr = []
        let dashedOneArr = []
        let dashedTwoArr = []
        let zeroLine = []
        let dshedLine = []
        let ceaseLine = []
        let unknownLine = []
        data1sLength.forEach((item, index) => {
          if (item === 101) {
            dashedTwoArr[index] = 3
          } else {
            dashedTwoArr[index] = undefined
          }
          if (item === 100) {
            dashedOneArr[index] = 2
          } else {
            dashedOneArr[index] = undefined
          }
          if (item === 103) {
            arr[index] = 1
          } else {
            arr[index] = undefined
          }
          if (item === 102) {
            newArr[index] = 0
          } else {
            newArr[index] = undefined
          }
          zeroLine[index] = 3
          dshedLine[index] = 2
          unknownLine[index] = 1
          ceaseLine[index] = 0
        })

        var options = {
          grid: { top: '10%', left: '10%', right: '5%', bottom: '20%', borderWidth: 0 },
          xAxis: [
            { axisTick: { show: true, textStyle: { color: '#fff' } }, axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } }, axisLine: { lineStyle: { color: '#fff' } }, data: this.options.time },
            { type: 'value', gridIndex: 0, splitLine: { show: false, textStyle: { color: '#fff' } }, axisLine: { show: false }, axisTick: { show: false } },
          ],
          yAxis: [{ type: 'category', position: 'left', axisLabel: { show: true }, axisLine: { show: false, lineStyle: { color: '#fff', type: 'solid' } }, axisTick: { show: false }, data: [this.$t('stop'), this.$t('unknown2'), this.$t('Heating'), this.$t('refrigeration')] }],
          series: [
            {
              type: 'line',
              stack: this.$t('refrigeration'),
              silent: false,
              data: dashedTwoArr,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#007EFF', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('Heating'),
              silent: false,
              data: dashedOneArr,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: {
                normal: { color: '#F24E4C', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 },
              },
            },
            {
              type: 'line',
              stack: this.$t('unknown2'),
              silent: false,
              data: arr,
              barMinHeight: 1,
              lineStyle: { normal: { type: 'solid' } },
              itemStyle: { normal: { color: '#FFA854', shadowColor: 'transparent', shadowBlur: 10, shadowOffsetX: 0 } },
            },
            {
              type: 'line',
              stack: this.$t('stop'),
              silent: false,
              data: newArr,
              lineStyle: { normal: { type: 'solid' } },
              barMinHeight: 1,
              itemStyle: { normal: { color: '#999999', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 } },
            },
            {
              type: 'line',
              stack: this.$t('refrigeration'),
              silent: false,
              data: zeroLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: { normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 } },
            },
            {
              type: 'line',
              stack: this.$t('Heating'),
              silent: false,
              data: dshedLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: { normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 } },
            },
            {
              type: 'line',
              stack: this.$t('unknown2'),
              silent: false,
              data: unknownLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: { normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 } },
            },
            {
              type: 'line',
              stack: this.$t('stop'),
              silent: false,
              data: ceaseLine,
              lineStyle: { normal: { type: 'dotted' } },
              barMinHeight: 1,
              showSymbol: false,
              itemStyle: { normal: { color: 'rgba(121, 123, 126,0.5)', shadowColor: 'transparent', shadowBlur: 0, shadowOffsetX: 0 } },
            },
          ],
        }
        if (this.assistLine.length) {
          options.series.push(
            ...this.assistLine.map(item => ({
              type: 'line',
              stack: this.$t('ns_lineStyle.dash'),
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
