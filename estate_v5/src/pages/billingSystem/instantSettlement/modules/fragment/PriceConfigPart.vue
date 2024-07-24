<template>
  <div class="price-config">
    <div class="header" v-if="!hidePrompt">
      <div class="left">
        {{ $t('unitPriceConfig') }}
        <TooltipVue style="margin-left: -5px; display: inline-block">{{ $t('temporaryUsersTip') }}</TooltipVue>
      </div>
    </div>
    <div class="prompt" v-if="!hidePrompt">
      <Icon color="#f2f2f2" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
      {{ $t('unitPriceConfigTip') }}
    </div>
    <div class="price-content">
      <div class="left">
        <div class="price-box def-price" :class="{ error: !validateFlag }">
          <div class="title">{{ $t('defaultUnitPrice') }}</div>
          <div class="price-input">
            <div class="input-item">
              <span class="lel">{{ $t('unitPriceForTemporaryUsers') }}({{ unit }}):</span>
              <Input v-if="!disabled" v-model="defaultUnitPrice.tempUserPrice" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'FourDecimal'" />
              <span class="value" v-else>{{ defaultUnitPrice.tempUserPrice }}</span>
            </div>
            <div class="input-item ml-10">
              <span class="lel">{{ $t('unitPriceForRegisteredUsers') }}({{ unit }}):</span>
              <Input v-if="!disabled" v-model="defaultUnitPrice.regUserPrice" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'FourDecimal'" />
              <span class="value" v-else>{{ defaultUnitPrice.regUserPrice }}</span>
            </div>
          </div>
        </div>
        <div class="error-tip" v-if="!validateFlag">{{ $t('defaultUnitPriceTip') }}</div>
        <div class="price-box" v-for="(item, index) in customUnitPrices" :key="index" :class="{ error: errorRepeat.length > 1 && errorRepeat.includes(index) }">
          <div class="price-input mb-10">
            <div class="input-item">
              <span class="lel">{{ $t('startTime') }}:</span>
              <Select v-if="!disabled" v-model="item.startTime" :disabled="disabled" :placeholder="$t('pleaseSelect')" style="width: 150px">
                <Option v-for="(op, i) in 24" :key="i" :value="`${i}`">{{ `${i.toString().padStart(2, 0)}:00` }}</Option>
              </Select>
              <span class="value" v-else>{{ `${item.startTime.toString().padStart(2, 0)}:00` }}</span>
            </div>
            <div class="input-item ml-10">
              <span class="lel">{{ $t('endTime') }}:</span>
              <Select v-if="!disabled" v-model="item.endTime" :disabled="disabled" :placeholder="$t('pleaseSelect')" style="width: 150px">
                <Option v-for="(op, i) in 25" :key="i" :disabled="i < item.startTime" :value="`${i}`">{{ `${i.toString().padStart(2, 0)}:00` }}</Option>
              </Select>
              <span class="value" v-else>{{ `${item.endTime.toString().padStart(2, 0)}:00` }}</span>
            </div>
          </div>
          <div class="price-input">
            <div class="input-item">
              <span class="lel">{{ $t('unitPriceForTemporaryUsers') }}({{ unit }}):</span>
              <Input v-if="!disabled" v-model="item.tempUserPrice" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'FourDecimal'" />
              <span class="value" v-else>{{ item.tempUserPrice }}</span>
            </div>
            <div class="input-item ml-10">
              <span class="lel">{{ $t('unitPriceForRegisteredUsers') }}({{ unit }}):</span>
              <Input v-if="!disabled" v-model="item.regUserPrice" :disabled="disabled" :placeholder="$t('pleaseEnter')" v-inputNumberRule="'FourDecimal'" />
              <span class="value" v-else>{{ item.regUserPrice }}</span>
            </div>
          </div>
          <div class="delete-price" v-if="!disabled">
            <Button type="text" @click.stop="delItem(index)" class="text-btn-error" icon="md-remove-circle"></Button>
          </div>
        </div>
        <div class="error-tip" v-if="errorRepeat.length > 1">{{ $t('duplicateTimeTip') }}</div>
        <div class="error-tip" v-if="!customValidateFlag">{{ $t('improveUnitPriceConfigurationTip') }}</div>
        <div class="add-price" v-if="!disabled">
          <Button type="primary" ghost long @click.stop="addConfigItem">{{ $t('addTimePeriod') }}</Button>
        </div>
      </div>
      <div class="right">
        <div class="clock">
          <div class="clock-view" ref="clockRef" v-resize="changeChartSize"></div>
          <span class="time pm">PM</span>
          <span class="time am">AM</span>
          <div class="legends">
            <div class="legend">
              <span class="icon active"></span>
              <span>{{ $t('configured') }}</span>
            </div>
            <div class="legend">
              <span class="icon"></span>
              <span>{{ $t('defaultTimePeriod') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    props: {
      value: { type: Object, default: () => {} },
      chargeType: { type: Number, default: 1 },
      hidePrompt: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
    },
    data() {
      return {
        time: [],
        eChart: null,
        errorRepeat: [],
        customUnitPrices: [],
        defaultUnitPrice: { startTime: '0', endTime: '23', tempUserPrice: '', regUserPrice: '' },
        validateFlag: true,
        customValidateFlag: true,
      }
    },
    computed: {
      clockData() {
        let list = []
        let timeRangeList = this.customUnitPrices.filter(item => item.startTime || item.endTime).map(it => [+it.startTime, +it.endTime])
        for (let index = 0; index < 24; index++) {
          if (timeRangeList.some(item => index >= item[0] && index < item[1])) {
            list.push(0)
          } else {
            list.push(1)
          }
        }
        return list
      },
      priceConf() {
        return {
          customUnitPrices: JSON.stringify(this.customUnitPrices),
          defaultUnitPrice: JSON.stringify(this.defaultUnitPrice),
        }
      },
      unit() {
        return this.chargeType === 1 ? this.$t('yuanPreKwh') : this.$t('yuanPreHour')
      },
    },
    methods: {
      drawClock(data) {
        let colors = ['rgba(17, 165, 88,.8)', 'rgba(7, 101, 199,.8)']
        let colors2 = ['rgba(17, 165, 88,.2)', 'rgba(7, 101, 199,.2)']
        let lineColors = data.map((value, index) => {
          var lineNumber = (1 / 24) * (index + 1)
          return [lineNumber, colors[value]]
        })
        let lineColors2 = data.map((value, index) => {
          var lineNumber = (1 / 24) * (index + 1)
          return [lineNumber, colors2[value]]
        })
        const options = {
          series: [
            {
              name: 'color',
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
              data: [],
            },
            {
              name: 'hour',
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
            },
            {
              name: 'min',
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
      changeTimeRange(value, index) {
        this.customUnitPrices[index].startTime = value[0]
        this.customUnitPrices[index].endTime = value[1]
      },
      addConfigItem() {
        if (this.customUnitPrices.length >= 10) return this.$Message.error({ content: this.$t('addMaxLengthPeriodTip') })
        this.customUnitPrices.push({ startTime: '', endTime: '', tempUserPrice: '', regUserPrice: '' })
      },
      delItem(index) {
        this.customUnitPrices.splice(index, 1)
      },
      hasOverlapIntervals() {
        let intervals = this.customUnitPrices.map(item => [+item.startTime, +item.endTime])
        this.errorRepeat = []
        for (let i = 0; i < intervals.length; i++) {
          const [start1, end1] = intervals[i]
          this.errorRepeat = [i]
          for (let j = i + 1; j < intervals.length; j++) {
            const [start2, end2] = intervals[j]
            if ((start1 <= start2 && start2 < end1) || (start2 <= start1 && start1 < end2)) {
              this.errorRepeat.push(j)
            }
          }
          if (this.errorRepeat.length > 1) return
        }
      },
      changeChartSize() {
        this.eChart && this.eChart.resize()
      },
      validate() {
        this.validateFlag = true
        this.validateFlag = true
        if (+this.defaultUnitPrice.regUserPrice < 0 || +this.defaultUnitPrice.tempUserPrice < 0 || !this.defaultUnitPrice.tempUserPrice || !this.defaultUnitPrice.regUserPrice) {
          this.validateFlag = false
          return false
        }
        if (this.customUnitPrices.length && this.customUnitPrices.some(item => +item.regUserPrice < 0 || +item.tempUserPrice < 0 || !item.regUserPrice || !item.tempUserPrice)) {
          this.customValidateFlag = false
          return false
        }
        if (this.errorRepeat.length > 1) return false
        return true
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
      customUnitPrices: {
        handler(value) {
          this.$nextTick(() => {
            this.hasOverlapIntervals()
            this.drawClock(this.clockData)
          })
        },
        deep: true,
      },
      priceConf: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true,
      },
      value: {
        handler(val, oldVal) {
          if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
            this.defaultUnitPrice = JSON.parse(val.defaultUnitPrice)
            this.customUnitPrices = JSON.parse(val.customUnitPrices)
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .price-config {
    padding: 15px;
    .header {
      margin-bottom: 10px;
      font-size: 16px;
    }
    .prompt {
      background: #454a55;
      border-radius: 5px;
      padding: 10px;
    }
    .price-content {
      display: flex;
      padding-top: 15px;
      .left {
        flex: 1;
        .price-box {
          padding: 10px;
          border: 1px solid #333;
          border-radius: 5px;
          margin-bottom: 10px;
          position: relative;
          padding-right: 40px;
          .title {
            font-size: 18px;
            color: #007eff;
            margin-bottom: 10px;
          }
          .price-input {
            display: flex;
            font-size: 14px;
            .input-item {
              display: flex;
              align-items: center;
              span.lel {
                white-space: nowrap;
                padding-right: 8px;
                color: #bebebe;
              }
              span.value {
                white-space: nowrap;
                padding-right: 40px;
                font-weight: bold;
              }
            }
          }
          .mb-10 {
            margin-bottom: 10px;
          }
          .delete-price {
            position: absolute;
            right: 0px;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            top: 0px;
            width: 40px;
            /deep/.ivu-btn.ivu-btn-text {
              font-size: 20px;
            }
          }
        }
        .price-box.error {
          border-color: #ed4014;
        }
        .error-tip {
          color: #ed4014;
          font-size: 14px;
          line-height: 30px;
        }
      }
      .right {
        width: 400px;
        padding-left: 30px;
        .clock {
          width: 100%;
          position: relative;
          .clock-view {
            height: 370px;
            width: 100%;
          }
          .time {
            position: absolute;
            z-index: 3;
            top: 170px;
            font-size: 30px;
            line-height: 30px;
            right: 80px;
          }
          .pm {
            left: 80px;
          }
          .legends {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            font-size: 16px;
            .legend {
              margin-right: 10px;
              line-height: 40px;
            }
            .icon {
              display: inline-block;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              margin-right: 5px;
              background: rgba(7, 101, 199, 0.8);
              vertical-align: middle;
            }
            .icon.active {
              background: rgba(17, 165, 88, 0.8);
            }
          }
        }
      }
    }
  }
</style>
