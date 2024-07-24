<template>
  <div class="data-prop-content">
    <div class="top-info">
      <span>{{ $t('component_ID') }}:</span>
      <span>{{ activePen && activePen.id }}</span>
      <span class="copy-icon" @click.stop="copyId"><Icon custom="icon-v5 icon-v5-fuzhi"></Icon></span>
    </div>
    <div class="form-addr">
      <div class="pick"><DeviceAddrPick v-model="addrInfo" @changeSwitchType="changeSwitchType" @changeName="changeName" /></div>
      <div class="pick" v-show="activePen && activePen.name === 'text'">
        <Select v-model="attrValue" transfer :placeholder="$t('plsSelectDataSource')">
          <Option v-for="item in attrOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </div>
  </div>
</template>

<script>
  import DeviceAddrPick from '../modules/DeviceAddrPick.vue'
  export default {
    inject: ['syncLoopConfig'],
    components: { DeviceAddrPick },
    props: { activePen: { type: Object, default: () => {} } },
    data() {
      return {
        addrInfo: [],
        attrValue: '',
        switchType: null,
        deviceInfo: {},
      }
    },
    computed: {
      attrOptions() {
        let options = []
        if (this.switchType === 1) {
          options = [
            { value: 'aa', label: `${this.$t('phaseLineCurrent')}(A)` },
            { value: 'av', label: `${this.$t('phaseLineVoltage')}(V)` },
            { value: 'awp', label: `${this.$t('phaseLinePower')}(W)` },
            { value: 'atUp', label: this.$t('phaselineterminalTem') },
            { value: 'at', label: this.$t('PhaselineterbottomTem') },
          ]
        } else if (this.switchType === 2) {
          options = [
            { value: 'aa', label: `${this.$t('phaseLineCurrent')}(A)` },
            { value: 'na', label: `${this.$t('zeroLineCurrent')}(A)` },
            { value: 'av', label: `${this.$t('phaseLineVoltage')}(V)` },
            { value: 'awp', label: `${this.$t('phaseLinePower')}(W)` },
            { value: 'atUp', label: this.$t('phaselineterminalTem') },
            { value: 'at', label: this.$t('PhaselineterbottomTem') },
            { value: 'ntUp', label: this.$t('zerolinetertopTem') },
            { value: 'nt', label: this.$t('zerolineterbottomTem') },
          ]
        } else if (this.switchType === 3) {
          options = [
            { value: 'aa', label: `${this.$t('APhaseCurrent')}(A)` },
            { value: 'ba', label: `${this.$t('BPhaseCurrent')}(A)` },
            { value: 'ca', label: `${this.$t('CPhaseCurrent')}(A)` },
            { value: 'av', label: `${this.$t('APhaseVoltage')}(V)` },
            { value: 'bv', label: `${this.$t('BPhaseVoltage')}(V)` },
            { value: 'cv', label: `${this.$t('CPhaseVoltage')}(V)` },
            { value: 'awp', label: `${this.$t('APhasePower')}(W)` },
            { value: 'bwp', label: `${this.$t('BPhasePower')}(W)` },
            { value: 'cwp', label: `${this.$t('CPhasePower')}(W)` },
            { value: 'gwp', label: `${this.$t('NPhasePower')}(W)` },
            { value: 'atUp', label: this.$t('alinetertopTem') },
            { value: 'at', label: this.$t('alineterbototmTem') },
            { value: 'btUp', label: this.$t('blinetertopTem') },
            { value: 'bt', label: this.$t('blineterbotomTem') },
            { value: 'ctUp', label: this.$t('clinetertopTem') },
            { value: 'ct', label: this.$t('clineterbottomTem') },
          ]
        } else if (this.switchType === 4) {
          options = [
            { value: 'aa', label: `${this.$t('APhaseCurrent')}(A)` },
            { value: 'ba', label: `${this.$t('BPhaseCurrent')}(A)` },
            { value: 'ca', label: `${this.$t('CPhaseCurrent')}(A)` },
            { value: 'na', label: `${this.$t('NPhaseCurrent')}(A)` },
            { value: 'av', label: `${this.$t('APhaseVoltage')}(V)` },
            { value: 'bv', label: `${this.$t('BPhaseVoltage')}(V)` },
            { value: 'cv', label: `${this.$t('CPhaseVoltage')}(V)` },
            { value: 'awp', label: `${this.$t('APhasePower')}(W)` },
            { value: 'bwp', label: `${this.$t('BPhasePower')}(W)` },
            { value: 'cwp', label: `${this.$t('CPhasePower')}(W)` },
            { value: 'gwp', label: `${this.$t('NPhasePower')}(W)` },
            { value: 'atUp', label: this.$t('alinetertopTem') },
            { value: 'at', label: this.$t('alineterbototmTem') },
            { value: 'btUp', label: this.$t('blinetertopTem') },
            { value: 'bt', label: this.$t('blineterbotomTem') },
            { value: 'ctUp', label: this.$t('clinetertopTem') },
            { value: 'ct', label: this.$t('clineterbottomTem') },
            { value: 'ntUp', label: this.$t('nlinetertopTem') },
            { value: 'nt', label: this.$t('nlineterbottomTem') },
          ]
        }
        return [...options, { value: 'gt', label: this.$t('deviceTem') }, { value: 'gld', label: this.$t('leakageCurrentmA') }, { value: 'hourPower', label: this.$t('hourlyElectricityConsumption2') }]
      },
    },
    methods: {
      changeSwitchType(type) {
        this.switchType = type
      },
      changeName(info) {
        this.deviceInfo = info
      },
      changeAttr() {
        if (this.addrInfo && this.addrInfo[0] && this.addrInfo[1] && this.attrValue) {
          let events = this.activePen.events || []
          if (!events.some(it => it.name === 'enter' && it.value === 'enterDeviceShowTip')) {
            events.push({ name: 'enter', action: 6, value: 'enterDeviceShowTip', params: '' })
          }
          if (!events.some(it => it.name === 'leave' && it.value === 'leaveDeviceHideTip')) {
            events.push({ name: 'leave', action: 6, value: 'leaveDeviceHideTip', params: '' })
          }
          let valueParams = {
            id: this.activePen && this.activePen.id,
            resId: this.addrInfo && this.addrInfo[0],
            addr: this.addrInfo && this.addrInfo[1],
            attr: this.attrValue,
            ...this.deviceInfo,
            events: events,
          }
          this.activePen && window.meta2d.setValue(valueParams, { render: true, history: true })
          this.syncLoopConfig()
        }
      },
      copyId() {
        this.$Copy({ text: this.activePen.id })
      },
    },
    mounted() {
      if (this.activePen) {
        this.addrInfo = this.activePen.resId ? [this.activePen.resId, this.activePen.addr] : []
        this.attrValue = this.activePen.name !== 'text' ? this.activePen.attr || 'oc' : this.activePen.attr
      }
    },
    watch: {
      addrInfo: {
        handler(value) {
          if (value && value[0] && value[1]) {
            this.$nextTick(() => {
              this.changeAttr()
            })
          }
        },
        deep: true,
      },
      attrValue() {
        this.changeAttr()
      },
    },
  }
</script>
<style lang="less" scoped>
  .data-prop-content {
    padding: 0px 10px;
    .top-info {
      display: flex;
      height: 32px;
      border-bottom: 1px solid #e5e5e5;
      align-items: center;
      padding: 0 5px;
      .copy-icon {
        color: #2d8cf0;
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .form-addr {
      margin-top: 20px;
      position: relative;
      .pick {
        margin-bottom: 20px;
        position: relative;
        width: 100%;
      }
    }
  }
</style>
