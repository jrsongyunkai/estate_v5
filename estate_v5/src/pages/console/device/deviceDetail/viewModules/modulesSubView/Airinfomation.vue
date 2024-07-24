<template>
  <div class="aircondition">
    <div class="airconditionHeader">
      <div class="left">
        <div class="bor"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
      </div>
      <div class="right">
        <div class="mode">
          <Button class="automatic" :class="{ active: isActive === 1 }" @click="SelectmodeType(1)">{{ $t('automaticMode') }}</Button>
          <Button class="hand" :class="{ active: isActive === 0 }" @click="SelectmodeType(0)">{{ $t('manualMode') }}</Button>
        </div>
        <div>
          <Button class="detailsBtn ml-10" type="primary" ghost custom-icon="icon-v5 icon-v5-s-operation" @click="openOperation"></Button>
          <Poptip placement="bottom-start" width="270" :transfer="true" :word-wrap="true" :title="$t('remoteControlCommand')" v-model="visible">
            <Button class="detailsBtn ml-10" type="primary" ghost @click="getqueryCmdLearn" custom-icon="icon-v5 icon-v5-yaokongqi"></Button>
            <div class="airpoptipContent" slot="content">
              <div class="list">
                <Button class="poptipButon" v-for="(item, index) in poptipButon" :key="index" @click="queryconfigAndOperate(`sendCmdChn${item.channel}`)">{{ item.cmdName }}</Button>
              </div>
              <div class="footer">
                <Button class="poptipButon" style="width: 100%; margin-top: 10px" @click="openStudyModal">{{ $t('remoteControlCommandLearning') }}</Button>
              </div>
            </div>
          </Poptip>
          <Button class="detailsBtn ml-10" type="primary" ghost @click="openEnableModal" custom-icon="icon-v5 icon-v5-jubao"></Button>
          <Button class="detailsBtn ml-10" type="primary" ghost @click="openConfigModal" custom-icon="icon-v5 icon-v5-yunyunhang"></Button>
          <Button class="detailsBtn ml-10" type="primary" ghost @click="handlerefresh" icon="md-refresh alarm-threshold-refresh"></Button>
        </div>
      </div>
    </div>
    <Row class="parameters">
      <Form :label-width="120">
        <FormItem :label="$t('indoorTemperature') + ':'">
          <div class="formInfo">
            <span>{{ `${findReal.tmp === undefined ? '-' : findReal.tmp}°C` }}</span>
            <span class="ml-10">{{ `(${findReal.tmpDeVa === undefined ? '-' : findReal.tmpDeVa})` }}</span>
            <span class="ml-10" :class="findReal.tmpStatus === 0 ? 'normal status' : findReal.tmpStatus === 1 ? 'heating tmpStatus' : 'refrigeration tmpStatus'">{{ findReal.tmpStatus === 0 ? $t('normal') : findReal.tmpStatus === 1 ? $t('excessiveTemperature') : $t('lowTemperature') }}</span>
            <i class="icon-v5 icon-v5-miaozhun_aiming" @click="handleTemhum('temperature')"></i>
          </div>
        </FormItem>
        <FormItem :label="$t('indoorHumidity') + ':'">
          <div class="formInfo">
            <span>{{ `${findReal.hum === undefined ? '-' : findReal.hum}%` }}</span>
            <span class="ml-10">{{ `(${findReal.humDeVa === undefined ? '-' : findReal.humDeVa})` }}</span>
            <i class="icon-v5 icon-v5-miaozhun_aiming" @click="handleTemhum('humidity')"></i>
          </div>
        </FormItem>
        <FormItem :label="$t('incomingCallActivation') + ':'">
          <span>{{ findReal.powerOnStartupEnable ? $t('open') : $t('close') }}</span>
        </FormItem>
        <FormItem :label="$t('alarmOutputStatus') + ':'">
          <div class="status" :class="findReal.buzzerOrRelayAlarmOutputState ? 'heating' : 'normal'">{{ findReal.buzzerOrRelayAlarmOutputState ? $t('alarm') : $t('normal') }}</div>
        </FormItem>
      </Form>
      <Form :label-width="120" v-for="(item, index) in findReal.runStatuses" :key="index">
        <FormItem :label="`${$t('airConditioning')}${findReal.runStatuses.length === 1 ? '' : item.air}${$t('state')}:`">
          <div class="status" :class="item.runStatus === 0 ? 'cease' : item.runStatus === 1 ? 'refrigeration' : item.runStatus === 2 ? 'heating' : 'unusual'">
            {{ item.runStatus === 0 ? $t('stop') : item.runStatus === 1 ? $t('refrigeration') : item.runStatus === 2 ? $t('Heating') : $t('unknown2') }}
          </div>
        </FormItem>
        <FormItem :label="$t('onOffState') + ':'">
          <div class="status" :class="item.powerOffStatus ? 'normal' : 'unusual'">{{ item.powerOffStatus ? $t('normal') : $t('abnormal') }}</div>
        </FormItem>
        <FormItem :label="$t('currentValue') + ':'">
          <span>{{ `${item.cur}A` }}</span>
        </FormItem>
      </Form>
    </Row>
    <Modal v-model="temHumShow" :title="temHumModalTitle" @on-ok="handletemHumcalibration">
      <Form>
        <FormItem :label="$t('calibrationDifference') + temHumUnit">
          <InputNumber v-model="calibrationValue" style="width: 240px" :formatter="value => (value ? `${Math.sign(value) === 1 ? '+' : ''}${parseFloat(Math.floor(value * 10) / 10)}` : 0)"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
    <Modal :title="$t('parameterConfiguration')" v-model="parmsModal" width="800">
      <Row :gutter="10">
        <Col :span="7" class="text-class" style="margin-left: 10px; padding-top: 5px">{{ $t('displayAirConditioning') }}：</Col>
        <Col>
          <Select v-model="airOnes" multiple style="width: 200px; margin-left: -8px">
            <Option v-for="(item, index) in custuomAirMachich" :key="index" :value="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
      </Row>
      <Row style="margin: 20px 0" :gutter="10">
        <Col :span="7" class="text-class" style="padding-top: 5px">{{ $t('temperatureAlarmUpperLimit') + '(℃):' }}</Col>
        <Col :span="16">
          <div>
            <InputNumber :placeholder="$t('pleaseEnter')" v-model="upFlow" style="width: 200px" :formatter="value => (value ? parseFloat(Math.floor(value * 10) / 10) : 0)"></InputNumber>
          </div>
        </Col>
      </Row>
      <Row style="margin: 20px 0" :gutter="10">
        <Col :span="7" class="text-class" style="padding-top: 5px">{{ $t('lowerLimitTemperatureAlarm') + '(℃):' }}</Col>
        <Col :span="16">
          <div>
            <InputNumber :placeholder="$t('pleaseEnter')" v-model="downFlow" style="width: 200px" :formatter="value => (value ? parseFloat(Math.floor(value * 10) / 10) : 0)"></InputNumber>
            <!-- :parser="value => value.replace('%', '')"  @on-blur="toSaveOneNum(downFlow,'downFlow')" -->
          </div>
        </Col>
      </Row>
      <Row :gutter="10" style="margin: 20px 0">
        <Col :span="7" class="text-class" style="padding-top: 5px">{{ $t('airConditioningCurrentValve') + '(A):' }}</Col>
        <Col :span="16">
          <InputNumber :placeholder="$t('pleaseEnter')" v-model="maFlow" style="width: 200px"></InputNumber>
        </Col>
      </Row>
      <Row :gutter="10">
        <Col :span="7" class="text-class">{{ $t('inComingCallSelfStart') + ':' }}</Col>
        <Col :span="16">
          <Switch v-model="switchAir" />
          <TooltipVue style="display: inline-block; margin-left: -5px" :tooltipText="tooltipTexttwo"></TooltipVue>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="saveParmsModal">{{ $t('save') }}</Button>
        <Button type="default" @click="parmsModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('enablePositionSetting')" v-model="enableModal" width="800">
      <div class="tool-Tips">
        <Icon type="md-text" class="mesg-tip" style="margin-top: 5px" />
        <span>{{ $t('commedTips1') }}</span>
        <div style="margin-top: 15px; margin-left: 55px">{{ $t('commedTips2') }}</div>
      </div>
      <Row>
        <Col :span="6" style="margin-top: 30px">
          <span style="border: 1px dashed #999999; padding: 15px">
            <Checkbox v-model="checkAlls" :indeterminate="isDeter" @on-change="getAllcheck">{{ $t('selectAll') }}</Checkbox>
          </span>
        </Col>
        <Col :span="18">
          <Row style="margin-top: 10px">
            <Col v-for="(item, index) in airConditionAlarm" :key="index" :span="12" style="margin: 5px 0">
              <Checkbox v-model="item.value" :true-value="1" :false-value="0" @on-change="getIsAllcheck">{{ item.label }}</Checkbox>
            </Col>
          </Row>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="saveEnableModal">{{ $t('save') }}</Button>
        <Button type="default" @click="enableModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('automaticRunConfiguration')" v-model="configModal" width="800">
      <div class="tool-Tips" style="margin-bottom: 30px">
        <Icon type="md-text" class="mesg-tip" />
        <span>{{ $t('configurationOnlyEffectAutomaticMode') }}</span>
      </div>
      <Row :gutter="10" style="margin: 15px 0">
        <Col :span="5" class="text-cla" style="padding-top: 5px">
          <span>{{ $t('automaticTemperatureControl') + ' (℃):' }}</span>
        </Col>
        <Col>
          <InputNumber :placeholder="$t('pleaseEnter')" v-model="techTmpCtrH" style="width: 200px"></InputNumber>
          <span style="margin: 0 10px">{{ $t('to') }}</span>
          <InputNumber :placeholder="$t('pleaseEnter')" v-model="techTmpCtrL" style="width: 200px"></InputNumber>
        </Col>
      </Row>
      <Row :gutter="10" style="margin: 25px 0">
        <Col :span="5" class="text-cla" style="padding-top: 5px">
          <span>{{ $t('automaticTemperatureReturnDifference') + ' (℃):' }}</span>
        </Col>
        <Col>
          <InputNumber :placeholder="$t('pleaseEnter')" v-model="techTmpReDi" style="width: 200px"></InputNumber>
        </Col>
      </Row>
      <Row :gutter="10" :style="{ margin: modeActive === 0 ? ' 15px 0 25px 0' : ' 15px 0' }">
        <Col :span="5" class="text-cla" style="padding-top: 5px">{{ $t('runingMode') + ':' }}</Col>
        <Col>
          <Button :class="modeActive === 0 ? 'isSeactive' : 'gray-Button'" @click="modeActive = 0">{{ $t('timedOperation') }}</Button>
          <Button :class="modeActive === 1 ? 'isSeactive' : 'gray-Button'" @click="modeActive = 1">{{ $t('dualMachineSwitching') }}</Button>
        </Col>
      </Row>
      <Row v-show="modeActive === 0">
        <Col :span="12">
          <div style="margin-bottom: 10px; padding-bottom: 7px; margin-left: 20px; display: flex; border-bottom: 1px solid #3d3d41">
            <div class="bor" style="margin-top: 3px"></div>
            <h4>{{ $t('airConditioningOperatingPeriodOne') }}</h4>
          </div>
          <div v-for="(item, index) in OperationList" :key="index" style="padding: 10px 30px">
            <span>{{ $t('timeSpan') }}{{ index + 1 }}：</span>
            <TimePicker v-model="item.value" format="HH:mm" :placeholder="$t('selectTimePeriod')" type="timerange" :separator="$t('to')" style="width: 200px"></TimePicker>
          </div>
        </Col>
        <Col :span="12">
          <div style="margin-bottom: 10px; padding-bottom: 7px; margin-left: 20px; display: flex; border-bottom: 1px solid #3d3d41">
            <div class="bor" style="margin-top: 3px"></div>
            <h4>{{ $t('airConditioningOperatingPeriodTwo') }}</h4>
          </div>
          <div v-for="(item, index) in OperationTimeList" :key="index" style="padding: 10px 30px">
            <span>{{ $t('timeSpan') }}{{ index + 1 }}：</span>
            <TimePicker v-model="item.value" format="HH:mm" :placeholder="$t('selectTimePeriod')" type="timerange" :separator="$t('to')" style="width: 200px"></TimePicker>
          </div>
        </Col>
      </Row>
      <Row v-show="modeActive === 1" :gutter="10" style="margin: 20px 0">
        <Col :span="5" class="text-cla" style="margin-top: 5px">{{ $t('switchingTimeMinutes') + ':' }}</Col>
        <Col :span="18">
          <InputNumber :placeholder="$t('pleaseEnter')" v-model="mintiesTime" style="width: 200px"></InputNumber>
        </Col>
      </Row>
      <Row v-show="modeActive === 1" :gutter="10">
        <Col :span="5" class="text-cla">{{ $t('firstStartAirConditioning') + ':' }}</Col>
        <Col>
          <RadioGroup v-model="disabledGroup">
            <Radio label="one">{{ $t('airConditioning') }}1</Radio>
            <Radio label="two" disabled>{{ $t('airConditioning') }}2</Radio>
          </RadioGroup>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="saveconfigModal">{{ $t('save') }}</Button>
        <Button type="default" @click="configModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal :title="$t('remoteControlCommandLearning')" v-model="studyModal" width="1305" :mask-closable="false" @on-visible-change="getModalVisble">
      <div style="margin-bottom: 10px; margin-left: 20px; padding-bottom: 10px; display: flex; border-bottom: 1px solid #3d3d41">
        <div class="bor" style="margin-top: 3px"></div>
        <h4>{{ $t('defaultCommand') }}</h4>
      </div>
      <Row style="margin: 18px">
        <Col :span="6" v-for="(item, index) in defaultInstructionsList" :key="index">
          <Row>
            <Col :span="6" style="padding-top: 5px">{{ item.channelName }}：</Col>
            <Col :span="18" style="position: relative">
              <span @mouseenter="getShowStudyStaus(item, item.channel)" @mouseleave="getNoShow(item)">
                <Input v-model="item.cmdName" readonly style="width: 200px"></Input>
              </span>
              <div v-if="item.onOrOff" style="position: absolute; right: 40px; top: 5px">
                <span v-if="item.startStudy" @click="studyInstructStart(item, 'defaults', 'start')" style="color: #1963b0" class="pointer">{{ $t('startStudy') }}</span>
                <span v-if="item.iSsued" style="color: #1963b0">
                  <span style="position: absolute; top: -3px; left: -15px">
                    <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="12" />
                  </span>
                  <span>{{ $t('underDistribution') }}</span>
                </span>
                <span v-if="item.studyShowcount" style="color: #1963b0">{{ $t('countdownLearning') }}：{{ countNum }}</span>
                <span v-if="item.againStudy" style="color: #d58342" class="pointer" @click="studyInstructStart(item, 'defaults', 'again')">{{ $t('relearn') }}</span>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <div class="header" style="margin-bottom: 10px; padding-bottom: 10px; margin-left: 20px; display: flex; border-bottom: 1px solid #3d3d41">
        <div class="bor" style="margin-top: 3px"></div>
        <h4>{{ $t('customCommand') }}</h4>
      </div>
      <Row style="margin-left: 20px">
        <Col v-for="(item, index) in customInstructionList" :key="index" :span="6" style="margin: 10px 0; position: relative">
          <span>{{ item.channelName }}:</span>
          <span @mouseenter="getShowStudyStaus(item, item.channel)" @mouseleave="getNoShow(item)" style="margin-left: 5px">
            <Input v-model="item.cmdName" style="width: 220px" :placeholder="$t('enterCommandName')"></Input>
          </span>
          <div v-if="item.onOrOff" style="position: absolute; right: 50px; top: 5px">
            <span v-if="item.startStudy" class="pointer" style="color: #1963b0" @click="studyInstructStart(item, 'customs', 'start')">{{ $t('startStudy') }}</span>
            <span v-if="item.iSsued" style="color: #1963b0">
              <span style="position: absolute; top: -3px; left: -15px">
                <Icon custom="icon-v5 icon-v5-loading-full" class="ivu-anim-loop" size="12" />
              </span>
              <span>{{ $t('underDistribution') }}</span>
            </span>
            <span v-if="item.studyShowcount" style="color: #1963b0">{{ $t('countdownLearning') }}：{{ countNum }}</span>
            <span v-if="item.againStudy" class="pointer" style="color: #d58342" @click="studyInstructStart(item, 'customs', 'again')">{{ $t('relearn') }}</span>
          </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="saveStudyModal">{{ $t('save') }}</Button>
        <Button type="default" @click="closeModal">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import store from '@/store'
  import {
    configAndOperate,
    findRealParam,
    getCmdStudyStatus,
    findParamConfigure, // 查找参数配置接口
    queryCmdLearn, // 查询指令学习
    findAlarmEnable, // 查找报警使能
    findAutoRunConfigure, // 查找自动运行配置
  } from '@/api/public'
  export default {
    props: {
      param: { type: Object, default: () => {} },
    },
    data() {
      return {
        setOne: null,
        timers: null,
        visible: false,
        configAddrs: '',
        enableAddr: '',
        addrParams: '',
        countNum: 20,
        defaultInstructionsList: [{}],
        customInstructionList: [],
        studyModal: false,
        mintiesTime: 0,
        disabledGroup: 'one',
        configModal: false,
        techTmpReDi: 0,
        OperationList: [
          { type: 'setAir1Rp1', value: '' },
          { type: 'setAir1Rp2', value: '' },
          { type: 'setAir1Rp3', value: '' },
          { type: 'setAir1Rp4', value: '' },
        ],
        OperationTimeList: [
          { type: 'setAir2Rp1', value: '' },
          { type: 'setAir2Rp2', value: '' },
          { type: 'setAir2Rp3', value: '' },
          { type: 'setAir2Rp4', value: '' },
        ],
        techTmpCtrH: 0,
        techTmpCtrL: 0,
        modeActive: 0,
        checkAlls: false,
        airConditionAlarm: [
          { value: 0, type: 'enableTmpAlmH', label: this.$t('temperatureUpperLimitAlarm') },
          { value: 0, type: 'enableTmpAlmL', label: this.$t('lowTemperatureLimitAlarm') },
          { value: 0, type: 'enableAir1PowerOnFailure', label: this.$t('airConditioningCircuitFailureAlarmOne') },
          { value: 0, type: 'enableAir2PowerOnFailure', label: this.$t('airConditioningCircuitFailureAlarmTwo') },
        ],
        enableModal: false,
        tooltipTexttwo: this.$t('airTips1'),
        upFlow: 0,
        downFlow: 0,
        maFlow: 0,
        airOnes: [],
        parmsModal: false,
        custuomAirMachich: [
          { value: '1', label: this.$t('airConditioning') + '1' },
          { value: '2', label: this.$t('airConditioning') + '2' },
        ],
        switchAir: false,
        temHumUnit: '',
        calibrationValue: 0,
        poptipButon: [],
        isActive: 1,
        temHumShow: false,
        temHumModalTitle: '',
        findReal: [],
      }
    },
    computed: {
      isDeter() {
        let alarmLength = this.airConditionAlarm.filter(item => item.value === 1).length
        let isDeter = alarmLength !== 0 && alarmLength !== this.airConditionAlarm.length
        return isDeter
      },
      checkAllCpt() {
        let arrLength = this.airConditionAlarm.filter(item => item.value === 1).length
        return arrLength === this.airConditionAlarm.length && arrLength > 0
      },
    },

    methods: {
      toSaveOneNum(val, type) {
        if (type === 'upFlow') {
          this.upFlow = +val.toFixed(1)
        } else if (type === 'downFlow') {
          this.downFlow = +val.toFixed(1)
        }
      },
      getModalVisble(val) {
        if (!val) {
          clearInterval(this.timers)
        }
      },
      closeModal() {
        this.studyModal = false
        clearInterval(this.timers)
      },
      queryconfigAndOperate(type) {
        let list = [{ type: type, value: 0 }]
        let params = { deviceId: this.param.mac, list: JSON.stringify(list) }
        if (this.isActive === 1) {
          this.$Modal.confirm({
            render: h => {
              return h('div', {}, [
                [
                  h('Icon', {
                    props: { custom: 'icon-v5 icon-v5-weiwancheng' },
                    style: { fontSize: '20px', color: 'red', marginRight: '10px' },
                  }),
                  h('span', { style: { fontSize: '16px' } }, this.$t('commandTips2')),
                ],
              ])
            },
            onOk: () => {
              this.configOperate(params)
            },
          })
        } else {
          this.configOperate(params)
        }
      },
      SelectmodeType(v) {
        this.isActive = v
        store.commit('airmode', this.isActive)
        let list = [{ type: 'setControlMode', value: String(v) }]
        let params = { deviceId: this.param.mac, list: JSON.stringify(list) }
        this.configOperate(params)
      },
      async handlefindRealParam() {
        let params = { projectCode: this.$store.state.projectCode, mac: this.param.mac }
        const res = await findRealParam(params)
        if (res.success) {
          this.findReal = res.data
          this.isActive = res.data.autoMode
          let arr = this.findReal.showAir.split(',')
          let newArr = []
          this.findReal.runStatuses.forEach((item, index) => {
            arr.map(val => {
              if (val === String(item.air)) {
                newArr.push(item)
              }
            })
          })
          this.findReal.runStatuses = newArr
          store.commit('airAddr', this.findReal.addr)
          store.commit('airMac', this.findReal.realMac)
          store.commit('airmode', this.isActive)
          store.commit('showAir', this.findReal.showAir)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getShowStudyStaus(val, sortNum) {
        let isShowStatus = 1
        let allArr = this.defaultInstructionsList.concat(this.customInstructionList)
        allArr.forEach(item => {
          if (item.iSsued || item.studyShowcount) {
            isShowStatus++
          }
        })
        if (isShowStatus > 1) {
          return
        }
        this.defaultInstructionsList.forEach(item => {
          if (item.channel !== sortNum) {
            item.onOrOff = false
          }
        })
        this.customInstructionList.forEach(item => {
          if (item.channel !== sortNum) {
            item.onOrOff = false
          }
        })
        val.onOrOff = true
        if (val.status === 0 || val.status === 9) {
          val.startStudy = true
          val.againStudy = false
        } else if (val.status === 2) {
          val.againStudy = true
          val.startStudy = false
        }
      },
      getNoShow(val) {},
      studyInstructStart(val, types, startOragain) {
        let list
        if (types === 'defaults') {
          list = [{ type: `studyCmdChn${val.channel}`, value: 0 }]
        } else if (types === 'customs') {
          list = [
            { type: `studyCmdChn${val.channel}`, value: 0 },
            { type: `setTitleChn${val.channel}`, value: val.cmdName },
          ]
        }
        let parmas = { deviceId: this.param.mac, list: JSON.stringify(list) }
        if (startOragain === 'again') {
          val.againStudy = false
        } else if (startOragain === 'start') {
          val.startStudy = false
        }
        val.iSsued = true
        this.countNum = 20
        this.setOne = null
        configAndOperate(parmas).then(res => {
          if (res.success) {
            if (this.timers) clearInterval(this.timers)
            this.timers = setInterval(() => {
              getCmdStudyStatus({ deviceId: this.param.mac, chns: val.channel })
                .then(res => {
                  if (res.success) {
                    if (res.data[0].status === 1) {
                      val.iSsued = false
                      val.studyShowcount = true
                      if (!this.setOne) {
                        this.setOne = setInterval(() => {
                          this.countNum--
                          if (this.countNum <= 0) {
                            clearInterval(this.setOne)
                          }
                        }, 1000)
                      }
                    }
                    if (res.data[0].status === 2) {
                      // 学习成功
                      val.iSsued = false
                      val.studyShowcount = false
                      val.startStudy = false
                      this.$Message.success({ content: res.message })
                      val.againStudy = true
                      clearInterval(this.setOne)
                      clearInterval(this.timers)
                    }
                    if (res.data[0].status === 9) {
                      // 学习失败
                      val.iSsued = false
                      val.studyShowcount = false
                      this.$Message.error({ content: this.$t('learningFailure') })
                      if (startOragain === 'start') {
                        val.startStudy = true
                      } else {
                        val.startStudy = false
                        val.againStudy = true
                      }
                      clearInterval(this.setOne)
                      clearInterval(this.timers)
                    }
                  } else {
                    this.$Message.error({ content: res.message })
                  }
                })
                .catch(() => {
                  val.iSsued = false
                  if (startOragain === 'again') {
                    val.againStudy = true
                  } else if (startOragain === 'start') {
                    val.startStudy = true
                  }
                  clearInterval(this.timers)
                })
            }, 3000)
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      openStudyModal() {
        this.visible = false
        let params = { projectCode: this.$store.state.projectCode, mac: this.param.mac }
        queryCmdLearn(params)
          .then(res => {
            if (res.success) {
              let defaultArr = res.data
                .filter(item => item.default)
                .map((item, index) => ({
                  ...item,
                  onOrOff: false,
                  startStudy: false, // (item.status === 0) || (item.status === 9),
                  iSsued: false,
                  studyShowcount: false,
                  count: 20,
                  againStudy: false, // item.status === 2
                }))
              let customArr = res.data
                .filter(item => !item.default)
                .map((item, index) => ({
                  ...item,
                  onOrOff: false,
                  startStudy: false, // (item.status === 0) || (item.status === 9),
                  iSsued: false,
                  studyShowcount: false,
                  count: 20,
                  againStudy: false, // item.status === 2
                }))
              this.customInstructionList = customArr
              this.defaultInstructionsList = defaultArr
            } else {
              this.$Message.error({ content: res.message })
            }
          })
          .finally(() => {
            getCmdStudyStatus({ deviceId: this.param.mac, chns: '' }).then(res => {
              if (res.success) {
                let dataArr = res.data
                dataArr.forEach(item => {
                  this.customInstructionList.forEach(v => {
                    if (v.channel === item.chn) {
                      v.startStudy = item.status === 0 || item.status === 9
                      v.againStudy = item.status === 2
                    }
                  })
                  this.defaultInstructionsList.forEach(v => {
                    if (v.channel === item.chn) {
                      v.startStudy = item.status === 0 || item.status === 9
                      v.againStudy = item.status === 2
                    }
                  })
                })
                this.studyModal = true
              } else {
                this.$Message.error({ content: res.message })
              }
            })
          })
      },
      saveStudyModal() {
        let concatArr = this.defaultInstructionsList.concat(this.customInstructionList)
        let listArr = concatArr.map(item => ({ type: `setTitleChn${item.channel}`, value: item.cmdName }))
        let params = {
          deviceId: this.param.mac,
          list: JSON.stringify(listArr),
        }
        this.configOperate(params)
        this.studyModal = false
        this.getqueryCmdLearn()
      },
      handlerefresh() {
        this.handlefindRealParam()
        this.$emit('refresh')
      },
      openConfigModal() {
        findAutoRunConfigure({
          projectCode: this.$store.state.projectCode,
          mac: this.param.mac,
        }).then(res => {
          if (res.success) {
            this.configAddrs = res.data.addr
            this.techTmpCtrH = res.data.tmpCtrH
            this.techTmpCtrL = res.data.tmpCtrL
            this.techTmpReDi = res.data.tmpReDi
            this.modeActive = res.data.doubleSwitchEnable ? 1 : 0
            this.mintiesTime = res.data.swiDur || 0
            if (this.modeActive === 0) {
              let arrValue = res.data.runPeriods
                .filter((v, index) => index < 4)
                .map(j => ({ value: [j.startTime, j.endTime] }))
                .map(t => t.value)
              this.OperationList.forEach((item, i) => {
                item.value = arrValue[i]
              })
              let arrTwoValue = res.data.runPeriods
                .filter((v, index) => index > 3)
                .map(j => ({ value: [j.startTime, j.endTime] }))
                .map(t => t.value)
              this.OperationTimeList.forEach((item, i) => {
                item.value = arrTwoValue[i]
              })
            }
            this.configModal = true
          } else {
            this.$Message.console.error({ content: res.message })
          }
        })
      },
      saveconfigModal() {
        let newArr
        let temArr = [
          { type: 'enableSwitchEnable', value: this.modeActive },
          { type: 'setTmpCtrH', value: this.techTmpCtrH },
          { type: 'setTmpCtrL', value: this.techTmpCtrL },
          { type: 'setTmpReDi', value: this.techTmpReDi },
        ]
        if (this.modeActive === 0) {
          this.OperationList.forEach(item => {
            item.value[0] = item.value[0].substr(0, 5)
          })
          this.OperationTimeList.forEach(item => {
            item.value[0] = item.value[0].substr(0, 5)
          })
          newArr = this.OperationList.concat(this.OperationTimeList).map(item => ({ type: item.type, value: item.value ? item.value.join(',').replace(':', '').replace(':', '').replace(',', '') : '' }))
        } else if (this.modeActive === 1) {
          newArr = [{ type: 'setSwiDur', value: this.mintiesTime }]
        }
        let params = {
          deviceId: this.param.mac,
          // addr: this.configAddrs,
          list: JSON.stringify(newArr.concat(temArr)),
        }

        configAndOperate(params).then(res => {
          if (res.success) {
            this.$Message.success({ content: res.message })
            this.configModal = false
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      openOperation() {
        findParamConfigure({
          projectCode: this.$store.state.projectCode,
          mac: this.param.mac,
        }).then(res => {
          if (res.success) {
            this.parmsModal = true
            this.airOnes = (res.data.showAir && res.data.showAir.split(',')) || [...res.data.showAir]
            this.upFlow = res.data.tmpAlmH || ''
            this.downFlow = res.data.tmpAlmL || ''
            this.maFlow = res.data.curReDi || null
            this.addrParams = res.data.addr || null
            this.switchAir = res.data.powerOnStartupEnable || null
            // 还有一个来电自启回显
          } else {
            this.$Message.console.error({ content: res.message })
          }
        })
      },
      configOperate(params) {
        configAndOperate(params).then(res => {
          if (res.success) {
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      getAllcheck(val) {
        this.airConditionAlarm.forEach(item => {
          item.value = val ? 1 : 0
        })
      },
      getqueryCmdLearn() {
        let params = {
          projectCode: this.$store.state.projectCode,
          mac: this.param.mac,
        }
        queryCmdLearn(params).then(res => {
          this.poptipButon = []
          res.data.map(val => {
            if (val.cmdName !== '' && val.channel !== 21 && val.channel !== 22 && val.channel !== 23 && val.studyStatus === 2) {
              this.poptipButon.push(val)
            }
          })
        })
      },
      getIsAllcheck() {
        let arrLength = this.airConditionAlarm.filter(item => item.value === 1).length
        this.checkAlls = arrLength === this.airConditionAlarm.length && !this.isDeter
      },
      saveEnableModal() {
        let params = {
          deviceId: this.param.mac,
          // addr: this.enableAddr,
          list: JSON.stringify(this.airConditionAlarm.map(item => ({ type: item.type, value: item.value }))),
        }

        this.configOperate(params)
        this.enableModal = false
      },
      saveParmsModal() {
        let list = [
          { type: 'setShowAir', value: this.airOnes.join(',') },
          { type: 'setTmpAlmH', value: this.upFlow },
          { type: 'setTmpAlmL', value: this.downFlow },
          { type: 'setCurReDi', value: this.maFlow },
          { type: 'enablePowerOnStartup', value: this.switchAir ? 1 : 0 },
        ]
        let params = {
          deviceId: this.param.mac,
          // addr: this.addrParams,
          list: JSON.stringify(list),
        }

        this.configOperate(params)
        this.parmsModal = false
        this.handlefindRealParam()
        this.$emit('refresh')
      },
      openEnableModal() {
        findAlarmEnable({
          projectCode: this.$store.state.projectCode,
          mac: this.param.mac,
        }).then(res => {
          if (res.success) {
            this.airConditionAlarm[0].value = res.data.tmpAlarmHEnable ? 1 : 0
            this.airConditionAlarm[1].value = res.data.tmpAlarmLEnable ? 1 : 0
            this.airConditionAlarm[2].value = res.data.air1PowerOnFailureEnable ? 1 : 0
            this.airConditionAlarm[3].value = res.data.air2PowerOnFailureEnable ? 1 : 0
            this.enableAddr = res.data.addr
            this.enableModal = true
          } else {
            this.$Message.console.error({
              content: res.message,
            })
          }
        })
      },

      handleTemhum(type) {
        this.temHumShow = true
        if (type === 'temperature') {
          this.temHumModalTitle = this.$t('temperatureCalibration')
          this.temHumUnit = '(°C)'
          this.calibrationValue = this.findReal.tmpDeVa
        } else {
          this.temHumModalTitle = this.$t('humidityCalibration')
          this.temHumUnit = '(%)'
          this.calibrationValue = this.findReal.humDeVa
        }
      },
      handletemHumcalibration() {
        let list = [{}]
        if (this.temHumModalTitle === this.$t('temperatureCalibration')) {
          list[0].type = 'setTmpDeVa'
        } else {
          list[0].type = 'setHumDeVa'
        }

        list[0].value = this.calibrationValue
        let params = {
          deviceId: this.param.mac,
          list: JSON.stringify(list),
        }
        this.configOperate(params)
      },
    },
    mounted() {
      this.handlefindRealParam()
    },
  }
</script>
<style lang="less">
  .gray-Button {
    color: #999999 !important;
    border: 1px solid #999999 !important;
    background: rgb(39, 45, 57) !important;
  }
  .isSeactive {
    color: #056dd8 !important;
    border: 1px solid #056dd8 !important;
    background: rgb(21, 51, 88) !important;
  }
  .text-class {
    text-align: right;
  }
  .text-cla {
    text-align: right;
  }
  .tool-Tips {
    margin: 15px;
    background: rgba(153, 153, 153, 0.05);
    color: #999999;
    border: 1px solid #888b92;
    padding: 10px 10px;
  }
  .aircondition {
    .airconditionHeader {
      height: 43px;
      border-bottom: 1px solid #5e626c;
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      .title {
        font-size: 16px;
        font-weight: 400;
      }
      .left {
        display: flex;
        align-items: center;
      }
      .right {
        display: flex;
        .mode {
          display: flex;
          margin-right: 5px;
          Button {
            color: #999999 !important;
            background: rgba(153, 153, 153, 0.1);
            border: 1px solid #999999;
          }
          .automatic {
            border-radius: 5px 0px 0px 5px;
          }
          .hand {
            border-radius: 0px 5px 5px 0px;
          }
          .active {
            background: rgba(0, 126, 255, 0.2);
            border: 1px solid #007eff;
            color: #007eff !important;
          }
        }
      }
    }
    .parameters {
      padding: 20px;
      .ivu-form-item {
        margin-bottom: 5px;
      }
      .formInfo {
        display: flex;
        .icon-v5 {
          margin-left: 10px;
          margin-top: 1px;
          font-size: 14px;
          color: #007eff;
        }
      }
      .tmpStatus {
        min-width: 58px;
        height: 20px;
        border-radius: 4px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        margin-top: 6px;
      }
      .status {
        width: 36px;
        height: 20px;
        border-radius: 4px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        margin-top: 6px;
      }
      .normal {
        background: rgba(13, 214, 103, 0.2);
        color: #0dd667;
      }
      .unusual {
        background: rgba(255, 168, 84, 0.2);
        color: #ffa854;
      }
      .cease {
        background: rgba(153, 153, 153, 0.2);
        color: #999999;
      }
      .refrigeration {
        background: rgba(0, 126, 255, 0.2);
        color: #007eff;
      }
      .heating {
        background: rgba(242, 78, 76, 0.2);
        color: #f24e4c;
      }
    }
  }
</style>
