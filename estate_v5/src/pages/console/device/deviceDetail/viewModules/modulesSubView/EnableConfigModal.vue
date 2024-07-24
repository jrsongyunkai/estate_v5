<template>
  <div>
    <Modal width="860px" v-model="ListShow" :title="title" class="expandModel">
      <div class="explanation">
        <div>
          <Icon custom="icon-v5 icon-v5-xiaoxi"></Icon>
          {{ $t('explanation') }}: 1.{{ $t('description1') }}
        </div>
        <div class="description" style="margin-left: 55px">2.{{ $t('description2') }}</div>
      </div>
      <div class="enableAlarmForm">
        <div class="checkAll">
          <Checkbox style="width: 140px" :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">
            {{ $t('selectAll') }}
          </Checkbox>
        </div>
        <div class="checkList">
          <CheckboxGroup v-model="enableForm.enableBits" @on-change="handleCheckedBitsChange">
            <Checkbox border v-for="(bit, index) in bits" :label="index + '-' + bit" :key="index" class="chcekBox" :disabled="bit === $t('reserved')" :style="bit === $t('reserved') ? 'display:none' : ''">{{ bit }}</Checkbox>
          </CheckboxGroup>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="openPwdsModal" :disabled="enableForm.enableBitsObj.length === 0">{{ $t('save') }}</Button>
        <Button @click="formCancel">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="submitForm"></OperationCheckAuth>
  </div>
</template>

<script>
  import { modifyBoxsChnlTripEnable, modifyBoxsChnlAlarmEbable } from '@/api/public'
  export default {
    props: {
      addrInfo: {
        type: Object,
        default: () => {},
      },
      configInfo: {
        type: Object,
        default: () => {},
      },
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        ListShow: false,
        title: '',
        checkAll: false,
        enableForm: {
          alarmEnable: [0, 0, 0, 0].reverse().join(''),
          tripEnable: [0, 0].reverse().join(''),
          enableBits: [],
          enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join(''),
        },
        cmd: '',
        type: '',
      }
    },
    computed: {
      indeterminate() {
        return this.enableForm.enableBits.length > 0 && this.enableForm.enableBits.length < this.bits.length
      },
      bits() {
        return this.type === 'alarm'
          ? [
              this.$t('shortCircuitAlarm'),
              this.$t('surgeAlarm'),
              this.$t('overloadA'),
              this.$t('temperatureW'),
              this.$t('leakageMonitoringAlarm'),
              this.$t('overCurrentAlarm'),
              this.$t('overVoltageAlarm'),
              this.$t('reserved'),
              this.$t('reserved'),
              this.$t('missingPhaseA'),
              this.$t('arcAlarm'),
              this.$t('underVoltageAlarm'),
              this.$t('overVoltageWarning'),
              this.$t('underVoltageWarning'),
              this.$t('leakageMonitoringWarning'),
              this.$t('currentWarning'),
              this.$t('openingprotection'),
              this.$t('localMaintenance'),
              this.$t('malignantLoad'),
              this.$t('remoteLock'),
              this.configInfo.switchType === 4 ? this.$t('upperEndMissingZero') : this.$t('reserved'),
              this.$t('temperatureAlarm'),
              this.$t('unbalancedAlarm'),
              this.$t('wrongPhaseAlarm'),
              this.$t('reserved'),
              this.$t('currentPhaseLossAlarm'),
              this.$t('reserved'),
              this.$t('reserved'),
              this.$t('carEclectricAlarm'),
              this.$t('reserved'),
              this.configInfo.switchType === 4 ? this.$t('lowerEndMissingZero') : this.$t('reserved'),
              this.$t('reserved'),
              this.$t('electricityWarning'),
              this.$t('powerAlarm'),
              this.$t('earlyWarningCharge'),
              this.$t('electricityRateAlarm'),
            ]
          : [
              this.$t('shortCircuitAlarmTrip'),
              this.$t('surgeAlarmTrip'),
              this.$t('overloadATrip'),
              this.$t('temperatureWTrip'),
              this.$t('leakageMonitoringAlarmTrip'),
              this.$t('overCurrentAlarmTrip'),
              this.$t('overVoltageAlarmTrip'),
              this.$t('reserved'),
              this.$t('reserved'),
              this.$t('missingPhaseATrip'),
              this.$t('arcAlarmTrip'),
              this.$t('underVoltageAlarmTrip'),
              this.$t('overVoltageWarningTrip'),
              this.$t('underVoltageWarningTrip'),
              this.$t('leakageMonitoringWarningTrip'),
              this.$t('currentWarningTrip'),
              this.$t('reserved'),
              this.$t('reserved'),
              this.$t('malignantLoadTripEnable'),
              this.$t('reserved'),
              this.configInfo.switchType === 4 ? this.$t('upperEndMissingZeroTrip') : this.$t('reserved'),
              this.$t('temperatureAlarmTrip'),
              this.$t('unbalancedAlarmTrip'),
              this.$t('wrongPhaseTrip'),
              this.$t('reserved'),
              this.$t('currentPhaseAlarmTrip'),
              this.$t('reserved'),
              this.$t('reserved'),
              this.$t('electricVehicleChargingTrip'),
              this.$t('reserved'),
              this.configInfo.switchType === 4 ? this.$t('lowerEndMissingZeroTrip') : this.$t('reserved'),
              this.$t('reserved'),
              this.$t('powerAlarmTripping'),
              this.$t('electricChargeAlarmTripping'),
            ]
      },
    },
    methods: {
      openModal(obj, type, newObj) {
        this.ListShow = true
        this.type = type
        this.title = type === 'alarm' ? this.$t('enableAlarmConfigure') : this.$t('enableTripConfigure')
        this.cmd = type === 'alarm' ? 'SET_ENABLE_ALARM' : 'SET_ENABLE_TRIP'
        this.$nextTick(() => {
          let arr = obj.split('').reverse()
          arr = [...arr, ...newObj.split('').reverse()]
          let _arr = []
          for (let i = 0; i < arr.length; i++) {
            if (arr[i] === '1') _arr.push(i + '-' + this.bits[i])
          }
          this.enableForm.enableBits = _arr
          this.enableForm.enableBitsObj = obj
          this.enableForm.alarmEnable = newObj
        })
      },
      formCancel() {
        this.ListShow = false
        this.enableForm.enableBits = []
        this.enableForm.enableBitsObj = ''
        this.enableForm.alarmEnable = ''
      },
      handleCheckAll() {
        if (this.indeterminate) {
          this.checkAll = false
        } else {
          this.checkAll = !this.checkAll
        }
        let arr = this.bits.map((it, index) => index + '-' + it)
        let arrs = []
        let arrs2 = []
        if (this.cmd === 'SET_ENABLE_ALARM') {
          arrs = [
            arr.indexOf('0-' + this.$t('shortCircuitAlarm')) > -1 ? 1 : 0,
            arr.indexOf('1-' + this.$t('surgeAlarm')) > -1 ? 1 : 0,
            arr.indexOf('2-' + this.$t('overloadA')) > -1 ? 1 : 0,
            arr.indexOf('3-' + this.$t('temperatureW')) > -1 ? 1 : 0,
            arr.indexOf('4-' + this.$t('leakageMonitoringAlarm')) > -1 ? 1 : 0,
            arr.indexOf('5-' + this.$t('overCurrentAlarm')) > -1 ? 1 : 0,
            arr.indexOf('6-' + this.$t('overVoltageAlarm')) > -1 ? 1 : 0,
            arr.indexOf('7-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('8-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('9-' + this.$t('missingPhaseA')) > -1 ? 1 : 0,
            arr.indexOf('10-' + this.$t('arcAlarm')) > -1 ? 1 : 0,
            arr.indexOf('11-' + this.$t('underVoltageAlarm')) > -1 ? 1 : 0,
            arr.indexOf('12-' + this.$t('overVoltageWarning')) > -1 ? 1 : 0,
            arr.indexOf('13-' + this.$t('underVoltageWarning')) > -1 ? 1 : 0,
            arr.indexOf('14-' + this.$t('leakageMonitoringWarning')) > -1 ? 1 : 0,
            arr.indexOf('15-' + this.$t('currentWarning')) > -1 ? 1 : 0,
            arr.indexOf('16-' + this.$t('openingprotection')) > -1 ? 1 : 0,
            arr.indexOf('17-' + this.$t('localMaintenance')) > -1 ? 1 : 0,
            arr.indexOf('18-' + this.$t('malignantLoad')) > -1 ? 1 : 0,
            arr.indexOf('19-' + this.$t('remoteLock')) > -1 ? 1 : 0,
            this.configInfo.switchType === 4 ? (arr.indexOf('20-' + this.$t('upperEndMissingZero')) > -1 ? 1 : 0) : arr.indexOf('20-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('21-' + this.$t('temperatureAlarm')) > -1 ? 1 : 0,
            arr.indexOf('22-' + this.$t('unbalancedAlarm')) > -1 ? 1 : 0,
            arr.indexOf('23-' + this.$t('wrongPhaseAlarm')) > -1 ? 1 : 0,
            arr.indexOf('24-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('25-' + this.$t('currentPhaseLossAlarm')) > -1 ? 1 : 0,
            arr.indexOf('26-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('27-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('28-' + this.$t('carEclectricAlarm')) > -1 ? 1 : 0,
            arr.indexOf('29-' + this.$t('reserved')) > -1 ? 0 : 1,
            this.configInfo.switchType === 4 ? (arr.indexOf('30-' + this.$t('lowerEndMissingZero')) > -1 ? 1 : 0) : arr.indexOf('30-' + this.$t('reserved')) > -1 ? 0 : 1,
            arr.indexOf('31-' + this.$t('reserved')) > -1 ? 0 : 1,
          ]
          arrs2 = [arr.indexOf('32-' + this.$t('electricityWarning')) > -1 ? 1 : 0, arr.indexOf('33-' + this.$t('powerAlarm')) > -1 ? 1 : 0, arr.indexOf('34-' + this.$t('earlyWarningCharge')) > -1 ? 1 : 0, arr.indexOf('35-' + this.$t('electricityRateAlarm')) > -1 ? 1 : 0]
          this.enableForm.enableBitsObj = arrs.reverse().join('')
          this.enableForm.alarmEnable = arrs2.reverse().join('')
        } else if (this.cmd === 'SET_ENABLE_TRIP') {
          arrs = [
            arr.indexOf(`0-${this.$t('shortCircuitAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`1-${this.$t('surgeAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`2-${this.$t('overloadATrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`3-${this.$t('temperatureWTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`4-${this.$t('leakageMonitoringAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`5-${this.$t('overCurrentAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`6-${this.$t('overVoltageAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`7-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`8-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`9-${this.$t('missingPhaseATrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`10-${this.$t('arcAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`11-${this.$t('underVoltageAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`12-${this.$t('overVoltageWarningTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`13-${this.$t('underVoltageWarningTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`14-${this.$t('leakageMonitoringWarningTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`15-${this.$t('currentWarningTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`16-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`17-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`18-${this.$t('malignantLoadTripEnable')}`) > -1 ? 1 : 0,
            arr.indexOf(`19-${this.$t('reserved')}`) > -1 ? 0 : 1,
            this.configInfo.switchType === 4 ? (arr.indexOf(`20-${this.$t('upperEndMissingZeroTrip')}`) > -1 ? 1 : 0) : arr.indexOf(`20-${this.$t('reserved')}`) > -1 ? 1 : 0,
            arr.indexOf(`21-${this.$t('temperatureAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`22-${this.$t('unbalancedAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`23-${this.$t('wrongPhaseTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`24-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`25-${this.$t('currentPhaseAlarmTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`26-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`27-${this.$t('reserved')}`) > -1 ? 0 : 1,
            arr.indexOf(`28-${this.$t('electricVehicleChargingTrip')}`) > -1 ? 1 : 0,
            arr.indexOf(`29-${this.$t('reserved')}`) > -1 ? 0 : 1,
            this.configInfo.switchType === 4 ? (arr.indexOf(`30-${this.$t('lowerEndMissingZeroTrip')}`) > -1 ? 1 : 0) : arr.indexOf(`30-${this.$t('reserved')}`) > -1 ? 1 : 0,
            arr.indexOf(`31-${this.$t('reserved')}`) > -1 ? 0 : 1,
          ]
          arrs2 = [arr.indexOf(`32-${this.$t('powerAlarmTripping')}`) > -1 ? 1 : 0, arr.indexOf(`33-${this.$t('electricChargeAlarmTripping')}`) > -1 ? 1 : 0]
          this.enableForm.enableBitsObj = arrs.reverse().join('')
          this.enableForm.tripEnable = arrs2.reverse().join('')
        }
        if (this.checkAll) {
          this.enableForm.enableBits = arr.concat(arrs2)
        } else {
          this.enableForm.enableBits = []
        }
      },
      handleCheckedBitsChange(value) {
        this.checkAll = value.length.length === this.bits.length
        let arr = []
        let arr2 = []
        if (this.cmd === 'SET_ENABLE_ALARM') {
          arr = [
            value.indexOf('0-' + this.$t('shortCircuitAlarm')) > -1 ? 1 : 0,
            value.indexOf('1-' + this.$t('surgeAlarm')) > -1 ? 1 : 0,
            value.indexOf('2-' + this.$t('overloadA')) > -1 ? 1 : 0,
            value.indexOf('3-' + this.$t('temperatureW')) > -1 ? 1 : 0,
            value.indexOf('4-' + this.$t('leakageMonitoringAlarm')) > -1 ? 1 : 0,
            value.indexOf('5-' + this.$t('overCurrentAlarm')) > -1 ? 1 : 0,
            value.indexOf('6-' + this.$t('overVoltageAlarm')) > -1 ? 1 : 0,
            value.indexOf('7-' + this.$t('reserved')) > -1 ? 1 : 0,
            value.indexOf('8-' + this.$t('reserved')) > -1 ? 1 : 0,
            value.indexOf('9-' + this.$t('missingPhaseA')) > -1 ? 1 : 0,
            value.indexOf('10-' + this.$t('arcAlarm')) > -1 ? 1 : 0,
            value.indexOf('11-' + this.$t('underVoltageAlarm')) > -1 ? 1 : 0,
            value.indexOf('12-' + this.$t('overVoltageWarning')) > -1 ? 1 : 0,
            value.indexOf('13-' + this.$t('underVoltageWarning')) > -1 ? 1 : 0,
            value.indexOf('14-' + this.$t('leakageMonitoringWarning')) > -1 ? 1 : 0,
            value.indexOf('15-' + this.$t('currentWarning')) > -1 ? 1 : 0,
            value.indexOf('16-' + this.$t('openingprotection')) > -1 ? 1 : 0,
            value.indexOf('17-' + this.$t('localMaintenance')) > -1 ? 1 : 0,
            value.indexOf('18-' + this.$t('malignantLoad')) > -1 ? 1 : 0,
            value.indexOf('19-' + this.$t('remoteLock')) > -1 ? 1 : 0,
            this.configInfo.switchType === 4 ? (value.indexOf('20-' + this.$t('upperEndMissingZero')) > -1 ? 1 : 0) : 0,
            value.indexOf('21-' + this.$t('temperatureAlarm')) > -1 ? 1 : 0,
            value.indexOf('22-' + this.$t('unbalancedAlarm')) > -1 ? 1 : 0,
            value.indexOf('23-' + this.$t('wrongPhaseAlarm')) > -1 ? 1 : 0,
            value.indexOf('24-' + this.$t('reserved')) > -1 ? 1 : 0,
            value.indexOf('25-' + this.$t('currentPhaseLossAlarm')) > -1 ? 1 : 0,
            value.indexOf('26-' + this.$t('reserved')) > -1 ? 1 : 0,
            value.indexOf('27-' + this.$t('reserved')) > -1 ? 1 : 0,
            value.indexOf('28-' + this.$t('carEclectricAlarm')) > -1 ? 1 : 0,
            value.indexOf('29-' + this.$t('reserved')) > -1 ? 1 : 0,
            this.configInfo.switchType === 4 ? (value.indexOf('30-' + this.$t('lowerEndMissingZero')) > -1 ? 1 : 0) : 0,
            value.indexOf('31-' + this.$t('reserved')) > -1 ? 1 : 0,
          ]
          arr2 = [value.indexOf('32-' + this.$t('electricityWarning')) > -1 ? 1 : 0, value.indexOf('33-' + this.$t('powerAlarm')) > -1 ? 1 : 0, value.indexOf('34-' + this.$t('earlyWarningCharge')) > -1 ? 1 : 0, value.indexOf('35-' + this.$t('electricityRateAlarm')) > -1 ? 1 : 0]
          this.enableForm.enableBitsObj = arr.reverse().join('')
          this.enableForm.alarmEnable = arr2.reverse().join('')
        } else if (this.cmd === 'SET_ENABLE_TRIP') {
          arr = [
            value.indexOf(`0-${this.$t('shortCircuitAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`1-${this.$t('surgeAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`2-${this.$t('overloadATrip')}`) > -1 ? 1 : 0,
            value.indexOf(`3-${this.$t('temperatureWTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`4-${this.$t('leakageMonitoringAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`5-${this.$t('overCurrentAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`6-${this.$t('overVoltageAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`7-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`8-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`9-${this.$t('missingPhaseATrip')}`) > -1 ? 1 : 0,
            value.indexOf(`10-${this.$t('arcAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`11-${this.$t('underVoltageAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`12-${this.$t('overVoltageWarningTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`13-${this.$t('underVoltageWarningTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`14-${this.$t('leakageMonitoringWarningTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`15-${this.$t('currentWarningTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`16-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`17-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`18-${this.$t('malignantLoadTripEnable')}`) > -1 ? 1 : 0,
            value.indexOf(`19-${this.$t('reserved')}`) > -1 ? 1 : 0,
            this.configInfo.switchType === 4 ? (value.indexOf(`20-${this.$t('upperEndMissingZeroTrip')}`) > -1 ? 1 : 0) : value.indexOf(`20-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`21-${this.$t('temperatureAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`22-${this.$t('unbalancedAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`23-${this.$t('wrongPhaseTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`24-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`25-${this.$t('currentPhaseAlarmTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`26-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`27-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`28-${this.$t('electricVehicleChargingTrip')}`) > -1 ? 1 : 0,
            value.indexOf(`29-${this.$t('reserved')}`) > -1 ? 1 : 0,
            this.configInfo.switchType === 4 ? (value.indexOf(`30-${this.$t('lowerEndMissingZeroTrip')}`) > -1 ? 1 : 0) : value.indexOf(`30-${this.$t('reserved')}`) > -1 ? 1 : 0,
            value.indexOf(`31-${this.$t('reserved')}`) > -1 ? 1 : 0,
          ]
          arr2 = [value.indexOf(`32-${this.$t('powerAlarmTripping')}`) > -1 ? 1 : 0, value.indexOf(`33-${this.$t('electricChargeAlarmTripping')}`) > -1 ? 1 : 0]
          this.enableForm.enableBitsObj = arr.reverse().join('')
          this.enableForm.tripEnable = arr2.reverse().join('')
        }
      },
      openPwdsModal() {
        this.$refs.operationCheckAuth.openModal({
          macs: this.deviceInfo.mac,
          nodeNos: this.addrInfo.addr,
          cmd: this.cmd,
        })
      },
      async submitForm(params) {
        let that = this
        if (params.cmd === 'SET_ENABLE_TRIP') {
          params.tripEnable = this.enableForm.enableBitsObj
          params.platTripEnable = this.enableForm.tripEnable
          const res = await modifyBoxsChnlTripEnable(params)
          if (res.success) {
            that.$Message.success({ content: this.$t('submitCommand') })
            this.$emit('updateConfigInfo')
            that.ListShow = false
          } else {
            if (res.data) {
              for (let elem of res.data) {
                if (elem.errorMsg === '0') {
                  this.$Message.success({ content: this.$t('processing1') })
                } else {
                  this.$Message.error({ content: elem.mac + this.$t('deviceOffline') })
                }
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          }
        } else if (params.cmd === 'SET_ENABLE_ALARM') {
          params.alarmEnable = this.enableForm.enableBitsObj
          params.platAlarmEnable = this.enableForm.alarmEnable
          const res = await modifyBoxsChnlAlarmEbable(params)
          if (res.success) {
            that.$Message.success({ content: this.$t('submitCommand') })
            this.$emit('updateConfigInfo')
            that.ListShow = false
          } else {
            if (res.data) {
              for (let elem of res.data) {
                if (elem.errorMsg === '0') {
                  this.$Message.success({ content: this.$t('processing1') })
                } else {
                  this.$Message.error({ content: elem.mac + elem.errorMsg })
                }
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          }
        }
      },
    },
  }
</script>
<style lang="less">
  .expandModel {
    .ivu-modal-footer {
      border: 0;
    }
    .ivu-checkbox-border {
      border-color: transparent;
    }
    .ivu-checkbox-border {
      line-height: 36px;
      height: 36px;
    }
    .explanation {
      border: 1px solid #3d3d41;
      padding: 10px;
      color: #999999;
      background: rgba(153, 153, 153, 0.05);
    }
    .enableAlarmForm {
      display: flex;
      margin-top: 20px;
      .checkAll {
        height: 188px;
        text-align: center;
        line-height: 188px;
        width: 140px;
        background: #1a202e;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px dashed #535b6c;
      }
      .checkList {
        margin-left: 20px;
      }
      .chcekBox {
        border-color: transparent;
        width: 210px;
      }
    }
  }
</style>
