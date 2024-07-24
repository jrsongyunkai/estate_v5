<template>
  <div>
    <div :id="uniqueID" ref="eChart" class="line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'BillingTrends',
    props: {
      options: { type: Object, default: () => {} },
    },
    mixins: [eChartMixins],
    data() {
      return {
        baseStyle: { height: '500px' },
      }
    },
    methods: {
      init() {
        const options = {
          title: { text: this.$t('amountWithUnit'), textStyle: { color: '#797979', fontSize: 12 }, left: 0, top: 10 },
          tooltip: {
            formatter: function (params) {
              var htmlStr = ''
              if (params.value !== 0) {
                htmlStr += '<div>'
                htmlStr += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;"></span>'
                htmlStr += window.$t('seriesNameHasMoneyValue', params)
                htmlStr += '</div>'
              }
              return htmlStr
            },
          },
          xAxis: {
            type: 'category',
            data: this.options.xAxisData,
            splitLine: { show: false },
            axisTick: { show: false },
            axisLine: { show: false, lineStyle: { color: '#797979' } },
          },
          grid: { left: 50, right: '1%', top: '10%', bottom: '10%' },
          yAxis: {
            splitLine: { show: false },
            axisLine: { show: true, lineStyle: { color: '#797979' } },
            axisTick: { show: false },
          },
          series: [
            { name: window.$t('dailyRechargeAmount'), type: 'line', data: this.options.data1, emphasis: { focus: 'series' }, itemStyle: { color: '#00ffff' } },
            {
              name: window.$t('remainingAmountOfTheDay'),
              type: 'bar',
              barWidth: '30%',
              data: this.options.data3,
              emphasis: { focus: 'series' },
              itemStyle: { color: '#02a7f0' },
              markLine: { symbol: 'none', itemStyle: { normal: { lineStyle: { color: '#797979', type: 'solid' }, label: { formatter: '' } } }, data: [{ name: window.$t('markerLine'), yAxis: 0 }] },
            },
            { name: window.$t('dailyTotalElectricityBill'), type: 'line', data: this.options.data2, emphasis: { focus: 'series' }, itemStyle: { color: '#f59a23' } },
          ],
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
      '$store.state.heightOne': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.baseStyle.height = newVal + 'px'
          }
        },
      },
      '$store.state.systemFlag': {
        handler(newVal, oldVal) {
          if (newVal && this.$store.state.toPath !== '') this.eChartResize()
        },
      },
      '$store.state.toPath': {
        handler(newVal, oldVal) {
          document.getElementById(this.uniqueID).style.width = window.innerWidth * 0.2083333 - 22 + 'px'
          if (newVal) this.eChartResize()
        },
      },
    },
  }
</script>
<style lang="less" scoped>
  .line-area {
    width: 100%;
  }

  .loading {
    position: relative;
  }

  .el-icon-loading {
    position: absolute;
    left: 43%;
    top: 39%;
    font-size: 50px;
    opacity: 0.5;
  }
</style>
