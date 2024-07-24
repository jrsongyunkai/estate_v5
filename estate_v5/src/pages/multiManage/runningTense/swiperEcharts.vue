<template>
  <div class="swier-Content-page">
    <div class="posi-text" v-show="!loading">
      <div class="real-Status">{{ $t('actualState') }}</div>
      <div class="config-Status">{{ $t('ruleConfigState') }}</div>
    </div>
    <div v-show="loading" class="dis-loading"><Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="50" /></div>
    <div v-show="!loading" class="swiper swiper1">
      <div class="swiper-wrapper"></div>

      <!-- <div class="swiper-pagination"></div> -->
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>
  </div>
</template>

<script type="module">
  import Swiper, { Virtual, Navigation, Pagination, FreeMode } from 'swiper'
  import { getCurrThirtyDay, arrProcess } from './getDay'
  import { configHistory } from '@api/multiManage/runningTense'
  import * as echarts from 'echarts5'
  export default {
    props: {
      defaultIndexChange: {
        type: Number,
        default: 0,
      },
      echartTime: {
        type: String,
        default: '',
      },
      macAndport: {
        type: Object,
        default: () => {},
      },
      configId: {
        type: Number,
        default: 0,
      },
      defaultIndex: {
        type: Number,
        default: 0,
      },
      isLoading: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        configList: getCurrThirtyDay(),
        loading: false,
        newSeriesData: [],
        swiper: null,
        newSwiper12s: null,
        chart: '',
        baseStyle: {
          height: this.$store.state.innerComponentHeight,
        },
        timeSpans: [...new Array(24)].map((it, index) => this.$t('manyHour', { value: index })),
        ecartsIntanceList: [],
        timeParam: '',
        middleLoading: '',
      }
    },
    created() {},
    mounted() {
      let that = this

      that.swiper = new Swiper('.swiper1', {
        slidesPerView: 1,
        modules: [Virtual, Navigation, Pagination],
        initialSlide: that.defaultIndexChange ? that.defaultIndex : 30,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        virtual: {
          slides: (function () {
            const slides = []
            for (var i = 0; i < 31; i += 1) {
              slides.push('Slide' + (i + 1))
            }
            return slides
          })(),
          renderSlide(slide, index) {
            // 创建 spwer1的slide
            // console.log('🚀 ~ file: swiperEcharts.vue:101 ~ renderSlide ~ isLoading:', that.middleLoading)
            const slide1 = document.createElement('div')
            slide1.classList.add('swiper-slide')
            slide1.style.width = 'auto'
            // 创建spwier2 div
            const swiper2 = document.createElement('div')
            swiper2.classList.add('swiper')
            swiper2.classList.add('swiper2')
            // 创建swiper-wrapepr, 固定结构 容器
            const wrapper = document.createElement('div')
            wrapper.classList.add('swiper-wrapper')
            //  swiper2中  添加wrapper容器
            swiper2.appendChild(wrapper)
            // 将spwer1中slide添加创建的swiper2
            slide1.appendChild(swiper2)

            // 创建swiper2 中的slide
            const slide2 = document.createElement('div')
            slide2.style.cursor = 'col-resize'
            slide2.classList.add('swiper-slide')
            slide2.style.width = 'auto'
            // 更改echart内容

            const chartDom = document.createElement('div')
            // chartDom.classList.add('mock-echarts')
            chartDom.style.height = '300px'
            chartDom.style.width = '2000px'
            chartDom.style.marginLeft = '-80px'
            slide2.appendChild(chartDom)
            wrapper.appendChild(slide2)
            // eslint-disable-next-line no-new
            new Swiper(swiper2, { slidesPerView: 'auto', modules: [FreeMode], freeMode: true, freeModeMomentumRatio: 15, nested: true })
            //  console.log(index, '====================')
            that.timeParam = that.configList[index].time
            const { addr, isOutOrIns, mac } = that.macAndport
            const digital = isOutOrIns === 'digitalOuts' ? `digitalOut${that.macAndport.index}` : isOutOrIns === 'digitalIns' ? `digitalIn${that.macAndport.index}` : ''
            let params = {
              configId: that.configId,
              mac,
              addr,
              startTime: that.timeParam,
              endTime: that.timeParam,
              digital,
            }
            let series = []
            if (that.defaultIndex === index) {
              that.loading = true
            }
            configHistory(params).then(res => {
              if (!res.success) {
                return that.$Message.error({
                  content: res.message,
                })
              }
              if (that.defaultIndex === index) {
                that.loading = false
              }
              const xAxisList = res.data.xAxis.map(v => {
                const timeArr = v.substr(11).split(':')
                return +timeArr[0] * 60 + +timeArr[1]
              })
              const actualStatusList = res.data.actualStatusList
              const configStatusList = res.data.configStatusList
              const newConfigArr = configStatusList.map(v => (v ? `${v}` : '0'))
              const newActualArr = actualStatusList.map(v => (v ? `${v}` : '0'))
              const newConfigList = arrProcess(newConfigArr, xAxisList)
              const actualFilter = arrProcess(newActualArr, xAxisList)
              newConfigList.forEach(it => {
                series.push(that.createChartNode(it, 5))
              })
              actualFilter.forEach(it => {
                series.push(that.createChartNode(it, 13))
              })
              that.createEcharts(chartDom, series)
            })

            return slide1
          },
        },
        on: {
          click: () => {},
          slideChangeTransitionStart: swiper => {
            const emitTime = that.configList.filter((v, idx) => idx === +swiper.activeIndex)
            that.$emit('changeTime', emitTime)

            // console.log('🚀 ~ file: swiperEcharts.vue:181 ~ mounted ~ swiper.activeIndex:', emitTime)
          },
          // slideChangeTransitionEnd: swiper => {
          //   console.log('🚀 ~ file: swiperEcharts.vue:176 ~ mounted ~ swiper.activeIndex:', swiper.activeIndex)
          //   that.$emit('changeTime', +swiper.activeIndex)
          // },
        },
      })
    },
    methods: {
      resize() {
        this.chart && this.chart.resize()
      },
      createEcharts(chartDom, series) {
        const chart = echarts.init(chartDom)
        this.ecartsIntanceList.push(chart)
        const options = {
          grid: { top: 40, left: '5%', right: '5%', bottom: '20%', borderWidth: 0 },
          legend: { show: true, right: '5%', top: 0, textStyle: { color: '#fff' }, icon: 'circle' },
          xAxis: [
            {
              type: 'value',
              position: 'top',
              min: 0,
              max: 1440,
              axisTick: { show: false, textStyle: { color: '#fff' } },
              axisLabel: {
                show: false,
                rotate: 0,
                margin: -5,
                align: 'center',
                color: 'red',
                formatter: value => {
                  return this.$t('manyHour', { value: value / 60 })
                },
              },
              axisLine: { onZero: false, lineStyle: { color: 'rgba(255, 255, 255, 0.1)', width: 20, cap: 'butt' } },
              splitLine: { show: true, lineStyle: { type: 'dashed', color: ['#cccccc50'] } },
              minInterval: 60,
              maxInterval: 60,
            },
            {
              type: 'category',
              position: 'top',
              data: this.timeSpans,
              axisLine: { onZero: true, show: false },
              axisTick: { show: false },
              axisLabel: { margin: -8, color: '#fff' },
            },
            // {
            //   name: '$t('ruleConfigState')',
            //   nameLocation: 'start',
            //   axisLine: { show: false, onZero: false },
            //   nameTextStyle: {
            //     padding: [0, -90],
            //     color: '#ffffff',
            //   },
            //   offset: -80,
            // },
            // {
            //   name: '$t('actualState')',
            //   nameLocation: 'start',
            //   nameTextStyle: {
            //     padding: [0, -65],
            //     color: '#ffffff',
            //   },
            //   axisLine: { show: false, onZero: false },
            //   offset: -41,
            // },
          ],
          yAxis: { show: false, min: 0, max: 20, position: 'right', splitLine: { show: false }, axisLabel: { show: false } },
          series,
        }
        chart.setOption(options, true)
      },

      createChartNode(obj, value) {
        if (obj.type === 0) {
          return {
            type: 'line',
            lineStyle: {
              width: 40,
            },
            color: '#21f27f',
            symbol: 'none',
            z: 2,
            xAxisIndex: 0,
            data: [
              [obj.start, value],
              [obj.end, value],
            ],
          }
        }
        if (obj.type === 1) {
          return {
            type: 'line',
            lineStyle: {
              width: 40,
            },
            color: '#f56c6c',
            z: 0,
            symbol: 'none',
            xAxisIndex: 0,
            data: [
              [obj.start, value],
              [obj.end, value],
            ],
          }
        }
        if (obj.type === 2) {
          return {
            type: 'line',
            lineStyle: {
              width: 40,
            },
            name: '',
            color: '#FFA854',
            z: 0,
            symbol: 'none',
            xAxisIndex: 0,
            data: [
              [obj.start, value],
              [obj.end, value],
            ],
          }
        }
      },
    },
    destroyed() {
      this.ecartsIntanceList.forEach(item => {
        item.dispose()
      })
      this.swiper.destroy()
    },
  }
</script>

<style lang="less" scoped>
  .posi-text {
    position: relative;
  }
  .real-Status {
    position: absolute;
    top: 70px;
    left: 20px;
  }
  .config-Status {
    position: absolute;
    top: 150px;
    left: 20px;
  }
  .swier-Content-page {
    width: 100%;
    height: 100%;
  }
  .dis-loading {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 100px;
  }
</style>
