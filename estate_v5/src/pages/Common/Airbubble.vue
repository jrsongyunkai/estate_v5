<template>
  <div>
    <div ref="eChart" class="Airbubble" :style="baseStyle"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'Airbubble',
    props: ['options'],
    data() {
      return {
        baseStyle: {
          height: '230px',
        },
      }
    },
    mixins: [eChartMixins],
    methods: {
      init() {
        var chartdata = []
        var datalist = []
        this.options.map(val => {
          chartdata.push({ name: '', value: `${val.total}` })
          datalist.push({ symbolSize: val.total < 10 ? 65 : val.total > 10 ? 70 : val.total > 20 ? 75 : val.total > 30 ? 80 : val.total > 40 ? 90 : val.total > 50 ? 100 : 110 })
        })
        datalist[0].offset = [56, 48]
        datalist[1].offset = [35, 80]
        datalist[2].offset = [20, 43]
        datalist[3].offset = [83, 30]
        datalist[4].offset = [36, 20]
        var color = ['#e03c3a', '#e0e71c', '#ea903a', '#de3384', '#0096ff']
        let newC = ['rgba(224, 60, 58,0.1)', 'rgba(224, 231, 28,0.1)', 'rgba(234, 144, 58,0.1)', 'rgba(222, 51, 132,0.1)', 'rgba(0, 150, 255,0.1)']
        var datas = []
        for (var i = 0; i < chartdata.length; i++) {
          var item = chartdata[i]
          var itemToStyle = datalist[i]
          datas.push({
            name: item.value + item.name,
            value: itemToStyle.offset,
            symbolSize: itemToStyle.symbolSize,
            label: { normal: { textStyle: { fontSize: 12, color: '#fff' } } },
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 3, [
                  { offset: 0.1, color: newC[i] },
                  { offset: 1, color: color[i] },
                ]),
                opacity: 1,
                borderWidth: 1,
                borderColor: color[i],
                shadowBlur: 7,
                symbolOffset: 0.6,
              },
            },
          })
        }
        let option = {
          grid: { show: false, top: 10, bottom: 10 },
          xAxis: [{ gridIndex: 0, type: 'value', show: false, min: 0, max: 100, nameLocation: 'middle', nameGap: 5 }],
          yAxis: [{ gridIndex: 0, min: 0, show: false, max: 100, nameLocation: 'middle', nameGap: 30 }],
          series: [{ type: 'scatter', symbol: 'circle', symbolSize: 120, label: { normal: { show: true, formatter: this.$t('numOfPeople', { num: '{b}' }), color: '#fff', textStyle: { fontSize: '20' } } }, itemStyle: { normal: { color: '#00acea' } }, data: datas }],
        }
        this.eChartSetOption(option)
      },
    },
  }
</script>
