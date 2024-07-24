<template>
  <div class="air-Disinfector">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('realTimeParameters') }}</span>
      </div>
      <div>
        <Button type="primary" ghost @click="startOpenModal">{{ $t('commandIssuance') }}</Button>
        <Button class="pointer detailsBtn ml-10" custom-icon="icon-v5 icon-v5-refresh" type="primary" @click.stop="init" ghost></Button>
      </div>
    </div>
    <div>
      <div class="disflex mar-t-30">
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('runningState') }}：</div>
          <div class="flex-1">
            <span :class="runStatus === 5 ? 'stopStyle' : 'defaultStyle'" class="heigth22">{{ runStatusReturn(runStatus) }}</span>
          </div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('jobTime') }}：</div>
          <div class="flex-1">{{ runTime || runTime === 0 ? runTime + 'min' : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('configTime') }}：</div>
          <div class="flex-1">{{ configTime || configTime === 0 ? configTime + 'min' : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('mistOutletTemperature') }}：</div>
          <div class="flex-1">{{ fogTmp ? fogTmp + '℃' : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('ambientTemperature') }}：</div>
          <div class="flex-1">{{ pressTmp ? pressTmp + '℃' : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('pressure1') }}：</div>
          <div class="flex-1">{{ pressure ? pressure + $t('kilogram') : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('equipmentVoltage') }}：</div>
          <div class="flex-1">{{ voltage || voltage === 0 ? voltage + 'V' : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('gridVoltage') }}：</div>
          <div class="flex-1">{{ gridVoltage || gridVoltage === 0 ? gridVoltage + 'V' : '' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('auxiliaryAtomizationPower') }}：</div>
          <div class="flex-1 disflex">
            <div v-show="!showSelectAuxiliary">
              <span>{{ $t('manyLevel', { num: auxiliaryValue }) }} &nbsp;</span>
              <i class="icon-v5 icon-v5-bianji" @click="openSelect"></i>
            </div>
            <Select v-model="auxiliaryValue" style="width: 100px" transfer v-show="showSelectAuxiliary" @on-change="changeAuxiliaryShow">
              <Option v-show="showSelectAuxiliary" v-for="item in auxiliaryAtomizationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('fanWindPower') }}：</div>
          <div class="flex-1 disflex">
            <div v-show="!showSelectWindPower">
              <span>{{ $t('manyLevel', { num: windPower }) }} &nbsp;</span>
              <i class="icon-v5 icon-v5-bianji" @click="openWindSelect"></i>
            </div>
            <Select v-model="windPower" style="width: 100px" transfer v-show="showSelectWindPower" @on-change="changeWindPowerShow">
              <Option v-show="showSelectWindPower" v-for="item in auxiliaryAtomizationList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('auxiliary') }}：</div>
          <div class="flex-1">
            <span :class="!lackOfLiquid ? 'greenStyle' : 'b-danger'" class="heigth22">{{ !lackOfLiquid ? $t('normal') : $t('lack') }}</span>
          </div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('medicinalLiquid') }}：</div>
          <div class="flex-1">
            <span :class="!lackOfAdditives ? 'greenStyle' : 'b-danger'" class="heigth22">{{ !lackOfAdditives ? $t('normal') : $t('lack') }}</span>
          </div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('electricQuantity') }}：</div>
          <div class="flex-1">
            <span :class="!lowBattery ? 'greenStyle' : 'b-danger'" class="heigth22">{{ !lowBattery ? $t('normal') : $t('lowBattery') }}</span>
          </div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('atomizationCore') }}：</div>
          <div class="flex-1">
            <span :class="!atomizingCoreFault ? 'greenStyle' : 'b-danger'" class="heigth22">{{ !atomizingCoreFault ? $t('normal') : $t('fault') }}</span>
          </div>
        </div>
      </div>
    </div>
    <Modal :title="$t('commandIssuance')" v-model="startConfigModal" :mask="false">
      <div class="disflex margin-10-0">
        <div class="mar-l-10">{{ $t('workMode') }}：</div>
        <RadioGroup v-model="workMode">
          <Radio :label="1">{{ $t('parasiticAtomization') }}</Radio>
          <Radio :label="2">{{ $t('humidificationAtomization') }}</Radio>
          <Radio :label="3">{{ $t('clean') }}</Radio>
          <Radio :label="5">{{ $t('stop') }}</Radio>
        </RadioGroup>
      </div>
      <div class="margin-10-0">
        <span class="mar-l-10">{{ $t('workingHours') }}：</span>
        <InputNumbers :isNeedArrow="false" class="w200" :precision="0" :placeholder="$t('pleaseEnter')" :min="0" :max="180" v-model="workTimeVal" />
        <span class="work-time-unit">
          <span class="unit">min</span>
        </span>
      </div>
      <div slot="footer">
        <Button type="default" @click="startConfigModal = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="saveStartConfig">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import InputNumbers from '@/pages/multiManage/trafficRenewal/input-Number.vue'
  import { getConfigDataThirdDevice, getRealTimeDataThirdDevice, downCommandThirdDevice, getPlatformConfData } from '@/api/console/device'
  export default {
    props: {
      mac: { type: String },
    },
    components: { InputNumbers },
    data() {
      return {
        atomizingCoreFault: null,
        lowBattery: null,
        lackOfAdditives: null,
        lackOfLiquid: null,
        voltage: '',
        gridVoltage: '',
        runStatus: 0,
        pressure: '',
        runTime: '',
        configTime: '',
        pressTmp: '',
        fogTmp: '',
        workMode: 1,
        startConfigModal: false,
        workTimeVal: 0,
        showSelectWindPower: false,
        showSelectAuxiliary: false,
        windPower: 1,
        auxiliaryValue: 1,
        auxiliaryAtomizationList: [
          { value: 1, label: this.$t('manyLevel', { num: '1' }) },
          { value: 2, label: this.$t('manyLevel', { num: '2' }) },
          { value: 3, label: this.$t('manyLevel', { num: '3' }) },
          { value: 4, label: this.$t('manyLevel', { num: '4' }) },
          { value: 5, label: this.$t('manyLevel', { num: '5' }) },
        ],
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getThirdDetail()
        this.getParamsDetails()
        this.getPlatformConfData()
      },
      runStatusReturn(val) {
        const returnLabel = { 1: this.$t('parasiticAtomization'), 2: this.$t('humidificationFog'), 3: this.$t('clean'), 5: this.$t('stop') }
        return returnLabel[val] || this.$t('unknownState')
      },
      async downCommandThird(type, val, val2) {
        const params = { mac: this.mac, deviceType: 1, cmdType: type, value1: val, value2: val2 || null }
        const res = await downCommandThirdDevice(params)
        if (!res.success) return this.$Message.error(res.message)
        this.$Message.success(res.message)
        this.init()
      },
      async getParamsDetails() {
        const res = await getRealTimeDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        const { runTime, fogTmp, pressTmp, pressure, runStatus, voltage, gridVoltage, lackOfLiquid, lackOfAdditives, lowBattery, atomizingCoreFault } = res.data
        this.fogTmp = fogTmp
        this.pressTmp = pressTmp
        this.runTime = runTime
        this.pressure = pressure
        this.runStatus = runStatus
        this.voltage = voltage
        this.gridVoltage = gridVoltage
        this.workTimeVal = +runTime
        this.lackOfLiquid = lackOfLiquid
        this.lackOfAdditives = lackOfAdditives
        this.lowBattery = lowBattery
        this.atomizingCoreFault = atomizingCoreFault
      },
      async getPlatformConfData() {
        const res = await getPlatformConfData({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.configTime = res.data.value2
      },
      async getThirdDetail() {
        const res = await getConfigDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.windPower = res.data.gear
        this.auxiliaryValue = res.data.power
      },
      changeAuxiliaryShow(val) {
        this.downCommandThird(6, this.auxiliaryValue)
        this.showSelectAuxiliary = false
      },
      changeWindPowerShow() {
        this.downCommandThird(7, this.windPower)
        this.showSelectWindPower = false
      },
      openSelect() {
        this.showSelectAuxiliary = true
      },
      openWindSelect() {
        this.showSelectWindPower = true
      },
      startOpenModal() {
        this.startConfigModal = true
      },
      saveStartConfig() {
        if (![1, 2, 3, 5].includes(this.workMode) || this.workTimeVal === null || (this.workTimeVal === 0 && this.workMode !== 5)) {
          return this.$Message.error(this.$t('completTnformationCommand'))
        }
        this.downCommandThird(4, this.workMode, `${this.workTimeVal}`)
        this.startConfigModal = false
      },
    },
  }
</script>

<style lang="less">
  .greenStyle {
    color: #21f27f !important;
    background: rgba(0, 186, 138, 0.15);
  }
  .stopStyle {
    color: #999;
    background: rgba(144, 147, 153, 0.15);
  }
  .defaultStyle {
    color: #007aff;
    background: rgba(0, 126, 255, 0.1);
  }
  .heigth22 {
    height: 22px;
    padding: 2px 5px;
  }
  .work-time-unit {
    position: relative;
    .unit {
      position: absolute;
      right: 10px;
      top: 0;
    }
  }
  .mar-l-10 {
    margin-left: 10px;
  }
  .mar-t-30 {
    margin: 15px 0 15px 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    > div {
      width: 33.333%;
      padding: 10px 0px;
    }
  }
  .margin-10-0 {
    margin: 15px 0;
  }
  .air-Disinfector {
    .disflex {
      display: flex;
    }
    .flex-1 {
      flex: 1;
    }
    .text-right {
      color: #9999;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
