<template>
  <div id="jhWaterinfo">
    <div class="theader">
      <div class="left">
        <div class="bor"></div>
        <div class="title">{{ $t('realTimeParameters') }}</div>
      </div>
      <div class="right">
        <Poptip :title="$t('simInfo1')" placement="bottom" transfer-class-name="jhwaterSim" width="280" :transfer="true">
          <Button class="detailsBtn ml-10" :title="$t('simInfo1')" @click="handleConfigSIM">
            <i class="icon-v5 icon-v5-ziyuanguanli-simkaguanli"></i>
          </Button>
          <div slot="content">
            <Form :label-width="120">
              <FormItem :label="$t('signalValue') + ':'">
                <div class="test">
                  <ul :style="{ width: config.width + 'px', height: config.height + 'px' }">
                    <li v-show="zadParams.realData.SignalValue > 0">
                      <span
                        :class="
                          zadParams.realData.SignalValue >= 0 && zadParams.realData.SignalValue <= 24
                            ? 'signal1'
                            : zadParams.realData.SignalValue >= 24 && zadParams.realData.SignalValue <= 49
                            ? 'signal2'
                            : zadParams.realData.SignalValue >= 50 && zadParams.realData.SignalValue <= 74
                            ? 'signal3'
                            : 'signal4'
                        "></span>
                    </li>
                    <li v-show="zadParams.realData.SignalValue > 24">
                      <span
                        :class="
                          zadParams.realData.SignalValue >= 0 && zadParams.realData.SignalValue <= 24
                            ? 'signal1'
                            : zadParams.realData.SignalValue >= 24 && zadParams.realData.SignalValue <= 49
                            ? 'signal2'
                            : zadParams.realData.SignalValue >= 50 && zadParams.realData.SignalValue <= 74
                            ? 'signal3'
                            : 'signal4'
                        "></span>
                    </li>
                    <li v-show="zadParams.realData.SignalValue > 50">
                      <span
                        :class="
                          zadParams.realData.SignalValue >= 0 && zadParams.realData.SignalValue <= 24
                            ? 'signal1'
                            : zadParams.realData.SignalValue >= 24 && zadParams.realData.SignalValue <= 49
                            ? 'signal2'
                            : zadParams.realData.SignalValue >= 50 && zadParams.realData.SignalValue <= 74
                            ? 'signal3'
                            : 'signal4'
                        "></span>
                    </li>
                    <li v-show="zadParams.realData.SignalValue > 75">
                      <span
                        :class="
                          zadParams.realData.SignalValue >= 0 && zadParams.realData.SignalValue <= 24
                            ? 'signal1'
                            : zadParams.realData.SignalValue >= 24 && zadParams.realData.SignalValue <= 49
                            ? 'signal2'
                            : zadParams.realData.SignalValue >= 50 && zadParams.realData.SignalValue <= 74
                            ? 'signal3'
                            : 'signal4'
                        "></span>
                    </li>
                  </ul>
                </div>
              </FormItem>
              <FormItem :label="$t('simId') + ':'">
                <span>{{ zadParams.realData.IMSI }}</span>
              </FormItem>
              <FormItem label="ICCID:">
                <span>{{ simObj.iccid }}</span>
              </FormItem>
              <FormItem :label="$t('cardSell') + ':'">
                <span>{{ simObj.supplierName }}</span>
              </FormItem>
              <FormItem :label="$t('packageType') + ':'">
                <span>{{ simObj.volumePackage }}</span>
              </FormItem>
              <FormItem :label="$t('trafficUsage') + ':'">
                <span>{{ simObj.remainVolume }}</span>
              </FormItem>
              <FormItem :label="$t('expireDate') + ':'">
                <span>{{ simObj.expireDate }}</span>
              </FormItem>
            </Form>
          </div>
        </Poptip>

        <Button class="detailsBtn ml-10" :title="$t('setting')" @click.native="handleConfiguration">
          <i class="icon-v5 icon-v5-xitongshezhiguanliqitashezhi"></i>
        </Button>
      </div>
    </div>

    <div class="content">
      <template v-if="equipmentType === 23">
        <div class="prompt" v-if="zadParams.realData.BatteryValue / 100 < 5.5">
          <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
          {{ $t('batteryTips1') }}
        </div>
        <div class="contentForm">
          <Form :label-width="120">
            <FormItem :label="$t('waterPressureStatus') + ':'">
              <template v-if="zadParams.eventData.WarnWaterPre !== undefined">
                <span :class="zadParams.eventData.WarnWaterPre === '0' ? 'normal' : 'warn'">{{ zadParams.eventData.WarnWaterPre === '0' ? $t('normal') : zadParams.eventData.WarnWaterPre === '1' ? $t('undervoltage') : $t('Overvoltage') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('valveStatus') + ':'">
              <template v-if="zadParams.eventData.WarnValve !== undefined">
                <span :class="zadParams.eventData.WarnValve === '1' ? 'abnormal' : 'normal'">{{ zadParams.eventData.WarnValve === '1' ? $t('open3') : $t('normal') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('ambientTemperature') + ':'">
              <template v-if="zadParams.realData.TemperatureValue !== undefined">
                <span>{{ (zadParams.realData.TemperatureValue - 1000) / 10 }}°C</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('collectionReportingCycle') + ':'">
              <template v-if="zadParams.parameterData.CollectPeriod !== undefined">
                <span>{{ zadParams.parameterData.CollectPeriod }}{{ $t('minute') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
          <Form :label-width="140">
            <FormItem :label="$t('waterPressureValueThreshold') + ':'">
              <span>{{ zadParams.realData.WaterValue }}/{{ `[${zadParams.parameterData.WarnMin ? zadParams.parameterData.WarnMin : '-'}~${zadParams.parameterData.WarnMax ? zadParams.parameterData.WarnMax : '-'}]` }}Mpa</span>
            </FormItem>
            <FormItem :label="$t('collisionState') + ':'">
              <template v-if="zadParams.eventData.WarnDown !== undefined">
                <span :class="zadParams.eventData.WarnDown === '1' ? 'abnormal' : 'normal'">{{ zadParams.eventData.WarnDown === '1' ? $t('collision') : $t('normal') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('deviceBatteryVoltage') + ':'">
              <template v-if="zadParams.realData.BatteryValue !== undefined">
                <span class="status1">{{ zadParams.realData.BatteryValue / 100 }}V</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
          <Form :label-width="160">
            <FormItem :label="$t('stateWaterPressureChangeRate') + ':'">
              <template v-if="zadParams.eventData.WarnChgRate !== undefined">
                <span :class="zadParams.eventData.WarnChgRate === '0' ? 'normal' : 'warn'">{{ zadParams.eventData.WarnChgRate === '0' ? $t('normal') : $t('mutation') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('boxState') + ':'">
              <template v-if="zadParams.eventData.WarnBottom !== undefined">
                <span :class="zadParams.eventData.WarnBottom === '1' ? 'abnormal' : 'normal'">{{ zadParams.eventData.WarnBottom === '1' ? $t('open3') : $t('normal') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('totalCollectionTimes') + ':'">
              <template v-if="zadParams.realData.CollectNumber !== undefined">
                <span>{{ zadParams.realData.CollectNumber }} {{ $t('times') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
        </div>
        <div class="contentForm">
          <Form :label-width="120">
            <FormItem :label="$t('samplingMinimumValue') + ':'">
              <template v-if="zadParams.parameterData.SamplingMin !== undefined">
                <span>{{ zadParams.parameterData.SamplingMin }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
          <Form :label-width="160">
            <FormItem :label="$t('samplingMax') + ':'">
              <template v-if="zadParams.parameterData.SamplingMax !== undefined">
                <span>{{ zadParams.parameterData.SamplingMax }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
          <Form :label-width="230">
            <FormItem :label="$t('sensorNominalValue') + ':'">
              <template v-if="zadParams.parameterData.SensorNominal !== undefined">
                <span>{{ zadParams.parameterData.SensorNominal }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
        </div>
      </template>
      <template v-if="equipmentType === 24">
        <div class="prompt" v-if="zadParams.realData.BatteryValue / 100 < 5.5">
          <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
          {{ $t('batteryTips2') }}
        </div>
        <div class="contentForm">
          <Form :label-width="120">
            <FormItem :label="$t('waterLevelStatus') + ':'">
              <template v-if="zadParams.eventData.WarnWaterPre !== undefined">
                <span :class="zadParams.eventData.WarnWaterPre === '0' ? 'normal' : 'warn'">{{ zadParams.eventData.WarnWaterPre === '0' ? $t('normal') : zadParams.eventData.WarnWaterPre === '1' ? $t('lowLiquidLevel') : $t('highLiquidLevel') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('ambientTemperature') + ':'">
              <template v-if="zadParams.realData.TemperatureValue !== undefined">
                <span>{{ (zadParams.realData.TemperatureValue - 1000) / 10 }}°C</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('collectionReportingCycle') + ':'">
              <template v-if="zadParams.parameterData.CollectPeriod !== undefined">
                <span>{{ zadParams.parameterData.CollectPeriod }}{{ $t('minute') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('sensorNominalValue') + ':'">
              <template v-if="zadParams.parameterData.SensorNominal !== undefined">
                <span>{{ zadParams.parameterData.SensorNominal }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
          <Form :label-width="120">
            <FormItem :label="$t('liquidLevelValueThreshold') + ':'">
              <span>{{ zadParams.realData.WaterValue }}/{{ `[${zadParams.parameterData.WarnMin ? zadParams.parameterData.WarnMin : '-'}~${zadParams.parameterData.WarnMax ? zadParams.parameterData.WarnMax : '-'}]` }}mm</span>
            </FormItem>
            <FormItem :label="$t('deviceBatteryVoltage') + ':'">
              <template v-if="zadParams.realData.BatteryValue !== undefined">
                <span class="status1">{{ zadParams.realData.BatteryValue / 100 }}V</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('samplingMinimumValue') + ':'">
              <template v-if="zadParams.parameterData.SamplingMin !== undefined">
                <span>{{ zadParams.parameterData.SamplingMin }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
          <Form :label-width="160">
            <FormItem :label="$t('waterLevelChangeRateStatus') + ':'">
              <template v-if="zadParams.eventData.WarnChgRate !== undefined">
                <span :class="zadParams.eventData.WarnChgRate === '0' ? 'normal' : 'warn'">{{ zadParams.eventData.WarnChgRate === '0' ? $t('normal') : $t('mutation') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('totalCollectionTimes') + ':'">
              <template v-if="zadParams.realData.CollectNumber !== undefined">
                <span>{{ zadParams.realData.CollectNumber }}{{ $t('times') }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
            <FormItem :label="$t('samplingMax') + ':'">
              <template v-if="zadParams.parameterData.SamplingMax !== undefined">
                <span>{{ zadParams.parameterData.SamplingMax }}</span>
              </template>
              <template v-else>
                <span>-</span>
              </template>
            </FormItem>
          </Form>
        </div>
      </template>
    </div>
    <Modal v-model="jhconfiguration" :title="$t('parameterConfiguration')" class-name="jhconfiguration">
      <template>
        <div class="prompt">
          <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
          {{ $t('commandTips3') }}
        </div>
        <Form :label-width="140">
          <FormItem :label="equipmentType === 23 ? $t('waterPressureAlarmThreshold') + ':' : $t('liquidLevelAlarmThreshold') + ':'">
            <Row>
              <div style="position: relative">
                <InputNumber v-model="setParams.warnMin" :parser="value => value.replace(/[^\d]/g, '')" :max="35535"></InputNumber>
                <i style="position: absolute; right: 10px; color: #808695">{{ equipmentType === 23 ? 'Mpa' : 'mm' }}</i>
              </div>
              <span style="margin: 0 10px">{{ $t('to') }}</span>
              <div style="position: relative">
                <InputNumber v-model="setParams.warnMax" :parser="value => value.replace(/[^\d]/g, '')" :max="35535"></InputNumber>
                <i style="position: absolute; right: 10px; color: #808695">{{ equipmentType === 23 ? 'Mpa' : 'mm' }}</i>
              </div>
            </Row>
          </FormItem>
          <FormItem :label="equipmentType === 23 ? $t('waterPressureChangeRate') + ':' : $t('waterLevelChangeRate')">
            <div style="position: relative">
              <InputNumber v-model="setParams.chgRate" :parser="value => value.replace(/[^\d]/g, '')" :max="1000"></InputNumber>
              <i style="position: absolute; left: 130px; color: #808695">%</i>
            </div>
          </FormItem>
          <template v-if="equipmentType === 23">
            <FormItem :label="$t('collectionCycleReportingCycle') + ':'">
              <Select v-model="setParams.period" style="width: 200px">
                <Option v-for="item in minute" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <span class="ml-10">{{ $t('minute') }}</span>
            </FormItem>
          </template>
          <template v-if="equipmentType === 24">
            <FormItem :label="$t('collectionCycleReportingCycle') + ':'">
              <Select v-model="setParams.period" style="width: 200px">
                <Option v-for="item in minute" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <span class="ml-10">{{ $t('minute') }}</span>
            </FormItem>
          </template>
        </Form>
      </template>
      <div slot="footer">
        <Button type="primary" @click="handlezadsetParam">{{ $t('confirm2') }}</Button>
        <Button @click="handlecancle">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import { zadfindRealParam, zadsetParam } from '@/api/public'
  export default {
    props: {
      equipmentType: {
        type: Number,
      },
      mac: {
        type: String,
      },
    },
    data() {
      return {
        minute: [
          { value: '5', label: '5' },
          { value: '15', label: '15' },
          { value: '30', label: '30' },
          { value: '60', label: '60' },
        ],
        minuteVal: '',
        jhconfiguration: false,
        simCard: false,
        config: { width: 32, height: 22 },
        waterPressure: 0,
        zadParams: { eventData: '', parameterData: '', realData: '' },
        setParams: { period: '', warnMin: '', warnMax: '', chgRate: '' },
        deviceId: '',
        simObj: {},
      }
    },
    watch: {
      waterPressure: {
        handler(newval) {
          if (newval > 65535) this.waterPressure = 65535
        },
      },
    },
    mounted() {
      this.handlezadfindRealParam()
      setTimeout(() => {
        this.simObj = this.$store.state.simObj
      }, 1000)
    },
    methods: {
      handleConfiguration() {
        this.jhconfiguration = true
        this.setParams = {
          period: `${this.zadParams.parameterData.CollectPeriod ? this.zadParams.parameterData.CollectPeriod : ''}`,
          warnMin: this.zadParams.parameterData.WarnMin ? this.zadParams.parameterData.WarnMin : '',
          warnMax: this.zadParams.parameterData.WarnMax ? this.zadParams.parameterData.WarnMax : '',
          chgRate: this.zadParams.parameterData.ChgRate ? this.zadParams.parameterData.ChgRate : '',
        }
      },
      handleConfigSIM() {
        this.simCard = true
      },
      async handlezadfindRealParam() {
        let params = { mac: this.mac, projectCode: this.$store.state.projectCode, equipmentType: this.equipmentType }
        const res = await zadfindRealParam(params)
        if (res.success) {
          this.zadParams.eventData = res.data.eventData ? res.data.eventData : {}
          this.zadParams.parameterData = res.data.parameterData ? res.data.parameterData : {}
          this.zadParams.realData = res.data.realData ? res.data.realData : {}
          this.deviceId = res.data.deviceId
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handlecancle() {
        this.jhconfiguration = false
      },
      handlezadsetParam() {
        let parmas = {
          projectCode: this.$store.state.projectCode,
          collectPeriod: this.setParams.period,
          connectPeriod: this.setParams.period,
          equipmentType: this.equipmentType,
          warnMin: this.setParams.warnMin,
          warnMax: this.setParams.warnMax,
          chgRate: this.setParams.chgRate,
          mac: this.mac,
        }
        zadsetParam(parmas).then(res => {
          if (res.success) {
            this.$Message.success({ content: res.message })
            this.jhconfiguration = false
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
    },
  }
</script>
<style lang="less">
  .signal1 {
    background: #a9172c;
  }
  .signal2 {
    background: #d38724;
  }
  .signal3 {
    background: #02a7f0;
  }
  .signal4 {
    background: #70b603;
  }
  .jhconfiguration {
    .prompt {
      color: #f29e31;
      background: rgba(245, 154, 35, 0.2);
      padding: 5px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .ivu-input-number-handler-wrap {
      display: none;
    }
    .ivu-input-number {
      width: 150px;
    }
  }

  .jhwaterSim {
    .ivu-form-item {
      margin-bottom: 0px;
    }
    .ivu-form-item-label {
      color: #d7d7d7 !important;
    }
    ul {
      display: flex;
      //   justify-content: space-around;
      overflow: hidden;
      list-style: none;
      li {
        width: 12%;
        background: rgba(0, 0, 0, 0.5);
        position: relative;
        margin-right: 2px;
        span {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 100%;
          height: 100%;
          border-radius: 1px;
        }
        &:nth-child(1) {
          height: 8px;
          margin-top: 14px;
        }
        &:nth-child(2) {
          height: 12px;
          margin-top: 12px;
        }
        &:nth-child(3) {
          height: 14px;
          margin-top: 10px;
        }
        &:nth-child(4) {
          height: 16px;
          margin-top: 8px;
        }
      }
    }
  }

  #jhWaterinfo {
    .theader {
      display: flex;
      align-items: center;
      padding-bottom: 10px;
      font-size: 16px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      border-bottom: 1px solid #5e626c;
      .right {
        Button {
          margin: 0 4px;
          border-radius: 5px;
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: 400;
          position: relative;
        }
      }
    }
    .content {
      .contentForm {
        display: flex;
      }
      .prompt {
        color: #f29e31;
        background: rgba(245, 154, 35, 0.2);
        padding: 5px;
        border-radius: 5px;
      }
      margin-top: 10px;
      .ivu-form-item {
        margin-bottom: 2px;
      }
      .ivu-form-item-label {
        color: #8e9095 !important;
      }
      .normal {
        background: rgba(112, 182, 3, 0.2);
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
        color: #70b603;
      }
      .warn {
        color: #d9001b;
        background: rgba(216, 53, 36, 0.2);
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
      }
      .abnormal {
        color: #d38724;
        background: rgba(229, 115, 41, 0.2);
        padding: 2px 6px;
        font-size: 12px;
        border-radius: 3px;
      }
      .status1 {
        color: #d38724;
      }
      .status2 {
        color: #d9001b;
      }
    }
  }
</style>
