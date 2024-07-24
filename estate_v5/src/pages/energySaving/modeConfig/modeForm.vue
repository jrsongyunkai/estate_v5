<template>
  <div class="form-mode-box">
    <Form ref="searchForm" :model="formData" label-position="right" :label-width="140" :rules="formRules">
      <FormItem :label="$t('schemaName')" prop="name">
        <Input v-model="formData.name" style="max-width: 320px" />
      </FormItem>
      <FormItem :label="$t('patternDescription')" prop="remark">
        <Input v-model="formData.remark" type="textarea" :rows="4" style="max-width: 320px" />
      </FormItem>
      <FormItem :label="$t('effectiveTimePeriod')" prop="timeRangeList">
        <div style="width: 300px">
          <div style="margin-bottom: 10px; display: flex" v-for="(item, index) in formData.timeRangeList" :key="index">
            <TimePicker :value="item" confirm type="timerange" @on-change="v => changeEffect(v, index)" format="HH:mm" :placeholder="$t('pleaseSelectTime')" />
            <Button class="ml-10 del-btn" type="error" @click.stop="delValidPeriod(index)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
          </div>
          <Button @click.stop="addValidPeriod" long>{{ $t('addEffectiveTimePeriod') }}</Button>
        </div>
      </FormItem>
      <FormItem class="mt-10" :label="$t('patternRules')" prop="modeRuleList">
        <div class="rule-group">
          <div class="rule-item" v-for="(rule, index) in formData.modeRuleList" :key="index">
            <div class="top-item">
              <Select v-model="rule.ruleType" style="width: 200px">
                <Option v-for="op in modeOptions" :key="op.value" :value="op.value">{{ op.label }}</Option>
              </Select>
              <div class="ml-10" v-if="rule.ruleType === 1">
                <span class="mr-10">{{ $t('cyclicForm') }}:</span>
                <Select class="ml-10" v-model="rule.cyclicType" style="width: 200px">
                  <Option v-for="(op, i) in cycleTypeOptions" :value="op.value" :key="i">{{ op.label }}</Option>
                </Select>
              </div>
            </div>
            <div class="content-item">
              <div class="left">{{ rule.ruleType === 0 ? `${$t('executionGroup')}:` : `${$t('deactivateRule')}:` }}</div>
              <div class="right">
                <template v-if="rule.ruleType === 0">
                  <div class="stop-rule-content">
                    <div class="rule-box-content">
                      <div class="rule-box-left" v-if="rule.groupRules.length > 1">
                        <Select style="width: 60px" v-model="rule.isAnd">
                          <Option :value="0">{{ $t('Or') }}</Option>
                          <Option :value="1">{{ $t('And') }}</Option>
                        </Select>
                      </div>
                      <div class="stop-rule-group">
                        <div class="stop-rule-item" v-for="(v, p) in rule.groupRules" :key="p">
                          <i18n style="display: flex" v-if="v.name === ruleTypeOptions[0].value" path="monitoringDurationMeetsConditionsValue">
                            <Select place="typeName" style="width: 150px; margin: 0 5px" class="ml-5" v-model="v.name">
                              <Option v-for="op in ruleTypeOptions" :key="op.value" :value="op.value">{{ op.label }}</Option>
                            </Select>
                            <Select place="inputNum" style="width: 150px; margin-left: 5px" class="ml-5" v-model="v.duration">
                              <Option v-for="op in timeOptions" :value="op.value" :key="op.value">{{ op.label }}</Option>
                            </Select>
                          </i18n>
                          <i18n style="display: flex" v-if="v.name === ruleTypeOptions[1].value" path="hourlyElectricityConsumptionRuleValue">
                            <Select place="typeName" style="width: 150px; margin: 0 5px" class="ml-5" v-model="v.name">
                              <Option v-for="op in ruleTypeOptions" :key="op.value" :value="op.value">{{ op.label }}</Option>
                            </Select>
                            <div place="inputNum" class="input-elect" style="margin-left: 5px">
                              <InputNumber class="none-handler-wrap" v-model="v.lowerBound" />
                              <span class="unit-text">kW·h</span>
                            </div>
                          </i18n>
                          <Button class="ml-10 del-btn" type="error" @click.stop="delCondition(rule.groupRules, p)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
                        </div>
                        <div style="width: 120px">
                          <Button @click.stop="addCondition(index)" long>{{ $t('addCondition') }}</Button>
                        </div>
                      </div>
                    </div>
                    <div class="rule-box-device">
                      <div class="left">{{ $t('executionDevice') }}:</div>
                      <div class="device-list">
                        <div class="device-item" v-for="(device, i) in rule.deviceList" :key="i">
                          <select-addr-model v-model="rule.deviceList[i]" />
                          <Button class="ml-10 del-btn" type="error" @click.stop="delDevice(rule.deviceList, i)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
                        </div>
                        <div class="add-device" style="width: 150px">
                          <Button @click.stop="addDevice(rule.deviceList)" long>{{ $t('addExecutionDevice') }}</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="rule.ruleType === 1">
                  <div class="item-group" v-for="(action, i) in rule.cyclicRuleList" :key="i">
                    <div class="time-box">
                      <div>
                        <span>{{ $t('shutdownPeriod') }}:</span>
                      </div>
                      <div class="time-item-group">
                        <template v-if="rule.cyclicType === cycleTypeOptions[0].value">
                          <div class="mb-10" v-for="(it, p) in action.period" :key="p">
                            <TimePicker :value="it" @on-change="v => changePeriodEffect(v, action.period, p)" confirm type="timerange" format="HH:mm" :placeholder="$t('pleaseSelectTime')" />
                            <Button class="ml-10 del-btn" type="error" @click.stop="delPeriodEffect(action.period, p)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
                          </div>
                          <Button style="width: 120px" @click.stop="addActionPeriod(action.period)" long>{{ $t('addExecutionPeriod') }}</Button>
                        </template>
                        <Select v-if="rule.cyclicType === cycleTypeOptions[1].value" v-model="action.weekList" multiple :max-tag-count="3" :placeholder="$t('pleaseSelectTime')" style="width: 320px">
                          <Option v-for="op in weekOptions" :key="op.value" :value="op.value">{{ op.label }}</Option>
                        </Select>
                        <Select v-if="rule.cyclicType === cycleTypeOptions[2].value" v-model="action.dayList" multiple :max-tag-count="3" :placeholder="$t('pleaseSelectTime')" style="width: 320px">
                          <Option v-for="op in daysOptions" :key="op.value" :value="op.value">{{ op.label }}</Option>
                        </Select>
                      </div>
                    </div>
                    <div class="device-box">
                      <div>
                        <span>{{ $t('executionDevice') }}:</span>
                      </div>
                      <div class="device-list">
                        <div class="device-item" v-for="(device, i) in action.deviceList" :key="i">
                          <select-addr-model v-model="action.deviceList[i]" />
                          <Button class="ml-10 del-btn" type="error" @click.stop="delDevice(action.deviceList, i)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
                        </div>
                        <div class="add-device">
                          <Button @click.stop="addDevice(action.deviceList)" long>{{ $t('addExecutionDevice') }}</Button>
                        </div>
                      </div>
                    </div>
                    <Button class="del-action" type="error" @click.stop="delActionItem(rule.cyclicRuleList, i)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
                  </div>
                  <div class="add-action">
                    <Button @click.stop="addAction(rule.cyclicRuleList)" long>{{ $t('addExecutionGroup') }}</Button>
                  </div>
                </template>
              </div>
            </div>
            <Button class="del-item-btn" type="error" @click.stop="delRuleItem(index)" ghost><i class="icon-v5 icon-v5-lajitong"></i></Button>
          </div>
          <div style="width: 200px">
            <Button @click.stop="addRuleItem" long>{{ $t('addMode') }}</Button>
          </div>
        </div>
      </FormItem>
      <div class="footer">
        <Button class="b-blue ml-10" @click.stop="handlerSubmit">{{ $t('save') }}</Button>
        <Button class="b-info ml-10" @click.stop="cancel">{{ $t('cancel') }}</Button>
      </div>
    </Form>
  </div>
</template>

<script>
  import { modeMatchRuleAdd, updateModeMatch, queryModeMatch } from '@/api/energySaving/index'
  import { hasOverlapIntervals } from './tool'
  import uuid from 'uuid/v1'
  import { WEEKS } from '@/untils/configuration'
  export default {
    props: {
      action: { type: String, default: 'add' },
      editId: { type: String | Number, default: '' },
    },
    components: {
      selectAddrModel: () => import('./selectAddrModel/index.vue'),
    },
    data() {
      return {
        modeOptions: [
          { label: this.$t('rotationExecution'), value: 1 },
          { label: this.$t('automaticDeactivation'), value: 0 },
        ],
        timeOptions: [
          { label: this.$t('hoursValue', { num: 1 }), value: 3600 },
          { label: this.$t('hoursValue', { num: 2 }), value: 7200 },
          { label: this.$t('hoursValue', { num: 5 }), value: 18000 },
          { label: this.$t('hoursValue', { num: 10 }), value: 36000 },
        ],
        daysOptions: (() => [...new Array(31)].map((it, index) => ({ label: `${(index + 1).toString().padStart(2, '0')}`, value: `${index + 1}` })))(),
        weekOptions: WEEKS.map((it, index) => ({ value: `${index + 1}`, label: it })),
        cycleTypeOptions: [
          { label: this.$t('everyDay'), value: 0 },
          { label: this.$t('weekly'), value: 1 },
          { label: this.$t('monthly'), value: 2 },
        ],
        ruleTypeOptions: [
          { label: this.$t('monitoringDurationThatMeetsTheConditions'), value: 'standbyTime' },
          { label: this.$t('hourlyElectricityConsumption'), value: 'hourlyElectricity' },
        ],
        formData: { name: '', remark: '', status: 0, timeRangeList: [], modeRuleList: [] },
        rules: {
          name: [{ required: true, message: this.$t('pleaseEnterModeName'), trigger: 'blur' }],
          timeRangeList: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, cb) => {
                if (!value.length || value.some(it => !it[0] || !it[1])) return cb(new Error(this.$t('pleaseEnterEffectiveTimePeriod')))
                if (hasOverlapIntervals(value)) return cb(new Error(this.$t('effectiveTimePeriodCannotOverlap')))
                cb()
              },
            },
          ],
          modeRuleList: [
            {
              required: true,
              trigger: 'blur',
              validator: (rule, value, cb) => {
                if (!value.length) return cb(new Error(this.$t('pleaseAddPatternRules')))
                let everyRight = value.every(it => {
                  if (it.ruleType === 1) {
                    // 轮换执行检查
                    return it.cyclicRuleList.length && it.cyclicRuleList.every(item => item.deviceList.length) && !it.cyclicRuleList.some(item => item.deviceList.every(dev => !dev.mac || !dev.addrs.length))
                  } else if (it.ruleType === 0) {
                    // 自动停用检查
                    if (!it.groupRules.length) return false
                    return !it.deviceList.some(dev => !dev.mac || !dev.addrs.length) && it.deviceList.length
                  } else {
                    return false
                  }
                })
                if (!everyRight) return cb(new Error(this.$t('configurationErrorTip')))
                cb()
              },
            },
          ],
        },
        tempFormRules: {
          name: [{ required: true, message: this.$t('pleaseEnterModeName'), trigger: 'change' }],
          timeRangeList: [{ required: true, message: this.$t('pleaseEnterEffectiveTimePeriod'), trigger: 'change', validator: (rule, value, cb) => cb() }],
          modeRuleList: [{ required: true, message: this.$t('pleaseAddPatternRules'), trigger: 'change', validator: (rule, value, cb) => cb() }],
        },
        formRules: {
          name: [{ required: true, message: this.$t('pleaseEnterModeName'), trigger: 'change' }],
          timeRangeList: [{ required: true, message: this.$t('pleaseEnterEffectiveTimePeriod'), trigger: 'change', validator: (rule, value, cb) => cb() }],
          modeRuleList: [{ required: true, message: this.$t('pleaseAddPatternRules'), trigger: 'change', validator: (rule, value, cb) => cb() }],
        },
      }
    },
    computed: {
      ruleList() {
        return this.formData.modeRuleList.map(it => {
          let obj = { ruleType: it.ruleType, cyclicType: it.cyclicType }
          if (it.ruleType === 1) {
            obj.ruleContent = JSON.stringify({
              ruleType: it.ruleType,
              cyclicType: it.cyclicType,
              cyclicRuleList: it.cyclicRuleList.map(item => {
                let timeRanges = []
                if (it.cyclicType === 0) {
                  timeRanges = item.period.map(time => `${time[0]}_${time[1]}`)
                } else if (it.cyclicType === 1) {
                  timeRanges = item.weekList
                } else if (it.cyclicType === 2) {
                  timeRanges = item.dayList
                }
                return { deviceList: item.deviceList, timeRanges, ruleItemId: item.ruleItemId || uuid() }
              }),
            })
          } else {
            obj.ruleContent = JSON.stringify({
              deviceList: it.deviceList,
              condition: {
                groupName: '',
                groupRules: it.groupRules.map(cond => {
                  let name = cond.name
                  let type = cond.name === this.ruleTypeOptions[1].value ? 'compare' : 'duration'
                  let elementText = cond.name === this.ruleTypeOptions[1].value ? JSON.stringify({ isAdd: !!it.isAnd, type, name, lowerBound: cond.lowerBound }) : JSON.stringify({ isAdd: !!it.isAnd, type, name, duration: cond.duration })
                  let obj = { name, type, elementText }
                  return obj
                }),
                isAnd: !!it.isAnd,
              },
              ruleItemId: it.ruleItemId || uuid(),
            })
          }
          if (it.id) {
            Object.assign(obj, { id: it.id, modeId: it.modeId || null })
          }
          return obj
        })
      },
    },
    methods: {
      async getDetailItem() {
        let res = await queryModeMatch({ id: this.editId })
        if (res.success) {
          let info = res.data
          this.formData.name = info.name
          this.formData.remark = info.remark
          this.formData.status = info.status
          this.formData.timeRangeList = info.timeRangeList.map(it => [it.startTime, it.endTime])
          this.formData.modeRuleList = info.ruleList.map(it => {
            let obj = { id: it.id, modeId: it.modeId, ruleType: it.ruleType, cyclicType: it.cyclicType }
            let ruleContent = JSON.parse(it.ruleContent)
            if (it.ruleType === 1) {
              obj.cyclicRuleList = ruleContent.cyclicRuleList.map(item => {
                return {
                  deviceList: item.deviceList,
                  weekList: it.cyclicType === 1 ? item.timeRanges : [],
                  period: it.cyclicType === 0 ? item.timeRanges.map(v => v.split('_')) : [],
                  dayList: it.cyclicType === 2 ? item.timeRanges : [],
                  ruleItemId: item.ruleItemId,
                }
              })
            } else {
              obj.isAnd = ruleContent.condition.groupRules[0].isAnd ? 1 : 0
              obj.groupRules = ruleContent.condition.groupRules.map(item => {
                let elementText = JSON.parse(item.elementText)
                return {
                  name: item.name,
                  duration: item.name === this.ruleTypeOptions[0].value ? elementText.duration : null,
                  lowerBound: item.name === this.ruleTypeOptions[1].value ? elementText.lowerBound : null,
                }
              })
              obj.ruleItemId = ruleContent.ruleItemId
              obj.deviceList = ruleContent.deviceList
            }
            return obj
          })
        } else {
          this.$Message.error({ content: res.message })
          this.cancel()
        }
      },
      addRuleItem() {
        this.formData.modeRuleList.push({
          ruleType: 1,
          cyclicType: 0,
          cyclicRuleList: [{ weekList: [], period: [], deviceList: [], dayList: [] }],
          isAnd: 0,
          groupRules: [],
          deviceList: [],
        })
      },
      addValidPeriod() {
        this.formData.timeRangeList.push([])
      },
      addAction(cyclicRuleList) {
        cyclicRuleList.push({ weekList: [], period: [], deviceList: [], dayList: [] })
      },
      delValidPeriod(index) {
        this.formData.timeRangeList.splice(index, 1)
      },
      changeEffect(v, index) {
        this.formData.timeRangeList.splice(index, 1, v)
      },
      delActionItem(cyclicRuleList, i) {
        cyclicRuleList.splice(i, 1)
      },
      changePeriodEffect(v, period, i) {
        period.splice(i, 1, v)
      },
      addActionPeriod(period) {
        period.push([])
      },
      delPeriodEffect(period, i) {
        period.splice(i, 1)
      },
      delDevice(deviceList, i) {
        deviceList.splice(i, 1)
      },
      addDevice(deviceList) {
        deviceList.push({ mac: '', addrs: [] })
      },
      delRuleItem(index) {
        this.formData.modeRuleList.splice(index, 1)
      },
      addCondition(index) {
        this.formData.modeRuleList[index].groupRules.push({ name: 'standbyTime', duration: 3600, lowerBound: null })
      },
      delCondition(list, index) {
        list.splice(index, 1)
      },
      cancel() {
        this.$refs.searchForm.resetFields()
        this.formData = { name: '', remark: '', status: 0, timeRangeList: [], modeRuleList: [] }
        this.$parent.addModalFlag = false
        this.$parent.queryData()
      },
      async postSubmitRequest() {
        let params = {
          projectCode: this.$store.state.projectCode,
          name: this.formData.name,
          remark: this.formData.remark,
          status: this.formData.status,
          timeRangeList: this.formData.timeRangeList.map(it => ({ startTime: it[0], endTime: it[1] })),
          ruleList: this.ruleList,
        }
        let res = null
        if (this.action === 'add') {
          // 新增
          res = await modeMatchRuleAdd(params)
        } else {
          // 修改
          res = await updateModeMatch(this.editId, { ...params, id: this.editId })
        }
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.cancel()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handlerSubmit() {
        this.formRules = this.rules
        this.$nextTick(() => {
          this.$refs.searchForm.validate(valid => {
            if (valid) {
              this.postSubmitRequest()
            }
          })
        })
      },
    },
    mounted() {
      if (this.editId) {
        this.getDetailItem()
      }
    },
    watch: {
      formData: {
        handler(value) {
          this.formRules = this.tempFormRules
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .form-mode-box {
    padding-top: 15px;
    .rule-group {
      .rule-item {
        padding: 15px;
        background: #141820;
        position: relative;
        margin-bottom: 10px;
        .flex {
          display: flex;
        }
        .top-item {
          display: flex;
          justify-content: flex-start;
        }
        .content-item {
          margin-top: 10px;
          display: flex;
          position: relative;
          .left {
            padding-right: 10px;
          }
          .right {
            flex: 1;
            .mb-10 {
              margin-bottom: 10px;
            }
            .ml-10 {
              margin-left: 10px;
            }
            .mr-10 {
              margin-right: 10px;
            }
            .del-btn {
              padding: 0 10px;
            }
            .item-group {
              width: 100%;
              padding: 15px;
              border: 1px solid #797979;
              margin-bottom: 10px;
              position: relative;
              .time-box {
                display: flex;
                margin-bottom: 10px;
              }
              .device-box {
                display: flex;
                .device-item {
                  margin-bottom: 10px;
                }
                .add-device {
                  width: 130px;
                }
              }
            }
            .add-action {
              width: 150px;
            }
            .stop-rule-content {
              .rule-box-content {
                display: flex;
                margin-bottom: 10px;
                .rule-box-left {
                  width: 100px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  position: relative;
                  height: auto;
                  &::before {
                    content: '';
                    display: block;
                    width: 2px;
                    height: calc(~'100% - 1px');
                    position: absolute;
                    left: calc(~'50% - 1px');
                    top: 1px;
                    background: #97999a;
                    z-index: 0;
                  }
                }
                .stop-rule-group {
                  .stop-rule-item {
                    margin-bottom: 10px;
                    display: flex;
                    .input-elect {
                      width: 150px;
                      position: relative;
                      /deep/.ivu-input-number {
                        width: 100%;
                      }
                      .unit-text {
                        position: absolute;
                        right: 10px;
                      }
                    }
                  }
                }
              }
              .rule-box-device {
                display: flex;
                .left {
                  width: 100px;
                  text-align: right;
                }
                .device-item {
                  margin-bottom: 10px;
                }
              }
            }
          }
          .del-action {
            position: absolute;
            right: 15px;
            top: 15px;
            padding: 0 10px;
          }
        }
        .del-item-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 0px 10px;
        }
      }
    }
    .footer {
      display: flex;
      justify-content: flex-end;
      padding-right: 40px;
    }
  }
</style>
