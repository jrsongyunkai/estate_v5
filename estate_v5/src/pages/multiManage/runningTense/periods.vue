<template>
  <div class="tensePeriods">
    <h3>{{ $t('configureTimePeriods') }}</h3>
    <div class="tip">
      <i class="icon-v5 icon-v5-huifu"></i>
      <span>{{ $t('configTips1') }}</span>
    </div>
    <Row style="margin-top: 20px">
      <Col :span="16">
        <div class="defaultTime">
          <div class="defaultTime_header">{{ $t('defaultTimePeriod') }}</div>
          <Form label-position="top" :model="defaultTimeDynamic" ref="defaultTime">
            <Row class="timeStatus">
              <FormItem :label="$t('ShouldInState')" class="mr10">
                <Select class="w170" v-model="defaultTimeDynamic.state" v-if="configType === 3">
                  <Option value="1" v-if="!disabled">{{ $t('normalRunning') }}</Option>
                  <Option value="2">{{ $t('powerFailure') }}</Option>
                </Select>
                <Select class="w170" v-model="defaultTimeDynamic.state" v-else>
                  <Option v-for="(item, index) in configTypeList" :key="index" :value="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>

              <FormItem :label="$t('alarmTriggeringMechanism')" class="mr10 fromIcon">
                <Poptip trigger="hover" :content="$t('findStausAlarm')" class="ic">
                  <Icon type="ios-information-circle-outline" />
                </Poptip>
                <Select style="width: 170px" v-model="defaultTimeDynamic.model">
                  <Option value="1" :disabled="disabled">
                    <div @click="modelSecect(disabled)" style="width: 100%" v-if="disabled">{{ $t('singlePointMonitoringMode') }}</div>
                    <template v-else>{{ $t('singlePointMonitoringMode') }}</template>
                  </Option>
                  <Option value="2">{{ $t('continuousMonitoringMode') }}</Option>
                </Select>
              </FormItem>
              <template>
                <FormItem :label="$t('alarmMonitoringCycle')" class="statusTime fromIcon" v-if="defaultTimeDynamic.model === '1'">
                  <Poptip trigger="hover" :content="$t('monitoringTips1')" class="ic3">
                    <Icon type="ios-information-circle-outline" />
                  </Poptip>
                  <Input class="input1" :placeholder="$t('pleaseEnter')" v-model="defaultTimeDynamic.monitorCycle" />
                  <span>{{ $t('minute') }}</span>
                </FormItem>
                <FormItem class="statusTime" style="margin-bottom: 0px !important" v-if="defaultTimeDynamic.model === '2'">
                  <span>{{ $t('stateTips1') }}</span>
                  <Input class="input" :placeholder="$t('pleaseEnter')" v-model="defaultTimeDynamic.monitorCycle" />
                  <span>{{ $t('minuteAlarm') }}</span>
                </FormItem>
              </template>
            </Row>
            <Row>
              <FormItem :label="$t('action')" class="mr10 dis-position" v-if="[1, 2].includes(configType)">
                <TooltipVue class="disblock">
                  <div>{{ actionText }}</div>
                </TooltipVue>
                <Select class="w170" v-model="defaultTimeDynamic.action">
                  <Option v-for="(item, index) in actionTypeArr" :key="index" :value="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('isItAlarm')" class="mr10">
                <Select style="width: 170px" v-model="defaultTimeDynamic.alarm" @on-change="handledefaultalarm">
                  <!-- <Option value="0" :disabled="disabled">
                                        <div @click="modelSecect(disabled)" style="width:100%" v-if="disabled">
                                            $t('no')
                                        </div>
                                        <template v-else>
                                            $t('no')
                                        </template>
                                    </Option> -->
                  <Option value="1">{{ $t('yes') }}</Option>
                  <Option value="0" v-if="configType !== 3">{{ $t('no') }}</Option>
                </Select>
              </FormItem>
              <template v-if="defaultTimeDynamic.alarm === '1'">
                <FormItem :label="$t('alarmType')" class="mr10">
                  <template v-if="disabled">
                    <Cascader v-model="defaultTimeDynamic.alarmType" clearable :data="alarms" :show-all-levels="false" style="width: 200px"></Cascader>
                  </template>
                  <template v-else>
                    <Cascader v-model="defaultTimeDynamic.alarmType" clearable :data="alarms" :show-all-levels="false" style="width: 200px"></Cascader>
                  </template>
                </FormItem>
                <FormItem :label="$t('voice')" class="mr10" v-if="!disabled">
                  <Switch v-model="defaultTimeDynamic.switch" />
                </FormItem>
              </template>
            </Row>
          </Form>
        </div>
        <Form class="formDynamic" :model="formDynamic" ref="formDynamic">
          <FormItem v-for="(item, index) in formDynamic.items" :key="index">
            <Row class="content" v-if="item.status">
              <Col :span="23">
                <Form label-position="top" :ref="'formDynamic' + index" :model="item" :rules="ruleLineValidate">
                  <Row class="timeStatus">
                    <FormItem :label="$t('timeSpan')" class="mr10" prop="timer">
                      <div :class="{ 'shake-slow': item.showSpan === true }">
                        <TimePicker
                          :class="item.showSpan === true ? 'date' : ''"
                          transfer
                          format="HH:mm"
                          :editable="false"
                          v-model="item.timer"
                          type="timerange"
                          confirm
                          placement="bottom-end"
                          :placeholder="$t('pleaseSelectTimePeriod')"
                          @on-open-change="handleMask(item.timer, index, $event)"></TimePicker>
                        <div v-if="item.showSpan" style="color: #e03c3a">
                          <p>{{ $t('selectedThresholdPeriodConflictss') }}</p>
                        </div>
                      </div>
                    </FormItem>
                  </Row>

                  <Row class="timeStatus">
                    <FormItem :label="$t('ShouldInState')" class="mr10" prop="state">
                      <Select style="width: 170px" v-model="item.state" v-if="configType === 3">
                        <Option value="1" v-if="!disabled">{{ $t('normalRunning') }}</Option>
                        <Option value="2">{{ $t('powerFailure') }}</Option>
                      </Select>
                      <Select class="w170" v-model="item.state" v-else>
                        <Option v-for="(item, index) in configTypeList" :key="index" :value="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('alarmTriggeringMechanism')" class="mr10 fromIcon" prop="model">
                      <Poptip trigger="hover" content="$t('findStausAlarm')" class="ic2">
                        <Icon type="ios-information-circle-outline" />
                      </Poptip>
                      <Select style="width: 170px" v-model="item.model">
                        <Option value="1" :disabled="disabled">
                          <div @click="modelSecect(disabled)" style="width: 100%" v-if="disabled">{{ $t('singlePointMonitoringMode') }}</div>
                          <template v-else>{{ $t('singlePointMonitoringMode') }}</template>
                        </Option>
                        <Option value="2">{{ $t('continuousMonitoringMode') }}</Option>
                      </Select>
                    </FormItem>
                    <template>
                      <FormItem :label="$t('alarmMonitoringCycle')" class="statusTime fromIcon" v-if="item.model === '1'" prop="monitorCycle">
                        <Poptip trigger="hover" :content="$t('monitoringTips1')" class="ic4">
                          <Icon type="ios-information-circle-outline" />
                        </Poptip>
                        <Input class="input1" :placeholder="$t('pleaseEnter')" v-model="item.monitorCycle" />
                        <span>{{ $t('minute') }}</span>
                      </FormItem>
                      <FormItem class="statusTime" style="margin-bottom: 0px !important" prop="monitorCycle" v-if="item.model === '2'">
                        <span>{{ $t('stateTips1') }}</span>
                        <Input class="input" :placeholder="$t('pleaseEnter')" v-model="item.monitorCycle" />
                        <span>{{ $t('minuteAlarm') }}</span>
                      </FormItem>
                    </template>
                  </Row>
                  <Row>
                    <FormItem :label="$t('action')" class="mr10 dis-position" v-if="[1, 2].includes(configType)" prop="action">
                      <TooltipVue class="disblocks">
                        <div>{{ actionText }}</div>
                      </TooltipVue>
                      <Select class="w170" v-model="item.action">
                        <Option v-for="(item, index) in actionTypeArr" :key="index" :value="item.value">{{ item.label }}</Option>
                      </Select>
                    </FormItem>
                    <FormItem :label="$t('isItAlarm')" class="mr10" prop="alarm">
                      <Select style="width: 170px" v-model="item.alarm">
                        <!-- <Option value="0" :disabled="disabled">
                                                    <div @click="modelSecect(disabled)" style="width:100%" v-if="disabled">
                                                        $t('no')
                                                    </div>
                                                    <template v-else>
                                                        $t('no')
                                                    </template>
                                               </Option> -->
                        <Option value="1">{{ $t('yes') }}</Option>
                        <Option value="0" v-if="configType !== 3">{{ $t('no') }}</Option>
                      </Select>
                    </FormItem>
                    <template v-if="item.alarm === '1'">
                      <FormItem :label="$t('alarmType')" class="mr10" prop="alarmType">
                        <template v-if="disabled">
                          <Cascader v-model="item.alarmType" clearable :data="alarms" :show-all-levels="false" style="width: 200px"></Cascader>
                        </template>

                        <template v-else>
                          <Cascader v-model="item.alarmType" clearable :data="alarms" :show-all-levels="false" style="width: 200px"></Cascader>
                        </template>
                      </FormItem>
                      <FormItem :label="$t('voice')" class="mr10" v-if="!disabled">
                        <Switch v-model="item.switch" />
                      </FormItem>
                    </template>
                  </Row>
                </Form>
              </Col>
              <Col :span="1" class="delContent">
                <Icon class="del" custom="icon-v5 icon-v5-jianshaojianqujianhao" @click="handleRemove(index, item.id)"></Icon>
              </Col>
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
  import { queryAlarmForConfig, tenseTimedel } from '@/api/public'
  import { queryBoxAbnormalConfig } from '@api/multiManage/runningTense'
  import TimeBars from '../threShold/timerPie.vue'
  export default {
    components: {
      TimeBars,
    },
    props: {
      rowItem: Object,
      formValidateType: Number,
      delRow: {
        type: String,
        default: '',
      },
      configType: {
        type: [Number, String],
        default: 0,
      },
    },
    data() {
      return {
        actionText: this.$t('portTips1'),
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
          monitorCycle: '',
          state: '',
          model: '',
          action: '',
          alarm: '',
          switch: false,
          alarmType: [],
        },
        allVal: [],
        formDynamic: {
          items: [
            {
              timer: '',
              monitorCycle: '',
              state: '',
              model: '',
              alarm: '',
              action: '',
              switch: false,
              alarmType: [],
              status: 1,
              id: '',
              showSpan: false,
            },
          ],
        },
        ruleLineValidate: {
          // 子表单验证规则
          timer: [{ required: true, type: 'array', message: this.$t('enterStartTime'), trigger: 'blur' }],
          monitorCycle: [{ required: true, message: this.$t('pleaseInputDuration'), trigger: 'blur' }],
          state: [{ required: true, message: this.$t('pleaseSelectState'), trigger: 'blur' }],
          model: [{ required: true, message: this.$t('selectTriggeringMechanism'), trigger: 'blur' }],
          alarm: [{ required: true, message: this.$t('selectIsAlarm'), trigger: 'blur' }],
          alarmType: [{ type: 'array', message: this.$t('pleaseSelectAlarmType'), trigger: 'blur' }],
          action: [{ required: true, message: this.$t('pleaseSelectAction'), trigger: 'blur' }],
        },
        Alarmconfig: [],
        vals: [],
      }
    },
    computed: {
      configTypeList() {
        const configTypeList =
          this.configType === 2
            ? [
                { label: 'ON', value: '6' },
                { label: 'OFF', value: '7' },
              ]
            : this.configType === 1
            ? [
                { label: this.$t('opening'), value: '3' },
                { label: this.$t('closing'), value: '4' },
                { label: this.$t('openAndLock'), value: '5' },
              ]
            : []
        return configTypeList
      },
      actionTypeArr() {
        const actionTypeArr =
          this.configType === 2
            ? [
                { label: 'ON', value: '4' },
                { label: 'OFF', value: '5' },
                { label: this.$t('inching'), value: '7' },
                { label: this.$t('nothing'), value: '0' },
              ]
            : this.configType === 1
            ? [
                { label: this.$t('opening'), value: '1' },
                { label: this.$t('closing'), value: '2' },
                { label: this.$t('openAndLock'), value: '3' },
                { label: this.$t('nothing'), value: '0' },
              ]
            : []
        return actionTypeArr
      },
    },
    mounted() {
      this.$emit('formDynamicData', this.formDynamic)
      this.$emit('defaultTimeDynamic', this.defaultTimeDynamic)
      if (!this.rowItem.isAdd) {
        this.handletenseTimelist()
      }
      if (this.formValidateType === 1) {
        this.disabled = true
      }
      this.handlequeryAlarmForConfig()
    },
    watch: {
      formValidateType: {
        handler(newVal) {
          this.handlequeryAlarmForConfig()
          if (newVal === 1) {
            this.disabled = true
          } else {
            this.disabled = false
          }
          this.defaultTimeDynamic = {
            monitorCycle: '',
            state: '',
            model: '',
            action: '',
            alarm: '',
            switch: false,
            alarmType: [],
          }
          if (this.rowItem.isAdd) {
            this.formDynamic = {
              items: [
                {
                  timer: '',
                  monitorCycle: '',
                  state: '',
                  model: '',
                  alarm: '',
                  action: '',
                  switch: false,
                  alarmType: [],
                  status: 1,
                  id: '',
                  showSpan: false,
                },
              ],
            }
          }
        },
      },
      delRow: {
        handler(newVal) {
          if (newVal === '1') {
            this.defaultTimeDynamic = {
              monitorCycle: '',
              state: '',
              model: '',
              action: '',
              alarm: '',
              switch: false,
              alarmType: [],
            }
            this.formDynamic = {
              items: [
                {
                  timer: '',
                  monitorCycle: '',
                  state: '',
                  model: '',
                  action: '',
                  alarm: '',
                  switch: false,
                  alarmType: [],
                  status: 1,
                  id: '',
                  showSpan: false,
                },
              ],
            }
          }
        },
        deep: true,
      },
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
      handleMask(time, index, event) {
        if (!event) {
          this.timeCheckFunction(time, index)
        }
      },
      modelSecect(item) {
        if (item) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('deveiceTips2'),
          })
        }
      },
      handledefaultalarm(val) {
        if (val === '1') {
          this.defaultTimeDynamic.alarmType = ['alarms', '1019']
        }
      },
      typeFiltering(val) {
        let str = ''
        this.Alarmconfig.forEach(vl => {
          if (vl.typeNumber === String(val)) {
            str = vl.parent
          }
        })
        return str
      },
      handletenseTimelist() {
        let params = {
          configId: this.rowItem.configId,
          projectCode: this.$store.state.projectCode,
        }
        queryBoxAbnormalConfig(params).then(res => {
          this.formDynamic.items = []
          if (res.success) {
            res.data.timeInfoList.forEach((val, index) => {
              setTimeout(() => {
                if (val.startTime === '' && val.endTime === '') {
                  this.defaultTimeDynamic = {
                    monitorCycle: String(val.monitorCycle),
                    state: String(val.mustStatus),
                    model: String(val.monitorModel),
                    alarm: String(val.isAlarm),
                    action: `${val.actionType}`,
                    switch: val.isPlayAudio === 1,
                    alarmType: [val.alarmTypeNo === 1015 ? 'custom' : this.typeFiltering(val.alarmTypeNo), val.alarmTypeNo === 1015 ? val.alarmCustomId : String(val.alarmTypeNo)],
                  }
                }
                if (val.startTime !== '' && val.endTime !== '') {
                  this.formDynamic.items.push({
                    timer: [val.startTime, val.endTime],
                    monitorCycle: String(val.monitorCycle),
                    state: String(val.mustStatus),
                    model: String(val.monitorModel),
                    alarm: String(val.isAlarm),
                    action: `${val.actionType}`,
                    switch: val.isPlayAudio === 1,
                    alarmType: [val.alarmTypeNo === 1015 ? 'custom' : this.typeFiltering(val.alarmTypeNo), val.alarmTypeNo === 1015 ? val.alarmCustomId : String(val.alarmTypeNo)],
                    status: 1,
                    id: val.id,
                    showSpan: false,
                  })
                }
                this.canvansShow(index)
              }, 400)
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handlequeryAlarmForConfig() {
        let params = {
          projectCodes: this.$store.state.projectCode,
        }
        queryAlarmForConfig(params).then(res => {
          if (res.success) {
            if (this.disabled) {
              this.alarms = [
                {
                  value: 'alarms',
                  label: this.$t('alarm'),
                  children: [],
                },
              ]
              this.Alarmconfig.push({
                info: this.$t('runningStateAbnormal'),
                parent: 'alarms',
                typeNumber: '1019',
              })
              this.alarms[0].children.push({
                value: '1019',
                label: this.$t('runningTimeAbnormal'),
                parent: 'alarms',
              })
            } else {
              this.alarms = [
                {
                  value: 'alarms',
                  label: this.$t('alarm'),
                  children: [],
                },
                {
                  value: 'warns',
                  label: this.$t('earlyWarning'),
                  children: [],
                },
                // 自定义报警
                {
                  value: 'custom',
                  label: this.$t('customAlarm'),
                  children: [],
                },
              ]
              res.data.alarms.forEach(val => {
                val.parent = 'alarms'
                this.Alarmconfig.push(val)
                this.alarms[0].children.push({
                  value: val.typeNumber,
                  label: val.info,
                  parent: val.parent,
                })
              })
              res.data.warns.map(val => {
                val.parent = 'warns'
                this.Alarmconfig.push(val)
                this.alarms[1].children.push({
                  value: val.typeNumber,
                  label: val.info,
                  parent: val.parent,
                })
              })
              res.data.customs.length &&
                res.data.customs[0].alarms.map(val => {
                  val.parent = 'custom'
                  this.Alarmconfig.push(val)
                  this.alarms[2].children.push({
                    value: val.id,
                    label: val.name,
                    parent: val.parent,
                  })
                })
            }
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleAdd() {
        this.index++
        this.formDynamic.items.push({
          timer: '',
          monitorCycle: '',
          state: '',
          model: '',
          alarm: '',
          action: '',
          status: 1,
          switch: false,
          alarmType: [],
          showSpan: false,
        })
      },
      handleRemove(index, id) {
        if (!this.rowItem.isAdd) {
          let params = {
            configId: this.rowItem.configId,
            id: id,
          }
          tenseTimedel(params).then(res => {
            this.formDynamic.items.splice(index, 1)
            this.canvansShow(index)
          })
        } else {
          this.formDynamic.items[index].status = 0
          this.formDynamic.items.splice(index, 1)

          this.canvansShow(index)
        }
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
      timeCheckFunction(val, currIndex) {
        this.vals = []
        this.vals.push(this.formDynamic.items.map(val => val.timer))

        if (this.formDynamic.items.length >= 2) {
          let newVals

          newVals = this.vals[0][this.vals.length - 1].map(item => this.transformTimerToNum(item))

          const valsResult = val.map(item => this.transformTimerToNum(item))

          const result = this.checkAllInRange(newVals, valsResult)

          if (!result) {
            this.formDynamic.items[currIndex].showSpan = true
          } else {
            this.formDynamic.items[currIndex].showSpan = false
          }
        }

        this.canvansShow(currIndex)
      },
      canvansShow(currIndex) {
        let timedatas = []
        this.allVal = []

        this.formDynamic.items.map(val => {
          this.allVal.push(val.timer)
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
    .dis-position {
      position: relative;
      .disblock {
        display: inline-block;
        position: absolute;
        top: -33px;
        left: 20px;
      }
      .disblocks {
        display: inline-block;
        position: absolute;
        top: -33px;
        left: 30px;
      }
    }
    .w170 {
      width: 170px;
    }
    .fromIcon {
      position: relative;
      .ic {
        position: absolute;
        top: -34px;
        right: 68px;
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
    }
    .defaultTime {
      border: 1px solid #717172;
      padding: 20px;
      border-radius: 5px;
      font-size: 16px;
      .defaultTime_header {
        color: #0882bc;
        margin-bottom: 20px;
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
    .date {
      border: 1px solid red;
    }
  }
</style>
