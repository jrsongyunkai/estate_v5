<template>
  <div class="e-chart-box">
    <div class="flaxs" style="float: right; margin-right: 10px">
      <div class="flaxs" v-for="(item, index) in options.series" :key="index">
        <template v-if="item.itemStyle">
          <div class="yuan" :style="'border:1px solid' + item.itemStyle.color"></div>
          <div class="text">{{ item.name }}</div>
        </template>
      </div>
    </div>
    <div ref="eChart" class="line"></div>
  </div>
</template>
<script>
  import eChartMixins from '@/mixins/eChartMixins'
  export default {
    name: 'line-chart',
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
      return {}
    },
    methods: {
      init() {
        let type = this.options.equipmentType === 30
        let that = this
        const options = {
          title: { show: this.options.title.show, text: this.options.title.text, textStyle: { color: '#FFF', fontSize: 14 }, left: 0, top: 0 },
          grid: { x: 50, y: 80, x2: 10, y2: this.options.grid ? this.options.grid : 80, borderWidth: 0, bottom: '50' },
          tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: datas => {
              let res = ''
              for (let i = 0, length = datas.length; i < length; i++) {
                if (that.options.time && i === 0) {
                  res = that.$t('time') + ': ' + datas[i].axisValue + '<br/>'
                }
                res += datas[i].marker + datas[i].seriesName + '：' + (datas[i].value !== undefined ? (datas[i].value === true ? that.$t('closing') : datas[i].value === false ? that.$t('opening') : datas[i].value) : '') + (type ? 'm³' : '') + '<br/>'
              }
              return res
            },
          },
          xAxis: [{ type: 'category', data: this.options.xAxis, axisLabel: { show: true, rotate: 0, textStyle: { color: '#fff' } }, axisTick: { onGap: 0, lineStyle: { color: '#767d8f' } }, axisLine: { lineStyle: { color: '#767d8f' } }, splitLine: { show: false }, rotate: -25 }],
          yAxis: [
            {
              name: this.options.nameY,
              minInterval: this.$route.meta.isShowtabbar ? 1 : '',
              type: 'value',
              splitArea: { show: true, areaStyle: { color: ['transparent', 'transparent'] } },
              splitLine: { show: this.options.splitLine ? this.options.splitLine : false, lineStyle: { color: '#274473' } },
              axisLine: { lineStyle: { color: '#767d8f' } },
              axisLabel: { show: true, textStyle: { color: '#fff' } },
            },
          ],
          series: this.options.series,
        }
        this.eChartSetOption(options)
      },
    },
    watch: {
      options: {
        handler(newVal, oldVal) {
          if (newVal) {
            this.options.xAxis = newVal.xAxis
            this.options.series = newVal.series
            this.init()
          }
        },
        deep: true,
      },
    },
  }
</script>
<style lang="less" scoped>
  .e-chart-box {
    width: 100%;
    .line {
      width: 100%;
      height: 320px;
    }
    .flaxs {
      display: flex;
      .yuan {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #fff;
      }
      .text {
        margin-left: 10px;
        margin-top: -5px;
        font-size: 14px;
      }
    }
  }
</style>
