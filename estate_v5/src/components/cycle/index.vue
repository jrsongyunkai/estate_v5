<template>
  <div class="cyclecomponts">
    <h3>{{ $t('cyclePeriod') }}</h3>
    <Row style="margin-top: 20px">
      <Col :span="6" class="cycleTime">
        <Form>
          <FormItem :label="$t('cyclePeriod')">
            <Select v-model="cycle" class="w400">
              <Option v-for="item in cycleList" :value="item.value" :key="item.value" :disabled="item.disable">
                <div @click="cycleSecect(item)" style="width: 100%" v-if="item.disable">
                  {{ item.label }}
                </div>
                <template v-else>
                  {{ item.label }}
                </template>
              </Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('selectCycle')" v-if="cycle === 2">
            <Select v-model="loopValue" filterable multiple allow-create class="w400" :max-tag-count="4">
              <Option v-for="item in weekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <template v-if="cycle === 3">
            <FormItem :label="$t('calendar')">
              <Select v-model="calendar" class="w400">
                <Option v-for="item in calendarData" :value="item.value" :key="item.value" :disabled="item.disable">
                  <div @click="cycleSecect(item)" style="width: 100%" v-if="item.disable">
                    {{ item.label }}
                  </div>
                  <template v-else>
                    {{ item.label }}
                  </template>
                </Option>
              </Select>
            </FormItem>
            <template v-if="calendar === '1'">
              <FormItem :label="$t('loopMode')">
                <Select v-model="month" class="w400">
                  <Option v-for="item in mode" :value="item.value" :key="item.value" :disabled="item.disable">
                    <div @click="cycleSecect(item)" style="width: 100%" v-if="item.disable">
                      {{ item.label }}
                    </div>
                    <template v-else>
                      {{ item.label }}
                    </template>
                  </Option>
                </Select>
              </FormItem>
              <Row v-if="month === '1'" class="timeSelect w400">
                <div>{{ $t('selectDate') }}</div>
                <Select :value="model11" multiple style="width: 400px" :max-tag-count="4" @on-change="handleSelect($event, '1')" class="selectDropdown">
                  <Option v-for="item in model11" :value="item" :key="item">{{ item }}</Option>
                </Select>
                <DatePicker :value="model11" :editable="false" id="datePicker" :clearable="false" ref="datePickerRef" type="date" multiple :format="`d${$t('day')}`" @on-change="datePickerQurey($event, '1')" style="width: 400px" class="datePicker"></DatePicker>
              </Row>
              <Row v-if="month === '2'">
                <FormItem :label="$t('rule')" style="width: 400px">
                  <Select v-model="rule">
                    <Option v-for="item in ruleList" :value="item.value" :key="item.value" :disabled="item.disable">
                      <div @click="cycleSecect(item)" style="width: 100%" v-if="item.disable">
                        {{ item.label }}
                      </div>
                      <template v-else>
                        {{ item.label }}
                      </template>
                    </Option>
                  </Select>
                </FormItem>
                <div v-if="rule === '1'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px">
                    <FormItem :label="$t('everyMonth')" :label-width="55">
                      <Select v-model="ordinal" style="width: 145px">
                        <Option v-for="item in ordinalIndex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('weekly')" :label-width="40" class="ml-10">
                      <Select v-model="ordinalWeek" style="width: 150px">
                        <template v-if="ordinal !== '6'">
                          <Option v-for="item in ordinalWeekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </template>
                        <template v-if="ordinal === '6' && $store.state.mondaySelect === true">
                          <Option v-for="item in ordinalWeekListFiter" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </template>
                        <template v-if="ordinal === '6' && $store.state.mondaySelect === false">
                          <Option v-for="item in ordinalWeekListFiter2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </template>
                      </Select>
                    </FormItem>
                  </Row>
                </div>
                <div v-if="rule === '2'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px">
                    <FormItem :label="$t('everyMonth')" :label-width="55">
                      <Select v-model="ordinal" style="width: 145px">
                        <Option v-for="item in ordinalWeekDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Row>
                </div>
                <div v-if="rule === '5'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px">
                    <FormItem :label="$t('countdownEveryMonth')" :label-width="90">
                      <Select v-model="ordinal" style="width: 100px">
                        <Option v-for="item in ordinalWeekAll" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('weekly')" :label-width="55">
                      <Select v-model="ordinalWeek" style="width: 100px">
                        <template v-if="ordinal !== '6'">
                          <Option v-for="item in ordinalWeekList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </template>
                        <template v-if="ordinal === '6'">
                          <Option v-for="item in ordinalWeekListFiter" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </template>
                      </Select>
                    </FormItem>
                  </Row>
                </div>
                <div v-if="rule === '6'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px">
                    <FormItem :label="$t('countdownEveryMonth')" :label-width="90">
                      <Select v-model="ordinal" style="width: 145px">
                        <Option v-for="item in ordinalWeekDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Row>
                </div>
              </Row>
            </template>
            <template v-if="calendar === '2'">
              <FormItem :label="$t('loopMode')">
                <Select v-model="month" class="w400">
                  <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('pleaseSelectDateTime')" v-if="month === '1'">
                <TreeSelect v-model="calendarMonthvalue" multiple show-checkbox :max-tag-count="4" :data="calendarMonthdata" class="w400" />
              </FormItem>
              <div v-if="month === '2'">
                <FormItem :label="$t('rule')">
                  <Select v-model="calendarMonthRule" style="width: 352px">
                    <Option v-for="item in calendarMonthRuleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <div v-if="calendarMonthRule === '2'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row class="ordinalSelection">
                    <FormItem :label="$t('everyMonth')" :label-width="55">
                      <Select v-model="calendarMonthRuleDay" style="width: 145px">
                        <Option v-for="item in dateLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                      {{ $t('day1') }}
                    </FormItem>
                  </Row>
                </div>
                <div v-if="calendarMonthRule === '6'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row class="ordinalSelection">
                    <FormItem :label="$t('countdownEveryMonth')" :label-width="85">
                      <Select v-model="calendarMonthRuleReciprocalDay" style="width: 145px">
                        <Option v-for="item in dateLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                      {{ $t('day1') }}
                    </FormItem>
                  </Row>
                </div>
              </div>
            </template>
          </template>
          <template v-if="cycle === 4">
            <FormItem :label="$t('calendar')">
              <Select v-model="calendar" class="w400">
                <Option v-for="item in calendaryData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <template v-if="calendar === '1'">
              <FormItem :label="$t('loopMode')">
                <Select v-model="year" class="w400">
                  <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <Row v-if="year === '1'" class="w400 timeSelect2">
                <div>{{ $t('selectDate') }}</div>
                <Select :value="model12" multiple :max-tag-count="2" @on-change="handleSelect($event, '1')" class="selectDropdown w400">
                  <Option v-for="item in model12" :value="item" :key="item">{{ item }}</Option>
                </Select>
                <DatePicker :value="model12" :editable="false" id="datePicker" :clearable="false" ref="datePickerRef" type="date" multiple format="MM-dd" @on-change="datePickerQurey($event, '2')" style="width: 400px" class="datePicker"></DatePicker>
              </Row>
              <Row v-if="year === '2'">
                <FormItem :label="$t('rule')">
                  <Select v-model="ruleYear" style="width: 352px">
                    <Option v-for="item in ruleYearList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <div v-if="ruleYear === '3'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px; margin-top: 20px">
                    <FormItem :label="$t('annually')" :label-width="40">
                      <Select v-model="ordinalYear" style="width: 145px">
                        <Option v-for="item in ordinalYearWeek" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Row>
                </div>
                <div v-if="ruleYear === '4'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px; margin-top: 20px">
                    <FormItem :label="$t('annually')" :label-width="40">
                      <Select v-model="ordinalYear" style="width: 145px">
                        <Option v-for="item in ordinalYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <span v-show="ordinalYear === '366'" style="color: red; font-size: 12px">{{ $t('leapYearAndLeapMonthTips1') }}</span>
                  </Row>
                </div>
                <div v-if="ruleYear === '7'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px; margin-top: 20px">
                    <FormItem :label="$t('countdownEveryYear')" :label-width="75">
                      <Select v-model="ordinalYear" style="width: 145px">
                        <Option v-for="item in ordinalYearWeek" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                  </Row>
                </div>
                <div v-if="ruleYear === '8'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row style="display: flex; width: 400px; margin-top: 20px">
                    <FormItem :label="$t('countdownEveryYear')" :label-width="75">
                      <Select v-model="ordinalYear" style="width: 145px">
                        <Option v-for="item in ordinalYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <span v-show="ordinalYear === '366'" style="color: red; font-size: 12px">{{ $t('leapYearAndLeapMonthTips1') }}</span>
                  </Row>
                </div>
              </Row>
            </template>
            <template v-if="calendar === '2'">
              <FormItem :label="$t('loopMode')">
                <Select v-model="year" class="w400">
                  <Option v-for="item in mode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('startDate')" v-if="year === '1'">
                <el-cascader :options="calendarYearCascader" :props="props" collapse-tags clearable @change="Querycascader" v-model="cascaderModel" separator="" :placeholder="$t('pleaseEnterTheStartDate')" style="background: transparent; width: 346px"></el-cascader>
              </FormItem>
              <template v-if="year === '2'">
                <FormItem :label="$t('rule')">
                  <Select v-model="calendarYearRule" style="width: 352px">
                    <Option v-for="item in calendarYearRuleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <div v-if="calendarYearRule === '4'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row class="ordinalSelection">
                    <FormItem :label="$t('annually')" :label-width="40">
                      <Select v-model="calendarYearRuleDay" style="width: 145px">
                        <Option v-for="item in calendarYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <span class="tips" v-if="calendarYearRuleDay > 354">{{ $t('leapYearAndLeapMonthTips2') }}</span>
                  </Row>
                </div>
                <div v-if="calendarYearRule === '8'">
                  <div>{{ $t('ordinalSelection') }}</div>
                  <Row class="ordinalSelection">
                    <FormItem :label="$t('countdownEveryYear')" :label-width="70">
                      <Select v-model="calendarYearRuleReciprocalDay" style="width: 145px">
                        <Option v-for="item in calendarYearDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <span class="tips" v-if="calendarYearRuleReciprocalDay > 354">{{ $t('leapYearAndLeapMonthTips2') }}</span>
                  </Row>
                </div>
              </template>
            </template>
          </template>
        </Form>
      </Col>
    </Row>
  </div>
</template>
<script>
  import { calendarMonthdata, calendarYearCascader } from '../../pages/multiManage/threShold/data'
  import { queryDateConfig } from '@/api/public'
  import { queryBoxAbnormalConfig } from '@api/multiManage/runningTense'
  export default {
    props: {
      formValidateType: Number,
      edit: Boolean,
      rowItem: { type: Object, default: () => {} },
      delCycle: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        calendarYearRuleDay: '',
        calendarYearRuleReciprocalDay: '',
        calendarYearRule: '',
        calendarYearRuleList: [
          {
            value: '4',
            label: this.$t('annually1'),
          },
          {
            value: '8',
            label: this.$t('countdownEveryYearsday'),
          },
        ],
        cascaderModel: '',
        props: { multiple: true },
        ordinalYear: '',
        model12: [],
        year: '',
        ruleYear: '',
        ruleYearList: [
          {
            value: '3',
            label: this.$t('everyYearweek'),
          },
          {
            value: '4',
            label: this.$t('everyYearday'),
          },
          {
            value: '7',
            label: this.$t('countdownEveryYearsWeek'),
          },
          {
            value: '8',
            label: this.$t('countdownEveryYearsday'),
          },
        ],
        calendaryData: [
          {
            value: '1',
            label: this.$t('gregorianCalendar'),
          },
          {
            value: '2',
            label: this.$t('lunarCalendar'),
          },
        ],
        calendarMonthRuleList: [
          {
            value: '2',
            label: this.$t('everyMouthOneOfDay'),
          },
          {
            value: '6',
            label: this.$t('countdownEveryMonthOneOfDay'),
          },
        ],
        calendarMonthRuleReciprocalDay: '',
        calendarMonthRule: '',
        calendarMonthvalue: [],
        calendarMonthdata: calendarMonthdata,
        calendarYearvalue: '',
        calendarYearCascader: calendarYearCascader,
        dateLists: [],
        dateList: [],
        ordinalWeekDay: [],
        loopValue: '',
        cycle: '',
        calendarMonthRuleDay: '',
        cycleList: [
          {
            value: 1,
            label: this.$t('everyDay'),
            disable: false,
          },
          {
            value: 2,
            label: this.$t('weekly'),
            disable: false,
          },
          {
            value: 3,
            label: this.$t('monthlyCycle'),
            disable: this.formValidateType === 1,
          },
          {
            value: 4,
            label: this.$t('yearlyCycle'),
            disable: this.formValidateType === 1,
          },
        ],

        model11: [],

        weekList: [],
        calendar: '',
        calendarData: [
          {
            value: '1',
            label: this.$t('gregorianCalendar'),
            disable: false,
          },
          {
            value: '2',
            label: this.$t('lunarCalendar'),
            disable: this.formValidateType === 1,
          },
        ],
        month: '',
        mode: [
          {
            value: '1',
            label: this.$t('cycleByDate'),
            disable: this.formValidateType === 1,
          },
          {
            value: '2',
            label: this.$t('cycleByOrdinalNumber'),
            disable: false,
          },
        ],
        rule: '',
        ruleList: [
          {
            value: '1',
            label: this.$t('weekEverymonth'),
            disable: this.formValidateType === 1,
          },
          {
            value: '2',
            label: this.$t('monthday'),
            disable: false,
          },
          {
            value: '5',
            label: this.$t('countdownEveryMonthRule5'),
            disable: this.formValidateType === 1,
          },
          {
            value: '6',
            label: this.$t('countdownEveryMonthRule6'),
            disable: this.formValidateType === 1,
          },
        ],
        ordinal: '',
        ordinalIndex: [
          {
            value: '1',
            label: this.$t('first'),
          },
          {
            value: '2',
            label: this.$t('second'),
          },
          {
            value: '3',
            label: this.$t('third'),
          },
          {
            value: '4',
            label: this.$t('fourth'),
          },
          {
            value: '5',
            label: this.$t('fifth'),
          },
          {
            value: '6',
            label: this.$t('sixth'),
          },
        ],
        ordinalWeekAll: [
          {
            value: '1',
            label: this.$t('first'),
          },
          {
            value: '2',
            label: this.$t('second'),
          },
          {
            value: '3',
            label: this.$t('third'),
          },
          {
            value: '4',
            label: this.$t('fourth'),
          },
          {
            value: '5',
            label: this.$t('fifth'),
          },
          {
            value: '6',
            label: this.$t('sixth'),
          },
        ],
        calendarYearDay: [],
        ordinalWeek: '',
        ordinalWeekListFiter: [
          {
            value: '1',
            label: this.$t('monday'),
          },
          {
            value: '2',
            label: this.$t('tuesday'),
          },
        ],
        ordinalWeekListFiter2: [
          {
            value: '7',
            label: this.$t('sunday'),
          },
          {
            value: '1',
            label: this.$t('monday'),
          },
        ],
        ordinalWeekList: [
          {
            value: '7',
            label: this.$t('sunday'),
          },
          {
            value: '1',
            label: this.$t('monday'),
          },
          {
            value: '2',
            label: this.$t('tuesday'),
          },
          {
            value: '3',
            label: this.$t('wednesday'),
          },
          {
            value: '4',
            label: this.$t('thursday'),
          },
          {
            value: '5',
            label: this.$t('friday'),
          },
          {
            value: '6',
            label: this.$t('saturday'),
          },
        ],
        ordinalYearWeek: [],
        ordinalYearDay: [],
      }
    },
    mounted() {
      this.handlequeryDateConfig()
      this.untilFuntionTime()
      this.mondaySelect()
      setTimeout(() => {
        if (this.edit) {
          this.dataValue()
        }
      }, 400)
    },
    watch: {
      formValidateType: {
        handler(newVal) {
          if (newVal === 2) {
            this.mode = []
            this.mode = [
              {
                value: '1',
                label: this.$t('cycleByDate'),
                disable: false,
              },
              {
                value: '2',
                label: this.$t('cycleByOrdinalNumber'),
                disable: false,
              },
            ]
            this.cycleList[2].disable = false
            this.cycleList[3].disable = false
            this.calendarData[1].disable = false

            this.ruleList.forEach(val => {
              val.disable = false
            })
          } else {
            this.cycleList[2].disable = true
            this.cycleList[3].disable = true
            this.calendarData[1].disable = true
            this.mode = []
            this.mode = [
              {
                value: '1',
                label: this.$t('cycleByDate'),
                disable: true,
              },
              {
                value: '2',
                label: this.$t('cycleByOrdinalNumber'),
                disable: false,
              },
            ]
            this.ruleList.forEach((val, ind) => {
              if (ind === 1) {
                val.disable = false
              } else {
                val.disable = true
              }
            })
          }
          this.macLineData = []
          if (!this.edit) {
            this.cycle = null
          }

          this.loopValue = ''
          this.startTime = ''
          this.endTime = ''
          this.rule = ''
          this.ordinal = ''
          this.ordinalWeek = ''
        },
      },
      '$store.state.mondaySelect': {
        handler(newVal, oldVal) {
          if (newVal === true) {
            this.weekList = [
              {
                value: '1',
                label: this.$t('monday'),
              },
              {
                value: '2',
                label: this.$t('tuesday'),
              },
              {
                value: '3',
                label: this.$t('wednesday'),
              },
              {
                value: '4',
                label: this.$t('thursday'),
              },
              {
                value: '5',
                label: this.$t('friday'),
              },
              {
                value: '6',
                label: this.$t('saturday'),
              },
              {
                value: '7',
                label: this.$t('sunday'),
              },
            ]
          } else {
            this.weekList = [
              {
                value: '7',
                label: this.$t('sunday'),
              },
              {
                value: '1',
                label: this.$t('monday'),
              },
              {
                value: '2',
                label: this.$t('tuesday'),
              },
              {
                value: '3',
                label: this.$t('wednesday'),
              },
              {
                value: '4',
                label: this.$t('thursday'),
              },
              {
                value: '5',
                label: this.$t('friday'),
              },
              {
                value: '6',
                label: this.$t('saturday'),
              },
            ]
          }
        },
      },
      delCycle: {
        handler(newVal) {
          if (newVal === '1') {
            this.cycle = null
          }
        },
        deep: true,
      },
    },
    methods: {
      handlequeryDateConfig() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        queryDateConfig(params).then(res => {
          this.$store.commit('mondaySelect', res.data.weekFirstDay === '1')
        })
      },
      cycleSecect(item) {
        if (item.disable) {
          this.$Modal.warning({
            title: this.$t('tip'),
            content: this.$t('loopModeTips1'),
          })
        }
      },
      handletensecycleSave() {
        let cycleData = ''
        let cycleMode = ''
        let cycleRule = ''
        switch (this.cycle) {
          case 2:
            cycleData = `${this.loopValue.map(Number)}`
            break
          case 3:
            cycleMode = this.month
            if (this.calendar === '1') {
              if (cycleMode === '1') {
                cycleData = `${this.startTime}`
              } else {
                cycleRule = this.rule
                if (cycleRule === '1' || cycleRule === '3' || cycleRule === '5') {
                  cycleData = `${this.ordinal}_${this.ordinalWeek}`
                } else {
                  cycleData = this.ordinal
                }
              }
            }
            if (this.calendar === '2') {
              if (cycleMode === '1') {
                cycleData = `${this.calendarMonthvalue}`
              } else {
                cycleRule = this.calendarMonthRule
                if (cycleRule === '2') {
                  cycleData = `${this.calendarMonthRuleDay}`
                }
                if (cycleRule === '6') {
                  cycleData = `${this.calendarMonthRuleReciprocalDay}`
                }
              }
            }

            break
          case 4:
            cycleMode = this.year
            if (this.calendar === '1') {
              if (cycleMode === '1') {
                cycleData = `${this.startTime}`
              } else {
                cycleRule = this.ruleYear
                if (cycleRule === '1') {
                  cycleData = this.ordinalYear
                } else {
                  cycleData = this.ordinalYear
                }
              }
            }

            if (this.calendar === '2') {
              cycleRule = this.calendarYearRule
              if (cycleMode === '1') {
                cycleData = `${this.cascader}`
              } else {
                if (cycleRule === '4') {
                  cycleData = `${this.calendarYearRuleDay}`
                }
                if (cycleRule === '8') {
                  cycleData = `${this.calendarYearRuleReciprocalDay}`
                }
              }
            }

            break
        }
        this.cycleData = {
          calendar: this.calendar,
          loopType: this.cycle,
          loopMode: cycleMode,
          loopRule: cycleRule,
          value: cycleData,
        }
        this.$emit('cycleData', this.cycleData)
      },
      Querycascader(val) {
        this.cascader = []
        val.map(item => {
          this.cascader.push(`${item[0]}${item[1]}`)
        })
      },
      untilFuntionTime() {
        for (var i = 1; i <= 30; i++) {
          this.dateLists.push({
            value: `${i}`,
            label: `${this.$t('section')}${i}`,
          })
          this.dateList.push({
            value: `${i}`,
            label: `${this.$t('numberThValue', { num: i })}`,
          })
        }

        for (var o = 1; o <= 31; o++) {
          this.ordinalWeekDay.push({
            value: `${o}`,
            label: `${this.$t('section')}${o}${this.$t('day')}`,
          })
        }

        for (var j = 1; j <= 54; j++) {
          this.ordinalYearWeek.push({
            value: `${j}`,
            label: `${this.$t('section')}${j}${this.$t('week')}`,
          })
        }
        for (var k = 1; k <= 366; k++) {
          this.ordinalYearDay.push({
            value: `${k}`,
            label: `${this.$t('section')}${k}${this.$t('day')}`,
          })
        }

        for (var l = 1; l <= 384; l++) {
          this.calendarYearDay.push({
            value: `${l}`,
            label: `${this.$t('section')}${l}${this.$t('day')}`,
          })
        }
      },
      mondaySelect() {
        if (this.$store.state.mondaySelect === true) {
          this.weekList = [
            {
              value: '1',
              label: this.$t('monday'),
            },
            {
              value: '2',
              label: this.$t('tuesday'),
            },
            {
              value: '3',
              label: this.$t('wednesday'),
            },
            {
              value: '4',
              label: this.$t('thursday'),
            },
            {
              value: '5',
              label: this.$t('friday'),
            },
            {
              value: '6',
              label: this.$t('saturday'),
            },
            {
              value: '7',
              label: this.$t('sunday'),
            },
          ]
        } else {
          this.weekList = [
            {
              value: '7',
              label: this.$t('sunday'),
            },
            {
              value: '1',
              label: this.$t('monday'),
            },
            {
              value: '2',
              label: this.$t('tuesday'),
            },
            {
              value: '3',
              label: this.$t('wednesday'),
            },
            {
              value: '4',
              label: this.$t('thursday'),
            },
            {
              value: '5',
              label: this.$t('friday'),
            },
            {
              value: '6',
              label: this.$t('saturday'),
            },
          ]
        }
      },
      handleSelect(val, type) {
        if (type === '1') {
          const temp = this.model11.concat(val).filter(item => !val.includes(item))
          const index = this.model11.indexOf(temp[0])
          if (index !== -1) {
            const internalValue = this.$refs.datePickerRef.internalValue
            internalValue.splice(index, 1)
            this.$refs.datePickerRef.internalValue = [...internalValue]
          }
          this.model11 = val
        } else {
          const temp = this.model12.concat(val).filter(item => !val.includes(item))
          const index = this.model12.indexOf(temp[0])
          if (index !== -1) {
            const internalValue = this.$refs.datePickerRef.internalValue
            internalValue.splice(index, 1)
            this.$refs.datePickerRef.internalValue = [...internalValue]
          }
          this.model12 = val
        }
      },
      datePickerQurey(val, type) {
        this.model11 = []
        this.model12 = []
        this.list2 = []
        this.data = val.split(',')
        this.data.map((val, index) => {
          this.list2.push({
            value: 'time' + index,
            label: val,
          })
        })

        if (type === '1') {
          this.list2.map(item => {
            this.model11.push(item.label)
          })
          this.startTime = `${this.data.map(item => item.replace(/日/, ''))}`
        } else {
          this.list2.map(item => {
            this.model12.push(item.label)
          })
          let arr = this.data.map(item => item.replace(/月/, ''))
          this.startTime = `${arr.map(item => item.replace(/日/, ''))}`
        }
      },
      CanstoDimension(arr1, arr2) {
        let arr = []
        for (let i = 0; i < arr1.length; i++) {
          arr.push([arr1[i], arr2[i]])
        }
        return arr
      },
      async dataValue() {
        let params = {
          configId: this.rowItem.configId,
          projectCode: this.$store.state.projectCode,
        }
        const res = await queryBoxAbnormalConfig(params)
        const { loopMode, loopRule, loopType, value, calendarType } = res.data.cycleInfo
        this.cycledate = {
          calendarType: calendarType,
          loopMode: loopMode,
          loopRule: loopRule,
          loopType: loopType,
          value: value,
        }
        this.cycle = this.cycledate.loopType
        console.log('🚀 ~ file: index.vue:964 ~ dataValue ~ this.cycledate.loopType:', this.cycledate.loopType)
        console.log('🚀 ~ file: index.vue:961 ~ dataValue ~  this.cycle:', this.cycle)

        const valueCycle = this.cycledate.value
        let arrmodel = (valueCycle && valueCycle.split(',')) || []

        this.model11 = arrmodel.map(item => `${item}${this.$t('day')}`)
        this.model12 = arrmodel.map(item => item.slice(0, 2) + this.$t('month') + item.slice(2, 4) + this.$t('day'))

        if (this.cycledate.loopType === 3) {
          this.startTime = this.model11.map(item => item.replace(/日/, ''))
        }

        if (this.cycledate.loopType === 4) {
          if (this.cycledate.calendarType === 1) {
            let arr = this.model12.map(item => item.replace(/月/, ''))

            this.startTime = arr.map(item => item.replace(/日/, ''))
          }
        }

        let casList = []
        let arr1 = []
        let arr2 = []
        this.cascader = []
        valueCycle &&
          valueCycle.split(',').map(val => {
            this.cascader.push(val)
            arr1.push(val.substring(0, 2))
            arr2.push(val.substring(2, 4))
          })

        casList = this.CanstoDimension(arr1, arr2)
        let reg = /\d+/g

        this.calendarYearRuleReciprocalDay = valueCycle || ''
        this.calendarYearRuleDay = valueCycle || ''

        this.calendarYearRule = `${this.cycledate.loopRule}`
        this.cascaderModel = casList
        this.calendarMonthRule = `${this.cycledate.loopRule}`

        if (valueCycle) {
          this.calendarMonthRuleDay = valueCycle && valueCycle.match(reg)[0]
          this.calendarMonthRuleReciprocalDay = valueCycle.match(reg)[0]
        }

        this.calendar = `${this.cycledate.calendarType}`
        this.calendarMonthvalue = valueCycle && valueCycle.split(',')

        this.loopValue = valueCycle && valueCycle.match(reg)
        this.month = `${this.cycledate.loopMode}`
        this.year = `${this.cycledate.loopMode}`

        this.endTime = valueCycle ? valueCycle.match(reg)[1] : ''

        this.rule = `${this.cycledate.loopRule}`
        this.ordinal = valueCycle ? valueCycle.match(reg)[0] : ''
        this.ordinalWeek = valueCycle ? valueCycle.match(reg)[1] : ''
        this.ruleYear = `${this.cycledate.loopRule}`
        this.ordinalYear = valueCycle ? valueCycle.match(reg)[0] : ''
      },
    },
  }
</script>
<style lang="less">
  .cyclecomponts {
    .timeSelect {
      position: relative;
      .selectDropdown {
        margin-top: 10px;
        .ivu-select-dropdown {
          display: none;
        }
        .ivu-tag {
          z-index: 10;
        }
      }
      .datePicker {
        position: absolute;
        top: 30px;
        .ivu-input,
        .ivu-input-suffix {
          opacity: 0;
        }
        .ivu-date-picker-header,
        .ivu-picker-confirm {
          display: none;
        }
        .ivu-select-dropdown {
          z-index: 10;
        }
      }
    }
    .timeSelect2 {
      position: relative;
      .selectDropdown {
        margin-top: 10px;
        .ivu-select-dropdown {
          display: none;
        }
        .ivu-tag {
          z-index: 10;
        }
      }
      .datePicker {
        position: absolute;
        top: 30px;
        .ivu-input,
        .ivu-input-suffix {
          opacity: 0;
        }
        .ivu-picker-confirm {
          display: none;
        }
      }
    }
  }
  .el-input__suffix {
    line-height: 30px;
    font-size: 12px;
  }
  .el-input--suffix .el-input__inner {
    padding: 0 10px;
  }
  .el-checkbox__inner {
    background-color: transparent;
    border: 1px solid #3d3d41;
  }
  .el-input__inner {
    background-color: #1a202e;
    border-color: #3d3d41;
    height: 30px !important;
    line-height: 30px;
  }
  .el-input__inner:hover {
    border-color: #5a5a5e;
  }
  .el-cascader__dropdown {
    background: #1a202e;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
    border: transparent;
    line-height: 30px;
  }
  .el-input {
    input::placeholder {
      font-weight: 400;
      color: #fff;
    }
  }
  .el-input.is-focus .el-input__inner {
    border-color: #57a3f3;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(45, 140, 240, 0.2);
  }
  .el-cascader-menu {
    border-right: solid 1px #3d3d41;
  }
  .el-cascader-node.in-active-path {
    color: #2d8cf0;
  }
  .el-cascader:not(.is-disabled):hover .el-input__inner {
    border-color: #5a5a5e;
  }
  .popper__arrow,
  .popper__arrow::after {
    border-bottom-color: transparent !important;
  }
  .el-cascader-node:not(.is-disabled):focus,
  .el-cascader-node:not(.is-disabled):hover {
    background: #2c2c2e !important;
  }
  .el-cascader-menu {
    color: #fff !important;
  }
  .el-cascader__tags .el-tag {
    color: #fff;
    background: transparent;
    border-color: #3d3d41 !important;
    border-radius: 0px;
  }
  .el-tag .el-icon-close {
    line-height: 20px;
    background-color: transparent !important;
  }
  .el-cascader-menu {
    min-width: 128px;
  }
</style>
