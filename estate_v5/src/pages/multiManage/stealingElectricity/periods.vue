<template>
  <div class="tensePeriods">
    <h3>{{ $t('configureTimePeriods') }}</h3>
    <div class="tip">
      <i class="icon-v5 icon-v5-huifu"></i>
      <span>{{ $t('pleaseConfigFloatLimit') }}</span>
    </div>
    <Row style="margin-top: 20px">
      <Col :span="16">
        <div class="defaultTime">
          <div class="defaultTime_header">{{ $t('defaultTimePeriod') }}</div>
          <Form label-position="top" :model="defaultTimeDynamic" ref="defaultTime" :rules="defaultRuleValidate">
            <Row class="timeStatus">
              <FormItem :label="$t('floatingCap')" class="mr10" prop="value">
                <Input :placeholder="$t('pleaseEnter')" style="width: 170px" v-model="defaultTimeDynamic.value">
                  <i slot="suffix" style="font-size: 14px">%</i>
                </Input>
              </FormItem>
              <FormItem :label="$t('alarmTriggeringMechanism')" class="mr10 fromIcon" prop="model">
                <Poptip word-wrap width="250" trigger="hover" class="ic">
                  <div slot="content">
                    <div style="text-align: left; color: #999; margin-bottom: 10px">{{ $t('theftMonitorTips1') }}</div>
                    <div style="text-align: left; color: #999">{{ $t('theftMonitorTips2') }}</div>
                  </div>
                  <Icon type="ios-information-circle-outline" />
                </Poptip>
                <Select style="width: 170px" v-model="defaultTimeDynamic.model">
                  <Option value="1">{{ $t('singlePointMonitoringMode') }}</Option>
                  <Option value="2">{{ $t('smoothStatMode') }}</Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('performAction')" class="mr10 fromIcon" prop="action">
                <Select style="width: 170px" v-model="defaultTimeDynamic.action">
                  <Option value="1">{{ $t('opening') }}</Option>
                  <Option value="2">{{ $t('closing') }}</Option>
                  <Option value="3">{{ $t('openAndLock') }}</Option>
                  <Option value="0">{{ $t('nothing') }}</Option>
                </Select>
              </FormItem>
            </Row>
            <Row>
              <FormItem :label="$t('isItAlarm')" class="mr10" style="width: 170px">
                <RadioGroup v-model="defaultTimeDynamic.alarm">
                  <Radio :label="$t('yes')" style="margin-right: 30px"></Radio>
                  <Radio :label="$t('no')"></Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="$t('voice')" class="mr10" v-if="!disabled">
                <Switch v-model="defaultTimeDynamic.switch" />
              </FormItem>
            </Row>
          </Form>
          <div class="enable">
            {{ $t('enabled') }}
            <Switch v-model="defaultTimeDynamic.enable" size="small" />
          </div>
        </div>
        <Form class="formDynamic" :model="formDynamic" ref="formDynamic">
          <FormItem v-for="(item, index) in formDynamic.items" :key="index">
            <Row class="content">
              <Col :span="23">
                <Form label-position="top" :ref="'formDynamic' + index" :model="item" :rules="ruleLineValidate">
                  <Row class="timeStatus">
                    <FormItem :label="$t('timeSpan')" class="mr10" prop="timer">
                      <div
                        :class="{
                          'shake-slow': item.showSpan === true,
                          date: item.showSpan === true,
                        }">
                        <Select style="width: 170px" v-model="item.timer" @on-change="handleMask(item.timer, index)" :transfer="true">
                          <Option v-for="(item, index) in timer" :key="index" :value="item">{{ item }}</Option>
                        </Select>
                      </div>
                      <div v-if="item.showSpan" style="color: #e03c3a">
                        <p>{{ $t('selectedThresholdPeriodConflicts') }}</p>
                      </div>
                    </FormItem>
                  </Row>

                  <Row class="timeStatus">
                    <FormItem :label="$t('floatingCap')" class="mr10" prop="value">
                      <Input :placeholder="$t('pleaseEnter')" style="width: 170px" v-model="item.value">
                        <i slot="suffix" style="font-size: 14px">%</i>
                      </Input>
                    </FormItem>
                    <FormItem :label="$t('alarmTriggeringMechanism')" class="mr10 fromIcon" prop="model">
                      <Poptip word-wrap width="250" trigger="hover" class="ic">
                        <div slot="content">
                          <div style="text-align: left; color: #999; margin-bottom: 10px">{{ $t('theftMonitorTips1') }}</div>
                          <div style="text-align: left; color: #999">{{ $t('theftMonitorTips2') }}</div>
                        </div>
                        <Icon type="ios-information-circle-outline" />
                      </Poptip>
                      <Select style="width: 170px" v-model="item.model">
                        <Option value="1">{{ $t('singlePointMonitoringMode') }}</Option>
                        <Option value="2">{{ $t('smoothStatMode') }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('performAction')" class="mr10 fromIcon" prop="action">
                      <Select style="width: 170px" v-model="item.action">
                        <Option value="1">{{ $t('opening') }}</Option>
                        <Option value="2">{{ $t('closing') }}</Option>
                        <Option value="3">{{ $t('openAndLock') }}</Option>
                        <Option value="0">{{ $t('nothing') }}</Option>
                      </Select>
                    </FormItem>
                  </Row>
                  <Row>
                    <FormItem :label="$t('isItAlarm')" class="mr10" style="width: 170px">
                      <RadioGroup v-model="item.alarm">
                        <Radio :label="$t('yes')" style="margin-right: 30px"></Radio>
                        <Radio :label="$t('no')"></Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem :label="$t('voice')" class="mr10">
                      <Switch v-model="item.switch" />
                    </FormItem>
                  </Row>
                </Form>
              </Col>
              <Col :span="1" class="delContent">
                <Icon class="del" custom="icon-v5 icon-v5-jianshaojianqujianhao" @click="handleRemove(index, item.id)"></Icon>
              </Col>
              <div class="enable">
                {{ $t('enabled') }}
                <Switch v-model="item.enable" size="small" />
              </div>
            </Row>
          </FormItem>

          <FormItem>
            <Row>
              <Button type="dashed" @click="handleAdd(index)" class="addtime mt-20">{{ $t('addTimePeriod') }}</Button>
            </Row>
          </FormItem>
        </Form>
      </Col>
      <Col :span="8" style="display: flex; align-items: center">
        <div style="width: 100%">
          <TimeBars :options="timeData" :porea="porea"></TimeBars>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
  import { snapshottimeconfig, elecStealingtimedel, elecStealingtimelist } from '@/api/public'
  import TimeBars from '../threShold/timerPie.vue'
  export default {
    components: {
      TimeBars,
    },
    props: {
      tpyeState: String,
      confId: [Number, String],
    },
    data() {
      return {
        timer: ['00:00-03:00', '03:00-06:00', '06:00-09:00', '09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-21:00', '21:00-24:00'],
        porea: {
          pmAM: [
            {
              position: 'absolute',
              top: '45%',
              left: '35%',
            },
            {
              position: 'absolute',
              top: '45%',
              left: '60%',
            },
          ],
        },
        timeData: [],
        disabled: false,
        alarms: [],
        index: 1,
        defaultTimeDynamic: {
          value: '',
          action: '',
          model: '',
          alarm: this.$t('yes'),
          switch: false,
          enable: true,
        },
        allVal: [],
        formDynamic: {
          items: [
            {
              action: '',
              timer: '',
              value: '',
              enable: true,
              model: '',
              alarm: this.$t('yes'),
              switch: false,
              id: '',
              showSpan: false,
            },
          ],
        },
        ruleLineValidate: {
          // 子表单验证规则
          timer: [{ required: true, message: this.$t('enterStartTime'), trigger: 'blur' }],
          action: [{ required: true, message: this.$t('pleaseSelectExecuteAction'), trigger: 'blur' }],
          value: [{ required: true, message: this.$t('pleaseEnterFloatLimit'), trigger: 'blur' }],
          model: [{ required: true, message: this.$t('pleaseEnterAlarmTrigger'), trigger: 'blur' }],
        },
        defaultRuleValidate: {
          // 子表单验证规则
          action: [{ required: true, message: this.$t('pleaseSelectExecuteAction'), trigger: 'blur' }],
          value: [{ required: true, message: this.$t('pleaseEnterFloatLimit'), trigger: 'blur' }],
          model: [{ required: true, message: this.$t('pleaseEnterAlarmTrigger'), trigger: 'blur' }],
        },
        Alarmconfig: [],
        vals: [],
      }
    },
    mounted() {
      if (this.tpyeState === 'edit') {
        this.handleElecStealingtimelist()
      }
      this.$emit('formDynamicData', this.formDynamic)
      this.$emit('defaultTimeDynamic', this.defaultTimeDynamic)
    },
    watch: {
      formDynamic: {
        handler(newVal) {
          this.$emit('formDynamicData', newVal)
        },
        deep: true,
      },
      defaultTimeDynamic: {
        handler(newVal) {
          this.$emit('defaultTimeDynamic', newVal)
        },
        deep: true,
      },
    },
    methods: {
      toDecimal(num) {
        return Math.round(num + Number.EPSILON)
      },
      handleElecStealingtimelist() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.confId,
        }
        elecStealingtimelist(params).then(res => {
          this.formDynamic.items = []
          setTimeout(() => {
            res.data.map((val, index) => {
              if (val.timeRangeType === 0) {
                this.defaultTimeDynamic = {
                  value: val.upLimit !== '' ? (val.upLimit * 100).toFixed(1) : '',
                  model: `${val.triggerType}`,
                  action: `${val.actionType}`,
                  alarm: val.alarmable ? this.$t('yes') : this.$t('no'),
                  switch: val.soundable,
                  enable: val.status === 1,
                }
              } else {
                this.formDynamic.items.push({
                  timer: val.timeRangeTypeName,
                  value: val.upLimit !== '' ? (val.upLimit * 100).toFixed(1) : '',
                  model: `${val.triggerType}`,
                  action: `${val.actionType}`,
                  alarm: val.alarmable ? this.$t('yes') : this.$t('no'),
                  switch: val.soundable,
                  enable: val.status === 1,
                  id: '',
                  showSpan: false,
                })
              }
              this.canvansShow(index)
            })
          }, 1000)
        })
      },
      handlesnapshottimeconfig() {
        let params = {
          projectCode: this.$store.state.projectCode,
          confId: this.confId,
          timeConfigStr: [],
        }

        this.formDynamic.items.forEach(item => {
          this.timer.map((val, index) => {
            if (item.timer === val) {
              item.timer = index + 1
            }
          })
        })

        let timeConfigStr = [this.defaultTimeDynamic, ...this.formDynamic.items]
        let timeConfigStrNew = []
        timeConfigStr.map(val => {
          timeConfigStrNew.push({
            timeRangeType: val.timer === undefined ? 0 : val.timer,
            status: val.enable ? 1 : 0,
            upLimit: val.value !== '' ? val.value / 100 : '',
            triggerType: val.model,
            actionType: val.action,
            alarmable: val.alarm === this.$t('yes'),
            soundable: val.switch,
          })
        })
        params.timeConfigStr = JSON.stringify(timeConfigStrNew)

        snapshottimeconfig(params).then(res => {})
      },
      handleRemove(index, id) {
        if (this.tpyeState === 'edit') {
          let params = {
            projectCode: this.$store.state.projectCode,
            confId: this.confId,
            ruleId: id,
          }
          elecStealingtimedel(params).then(res => {
            this.formDynamic.items.splice(index, 1)
            this.canvansShow(index)
          })
        } else {
          this.formDynamic.items[index].status = 0
          this.formDynamic.items.splice(index, 1)

          this.canvansShow(index)
        }
      },
      handleAdd() {
        this.index++
        this.formDynamic.items.push({
          timer: '',
          value: '',
          enable: false,
          model: '',
          alarm: this.$t('yes'),
          switch: false,
          id: '',
          showSpan: false,
        })
      },
      transformTimerToNum(timer) {
        return timer.substr(0, 2) * 3600 + timer.substr(3) * 60
      },
      checkAllInRange(vals, valsResult) {
        let result = true
        if (this.isIntersect(vals, valsResult)) {
          result = false
        }
        return result
      },
      isIntersect(arr1, arr2) {
        let start = [Math.min(...arr1), Math.min(...arr2)] // 区间的两个最小值
        let end = [Math.max(...arr1), Math.max(...arr2)] // 区间的两个最大值
        return Math.max(...start) <= Math.min(...end) // 最大值里的最小值 $t('btns.true')$t('btns.false') 小于等于 最大值的最小值
      },
      handleMask(time, index) {
        this.timeCheckFunction(time.split('-'), index)
      },
      timeCheckFunction(val, currIndex) {
        this.vals = []
        this.vals.push(this.formDynamic.items.map(val => val.timer.split('-')))

        if (this.formDynamic.items.length >= 2) {
          let newVals = []
          this.formDynamic.items.map(val => {
            newVals.push(val.timer)

            if (newVals.indexOf(val.timer) === 0) {
              this.formDynamic.items[currIndex].showSpan = true
            } else {
              this.formDynamic.items[currIndex].showSpan = false
            }
          })
        }

        this.canvansShow(currIndex)
      },
      canvansShow(currIndex) {
        let timedatas = []
        this.allVal = []

        this.formDynamic.items.map(val => {
          this.allVal.push(val.timer.split('-'))
        })

        for (let i = 0; i < 1440; i++) {
          timedatas[i] = 0
        }

        let canvasList = []

        for (let i = 0; i < this.allVal.length; i++) {
          canvasList.push(...this.newMintesFunction(this.allVal[i]))
        }

        timedatas.forEach((item, index) => {
          canvasList &&
            canvasList.map(itm => {
              if (index === itm) {
                timedatas[itm] = 4
              }
            })
        })
        timedatas.map((val, index) => {
          if (val === 0) {
            timedatas[index] = 2
          }
        })
        timedatas.map((val, index) => {
          if (val === 0) {
            timedatas[index] = 2
          }
        })

        this.timeData = timedatas
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
    },
  }
</script>
<style lang="less">
  .tensePeriods {
    .fromIcon {
      position: relative;
      .ic {
        position: absolute;
        top: -34px;
        right: 54px;
        color: #1398e5;
      }
      .ic2 {
        position: absolute;
        top: -36px;
        right: 54px;
        color: #1398e5;
      }
      .ic3 {
        position: absolute;
        top: -34px;
        right: 34px;
        color: #1398e5;
      }
      .ic4 {
        position: absolute;
        top: -36px;
        right: 24px;
        color: #1398e5;
      }
    }
    .addtime {
      width: 100%;
      background: rgba(2, 167, 240, 0.1);
      color: #02a7f0;
      border-color: #02a7f0;
    }
    .delContent {
      display: flex;
      align-items: center;
    }
    .del {
      font-size: 30px;
      color: #e03c3a;
    }
    .timeStatus {
      align-items: center;
      font-size: 12px;
      .statusTime {
        color: #fff;
        .input {
          width: 80px;
          margin: 0 10px;
        }
        .input1 {
          width: 100px;
          margin-right: 10px;
        }
      }
    }
    .mr10 {
      margin-right: 10px;
    }
    .tip {
      background: #393e4a;
      padding: 5px;
      border-radius: 5px;
      margin-top: 10px;
      span {
        font-size: 12px;
      }
    }
    .defaultTime {
      border: 1px solid #717172;
      padding: 20px;
      border-radius: 5px;
      font-size: 16px;
      position: relative;
      .defaultTime_header {
        color: #0882bc;
        margin-bottom: 20px;
      }
      .enable {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
      }
    }
    .formDynamic {
      margin-top: 20px;
      position: relative;

      .content {
        padding: 20px;
        border: 1px solid #717172;
        border-radius: 5px;
        margin-bottom: 10px;
      }
      .ivu-form-item {
        margin-bottom: 24px !important;
      }
      .enable {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 14px;
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

    .date {
      border: 1px solid red;
      width: 172px;
    }
    .shake-slow {
      animation: shake-slow 0.5s ease-in-out 0s 1 alternate forwards;
    }
  }
</style>
