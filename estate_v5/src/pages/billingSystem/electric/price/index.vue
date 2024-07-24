<template>
  <div class="price">
    <Tabs value="name1" style="position: relative" name="sub">
      <template #extra>
        <Button v-if="unitPriceStatus" class="b-blue" @click="handleUnitPrice('edit')">{{ $t('edit') }}</Button>
        <Button v-if="!unitPriceStatus" class="b-blue" @click="savePriceConfig">{{ $t('save') }}</Button>
        <Button v-if="!unitPriceStatus" class="b-info ml-10" @click="handleUnitPrice('cancal')">{{ $t('cancel') }}</Button>
      </template>
      <TabPane :label="$t('electricityPriceConfiguration')" name="name1" tab="sub">
        <div style="margin-top: 10px; background: #1a202e; padding: 20px; border-radius: 5px">
          <Row>
            <Col :span="6" class="timer_Chats">
              <span style="font-size: 18px">{{ $t('periodConfiguration') }}</span>
              <TimeBars :options="timeData"></TimeBars>
              <div class="length">
                <span>
                  <i />
                  {{ $t('sharp') }}
                </span>
                <span>
                  <i />
                  {{ $t('peak') }}
                </span>
                <span>
                  <i />
                  {{ $t('performance') }}
                </span>
                <span>
                  <i />
                  {{ $t('valley') }}
                </span>
              </div>
            </Col>
            <Col :span="18">
              <Row>
                <Col :span="6">
                  <div style="margin-bottom: 10px">{{ $t('sharpPeriod') }}</div>
                  <div v-for="(item, index) in topTimeList" :key="item.value" style="margin-top: 8px" :class="{ 'shake-slow': !!item.showSpan }">
                    <template v-if="!unitPriceStatus">
                      <CustomDatepicker
                        transfer
                        :editable="false"
                        confirm
                        v-model="topTimeValue[index]"
                        format="HH:mm"
                        type="timerange"
                        placement="bottom-end"
                        :class="`date${index}`"
                        :placeholder="$t('pleaseSelectTime')"
                        :style="item.showSpan ? inputstyle : 'width:168px'"
                        @on-open-change="getCloseTime($event, topTimeValue[index], 'topTimeValue', index)"
                        @on-ok="timeCheckFunction(topTimeValue[index], 'topTimeValue', index)"
                        @on-clear="topTimeValue[index] = ''"
                        @on-change="handleTimeValue($event, 'topTimeValue')"></CustomDatepicker>
                      <span style="margin-left: 5px; background: rgba(224, 60, 58, 0.1); padding: 4px; border: 1px solid #e03c3a; border-radius: 3px">
                        <Icon type="ios-trash-outline" size="22" color="#E03C3A" @click="topMinusList(index)" />
                      </span>
                      <div v-if="item.showSpan" style="color: #e03c3a">
                        <p>{{ $t('periodOverlap') }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <CustomDatepicker type="timerange" format="HH:mm" :readonly="true" v-model="topTimeValue[index]" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></CustomDatepicker>
                    </template>
                  </div>
                  <Button v-if="!unitPriceStatus" ghost long style="margin-top: 5px; width: 168px; background: rgba(0, 126, 255, 0.2)" type="primary" @click="topMinusList('add')">
                    {{ '+' + $t('addTimePeriod') }}
                  </Button>
                </Col>
                <Col :span="6">
                  <div style="margin-bottom: 10px">{{ $t('peakPeriod') }}</div>
                  <div v-for="(item, index) in timeList" :key="item.value" style="margin-top: 8px" :class="{ 'shake-slow': !!item.showSpan }">
                    <template v-if="!unitPriceStatus">
                      <CustomDatepicker
                        transfer
                        :editable="false"
                        confirm
                        v-model="timeValue[index]"
                        format="HH:mm"
                        type="timerange"
                        placement="bottom-end"
                        :placeholder="$t('pleaseSelectTime')"
                        :style="item.showSpan ? inputstyle : 'width:168px'"
                        id="timeValueid"
                        @on-open-change="getCloseTime($event, timeValue[index], 'timeValue', index)"
                        @on-ok="timeCheckFunction(timeValue[index], 'timeValue', index)"
                        @on-clear="timeValue[index] = ''"
                        @on-change="handleTimeValue($event, 'timeValue')"></CustomDatepicker>
                      <span style="margin-left: 5px; background: rgba(224, 60, 58, 0.1); padding: 4px; border: 1px solid #e03c3a; border-radius: 3px">
                        <Icon type="ios-trash-outline" size="22" color="#E03C3A" @click="minusList(index)" />
                      </span>
                      <div v-if="item.showSpan" style="color: #e03c3a">
                        <p>{{ $t('periodOverlap') }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <CustomDatepicker type="timerange" format="HH:mm" :readonly="true" v-model="timeValue[index]" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></CustomDatepicker>
                    </template>
                  </div>
                  <Button v-if="!unitPriceStatus" ghost long style="margin-top: 5px; width: 168px; background: rgba(0, 126, 255, 0.2)" type="primary" @click="minusList('add')">
                    {{ '+' + $t('addTimePeriod') }}
                  </Button>
                </Col>
                <Col :span="6">
                  <div style="margin-bottom: 10px">{{ $t('performancePeriod') }}</div>
                  <div v-for="(item, index) in centerTimeList" :key="item.value" style="margin-top: 8px" :class="{ 'shake-slow': !!item.showSpan }">
                    <template v-if="!unitPriceStatus">
                      <CustomDatepicker
                        transfer
                        :editable="false"
                        confirm
                        v-model="centerTimeValue[index]"
                        format="HH:mm"
                        type="timerange"
                        placement="bottom-end"
                        :placeholder="$t('pleaseSelectTime')"
                        :style="item.showSpan ? inputstyle : 'width:168px'"
                        @on-open-change="getCloseTime($event, centerTimeValue[index], 'centerTimeValue', index)"
                        @on-ok="timeCheckFunction(centerTimeValue[index], 'centerTimeValue', index)"
                        @on-clear="centerTimeValue[index] = ''"
                        @on-change="handleTimeValue($event, 'centerTimeValue')"></CustomDatepicker>
                      <span style="margin-left: 5px; background: rgba(224, 60, 58, 0.1); padding: 4px; border: 1px solid #e03c3a; border-radius: 3px">
                        <Icon type="ios-trash-outline" size="22" color="#E03C3A" @click="centerminusList(index)" />
                      </span>
                      <div v-if="item.showSpan" style="color: #e03c3a">
                        <p>{{ $t('periodOverlap') }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <CustomDatepicker type="timerange" format="HH:mm" :readonly="true" v-model="centerTimeValue[index]" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></CustomDatepicker>
                    </template>
                  </div>
                  <Button v-if="!unitPriceStatus" ghost long style="margin-top: 5px; width: 168px; background: rgba(0, 126, 255, 0.2)" type="primary" @click="centerminusList('add')">
                    {{ '+' + $t('addTimePeriod') }}
                  </Button>
                </Col>
                <Col :span="6">
                  <div style="margin-bottom: 10px">{{ $t('valleyPeriod') }}</div>
                  <div v-for="(item, index) in bottomTimeList" :key="item.value" style="margin-top: 8px" :class="{ 'shake-slow': !!item.showSpan }">
                    <template v-if="!unitPriceStatus">
                      <CustomDatepicker
                        transfer
                        :editable="false"
                        confirm
                        v-model="bottomTimeValue[index]"
                        format="HH:mm"
                        type="timerange"
                        placement="bottom-end"
                        :placeholder="$t('pleaseSelectTime')"
                        :style="item.showSpan ? inputstyle : 'width:168px'"
                        @on-open-change="getCloseTime($event, bottomTimeValue[index], 'bottomTimeValue', index)"
                        @on-ok="timeCheckFunction(bottomTimeValue[index], 'bottomTimeValue', index)"
                        @on-clear="bottomTimeValue[index] = ''"
                        @on-change="handleTimeValue($event, 'bottomTimeValue')"></CustomDatepicker>
                      <span style="margin-left: 5px; background: rgba(224, 60, 58, 0.1); padding: 4px; border: 1px solid #e03c3a; border-radius: 3px">
                        <Icon type="ios-trash-outline" size="22" color="#E03C3A" @click="bottomminusList(index)" />
                      </span>
                      <div v-if="item.showSpan" style="color: #e03c3a">
                        <p>{{ $t('periodOverlap') }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <CustomDatepicker type="timerange" format="HH:mm" :readonly="true" v-model="bottomTimeValue[index]" placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></CustomDatepicker>
                    </template>
                  </div>
                  <Button v-if="!unitPriceStatus" ghost long style="margin-top: 5px; width: 168px; background: rgba(0, 126, 255, 0.2)" type="primary" @click="bottomminusList('add')">
                    {{ '+' + $t('addTimePeriod') }}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div class="content">
          <h3>{{ $t('unitPriceConfig') }}</h3>
          <UnitPrice ref="unitPrice" @unitPricetype="handleunitPricetype" :unitPriceStatus="unitPriceStatus" @saveState="handlesaveState" />
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import { findPowerConfigure, powerConfigure } from '@api/public'
  import TimeBars from '../../../Common/Timers.vue'
  import UnitPrice from './unitPrice.vue'
  import store from '../../../../store'
  import CustomDatepicker from './component/customDatePick/date-picker/picker/time-picker'
  export default {
    name: 'billingSystem-price',
    components: {
      TimeBars,
      UnitPrice,
      CustomDatepicker,
    },
    data() {
      return {
        unitPricetype: '',
        analog: {
          data1: ['17:00', '20-59'],
          data2: ['07:00', '10-59'],
          data3: ['05:00', '06:59'],
          data4: ['11:00', '16-59'],
          data5: ['21:00', '21-59'],
          data6: ['00:00', '04-59'],
        },
        analogData1: [['17:00', '20-59']],
        analogData2: [['07:00', '10-59']],
        analogData3: [
          ['05:00', '06:59'],
          ['11:00', '16-59'],
          ['21:00', '21-59'],
        ],
        analogData4: [['00:00', '04-59']],
        unitPriceStatus: true,
        inputstyle: {
          width: '168px',
          border: '1px solid red',
          borderRadius: '5px',
        },
        bottomStyle: { color: '#E03C3A', display: 'none' },
        NewtopValue: '',
        topValue: '',
        centerValue: '',
        bottomValue: '',
        topTimeList: [{ value: 55, showSpan: false }],
        topTimeValue: [],
        timeList: [{ value: 6, showSpan: false }],
        timeValue: [],
        centerTimeList: [{ value: 8, showSpan: false }],
        centerTimeValue: [],
        bottomTimeList: [{ value: 1, showSpan: false }],
        bottomTimeValue: [],
        timeData: [],
        finallyTime: '',
        isCheck: true,
        isbottomDisplay: '',
        testList: [],
      }
    },
    created() {
      this.init()
    },
    mounted() {},
    methods: {
      handleUnitPrice(type) {
        if (type === 'edit') {
          this.unitPriceStatus = false
          store.commit('configPriceStatus', false)
        } else {
          this.unitPriceStatus = true
          this.init()
          if (this.unitPricetype) {
            this.$refs.unitPrice.init()
          } else {
            this.$refs.unitPrice.handleCleanData()
          }
        }
      },
      async init() {
        const params = { projectCode: this.$store.state.projectCode }
        const res = await findPowerConfigure(params)
        if (res.success) {
          this.NewtopValue = res.data.topPeakPrice ? res.data.topPeakPrice : '' // .substr(0, res.data.topPeakPrice.length - 1)
          this.topValue = res.data.peakPrice ? res.data.peakPrice : '' // .substr(0, res.data.peakPrice.length - 1);
          this.centerValue = res.data.flatPrice ? res.data.flatPrice : '' // .substr(0, res.data.flatPrice.length - 1);
          this.bottomValue = res.data.valleyPrice ? res.data.valleyPrice : '' // .substr(0, res.data.valleyPrice.length - 1);
          for (let index = 0; index < res.data.topPeakList.length; index++) {
            this.topTimeList[index] = { value: Math.random() * 155 + 'top', showSpan: false }
          }
          for (let index = 0; index < res.data.peakList.length; index++) {
            this.timeList[index] = { value: Math.random() * 103 + 'time', showSpan: false }
          }
          for (let index = 0; index < res.data.flatList.length; index++) {
            this.centerTimeList[index] = { value: Math.random() * 10 + 'cent', showSpan: false }
          }
          for (let index = 0; index < res.data.valleyList.length; index++) {
            this.bottomTimeList[index] = { value: Math.random() * 100 + 'bott', showSpan: false }
          }
          this.topTimeValue = res.data.topPeakList
          this.timeValue = res.data.peakList
          this.centerTimeValue = res.data.flatList
          this.bottomTimeValue = res.data.valleyList
          store.commit('configPowerCycle', {
            topTimeValue: this.topTimeValue,
            timeValue: this.timeValue,
            centerTimeValue: this.centerTimeValue,
            bottomTimeValue: this.bottomTimeValue,
          })
          let timedatas = []
          for (let i = 0; i < 1440; i++) {
            timedatas[i] = 0
          }
          let oneList = []
          let twoList = []
          let threeList = []
          let fourList = []
          for (let i = 0; i < this.topTimeValue.length; i++) {
            oneList.push(...this.newMintesFunction(this.topTimeValue[i]))
          }
          for (let i = 0; i < this.timeValue.length; i++) {
            twoList.push(...this.newMintesFunction(this.timeValue[i]))
          }
          for (let i = 0; i < this.centerTimeValue.length; i++) {
            threeList.push(...this.newMintesFunction(this.centerTimeValue[i]))
          }
          for (let i = 0; i < this.bottomTimeValue.length; i++) {
            fourList.push(...this.newMintesFunction(this.bottomTimeValue[i]))
          }
          let neWTopPeakList = oneList
          let newTopList = twoList
          let newCenterList = threeList
          let newBottomList = fourList
          timedatas.forEach((item, index) => {
            newTopList &&
              newTopList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 4
                }
              })
            newCenterList &&
              newCenterList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 2
                }
              })
            newBottomList &&
              newBottomList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 1
                }
              })
            neWTopPeakList &&
              neWTopPeakList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 3
                }
              })
          })
          this.timeData = timedatas
          this.unitPriceStatus = true
        } else {
          this.$Message.error(res.message)
        }
      },
      handleTimeValue(val, type) {
        if (type === 'topTimeValue') {
          store.commit('configPowerCycle', { topTimeValue: val, timeValue: this.timeValue, centerTimeValue: this.centerTimeValue, bottomTimeValue: this.bottomTimeValue })
        } else if (type === 'timeValue') {
          store.commit('configPowerCycle', { topTimeValue: this.topTimeValue, timeValue: val, centerTimeValue: this.centerTimeValue, bottomTimeValue: this.bottomTimeValue })
        } else if (type === 'centerTimeValue') {
          store.commit('configPowerCycle', { topTimeValue: this.topTimeValue, timeValue: this.timeValue, centerTimeValue: val, bottomTimeValue: this.bottomTimeValue })
        } else if (type === 'bottomTimeValue') {
          store.commit('configPowerCycle', { topTimeValue: this.topTimeValue, timeValue: this.timeValue, centerTimeValue: this.centerTimeValue, bottomTimeValue: val })
        }
      },
      addZero(val, type) {
        if (val === '') {
          val = ''
          return false
        }
        if (type === 'NewtopValue') {
          this.NewtopValue = val.toFixed(5)
        } else if (type === 'topValue') {
          this.topValue = val.toFixed(5)
        } else if (type === 'centerValue') {
          this.centerValue = val.toFixed(5)
        } else if (type === 'bottomValue') {
          this.bottomValue = val.toFixed(5)
        }
      },
      myIsNaN(value) {
        return typeof value === 'number' && !isNaN(value)
      },
      getCloseTime(val, time, type, index) {
        if (!val) {
          this.timeCheckFunction(time, type, index)
        }
      },
      getPriceValue(val, type) {
        if (val === '') {
          val = ''
          return false
        }
        if (+val < 0) {
          this.$Message.error({ content: this.$t('electricityPriceCannotNegative') })
        }
        if (!this.myIsNaN(+val)) {
          this.$Message.error({ content: this.$t('pleaseEnterNumber') })
          return false
        }
        if (type === 'NewtopValue') {
          this.NewtopValue = Math.abs(val)
        } else if (type === 'topValue') {
          this.topValue = Math.abs(val)
        } else if (type === 'centerValue') {
          this.centerValue = Math.abs(val)
        } else if (type === 'bottomValue') {
          this.bottomValue = Math.abs(val)
        }
      },
      minusList(val) {
        if (this.timeList.length > 12) {
          this.$Message.error({ content: this.$t('pleaseEnterNumber') })
          return false
        } else {
          if (val === 'add') {
            this.timeList.push({ value: Math.random() * 108 + 'center', showSpan: false })
          } else {
            this.timeList.splice(val, 1)
            this.timeValue.splice(val, 1)
            this.handleTimeValue(this.bottomTimeValue, 'timeValue')
            if (this.timeList.length <= 0) {
              this.timeList = []
              this.timeValue = []
            }
          }
        }
      },
      topMinusList(val) {
        if (val === 'add') {
          this.topTimeList.push({ value: Math.random() * 1080 + 'top', showSpan: false })
        } else {
          this.topTimeList.splice(val, 1)
          this.topTimeValue.splice(val, 1)
          if (this.topTimeList.length <= 0) {
            this.topTimeList = []
            this.topTimeValue = []
          }
          this.handleTimeValue(this.topTimeValue, 'topTimeValue')
        }
        if (this.topTimeList.length > 12) {
          this.topTimeList = 12
          this.$Message.error({ content: this.$t('cantAdd') })
          return false
        }
      },
      centerminusList(val) {
        if (this.centerTimeList.length > 12) {
          this.$Message.error({ content: this.$t('pleaseEnterNumber') })
          return false
        } else {
          if (val === 'add') {
            this.centerTimeList.push({ value: Math.random() * 1000 + 'cen', showSpan: false })
          } else {
            this.centerTimeList.splice(val, 1)
            this.centerTimeValue.splice(val, 1)
            this.handleTimeValue(this.centerTimeValue, 'centerTimeValue')
            if (this.centerTimeList.length <= 0) {
              this.centerTimeList = []
              this.centerTimeValue = []
            }
          }
        }
      },
      bottomminusList(val) {
        if (this.bottomTimeList.length > 12) {
          this.$Message.error({ content: this.$t('pleaseEnterNumber') })
          return false
        } else {
          if (val === 'add') {
            this.bottomTimeList.push({ value: Math.random() * 100 + 'bottom', showSpan: false })
          } else {
            this.bottomTimeList.splice(val, 1)
            this.bottomTimeValue.splice(val, 1)
            this.handleTimeValue(this.bottomTimeValue, 'bottomTimeValue')
            if (this.bottomTimeList.length <= 0) {
              this.bottomTimeList = []
              this.bottomTimeValue = []
            }
          }
        }
      },
      // 按小时渲染饼图方法
      arrFuction(Arr) {
        let arr = Arr.map(([one, two]) => ({ one, two }))
        let secondList = arr.map(item => item.one + '-' + item.two)
        let thirdList = secondList.map(item => [Number(String(item).substr(0, 2)), Number(String(item).substr(6, 2))])
        let newArr = []
        thirdList.forEach(([a, b]) => {
          newArr.push(a)
          for (let i = 0; i < 24; i++) {
            if (a === b) {
              newArr.push(b)
            } else {
              a += 1
              newArr.push(a)
            }
          }
        })
        return Array.from(new Set(newArr))
      },
      newMintesFunction(arr = [], type) {
        if (arr) {
          let a = +arr[0].substr(0, 2)
          let b = +arr[1].substr(0, 2)
          let c = +arr[0].substr(3, 2)
          let d = +arr[1].substr(3, 2)
          if (a - b === 0 && d - c === 0) {
            return []
          }
          let num = (d - c).toFixed(0)
          let g = b - a
          if (a === 0 && g === 0 && d - c > 0) {
            let f = Number(c)
            let newINdex = [f]
            for (let i = 0; i < num; i++) {
              f += 1
              newINdex.push(f)
            }

            return newINdex
          }
          if (g === 0 && d - c > 0 && a > 0) {
            let f = Number(a * 60) + Number(c)
            let newINdex = [f]
            for (let i = 0; i < num; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }
          if (a > 0 && g > 0) {
            let f = Number(a * 60) + Number(c)
            let newINdex = [f]
            let timef = (b - a) * 60 + (d - c)
            for (let i = 0; i < timef; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }

          if (a === 0 && g > 0) {
            let f = 0 + Number(c)
            let newINdex = [f]
            let timef = +(b * 60) + (d - c)
            for (let i = 0; i < timef; i++) {
              f += 1
              newINdex.push(f)
            }
            return newINdex
          }
        } else {
          return []
        }
      },
      // 按12分钟渲染饼图方法
      newTimefuntion(arr = [], type) {
        if (arr) {
          let a = +arr[0].substr(0, 2)
          let b = +arr[1].substr(0, 2)
          let c = +arr[0].substr(3, 2)
          let d = +arr[1].substr(3, 2)
          let num = Math.round((d - c) / 12).toFixed(0)
          if (a - b === 0 && d - c === 0) {
            return []
          }
          let newNums = num === 5 ? 0 : num === 4 ? 1 : num === 3 ? 2 : num === 2 ? 3 : num === 1 ? 4 : 0
          if (a - b === 0 && d - c > 0) {
            let f = Number(a * 5) + Number(newNums) + 1
            let newINdex = [f]
            for (let i = 0; i < num - 1; i++) {
              f += 1
              newINdex.push(f)
            }

            return newINdex
          } else if (b - a > 0) {
            let twoNum = Number(Math.round((60 - c) / 12).toFixed(0))
            let tthreeNums = twoNum === 5 ? 0 : twoNum === 4 ? 1 : twoNum === 3 ? 2 : twoNum === 2 ? 3 : twoNum === 1 ? 4 : 0
            let oneNum = Number((b - a - 1) * 5) + Number(Math.round((60 - c) / 12).toFixed(0)) + Number(Math.round(d / 12).toFixed(0))
            let f = Number(a * 5) + Number(tthreeNums)
            let newINdex = [f]
            for (let i = 0; i < oneNum - 1; i++) {
              f += 1
              newINdex.push(f)
            }

            return newINdex
          }
        } else {
          return []
        }
      },
      async upduateConfig(val) {
        if (this.topTimeList.length > 0 && this.changetimeValue(this.topTimeValue).indexOf('~') === 0) {
          return this.$Message.error({ content: this.$t('sharpPeriod') })
        }
        if (this.timeList.length > 0 && this.changetimeValue(this.timeValue).indexOf('~') === 0) {
          return this.$Message.error({ content: this.$t('peakPeriod') })
        }
        if (this.centerTimeList.length > 0 && this.changetimeValue(this.centerTimeValue).indexOf('~') === 0) {
          return this.$Message.error({ content: this.$t('performancePeriod') })
        }
        if (this.bottomTimeList.length > 0 && this.changetimeValue(this.bottomTimeValue).indexOf('~') === 0) {
          return this.$Message.error({ content: this.$t('valleyPeriod') })
        }
        let topPeak = this.topTimeValue.length > 0 ? this.changetimeValue(this.topTimeValue).join() : ''
        let peak = this.timeValue.length > 0 ? this.changetimeValue(this.timeValue).join() : ''
        let flat = this.centerTimeValue.length > 0 ? this.changetimeValue(this.centerTimeValue).join() : ''
        let valley = this.bottomTimeValue.length > 0 ? this.changetimeValue(this.bottomTimeValue).join() : ''
        let params = { projectCode: this.$store.state.projectCode, loginChannel: 'PC', dataFo: { topPeak, peak, flat, valley } }
        const res = await powerConfigure(params)
        if (res.success) {
          if (val === 'update') this.init()
        } else {
          this.$Message.error(res.message)
        }
      },
      changetimeValue(Arr) {
        if (Arr === []) {
          return false
        } else {
          let arr = Arr && Arr.map(([one, two]) => ({ one, two }))
          let secondList = arr.map(item => item.one + '~' + item.two)
          return secondList
        }
      },
      timeCheckFunction(val, type, index) {
        const numFunctic = (fuc = []) => {
          let numTime = fuc.map(item => item.split(':'))
          let numList = numTime.map(([a, b]) => +(a * 60) + +b)
          return numList
        }
        if (val) {
          if (type === 'timeValue') {
            let newValue = val.map(item => +item.substr(0, 2))
            let oneMinitesVlaue = val.filter((item, index) => index === 1)
            let threeNum = Number(oneMinitesVlaue.join().substr(3, 2))
            let twoMinitesVlaue = val.filter((item, index) => index === 0)
            let fourNum = Number(twoMinitesVlaue.join().substr(3, 2))
            let allTimelist = this.topTimeValue.concat(this.centerTimeValue, this.bottomTimeValue)
            let twoList = allTimelist.map(([a, b]) => [+a.substr(0, 2), +b.substr(0, 2), +b.substr(3, 2), +a.substr(3, 2)])
            try {
              twoList.forEach(([a, b, c, d]) => {
                if (
                  (newValue[0] === a && fourNum === d) ||
                  (newValue[0] === b && fourNum === c) ||
                  (newValue[1] === a && threeNum === d && d !== 0) ||
                  (newValue[1] === b && threeNum === c) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (a < newValue[1] || (a === newValue[1] && d < threeNum)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[0] < b || (newValue[0] === b && fourNum < c)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  (newValue[0] === a && fourNum === d && newValue[1] === b && threeNum === c)
                ) {
                  this.timeList.splice(index, 1, { value: Math.random() * 10055, showSpan: true })
                  this.isCheck = false
                  throw this.timeList
                } else {
                  this.isCheck = true
                  this.timeList.splice(index, 1, { value: Math.random() * 10055, showSpan: false })
                }
              })
            } catch (e) {}
            // 添加被冲突显示
            let numArres = numFunctic(val)
            this.topTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.topTimeList[idex].showSpan = true
                } else {
                  this.topTimeList[idex].showSpan = false
                }
              } else {
                this.topTimeList[idex].showSpan = false
              }
            })
            this.centerTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.centerTimeList[idex].showSpan = true
                } else {
                  this.centerTimeList[idex].showSpan = false
                }
              } else {
                this.centerTimeList[idex].showSpan = false
              }
            })
            this.bottomTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.bottomTimeList[idex].showSpan = true
                } else {
                  this.bottomTimeList[idex].showSpan = false
                }
              } else {
                this.bottomTimeList[idex].showSpan = false
              }
            })
          } else if (type === 'topTimeValue') {
            let newValue = val.map(item => +item.substr(0, 2))
            let oneMinitesVlaue = val.filter((item, index) => index === 1)
            let threeNum = Number(oneMinitesVlaue.join().substr(3, 2))
            let twoMinitesVlaue = val.filter((item, index) => index === 0)
            let fourNum = Number(twoMinitesVlaue.join().substr(3, 2))

            let allTimelist = this.timeValue.concat(this.centerTimeValue, this.bottomTimeValue)
            let twoList = allTimelist.map(([a, b]) => [+a.substr(0, 2), +b.substr(0, 2), +b.substr(3, 2), +a.substr(3, 2)])
            try {
              twoList.forEach(([a, b, c, d]) => {
                if (
                  (newValue[0] === a && fourNum === d) ||
                  (newValue[0] === b && fourNum === c) ||
                  (newValue[1] === a && threeNum === d && d !== 0) ||
                  (newValue[1] === b && threeNum === c) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (a < newValue[1] || (a === newValue[1] && d < threeNum)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[0] < b || (newValue[0] === b && fourNum < c)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  (newValue[0] === a && fourNum === d && newValue[1] === b && threeNum === c)
                ) {
                  this.topTimeList.splice(index, 1, { value: Math.random() * 10055, showSpan: true })

                  this.isCheck = false
                  throw this.topTimeList
                } else {
                  this.isCheck = true
                  this.topTimeList.splice(index, 1, { value: Math.random() * 1055, showSpan: false })
                }
              })
            } catch (e) {}
            // 添加被冲突显示
            let numArres = numFunctic(val)
            this.timeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.timeList[idex].showSpan = true
                } else {
                  this.timeList[idex].showSpan = false
                }
              } else {
                this.timeList[idex].showSpan = false
              }
            })
            this.centerTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.centerTimeList[idex].showSpan = true
                } else {
                  this.centerTimeList[idex].showSpan = false
                }
              } else {
                this.centerTimeList[idex].showSpan = false
              }
            })
            this.bottomTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.bottomTimeList[idex].showSpan = true
                } else {
                  this.bottomTimeList[idex].showSpan = false
                }
              } else {
                this.bottomTimeList[idex].showSpan = false
              }
            })
          } else if (type === 'centerTimeValue') {
            let newValue = val.map(item => +item.substr(0, 2))
            let oneMinitesVlaue = val.filter((item, index) => index === 1)
            let threeNum = Number(oneMinitesVlaue.join().substr(3, 2))
            let twoMinitesVlaue = val.filter((item, index) => index === 0)
            let fourNum = Number(twoMinitesVlaue.join().substr(3, 2))

            let allTimelist = this.timeValue.concat(this.topTimeValue, this.bottomTimeValue)
            let twoList = allTimelist.map(([a, b]) => [+a.substr(0, 2), +b.substr(0, 2), +b.substr(3, 2), +a.substr(3, 2)])
            console.log('🚀 ~ timeCheckFunction ~ twoList:2', twoList)
            try {
              twoList.forEach(([a, b, c, d]) => {
                if (
                  (newValue[0] === a && fourNum === d) ||
                  (newValue[0] === b && fourNum === c) ||
                  (newValue[1] === a && threeNum === d && d !== 0) ||
                  (newValue[1] === b && threeNum === c) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (a < newValue[1] || (a === newValue[1] && d < threeNum)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[0] < b || (newValue[0] === b && fourNum < c)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  (newValue[0] === a && fourNum === d && newValue[1] === b && threeNum === c)
                ) {
                  this.isCheck = false
                  this.centerTimeList.splice(index, 1, { value: Math.random() * 10000, showSpan: true })
                  throw this.centerTimeList
                } else {
                  this.isCheck = true
                  this.centerTimeList.splice(index, 1, { value: Math.random() * 1100, showSpan: false })
                }
              })
            } catch (e) {}
            // 添加被冲突显示
            let numArres = numFunctic(val)
            this.timeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.timeList[idex].showSpan = true
                } else {
                  this.timeList[idex].showSpan = false
                }
              } else {
                this.timeList[idex].showSpan = false
              }
            })
            this.topTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.topTimeList[idex].showSpan = true
                } else {
                  this.topTimeList[idex].showSpan = false
                }
              } else {
                this.topTimeList[idex].showSpan = false
              }
            })
            this.bottomTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.bottomTimeList[idex].showSpan = true
                } else {
                  this.bottomTimeList[idex].showSpan = false
                }
              } else {
                this.bottomTimeList[idex].showSpan = false
              }
            })
          } else if (type === 'bottomTimeValue') {
            let newValue = val.map(item => +item.substr(0, 2))
            let oneMinitesVlaue = val.filter((item, index) => index === 1)
            let threeNum = Number(oneMinitesVlaue.join().substr(3, 2))
            let twoMinitesVlaue = val.filter((item, index) => index === 0)
            let fourNum = Number(twoMinitesVlaue.join().substr(3, 2))

            let allTimelist = this.timeValue.concat(this.topTimeValue, this.centerTimeValue)
            let twoList = allTimelist.map(([a, b]) => [+a.substr(0, 2), +b.substr(0, 2), +b.substr(3, 2), +a.substr(3, 2)])
            console.log('🚀 ~ timeCheckFunction ~ twoList:1', twoList)
            try {
              twoList.forEach(([a, b, c, d]) => {
                if (
                  (newValue[0] === a && fourNum === d) ||
                  (newValue[0] === b && fourNum === c) ||
                  (newValue[1] === a && threeNum === d && d !== 0) ||
                  (newValue[1] === b && threeNum === c) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (a < newValue[1] || (a === newValue[1] && d < threeNum)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[1] < b || (newValue[1] === b && threeNum < c))) ||
                  ((newValue[0] > a || (newValue[0] === a && fourNum > d)) && (newValue[0] < b || (newValue[0] === b && fourNum < c)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  ((newValue[0] < a || (newValue[0] === a && fourNum < d)) && (newValue[1] > b || (newValue[1] === b && threeNum > c))) ||
                  (newValue[0] === a && fourNum === d && newValue[1] === b && threeNum === c)
                ) {
                  this.isCheck = false
                  // this.$Message.error({
                  //     content: '时段选择分钟有重叠,请重新选择'
                  // })
                  this.bottomTimeList.splice(index, 1, { value: Math.random(), showSpan: true })
                  throw this.bottomTimeList
                } else {
                  this.isCheck = true
                  this.bottomTimeList.splice(index, 1, { value: Math.random(), showSpan: false })
                }
              })
            } catch (e) {}
            // 添加被冲突显示
            let numArres = numFunctic(val)
            this.timeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.timeList[idex].showSpan = true
                } else {
                  this.timeList[idex].showSpan = false
                }
              } else {
                this.timeList[idex].showSpan = false
              }
            })
            this.centerTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.centerTimeList[idex].showSpan = true
                } else {
                  this.centerTimeList[idex].showSpan = false
                }
              } else {
                this.centerTimeList[idex].showSpan = false
              }
            })
            this.topTimeValue.forEach((item, idex) => {
              if (Array.isArray(item) && item.length) {
                let one = numFunctic(item)
                if ((numArres[0] > one[0] && numArres[0] < one[1]) || (numArres[1] > one[0] && numArres[1] < one[1]) || numArres[0] === one[0] || numArres[0] === one[1] || (numArres[1] === one[0] && one[0] % 60 !== 0) || numArres[1] === one[1] || (numArres[0] < one[0] && numArres[1] > one[1])) {
                  this.topTimeList[idex].showSpan = true
                } else {
                  this.topTimeList[idex].showSpan = false
                }
              } else {
                this.topTimeList[idex].showSpan = false
              }
            })
          }
        }
        if (this.isCheck) {
          let oneList = []
          let twoList = []
          let threeList = []
          let fourList = []
          for (let i = 0; i < this.topTimeValue.length; i++) {
            oneList.push(...this.newMintesFunction(this.topTimeValue[i]))
          }
          for (let i = 0; i < this.timeValue.length; i++) {
            twoList.push(...this.newMintesFunction(this.timeValue[i]))
          }
          for (let i = 0; i < this.centerTimeValue.length; i++) {
            threeList.push(...this.newMintesFunction(this.centerTimeValue[i]))
          }
          for (let i = 0; i < this.bottomTimeValue.length; i++) {
            fourList.push(...this.newMintesFunction(this.bottomTimeValue[i]))
          }
          let timedatas = []
          for (let i = 0; i < 1440; i++) {
            timedatas.push(0)
          }
          let neWTopPeakList = oneList
          let newTopList = twoList
          let newCenterList = threeList
          let newBottomList = fourList
          timedatas.forEach((item, index) => {
            newTopList &&
              newTopList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 4
                }
              })
            newCenterList &&
              newCenterList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 2
                }
              })
            newBottomList &&
              newBottomList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 1
                }
              })
            neWTopPeakList &&
              neWTopPeakList.map(itm => {
                if (index === itm) {
                  timedatas[itm] = 3
                }
              })
          })
          this.timeData = timedatas
        }
      },
      handlesaveState(val) {
        this.unitPriceStatus = val
        this.$refs.unitPrice.init()
      },
      handleunitPricetype(val) {
        this.unitPricetype = val
      },
      savePriceConfig() {
        this.upduateConfig('update')
        this.$refs.unitPrice.save()
      },
    },
  }
</script>

<style lang="less">
  .price {
    height: calc(~'100vh - 142px');
    overflow: hidden;
    & > .ivu-tabs {
      height: 100%;
      & > .ivu-tabs-content {
        height: calc(~'100% - 48px');
        overflow: auto;
        &::-webkit-scrollbar {
          width: 0;
          height: 0px;
        }
      }
      & > .ivu-tabs-bar {
        background: #1a202e;
        padding: 7px 10px 5px 10px;
        border-radius: 5px;
        margin-bottom: 0px;
        box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2);
      }
    }
    .content {
      margin-top: 10px;
      padding: 20px;
    }
    .length {
      display: flex;
      justify-content: center;
      margin-right: 20px;
      span {
        display: flex;
        align-items: center;
        margin: 0 15px;
        i {
          width: 10px;
          height: 10px;
          display: block;
          margin-right: 5px;
        }
      }
    }
    .length span:nth-child(1) {
      i {
        background: #e03c3a;
      }
    }
    .length span:nth-child(2) {
      i {
        background: #ffa854;
      }
    }
    .length span:nth-child(3) {
      i {
        background: #007fff;
      }
    }
    .length span:nth-child(4) {
      i {
        background: #0dd667;
      }
    }
    @keyframes shake-slow {
      2% {
        transform: translate(3px, 0px) rotate(0deg);
      }

      12% {
        transform: translate(-3px, 0px) rotate(0deg);
      }

      22% {
        transform: translate(3px, 0px) rotate(0deg);
      }

      32% {
        transform: translate(-3px, 0px) rotate(0deg);
      }

      42% {
        transform: translate(3px, 0px) rotate(0deg);
      }

      52% {
        transform: translate(-3px, 0px) rotate(0deg);
      }

      62% {
        transform: translate(3px, 0px) rotate(0deg);
      }

      72% {
        transform: translate(-3px, 0px) rotate(0deg);
      }

      82% {
        transform: translate(3px, 0px) rotate(0deg);
      }

      92% {
        transform: translate(-3px, 0px) rotate(0deg);
      }

      0%,
      100% {
        transform: translate(0, 0) rotate(0);
      }
    }

    .shake-slow {
      animation: shake-slow 0.5s ease-in-out 0s 1 alternate forwards;
    }
  }
</style>
