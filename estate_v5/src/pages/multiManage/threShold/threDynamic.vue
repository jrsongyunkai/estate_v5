<template>
  <div class="dynamic">
    <div class="dynamicTips">
      <i class="icon-v5 icon-v5-huifu"></i>
      {{ $t('thresholdConfigurationPrompt') }}
    </div>
    <Form ref="formDynamic" :model="formDynamic" v-if="lineType === 1">
      <FormItem v-for="(item, index) in formDynamic.items" :key="index" :prop="'items.' + index + '.value'" class="formdyn">
        <Row>
          <Col :span="24">
            <Collapse v-model="item.collapse">
              <Panel :name="`${index}`">
                <Col :span="16" style="display: flex">
                  <span @click.stop.prevent="() => {}" style="width: 330px">
                    <FormItem :label="$t('thresholdType')" :label-width="121">
                      <Select v-model="item.type" style="width: 200px">
                        <Option v-for="(items, index) in thresholdType" :value="items.value" :key="index">{{ items.label }}</Option>
                      </Select>
                    </FormItem>
                  </span>
                  <span @click.stop.prevent="() => {}" style="width: 300px">
                    <FormItem>
                      <Select v-model="item.chirentype" @on-change="handleChange($event, index)" style="width: 200px" v-if="item.type === 1">
                        <Option v-for="items in thresholdTypeChiren1" :value="items.value" :key="items.value">{{ items.label }}</Option>
                      </Select>
                      <Select v-model="item.chirentype" @on-change="handleChange($event, index)" style="width: 200px" v-if="item.type === 2">
                        <Option v-for="items in thresholdTypeChiren2" :value="items.value" :key="items.value">{{ items.label }}</Option>
                      </Select>
                      <Select v-model="item.chirentype" @on-change="handleChange($event, index)" style="width: 200px" v-if="item.type === 3">
                        <Option v-for="items in thresholdTypeChiren3" :value="items.value" :key="items.value">{{ items.label }}</Option>
                      </Select>
                      <Select v-model="item.chirentype" @on-change="handleChange($event, index)" style="width: 200px" v-if="item.type === 4">
                        <Option v-for="items in thresholdTypeChiren4" :value="items.value" :key="items.value">{{ items.label }}</Option>
                      </Select>
                      <Select v-model="item.chirentype" @on-change="handleChange($event, index)" style="width: 200px" v-if="item.type === 5">
                        <Option v-for="items in thresholdTypeChiren5" :value="items.value" :key="items.value">{{ items.label }}</Option>
                      </Select>
                      <Select v-model="item.chirentype" @on-change="handleChange($event, index)" style="width: 200px" v-if="item.type === 6">
                        <Option v-for="(items, index) in thresholdTypeChiren6" :value="items.value" :key="index">{{ items.label }}</Option>
                      </Select>
                    </FormItem>
                  </span>
                </Col>
                <Col :span="8" class="formRight">
                  <div class="formBtn">
                    <Button class="danger" @click.stop.prevent="handleRemove(index, item)">{{ $t('deleteThresholdType') }}</Button>
                  </div>
                </Col>
                <Row slot="content">
                  <Col :span="16">
                    <Form ref="item.chilren" :model="item.chilren" :label-width="80">
                      <Row class="content" v-if="item.chilren.itemc[0].isDefalutTime !== 1">
                        <Col :span="24">
                          <div class="default_content">
                            <div class="default_period">{{ $t('defaultTimePeriod') }}</div>
                            <Button class="b-blue" @click="handleGetDefaultThreshold(item.type, item.chirentype)">{{ $t('deviceDefaultThresholdImport') }}</Button>
                          </div>
                          <Row>
                            <FormItem :label="$t('warningValue')" :label-width="106">
                              <div class="contentInput">
                                <Input v-model="item.defaultWarningVal" :placeholder="$t('pleaseEnter')" style="width: 300px" />
                                <i>{{ thresholdType && formDynamic.items[index].type ? thresholdType.find(v => v.value === formDynamic.items[index].type).unit : '' }}</i>
                              </div>
                            </FormItem>
                            <FormItem :label="$t('warningAction')" :label-width="106" class="ml-10">
                              <Select @on-change="closingReminder($event, item, '1')" :disabled="item.chilren.itemc[0].canSetTypes !== ''" style="width: 300px" v-model="item.defaultWarningAction" :placeholder="$t('pleaseSelectOpenOrCloseOrNothing')">
                                <Option v-for="item in item.chilren.itemc[0].alertActionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                            <FormItem :label="$t('isItAlarm')" :label-width="121" class="ml-10">
                              <RadioGroup v-model="item.defaultWarningGroup" style="width: 120px; display: flex; justify-content: space-between">
                                <Radio :disabled="item.chilren.itemc[0].canSetTypes !== ''" :label="$t('yes')">
                                  {{ $t('yes') }}
                                </Radio>
                                <Radio :disabled="item.chilren.itemc[0].canSetTypes !== ''" :label="$t('no')">
                                  {{ $t('no') }}
                                </Radio>
                              </RadioGroup>
                            </FormItem>
                          </Row>
                          <Row class="mt-20">
                            <FormItem :label="$t('alarmValue')" :label-width="90">
                              <div class="contentInput">
                                <Input v-model="item.defaultAlarmVal" :placeholder="$t('pleaseEnter')" style="width: 300px" />
                                <i>{{ thresholdType && formDynamic.items[index].type ? thresholdType.find(v => v.value === formDynamic.items[index].type).unit : '' }}</i>
                              </div>
                            </FormItem>
                            <FormItem :label="$t('alarmAction')" :label-width="90" class="ml-10">
                              <Select @on-change="closingReminder($event, item, '2')" :disabled="item.chilren.itemc[0].canSetTypes !== ''" style="width: 300px" v-model="item.defaultAlarmAction" :placeholder="$t('pleaseSelectOpenOrCloseOrNothing')">
                                <Option v-for="item in item.chilren.itemc[0].warningActionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                            <FormItem :label="$t('isItAlarm')" :label-width="121" class="ml-10">
                              <RadioGroup v-model="item.defaultalarmGroup" style="width: 120px; display: flex; justify-content: space-between">
                                <Radio :disabled="item.chilren.itemc[0].canSetTypes !== ''" :label="$t('yes')">
                                  {{ $t('yes') }}
                                </Radio>
                                <Radio :disabled="item.chilren.itemc[0].canSetTypes !== ''" :label="$t('no')">
                                  {{ $t('no') }}
                                </Radio>
                              </RadioGroup>
                            </FormItem>
                          </Row>
                        </Col>
                      </Row>
                      <FormItem v-for="(item, indexs) in item.chilren.itemc" :key="indexs" :prop="'item.' + indexs + '.value'">
                        <Row class="content">
                          <Col :span="23">
                            <FormItem v-if="item.isDefalutTime !== 1" :label="$t('timeSpan')" :label-width="70" style="width: 200px">
                              <div :class="{ 'shake-slow': item.showSpan === true }">
                                <TimePicker
                                  transfer
                                  format="HH:mm"
                                  :editable="false"
                                  v-model="item.timer"
                                  :class="item.showSpan === true ? 'date' : ''"
                                  type="timerange"
                                  confirm
                                  placement="bottom-end"
                                  :placeholder="$t('pleaseSelectTimePeriod')"
                                  @on-ok="timeCheckFunction(item.timer, indexs, index)"></TimePicker>
                                <div v-if="item.showSpan" style="color: #e03c3a">
                                  <p>{{ $t('selectedThresholdPeriodConflicts') }}</p>
                                </div>
                              </div>
                            </FormItem>
                            <div class="default_content" v-else>
                              <div class="default_period">{{ $t('defaultTimePeriod') }}</div>
                              <Button class="b-blue" @click="handleGetDefaultThreshold(item.type, item.chirentype)">{{ $t('deviceDefaultThresholdImport') }}</Button>
                            </div>

                            <Row class="mt-20">
                              <FormItem :label="$t('warningValue')" :label-width="90">
                                <div class="contentInput">
                                  <Input v-model="item.warningValue" :placeholder="$t('pleaseEnter')" style="width: 300px" />
                                  <i>{{ thresholdType && formDynamic.items[index].type ? thresholdType.find(v => v.value === formDynamic.items[index].type).unit : '' }}</i>
                                </div>
                              </FormItem>
                              <FormItem :label="$t('warningAction')" :label-width="90" class="ml-10">
                                <Select @on-change="closingReminder($event, item, '4')" :disabled="item.canSetTypes !== ''" v-model="item.warningAction" style="width: 300px" :placeholder="$t('pleaseSelectOpenOrCloseOrNothing')">
                                  <Option v-for="item in item.warningActionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                              </FormItem>
                              <FormItem :label="$t('isItAlarm')" :label-width="121" class="ml-10">
                                <RadioGroup v-model="item.warningadioAlarm" style="width: 120px; display: flex; justify-content: space-between">
                                  <Radio :disabled="item.canSetTypes !== ''" :label="$t('yes')">
                                    {{ $t('yes') }}
                                  </Radio>
                                  <Radio :disabled="item.canSetTypes !== ''" :label="$t('no')">
                                    {{ $t('no') }}
                                  </Radio>
                                </RadioGroup>
                              </FormItem>
                            </Row>
                            <Row class="mt-20">
                              <FormItem :label="$t('alarmValue')" :label-width="106">
                                <div class="contentInput">
                                  <Input v-model="item.alertValue" :placeholder="$t('pleaseEnter')" style="width: 300px" />
                                  <i>{{ thresholdType && formDynamic.items[index].type ? thresholdType.find(v => v.value === formDynamic.items[index].type).unit : '' }}</i>
                                </div>
                              </FormItem>
                              <FormItem :label="$t('alarmAction')" :label-width="106" class="ml-10">
                                <Select @on-change="closingReminder($event, item, '3')" :disabled="item.canSetTypes !== ''" v-model="item.alertAction" style="width: 300px" :placeholder="$t('pleaseSelectOpenOrCloseOrNothing')">
                                  <Option v-for="item in item.alertActionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                              </FormItem>
                              <FormItem :label="$t('isItAlarm')" :label-width="121" class="ml-10">
                                <RadioGroup v-model="item.alertradioAlarm" style="width: 120px; display: flex; justify-content: space-between">
                                  <Radio :disabled="item.canSetTypes !== ''" :label="$t('yes')">
                                    {{ $t('yes') }}
                                  </Radio>
                                  <Radio :disabled="item.canSetTypes !== ''" :label="$t('no')">
                                    {{ $t('no') }}
                                  </Radio>
                                </RadioGroup>
                              </FormItem>
                            </Row>
                          </Col>
                          <Col span="1" style="display: flex; align-items: center" v-if="item.isDefalutTime !== 1">
                            <Icon class="del" custom="icon-v5 icon-v5-jianshaojianqujianhao" @click="handleRemoveContent(index, indexs, item)"></Icon>
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem>
                        <Row>
                          <Col span="12" class="md-add">
                            <Button type="dashed" @click="handleAddContent(index)" icon="md-add" class="mt-20">{{ $t('addTimePeriod') }}</Button>
                          </Col>
                        </Row>
                      </FormItem>
                    </Form>
                  </Col>
                  <Col :span="8">
                    <div class="formEchats">
                      <TimeBars :options="item.timeData" :porea="porea"></TimeBars>
                      <div class="conficontent">
                        <div class="configured">
                          <div class="configuredColod"></div>
                          <span class="configuredSpan">{{ $t('configured') }}</span>
                        </div>
                        <div class="configured">
                          <div class="noconfiguredColod"></div>
                          <span class="configuredSpan">{{ $t('defaultTimePeriod') }}</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <Col :span="24" class="md-add" style="margin-left: 0">
            <Button type="dashed" long @click="handleAdd" icon="md-add">{{ $t('addThresholdType') }}</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>

    <Form ref="formIo" :model="formIo" v-else>
      <FormItem v-for="(item, index) in formIo.items" :key="index" :prop="'items.' + index + '.value'" class="formdyn">
        <Row>
          <Col :span="24">
            <Collapse v-model="item.collapse">
              <Panel :name="`${index}`">
                <Col :span="16" style="display: flex">
                  <span @click.stop.prevent="() => {}" style="width: 330px">
                    <FormItem :label="$t('unitConversion')">
                      <Select v-model="item.type" style="width: 200px">
                        <Option v-for="(items, index) in thresholdType" :value="items.value" :key="index">{{ items.label }}</Option>
                      </Select>
                    </FormItem>
                  </span>
                </Col>
                <Col :span="8" class="formRight">
                  <div class="formBtn">
                    <Button class="danger" @click.stop.prevent="handleRemove(index, item)">{{ $t('deleteThresholdType') }}</Button>
                  </div>
                </Col>
                <Row slot="content">
                  <Col :span="16">
                    <Form ref="item.chilren" :model="item.chilren" :label-width="80">
                      <Row class="content" v-if="item.chilren.itemc[0].isDefalutTime !== 1">
                        <Col :span="24">
                          <div class="default_content">
                            <div class="default_period">{{ $t('defaultTimePeriod') }}</div>
                          </div>
                          <Row>
                            <FormItem :label-width="80">
                              <span>{{ $t('alertRange') }}</span>
                              <div class="contentInput">
                                <Input v-model="item.defaultwarnThresholList[0]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                                ——
                                <Input v-model="item.defaultwarnThresholList[1]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                              </div>
                            </FormItem>
                            <FormItem :label-width="80" class="ml-20">
                              <div>{{ $t('alarmType') }}</div>
                              <Select v-model="item.defaultwarnThresholType" :placeholder="$t('pleaseSelectCustomAlarm')" :not-found-text="$t('selectCustomAlarmNoDataTip')" style="width: 200px">
                                <Option v-for="item in item.defaultalertTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                          </Row>
                          <Row style="margin-top: 20px">
                            <FormItem :label-width="80">
                              <span>{{ $t('alarmRange') }}</span>
                              <div class="contentInput">
                                <Input v-model="item.defaultalarmThresholList[0]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                                ——
                                <Input v-model="item.defaultalarmThresholList[1]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                              </div>
                            </FormItem>
                            <FormItem :label-width="80" class="ml-20">
                              <div>{{ $t('alarmType') }}</div>
                              <Select v-model="item.defaultalarmThresholType" :placeholder="$t('pleaseSelectCustomAlarm')" :not-found-text="$t('selectCustomAlarmNoDataTip')" style="width: 200px">
                                <Option v-for="item in item.defaultalertTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                              </Select>
                            </FormItem>
                          </Row>
                        </Col>
                      </Row>
                      <FormItem v-for="(item, indexs) in item.chilren.itemc" :key="indexs" :prop="'item.' + indexs + '.value'">
                        <Row class="content">
                          <Col :span="23">
                            <FormItem v-if="item.isDefalutTime !== 1" :label="$t('timeSpan')" :label-width="$store.state.locale !== 'zh-CN' ? 70 : 40" style="width: 200px">
                              <div :class="{ 'shake-slow': item.showSpan === true }">
                                <TimePicker
                                  transfer
                                  format="HH:mm"
                                  :editable="false"
                                  v-model="item.timer"
                                  :class="item.showSpan === true ? 'date' : ''"
                                  type="timerange"
                                  confirm
                                  placement="bottom-end"
                                  :placeholder="$t('pleaseSelectTimePeriod')"
                                  @on-ok="timeCheckFunction(item.timer, indexs, index)"></TimePicker>
                                <div v-if="item.showSpan" style="color: #e03c3a">
                                  <p>{{ $t('selectedThresholdPeriodConflicts') }}</p>
                                </div>
                              </div>
                            </FormItem>
                            <div class="default_content" v-else>
                              <div class="default_period">{{ $t('defaultTimePeriod') }}</div>
                            </div>
                            <Row style="margin-top: 20px">
                              <FormItem :label-width="80">
                                <span>{{ $t('alertRange') }}</span>
                                <div class="contentInput">
                                  <Input v-model="item.warnThresholList[0]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                                  ——
                                  <Input v-model="item.warnThresholList[1]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                                </div>
                              </FormItem>
                              <FormItem :label-width="80" class="ml-20">
                                <div>{{ $t('alarmType') }}</div>
                                <Select v-model="item.warnThresholType" :placeholder="$t('pleaseSelectCustomAlarm')" :not-found-text="$t('selectCustomAlarmNoDataTip')" style="width: 200px">
                                  <Option v-for="item in item.alertTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                              </FormItem>
                            </Row>
                            <Row style="margin-top: 20px">
                              <FormItem :label-width="80">
                                <span>{{ $t('alarmRange') }}</span>
                                <div class="contentInput">
                                  <Input v-model="item.alarmThresholList[0]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                                  ——
                                  <Input v-model="item.alarmThresholList[1]" :placeholder="$t('pleaseEnter')" style="width: 180px" />
                                </div>
                              </FormItem>
                              <FormItem :label-width="80" class="ml-20">
                                <div>{{ $t('alarmType') }}</div>
                                <Select v-model="item.alarmThresholType" :placeholder="$t('pleaseSelectCustomAlarm')" :not-found-text="$t('selectCustomAlarmNoDataTip')" style="width: 200px">
                                  <Option v-for="item in item.alertTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                              </FormItem>
                            </Row>
                          </Col>
                          <Col span="1" style="display: flex; align-items: center" v-if="item.isDefalutTime !== 1">
                            <Icon class="del" custom="icon-v5 icon-v5-jianshaojianqujianhao" @click="handleRemoveContent(index, indexs, item)"></Icon>
                          </Col>
                        </Row>
                      </FormItem>
                      <FormItem>
                        <Row>
                          <Col span="12" class="md-add">
                            <Button type="dashed" @click="handleAddContent(index)" icon="md-add" class="mt-20">{{ $t('addTimePeriod') }}</Button>
                          </Col>
                        </Row>
                      </FormItem>
                    </Form>
                  </Col>
                  <Col :span="8">
                    <div class="formEchats">
                      <TimeBars :options="item.timeData" :porea="porea"></TimeBars>
                      <div class="conficontent">
                        <div class="configured">
                          <div class="configuredColod"></div>
                          <span class="configuredSpan">{{ $t('configured') }}</span>
                        </div>
                        <div class="configured">
                          <div class="noconfiguredColod"></div>
                          <span class="configuredSpan">{{ $t('defaultTimePeriod') }}</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <Col :span="24" class="md-add" style="margin-left: 0">
            <Button type="dashed" long @click="handleAdd" icon="md-add">{{ $t('addThresholdType') }}</Button>
          </Col>
        </Row>
      </FormItem>
    </Form>
  </div>
</template>
<script>
  import TimeBars from './timerPie.vue'
  import { thresholdTypeList4Time, threTypleListSave, thresholdEditList, queryAlarmForConfig, handleThresholdDel, getDefaultThreshold } from '@/api/public'
  export default {
    props: {
      configId: {
        // 父组件把方法传过来
        type: String,
        default: '',
      },
      flagEdit: {
        type: Object,
        default() {
          return {}
        },
      },
      lineType: {
        type: Number,
        default: 1,
      },
    },
    components: {
      TimeBars,
    },
    data() {
      return {
        IoTypeList: [],
        timeDataColor: '#007eff',
        index: 0,
        indexs: 0,
        timeData: [],
        formDynamic: {
          items: [
            {
              timeData: [],
              type: '',
              index: 0,
              chirentype: '',
              collapse: ['0'],
              defaultWarningVal: '',
              defaultWarningAction: '',
              defaultWarningGroup: this.$t('yes'),
              defaultAlarmVal: '',
              defaultAlarmAction: '',
              defaultAlarmGroup: this.$t('yes'),
              chilren: {
                itemc: [
                  {
                    isDefalutTime: '',
                    canSetTypes: '',
                    showSpan: false,
                    type: '',
                    timer: [],
                    index: 0,
                    alertradioAlarm: this.$t('yes'),
                    warningadioAlarm: this.$t('yes'),
                    alertValue: '',
                    alertActionList: [
                      { value: '0', label: this.$t('nothing') },
                      { value: '1', label: this.$t('opening') },
                      { value: '2', label: this.$t('closing') },
                    ],
                    alertAction: '',
                    warningValue: '',
                    warningActionList: [
                      { value: '0', label: this.$t('nothing') },
                      { value: '1', label: this.$t('opening') },
                      { value: '2', label: this.$t('closing') },
                    ],
                    warningAction: '',
                  },
                ],
              },
            },
          ],
        },
        formIo: {
          items: [
            {
              timeData: [],
              type: '',
              index: 0,
              collapse: ['0'],
              idList: [0, 0],
              defaultwarnThresholList: ['', ''],
              defaultalarmThresholList: ['', ''],
              defaultwarnThresholType: '',
              defaultalarmThresholType: '',
              defaultalertTypeList: [],
              chilren: {
                itemc: [{ isDefalutTime: '', showSpan: false, type: '', timer: [], index: 0, idList: [0, 0], warnThresholList: ['', ''], alarmThresholList: ['', ''], warnThresholType: '', alarmThresholType: '', alertTypeList: [] }],
              },
            },
          ],
        },
        thresholdType: [],
        thresholdTypeChiren1: [],
        thresholdTypeChiren2: [],
        thresholdTypeChiren3: [],
        thresholdTypeChiren4: [],
        thresholdTypeChiren5: [],
        thresholdTypeChiren6: [],
        typeChild: [],
        typeData: [],
        topTimeValue: [],
        ListData: [],
        threEditData: [],
        defaultWarning: '',
        defaultAlarm: '',
        canSetTypes: '',
        porea: {
          pmAM: [
            { position: 'absolute', top: '45%', left: '25%' },
            { position: 'absolute', top: '45%', left: '65%' },
          ],
        },
      }
    },
    mounted() {
      this.handleThresholdTypeList()
      if (this.flagEdit.edit) {
        setTimeout(() => {
          if (this.lineType === 1) {
            this.handleThresholdEditList()
          } else {
            this.thresholdEditListIo()
          }
        }, 500)
      } else {
        this.initCanvas(0)
        this.handleCustom()
      }
    },
    methods: {
      handleCustom() {
        let params = {
          projectCodes: this.$store.state.projectCode,
        }
        queryAlarmForConfig(params).then(res => {
          this.customName = []
          res.data.customs.map(val => {
            this.customName.push({ value: val.id, label: val.name })
            val.alarms.map(v => {
              this.IoTypeList.push({ value: v.id, label: v.name })
              this.formIo.items.map(val => {
                val.chilren.itemc.map(vs => {
                  vs.alertTypeList.push({ value: v.id, label: v.name })
                })
              })
              this.formIo.items[0].defaultalertTypeList.push({ value: v.id, label: v.name })
            })
          })
        })
      },
      closingReminder(val, iv, inds) {
        if (val === '2') {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('poseSafetyHazard'),
            onCancel: () => {
              switch (inds) {
                case '1':
                  iv.defaultWarningAction = ''
                  break
                case '2':
                  iv.defaultAlarmAction = ''
                  break
                case '3':
                  iv.alertAction = ''
                  break
                default:
                  iv.warningAction = ''
              }
            },
          })
        }
      },
      handleGetDefaultThreshold(type, chirentype) {
        if (type === '' && chirentype === '') {
          return this.$Message.error({ content: this.$t('pleaseSelectThresholdType') })
        }
        let params = { configId: this.flagEdit.edit === true ? this.flagEdit.configId : this.configId, type: type, subType: chirentype }
        getDefaultThreshold(params).then(res => {
          if (res.success) {
            this.$Message.success({ content: this.$t('importSuccessful') })
            this.formDynamic.items.map((item, index) => {
              item.defaultWarningVal = res.data.warnThreshol
              item.defaultAlarmVal = res.data.alarmThreshol
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      thresholdEditListIo() {
        let params = { configId: this.flagEdit.configId, type: '8' }
        thresholdEditList(params).then(res => {
          this.formIo.items = []
          var newArr = []
          let tempArr = []
          this.datas = res.data
          this.datas.forEach((i, index) => {
            if (tempArr.indexOf(`${i.subTypeList}`) === -1) {
              tempArr.push(`${i.subTypeList}`)
              newArr.push({
                timeData: [],
                type: `${i.subTypeList}`,
                index: 0,
                idList: i.idList,
                collapse: ['0'],
                defaultwarnThresholList: ['', ''],
                defaultalarmThresholList: ['', ''],
                defaultwarnThresholType: '',
                defaultalarmThresholType: '',
                defaultalertTypeList: [],
                chilren: {
                  itemc: [
                    {
                      idList: i.idList,
                      isDefalutTime: i.isDefalutTime,
                      showSpan: false,
                      type: `${i.subTypeList}`,
                      timer: [i.startTime, i.endTime],
                      index: 0,
                      warnThresholList: i.warnThresholList,
                      alarmThresholList: i.alarmThresholList,
                      warnThresholType: i.warnCustomId,
                      alarmThresholType: i.alarmCustomId,
                      alertTypeList: [],
                    },
                  ],
                },
              })
            } else {
              newArr[tempArr.indexOf(`${i.subTypeList}`)].chilren.itemc.push({
                timeData: [],
                type: `${i.subTypeList}`,
                index: 0,
                collapse: ['0'],
                idList: i.idList,
                defaultwarnThresholList: ['', ''],
                defaultalarmThresholList: ['', ''],
                defaultwarnThresholType: '',
                defaultalarmThresholType: '',
                defaultalertTypeList: [],
                isDefalutTime: i.isDefalutTime,
                showSpan: false,
                timer: [i.startTime, i.endTime],
                warnThresholList: i.warnThresholList,
                alarmThresholList: i.alarmThresholList,
                warnThresholType: i.warnCustomId,
                alarmThresholType: i.alarmCustomId,
                alertTypeList: [],
              })
            }
          })
          newArr.map((item, index) => {
            this.formIo.items.push(item)
            this.canvansShow(index)
          })
          this.handleCustom()
        })
      },
      handleThresholdEditList() {
        let params = {
          configId: this.flagEdit.configId,
        }
        thresholdEditList(params).then(res => {
          if (res.success) {
            this.datas = res.data
            this.formDynamic.items = []
            let tempArr = []
            var newArr = []
            this.datas.forEach((i, index) => {
              if (tempArr.indexOf(i.subType) === -1) {
                this.handleChange(i.subType)
                newArr.push({
                  chirentype: i.subType,
                  type: i.type,
                  timeData: [],
                  chilren: {
                    itemc: [
                      {
                        canSetTypes: i.canSetTypes,
                        isDefalutTime: i.isDefalutTime,
                        alertAction: i.alarmAction.toString(),
                        alertradioAlarm: i.alarmStatus === 2 ? this.$t('yes') : this.$t('no'),
                        alertValue: i.alarmThreshol === undefined ? '' : i.alarmThreshol,
                        id: i.id,
                        showSpan: false,
                        timer: [i.startTime, i.endTime],
                        warningAction: i.warnAction.toString(),
                        warningadioAlarm: i.warnStatus === 2 ? this.$t('yes') : this.$t('no'),
                        warningValue: i.warnThreshol === undefined ? '' : i.warnThreshol,
                        alertActionList: [
                          { value: '0', label: this.$t('nothing') },
                          { value: '1', label: this.$t('opening') },
                          { value: '2', label: this.$t('closing') },
                        ],
                        warningActionList: [
                          { value: '0', label: this.$t('nothing') },
                          { value: '1', label: this.$t('opening') },
                          { value: '2', label: this.$t('closing') },
                        ],
                      },
                    ],
                  },
                })
                tempArr.push(i.subType)
              } else {
                newArr[tempArr.indexOf(i.subType)].chilren.itemc.push({
                  canSetTypes: i.canSetTypes,
                  alertAction: i.alarmAction.toString(),
                  alertradioAlarm: i.alarmStatus === 2 ? this.$t('yes') : this.$t('no'),
                  alertValue: i.alarmThreshol === undefined ? '' : i.alarmThreshol,
                  timer: [i.startTime, i.endTime],
                  id: i.id,
                  showSpan: false,
                  warningAction: i.warnAction.toString(),
                  warningadioAlarm: i.warnStatus === 2 ? this.$t('yes') : this.$t('no'),
                  warningValue: i.warnThreshol === undefined ? '' : i.warnThreshol,
                  alertActionList: [
                    { value: '0', label: this.$t('nothing') },
                    { value: '1', label: this.$t('opening') },
                    { value: '2', label: this.$t('closing') },
                  ],
                  warningActionList: [
                    { value: '0', label: this.$t('nothing') },
                    { value: '1', label: this.$t('opening') },
                    { value: '2', label: this.$t('closing') },
                  ],
                })
              }
              this.threEditData = newArr
              newArr.map((item, index) => {
                this.formDynamic.items.push(item)
              })
              this.formDynamic.items.map((item, index) => {
                item.index = index
                item.collapse = [`${index - 1}`]
                this.canvansShow(index)
              })
            })
            let newArrs = []
            let obj = {}
            for (var i = 0; i < this.formDynamic.items.length; i++) {
              if (!obj[this.formDynamic.items[i].chirentype]) {
                newArrs.push(this.formDynamic.items[i])
                obj[this.formDynamic.items[i].chirentype] = true
              }
            }
            this.formDynamic.items = newArrs
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      thresholdSave() {
        this.saveValueEdit()
        let params = {
          configId: this.flagEdit.edit === true ? this.flagEdit.configId : this.configId,
        }
        if (this.lineType === 1) {
          params.list = JSON.stringify(this.ListData)
        } else {
          params.newList = JSON.stringify(this.ListData)
        }
        threTypleListSave(params).then(res => {
          if (res.success) {
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      typeduplice() {
        this.saveValueEdit()
        let newArr = []
        let newNullArr = []
        this.ListData.map(item => {
          newNullArr.push(item.subType)
        })
        let duplicate = false
        this.formDynamic.items.map(v => {
          newArr.push(v.chirentype)
        })

        if (new Set(newArr).size !== newArr.length) {
          duplicate = true
        }

        let duplicateNull = false
        newNullArr.map(item => {
          if (item === '') {
            duplicateNull = true
          }
        })

        if (this.lineType === 1) {
          this.$emit('formDynamic', this.formDynamic)
        } else {
          this.$emit('formDynamic', this.formIo)
        }

        this.$emit('duplicateTypeNull', duplicateNull)
        this.$emit('DuplicateType', duplicate)
      },
      saveValueEdit() {
        this.ListData = []
        if (this.lineType === 1) {
          this.formDynamic.items.map(item => {
            item.chilren.itemc.map(val => {
              if (item.defaultWarningVal !== undefined) {
                this.ListData.push({
                  canSetTypes: val.canSetTypes,
                  id: this.flagEdit.edit ? val.id : '',
                  type: item.type,
                  subType: item.chirentype,
                  startTime: '',
                  endTime: '',
                  warnThreshol: item.defaultWarningVal === undefined ? '' : item.defaultWarningVal,
                  warnAction: this.canSetTypes !== '' ? '' : item.defaultWarningAction === undefined ? '' : item.defaultWarningAction,
                  warnStatus: this.canSetTypes !== '' ? '' : item.defaultWarningGroup === this.$t('yes') ? '2' : '1',
                  alarmThreshol: item.defaultAlarmVal === undefined ? '' : item.defaultAlarmVal,
                  alarmAction: this.canSetTypes !== '' ? '' : item.defaultAlarmAction === undefined ? '' : item.defaultAlarmAction,
                  alarmStatus: this.canSetTypes !== '' ? '' : item.defaultAlarmGroup === this.$t('yes') ? '2' : '1',
                })
              }
              this.ListData.push({
                canSetTypes: val.canSetTypes,
                id: this.flagEdit.edit ? val.id : '',
                type: item.type,
                subType: item.chirentype,
                startTime: val.timer[0],
                endTime: val.timer[1],
                alarmThreshol: val.alertValue === undefined ? '' : val.alertValue,
                alarmAction: this.canSetTypes !== '' ? '' : val.alertAction,
                alarmStatus: this.canSetTypes !== '' ? '' : val.alertradioAlarm === this.$t('yes') ? '2' : '1',
                warnThreshol: val.warningValue === undefined ? '' : val.warningValue,
                warnAction: this.canSetTypes !== '' ? '' : val.warningAction,
                warnStatus: this.canSetTypes !== '' ? '' : val.warningadioAlarm === this.$t('yes') ? '2' : '1',
              })
            })
          })
        } else {
          this.formIo.items.map(item => {
            item.chilren.itemc.map(val => {
              if (item.defaultwarnThresholList !== undefined) {
                this.ListData.push({
                  idList: this.flagEdit.edit ? val.idList : [0, 0],
                  type: this.formDynamicType,
                  subTypeList: [item.type.split(',')[0], item.type.split(',')[1]],
                  startTime: '',
                  endTime: '',
                  warnThresholList: item.defaultwarnThresholList === undefined ? [] : item.defaultwarnThresholList,
                  warnAction: 3,
                  warnCustomId: item.defaultwarnThresholType,
                  alarmAction: 3,
                  alarmCustomId: item.defaultalarmThresholType,
                  alarmThresholList: item.defaultalarmThresholList === undefined ? [] : item.defaultalarmThresholList,
                  alarmStatus: 2,
                  warnStatus: 2,
                })
              }
              this.ListData.push({
                idList: this.flagEdit.edit ? val.idList : [0, 0],
                type: this.formDynamicType,
                subTypeList: [item.type.split(',')[0], item.type.split(',')[1]],
                startTime: val.timer[0],
                endTime: val.timer[1],
                warnThresholList: val.warnThresholList,
                warnAction: 3,
                warnCustomId: val.warnThresholType,
                alarmAction: 3,
                alarmCustomId: val.alarmThresholType,
                alarmThresholList: val.alarmThresholList,
                alarmStatus: 2,
                warnStatus: 2,
              })
            })
          })
        }
      },
      handleAdd() {
        this.index++
        if (this.lineType === 1) {
          this.formDynamic.items.push({
            timeData: [],
            type: '',
            index: this.index,
            chirentype: '',
            collapse: [`${this.formDynamic.items.length}`],
            defaultWarningVal: '',
            defaultAlarmVal: '',
            chilren: {
              itemc: [
                {
                  showSpan: false,
                  type: '',
                  timer: [],
                  canSetTypes: '',
                  index: 0,
                  alertradioAlarm: this.$t('yes'),
                  warningadioAlarm: this.$t('yes'),
                  alertValue: '',
                  alertActionList: [
                    { value: '0', label: this.$t('nothing') },
                    { value: '1', label: this.$t('opening') },
                    { value: '2', label: this.$t('closing') },
                  ],
                  alertAction: '',
                  warningValue: '',
                  warningActionList: [
                    { value: '0', label: this.$t('nothing') },
                    { value: '1', label: this.$t('opening') },
                    { value: '2', label: this.$t('closing') },
                  ],
                  warningAction: '',
                },
              ],
            },
          })
        } else {
          this.formIo.items.push({
            timeData: [],
            type: '',
            index: 0,
            chirentype: '',
            collapse: [`${this.formIo.items.length}`],
            defaultwarnThresholList: ['', ''],
            defaultalarmThresholList: ['', ''],
            defaultwarnThresholType: '',
            defaultalarmThresholType: '',
            defaultalertTypeList: [],
            chilren: {
              itemc: [{ showSpan: false, type: '', timer: [], index: 0, warnThresholList: ['', ''], alarmThresholList: ['', ''], warnThresholType: '', alarmThresholType: '', alertTypeList: [] }],
            },
          })
        }

        this.initCanvas(this.index)
      },
      handleAddContent(index) {
        if (this.lineType === 1) {
          this.formDynamic.items[index].chilren.itemc.push({
            index: this.indexs,
            showSpan: false,
            type: '',
            timer: [],
            alertradioAlarm: this.$t('yes'),
            warningadioAlarm: this.$t('yes'),
            alertValue: '',
            alertActionList: [
              { value: '0', label: this.$t('nothing') },
              { value: '1', label: this.$t('opening') },
              { value: '2', label: this.$t('closing') },
            ],
            alertAction: '',
            warningValue: '',
            warningActionList: [
              { value: '0', label: this.$t('nothing') },
              { value: '1', label: this.$t('opening') },
              { value: '2', label: this.$t('closing') },
            ],
            warningAction: '',
          })
        } else {
          this.formIo.items[index].chilren.itemc.push({
            showSpan: false,
            type: '',
            timer: [],
            index: 0,
            warnThresholList: ['', ''],
            alarmThresholList: ['', ''],
            warnThresholType: '',
            alarmThresholType: '',
            alertTypeList: this.IoTypeList,
          })
        }
      },
      handleRemove(index, item) {
        if (this.lineType === 1) {
          if (this.flagEdit.edit) {
            if (this.formDynamic.items.length > 1) {
              const consID = []
              item.chilren.itemc.map(v => {
                if (v.id) {
                  consID.push(v.id)
                }
              })
              const arr = Array.isArray(consID) && consID.length > 0
              if (arr) {
                let params = { ids: consID.join(',') }
                handleThresholdDel(params).then(res => {
                  if (res.success) {
                    this.formDynamic.items.splice(index, 1)
                    this.$Message.success(this.$t('deleteSuccessful'))
                  }
                  if (consID.join(',') === '') {
                    this.$Message.error(this.$t('deleteFailed'))
                  }
                })
              }

              if (!arr) {
                this.$Message.success(this.$t('deleteSuccessful'))
                this.formDynamic.items.splice(index, 1)
              }
            } else {
              this.$Message.error(this.$t('periodInformationOnlySet'))
            }
          } else {
            if (this.formDynamic.items.length <= 1) {
              this.$Message.error(this.$t('periodInformationOnlySet'))
            } else {
              this.formDynamic.items.splice(index, 1)
              this.$Message.success(this.$t('deleteSuccessful'))
            }
          }
        } else {
          if (this.flagEdit.edit) {
            if (this.formIo.items.length > 1) {
              const consID = []
              item.chilren.itemc.map(v => {
                if (v.id) {
                  consID.push(v.id)
                }
              })
              const arr = Array.isArray(consID) && consID.length > 0
              if (arr) {
                handleThresholdDel({ ids: consID.join(',') }).then(res => {
                  if (res.success) {
                    this.formIo.items.splice(index, 1)
                    this.$Message.success(this.$t('deleteSuccessful'))
                  }
                  if (consID.join(',') === '') {
                    this.$Message.error(this.$t('deleteFailed'))
                  }
                })
              }
              if (!arr) {
                this.$Message.success(this.$t('deleteSuccessful'))
                this.formIo.items.splice(index, 1)
              }
            } else {
              this.$Message.error(this.$t('periodInformationOnlySet'))
              // this.formIo.items.splice(index, 1)
            }
          } else {
            if (this.formIo.items.length <= 1) {
              this.$Message.error(this.$t('periodInformationOnlySet'))
            } else {
              this.formIo.items.splice(index, 1)
              this.$Message.success(this.$t('deleteSuccessful'))
            }
          }
        }
      },
      handleRemoveContent(index, indexs, item) {
        if (this.lineType === 1) {
          if (this.flagEdit.edit) {
            if (this.formDynamic.items[index].chilren.itemc.length > 2) {
              if (item.id !== undefined) {
                handleThresholdDel({ ids: item.id }).then(res => {
                  if (res.success) {
                    this.canvansShow(index)
                    this.$Message.success(this.$t('deleteSuccessful'))
                    this.formDynamic.items[index].chilren.itemc.splice(indexs, 1)
                    this.canvansShow(index)
                  } else {
                    this.$Message.error(this.$t('deleteFailed'))
                  }
                })
              } else {
                this.$Message.success(this.$t('deleteSuccessful'))
                this.formDynamic.items[index].chilren.itemc.splice(indexs, 1)
              }
            } else {
              this.$Message.error(this.$t('periodInformationOnlyTime'))
            }
          } else {
            if (this.formDynamic.items[index].chilren.itemc.length <= 1) {
              this.$Message.error(this.$t('periodInformationOnlyTime'))
            } else {
              this.$Message.success(this.$t('deleteSuccessful'))
              this.formDynamic.items[index].chilren.itemc.splice(indexs, 1)
            }
          }
        } else {
          if (this.flagEdit.edit) {
            if (this.formIo.items[index].chilren.itemc.length > 2) {
              if (item.id !== undefined) {
                handleThresholdDel({ ids: item.id }).then(res => {
                  if (res.success) {
                    this.canvansShow(index)
                    this.$Message.success(this.$t('deleteSuccessful'))
                    this.formIo.items[index].chilren.itemc.splice(indexs, 1)
                    this.canvansShow(index)
                  } else {
                    this.$Message.error(this.$t('deleteFailed'))
                  }
                })
              } else {
                this.$Message.success(this.$t('deleteSuccessful'))
                this.formIo.items[index].chilren.itemc.splice(indexs, 1)
              }
            } else {
              this.$Message.error(this.$t('periodInformationOnlyTime'))
            }
          } else {
            if (this.formIo.items[index].chilren.itemc.length <= 1) {
              this.$Message.error(this.$t('periodInformationOnlyTime'))
            } else {
              this.$Message.success(this.$t('deleteSuccessful'))
              this.formIo.items[index].chilren.itemc.splice(indexs, 1)
            }
          }
        }
      },
      handleThresholdTypeList() {
        let params = { configId: this.flagEdit.edit === true ? this.flagEdit.configId : this.configId }
        thresholdTypeList4Time(params).then(res => {
          this.thresholdType = []
          if (res.success) {
            res.data.map(item => {
              this.formDynamicType = item.type
              if (this.lineType === 1) {
                this.thresholdType.push({ value: item.type, label: item.typeName, unit: item.unit })
                this.typeChild.push(item)
              } else {
                item.childs.map(val => {
                  this.thresholdType.push({ value: `${val.subTypeList}`, label: val.typeName, unit: val.unit })
                })
              }
            })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleTpyeList() {
        this.thresholdTypeChiren1 = []
        this.thresholdTypeChiren2 = []
        this.thresholdTypeChiren3 = []
        this.thresholdTypeChiren4 = []
        this.thresholdTypeChiren5 = []
        this.typeChild.map((val, ind) => {
          val.childs.map(item => {
            if (ind === 0) {
              this.thresholdTypeChiren1.push({ value: item.type, label: item.typeName })
            } else if (ind === 1) {
              this.thresholdTypeChiren2.push({ value: item.type, label: item.typeName })
            } else if (ind === 2) {
              this.thresholdTypeChiren3.push({ value: item.type, label: item.typeName })
            } else if (ind === 3) {
              this.thresholdTypeChiren4.push({ value: item.type, label: item.typeName })
            } else if (ind === 4) {
              this.thresholdTypeChiren5.push({ value: item.type, label: item.typeName })
            }
          })
        })
        this.thresholdTypeChiren6 = []
        this.typeChild[5].childs.forEach(item => {
          this.thresholdTypeChiren6.push({ value: item.type, label: item.typeName })
        })
      },
      transformTimerToNum(timer) {
        return timer.substr(0, 2) * 3600 + timer.substr(3) * 60
      },
      isIntersect(arr1, arr2) {
        let start = [Math.min(...arr1), Math.min(...arr2)] // 区间的两个最小值
        let end = [Math.max(...arr1), Math.max(...arr2)] // 区间的两个最大值
        return Math.max(...start) <= Math.min(...end) // 最大值里的最小值 $t('yes')$t('no') 小于等于 最大值的最小值
      },
      checkAllInRange(vals, valsResult) {
        let result = true
        vals.forEach(item => {
          if (this.isIntersect(item, valsResult)) {
            result = false
          }
        })
        return result
      },
      handleChange(val, index) {
        this.typeChild.map(item => {
          item.childs.map(vals => {
            if (val === vals.type) {
              this.formDynamic.items.map((val, ind) => {
                if (index === ind) {
                  val.chilren.itemc.map(items => {
                    items.canSetTypes = vals.canSetTypes
                  })
                }
              })
            }
          })
        })
      },
      timeCheckFunction(val, index, currIndex) {
        if (this.lineType === 1) {
          this.formDynamic.items[currIndex].chilren.itemc.map((item, index) => {
            if (item.timer[0] === '') {
              this.formDynamic.items[currIndex].chilren.itemc.splice(index, 1)
            }
          })
          const vals = this.formDynamic.items[currIndex].chilren.itemc.filter((v, i) => i !== index).map(v => v.timer.map(item => this.transformTimerToNum(item)))
          const valsResult = val.map(item => this.transformTimerToNum(item))
          const result = this.checkAllInRange(vals, valsResult)
          if (!result) {
            this.formDynamic.items[currIndex].chilren.itemc[index].showSpan = true
          } else {
            this.formDynamic.items[currIndex].chilren.itemc[index].showSpan = false
          }
        } else {
          this.formIo.items[currIndex].chilren.itemc.map((item, index) => {
            if (item.timer[0] === '') {
              this.formIo.items[currIndex].chilren.itemc.splice(index, 1)
            }
          })
          const vals = this.formIo.items[currIndex].chilren.itemc.filter((v, i) => i !== index).map(v => v.timer.map(item => this.transformTimerToNum(item)))
          const valsResult = val.map(item => this.transformTimerToNum(item))
          const result = this.checkAllInRange(vals, valsResult)
          if (!result) {
            this.formIo.items[currIndex].chilren.itemc[index].showSpan = true
          } else {
            this.formIo.items[currIndex].chilren.itemc[index].showSpan = false
          }
        }
        this.canvansShow(currIndex)
      },
      initCanvas(index) {
        if (this.lineType === 1) {
          this.formDynamic.items[index].timeData = new Array(1440).fill(2)
        } else {
          this.formIo.items[index].timeData = new Array(1440).fill(2)
        }
      },
      canvansShow(currIndex) {
        let timedatas = []
        this.allVal = []
        if (this.lineType === 1) {
          this.formDynamic.items[currIndex].chilren.itemc.map(v => {
            this.allVal.push(v.timer)
          })
        } else {
          this.formIo.items[currIndex].chilren.itemc.map(v => {
            this.allVal.push(v.timer)
          })
        }
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
        if (this.lineType === 1) {
          this.formDynamic.items[currIndex].timeData = timedatas
        } else {
          this.formIo.items[currIndex].timeData = timedatas
        }
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
    watch: {
      formDynamic: {
        handler(newVal, oldVal) {
          this.$nextTick(() => {
            this.handleTpyeList()
            this.formDynamic = newVal
          })
        },
        deep: true,
      },
    },
    computed: {},
  }
</script>
<style lang="less">
  .dynamic {
    .dynamicTips {
      padding: 6px;
      margin-bottom: 10px;
      border: 1px solid #999999;
      color: #999999;
    }
    .formdyn {
      background: #090f19;
      border-left: 2px solid #007eff;
      padding: 10px;
    }
    .mt-20 {
      margin-top: 20px;
    }
    .default_content {
      display: flex;
      width: 100%;
      justify-content: space-between;
      .default_period {
        color: #007eff;
        font-size: 16px;
        font-family: PingFang SC;
      }
    }

    .danger {
      height: 36px;
      background: rgba(224, 60, 58, 0.1);
      border: 1px solid #e03c3a;
      border-radius: 5px;
      color: #e03c3a;
    }
    .content {
      padding: 20px;
      margin-left: 20px;
      border: 1px solid #424b5f;
      border-radius: 5px;
      margin-bottom: 10px;
      .contentInput {
        position: relative;
        i {
          position: absolute;
          right: 5px;
        }
      }
    }
    .md-add {
      margin-left: 20px;
      .ivu-btn {
        background: rgba(0, 126, 255, 0.1);
        color: #007eff;
        border: 1px dotted #007eff;
      }
    }
    .del {
      font-size: 30px;
      color: #e03c3a;
    }
    .formEchats {
      margin: 0 auto;
      width: 350px;
      .conficontent {
        display: flex;
        justify-content: center;
        .configured {
          display: flex;
          align-items: center;
          .configuredColod {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #0dd667;
          }
          .noconfiguredColod {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #007eff;
          }
          .configuredSpan {
            font-size: 14px;
            color: #979b9b;
            margin: 0 10px;
          }
        }
      }
    }
    .formRight {
      position: relative;
      height: 36px;
      .formBtn {
        position: absolute;
        right: 30px;
      }
    }
    .ivu-collapse {
      border: none;
    }
    .ivu-theme-dark .ivu-collapse {
      background-color: #090f19;
      border-color: transparent;
    }
    .ivu-collapse > .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header {
      border-color: transparent;
    }
    .ivu-collapse {
      width: 100%;
      // background: #0d141f;
    }
    .ivu-collapse-content {
      background: #090f19;
    }
    .ivu-collapse-header {
      display: flex;
      align-items: center;
    }
    .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header > i {
      margin-right: 0;
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
