<template>
  <div class="period-config-content">
    <div class="clock">
      <div class="header">时段配置预览</div>
      <div class="body">
        <div class="clock-view" ref="clockRef"></div>
        <div class="legend">
          <span class="legend-item" v-for="item in models" :style="{ '--spanColor': item.color }" :key="item.value">{{ item.label }}时</span>
        </div>
      </div>
    </div>
    <div class="right">
      <Row style="width: 100%" :gutter="10">
        <Col span="6" v-for="item in models" :key="item.value">
          <periodGroup :type="item.value" :errorRepeat="errorRepeat" v-model="item.list"></periodGroup>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  import periodGroup from './periodGroup.vue'
  export default {
    props: {
      value: { type: Object, default: () => {} },
    },
    components: { periodGroup },
    data() {
      return {
        eChart: null,
        models: [
          { color: '#df3d3a', label: '尖', value: 'top', list: [] },
          { color: '#e19a51', label: '峰', value: 'peak', list: [] },
          { color: '#0180ff', label: '平', value: 'normal', list: [] },
          { color: '#0eb55c', label: '谷', value: 'valley', list: [] },
        ],
        errorRepeat: [],
      }
    },
    computed: {
      clockData() {
        let list = new Array(1440).fill(4)
        this.models.forEach((it, i) => {
          it.list.forEach(([start, end]) => {
            let startMinutes = this.parseTimeToMinutes(start)
            let endMinutes = this.parseTimeToMinutes(end)
            if (startMinutes < endMinutes) {
              for (let index = startMinutes; index <= endMinutes; index++) {
                list[index] = i
              }
            }
          })
        })
        return list
      },
      modelsList() {
        let list = []
        this.models.forEach(it => {
          list.push(
            ...it.list.map(([start, end]) => ({
              series: it.value,
              start: this.parseTimeToMinutes(start),
              end: this.parseTimeToMinutes(end),
            }))
          )
        })
        return list
      },
    },
    methods: {
      parseTimeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number)
        return hours * 60 + minutes
      },
      drawClock(data) {
        let colors = this.models.map(it => it.color)
        let lineColors = data.map((value, index) => {
          let lineNumber = (1 / 1440) * (index + 1)
          return [lineNumber, colors[value] ? `${colors[value]}cc` : null]
        })
        let lineColors2 = data.map((value, index) => {
          let lineNumber = (1 / 1440) * (index + 1)
          return [lineNumber, colors[value] ? `${colors[value]}33` : null]
        })
        const options = {
          series: [
            {
              name: '颜色',
              type: 'gauge',
              center: ['50%', '50%'],
              radius: '90%',
              min: 0,
              startAngle: 90,
              endAngle: -269.9999,
              animation: 0,
              pointer: { show: true },
              axisLine: { lineStyle: { color: lineColors2, width: 300 } },
              splitLine: { show: false, length: 18, lineStyle: { width: 1 } },
              axisTick: { show: false },
              axisLabel: { show: false },
              title: { show: false },
              detail: { show: false },
            },
            {
              name: '小时',
              type: 'gauge',
              radius: '82%',
              min: 0,
              max: 24,
              startAngle: 90,
              endAngle: -269.99999,
              splitNumber: 24,
              axisLine: { lineStyle: { color: [[1, '#fff']], width: 0 } },
              axisLabel: { show: true, distance: 2, formatter: t => t || '', fontSize: 12, color: '#fff' },
              axisTick: { length: 12, lineStyle: { color: 'auto', width: 1 } },
              splitLine: { length: 16, lineStyle: { color: 'auto', width: 2 } },
              detail: { show: false },
              title: { show: true },
            },
            {
              name: '分钟',
              type: 'gauge',
              radius: '90%',
              min: 0,
              max: 60,
              startAngle: 90,
              endAngle: -269.99999,
              splitNumber: 60,
              axisLine: { show: true, lineStyle: { color: lineColors, width: 10 } },
              axisLabel: { show: false, distance: 10 },
              axisTick: { show: false, length: 4, lineStyle: { color: 'auto', width: 1 } },
              splitLine: { show: false, length: 4, lineStyle: { color: 'auto', width: 1 } },
              detail: { show: false },
            },
          ],
        }
        this.eChart && this.eChart.clear()
        this.eChart && this.eChart.setOption(options, true)
      },
      hasOverlapIntervals() {
        let intervals = this.modelsList
        this.errorRepeat = []
        for (let i = 0; i < intervals.length; i++) {
          const { start: start1, end: end1 } = intervals[i]
          this.errorRepeat = [intervals[i]]
          for (let j = i + 1; j < intervals.length; j++) {
            const { start: start2, end: end2 } = intervals[j]
            if ((start1 <= start2 && start2 < end1) || (start2 <= start1 && start1 < end2)) {
              this.errorRepeat.push(intervals[j])
            }
          }
          if (this.errorRepeat.length > 1) return
        }
      },
      validate() {
        return this.modelsList.length > 0 && !this.errorRepeat.length > 1
      },
    },
    mounted() {
      this.eChart = echarts.init(this.$refs.clockRef)
      this.drawClock(this.clockData)
    },
    beforeDestroy() {
      this.eChart && this.eChart.dispose()
      this.eChart = null
    },
    watch: {
      models: {
        handler(val) {
          console.log('🚀 ~ handler ~ val:', val)
          let obj = val.reduce((pre, cur) => {
            let { value, list } = cur
            pre[value] = list || []
            return pre
          }, {})
          console.log('🚀 ~ obj ~ obj:', obj)
          this.$emit('input', obj)
          this.$nextTick(() => {
            this.hasOverlapIntervals()
            this.drawClock(this.clockData)
          })
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .period-config-content {
    width: 100%;
    display: flex;
    align-content: space-between;
    .clock {
      width: 400px;
      padding: 10px;
      background: #1a202e;
      margin-right: 10px;
      .header {
        line-height: 30px;
        margin-bottom: 10px;
        font-size: 14px;
        color: #007fff;

        &::before {
          display: inline-block;
          content: '';
          width: 3px;
          height: 20px;
          background: #007fff;
          vertical-align: middle;
          margin-right: 10px;
        }
      }
      .body {
        width: 100%;
        .clock-view {
          width: 300px;
          height: 300px;
          margin: 0 auto;
          position: relative;
          &::after {
            content: 'AM';
            z-index: 0;
            position: absolute;
            right: 70px;
            top: 135px;
            font-size: 24px;
            line-height: 30px;
            color: #fff;
          }
          &::before {
            content: 'PM';
            z-index: 0;
            position: absolute;
            left: 70px;
            top: 135px;
            font-size: 24px;
            line-height: 30px;
            color: #fff;
          }
        }
        .legend {
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          &-item {
            padding: 0 10px;
            display: inline-block;
            &::before {
              display: inline-block;
              content: '';
              width: 10px;
              height: 10px;
              background: var(--spanColor);
              vertical-align: middle;
              margin-right: 8px;
            }
          }
        }
      }
    }
    .right {
      width: calc(~'100% - 410px');
      display: flex;
      padding: 15px 10px;
      background: #1a202e;
    }
  }
</style>
