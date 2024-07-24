<template>
  <div>
    <div :id="uniqueID" ref="eChart" class="line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'StackedBar',
    props: ['options'],
    data() {
      return {
        echart: '',
        uniqueID: '',
        baseStyle: { height: '28px' },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        let option = {
          grid: { left: '-2%', right: '0.5%', bottom: '160%', containLabel: true },
          xAxis: { show: false, type: 'value' },
          yAxis: { type: 'category', data: [''], axisLine: { show: false }, axisTick: { show: false }, color: '#fff' },
          series: [
            {
              name: this.$t('unableLiveSelf'),
              type: 'bar',
              stack: 'total',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: 'rgb(76, 39, 49,0.8)' },
                    { offset: 1, color: 'rgb(190, 55, 56,1)' },
                  ]),
                },
              },
              label: { normal: { show: true, position: 'inside' } },
              z: 10,
              data: [''],
            },
            {
              name: this.$t('haveDisease'),
              type: 'bar',
              stack: 'total',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: 'rgb(76, 39, 49,0.8)' },
                    { offset: 1, color: 'rgb(224, 231, 28,1)' },
                  ]),
                },
              },
              label: { normal: { show: true, position: 'inside' } },
              z: 10,
              data: [''],
            },
            {
              name: this.$t('liveAloneAndOver70'),
              type: 'bar',
              stack: 'total',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: 'rgb(76, 39, 49,0.8)' },
                    { offset: 1, color: 'rgb(234, 144, 58,1)' },
                  ]),
                },
              },
              label: { normal: { show: true, position: 'inside' } },
              z: 10,
              data: [''],
            },
            {
              name: this.$t('handicapAndOver70'),
              type: 'bar',
              stack: 'total',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: 'rgb(76, 39, 49,0.8)' },
                    { offset: 1, color: 'rgb(222, 51, 132,1)' },
                  ]),
                },
              },
              label: { normal: { show: true, position: 'inside' } },
              z: 10,
              data: [''],
            },
            {
              name: this.$t('others'),
              type: 'bar',
              stack: 'total',
              barWidth: 20,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    { offset: 0, color: 'rgb(76, 39, 49,0.8)' },
                    { offset: 1, color: 'rgb(0, 150, 255,1)' },
                  ]),
                },
              },
              label: { normal: { show: true, position: 'inside' } },
              z: 10,
              data: [''],
            },
          ],
        }
        option.series[0].data = [this.options[0].total === 0 ? '' : this.options[0].total]
        option.series[1].data = [this.options[1].total === 0 ? '' : this.options[1].total]
        option.series[2].data = [this.options[2].total === 0 ? '' : this.options[2].total]
        option.series[3].data = [this.options[3].total === 0 ? '' : this.options[3].total]
        option.series[4].data = [this.options[4].total === 0 ? '' : this.options[4].total]
        this.eChartSetOption(option)
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options = newVal
            this.init()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less"></style>
