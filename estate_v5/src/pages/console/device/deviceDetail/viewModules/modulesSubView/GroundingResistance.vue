<template>
  <div class="air-Disinfector">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <span>{{ $t('realTimeParameters') }}</span>
      </div>
      <div></div>
    </div>
    <div>
      <div class="disflex mar-t-30">
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('APhaseVoltage') }}:</div>
          <div class="flex-1">{{ info && info.volA !== undefined ? info.volA + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('BPhaseVoltage') }}:</div>
          <div class="flex-1">{{ info && info.volB !== undefined ? info.volB + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('CPhaseVoltage') }}:</div>
          <div class="flex-1">{{ info && info.volC !== undefined ? info.volC + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('shellVoltage') }}:</div>
          <div class="flex-1">{{ info && info.shellVol !== undefined ? info.shellVol + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('leakageCurrentOfIncomingCable') }}:</div>
          <div class="flex-1">{{ info && info.cableLeakCur !== undefined ? +info.cableLeakCur * 10 + 'mA' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('groundingResistanceMonitoringCcurrent') }}:</div>
          <div class="flex-1">{{ info && info.resistanceDetectionCur !== undefined ? info.resistanceDetectionCur + 'A' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('temperatureOfIncomingCable') }}:</div>
          <div class="flex-1">{{ info && info.cableTemp !== undefined ? info.cableTemp + '℃' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('ABLineVoltage') }}:</div>
          <div class="flex-1">{{ info && info.volAB !== undefined ? info.volAB + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('BCLineVoltage') }}:</div>
          <div class="flex-1">{{ info && info.volBC !== undefined ? info.volBC + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('CALineVoltage') }}:</div>
          <div class="flex-1">{{ info && info.volCA !== undefined ? info.volCA + 'V' : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('groundingResistanceValue') }}:</div>
          <div class="flex-1">{{ info && info.wireResistance !== undefined ? (info.wireResistance >= 4 ? `≥4Ω` : `<4Ω`) : '-' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('OUT1Status') }}:</div>
          <div class="flex-1">{{ info.outputOneStatus === undefined ? '-' : info && info.outputOneStatus ? 'ON' : 'OFF' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('OUT2Status') }}:</div>
          <div class="flex-1">{{ info.outputSecondStatus === undefined ? '-' : info && info.outputSecondStatus ? 'ON' : 'OFF' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('X0Status') }}:</div>
          <div class="flex-1">{{ info.reactanceOneStatus === undefined ? '-' : info && info.reactanceOneStatus ? 'ON' : 'OFF' }}</div>
        </div>
        <div class="disflex">
          <div class="flex-1 text-right">{{ $t('X1Status') }}:</div>
          <div class="flex-1">{{ info.reactanceSecondStatus === undefined ? '-' : info && info.reactanceSecondStatus ? 'ON' : 'OFF' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getRealTimeDataThirdDevice } from '@/api/console/device'
  export default {
    props: {
      mac: { type: String },
    },
    data() {
      return {
        info: null,
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.getParamsDetails()
      },
      async getParamsDetails() {
        const res = await getRealTimeDataThirdDevice({ mac: this.mac })
        if (!res.success) return this.$Message.error(res.message)
        this.info = { ...res.data }
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
      padding-right: 8px;
    }
  }
</style>
