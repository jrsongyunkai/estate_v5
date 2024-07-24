<template>
  <div>
    <div ref="eChart" class="line-area"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'line-area-chart',
    props: {
      options: {
        type: Object,
        default() {
          return {}
        },
      },
    },
    mixins: [eChartMixins],
    data() {
      return {}
    },
    methods: {
      init() {
        const options = {
          tooltip: {
            trigger: 'axis',
            confine: true,
            axisPointer: {
              type: 'none',
            },
            formatter: data => {
              let res
              for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                  res = data[i].axisValue + '   ' + this.options.customTime[data[0].dataIndex] + '<br/>'
                }
                res += data[i].marker + data[i].seriesName + ':' + data[i].value + '<br/>'
              }
              return res
            },
          },
          title: {
            show: this.options.title.show,
            text: this.options.title.text ? this.options.title.text : '',
            textStyle: {
              color: '#fff',
              fontSize: 16,
            },
            left: 0,
            top: 10,
          },
          legend: {
            show: true,
            orient: 'horizontal',
            align: 'left',
            right: 10,
            data: this.options.series.name,
            icon: 'emptycircle',
            itemWidth: 10, // 设置宽度
            itemHeight: 10, // 设置高度
            itemGap: 10, // 设置间距
            textStyle: {
              color: '#fff',
            },
          },
          xAxis: this.options.xAxis,
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
            left: this.options.left !== undefined ? this.options.left : this.$store.state.locale !== 'zh-CN' ? 70 : 50,
            right: '2%',
            top: '20%',
            bottom: '10%',
          },
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
    },
    watch: {
      options: {
        handler(newVal) {
          if (newVal) {
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
    height: 300px;
  }
</style>
