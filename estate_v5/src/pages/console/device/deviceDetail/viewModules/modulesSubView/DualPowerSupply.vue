<template>
  <div>
    <DeviceParamHead>
      <div class="double-Power-flex"></div>
    </DeviceParamHead>
    <Row class="ivu-mt-16">
      <Col :md="24" :lg="24" :xl="12" :xxl="8">
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('mainsInputStatus') }}：</div>
          <div class="double-Power-flex-1">{{ (deviceParams.powerInput && powerInputConfig[deviceParams.powerInput.inputStatus]) || '-' }}</div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('mainPowerSupplyBattery') }}：</div>
          <div class="double-Power-flex-1">
            {{ deviceParams.masterPowerVol && [1, 2].includes(deviceParams.masterPowerVol.status) ? masterPowerVolConfig[deviceParams.masterPowerVol.status] : '-' }}
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('backupPowerSupplyVoltage') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.backupPowerVol.val }}</span>
            <span v-if="[3, 4].includes(deviceParams.backupPowerVol.status)" class="red-style">{{ masterPowerVolConfig[deviceParams.backupPowerVol.status] }}</span>
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('fanStatus') }}：</div>
          <div class="double-Power-flex-1">
            {{ fanStatusConfig[deviceParams.fanTmp.fanStatus] || '-' }}
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('totalCurrent') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.directCur.val }}</span>
            <span :class="deviceParams.directCur.status === 0 ? 'green-style' : 'red-style'">{{ directCurConfig[deviceParams.directCur.status] }}</span>
          </div>
        </div>
      </Col>
      <Col :md="24" :lg="24" :xl="12" :xxl="8">
        <div class="double-Power-content margin-10" v-if="deviceParams.isShareTime">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('mainsInputVoltage') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.powerInput.val }}</span>
            <span :class="deviceParams.powerInput.status === 0 ? 'green-style' : 'red-style'">{{ powerInputStatus[deviceParams.powerInput.status] }}</span>
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right Power-no-wrap">{{ $t('mainPowerSupplyBatteryVoltage') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.masterPowerVol.val }}</span>
            <span v-if="[3, 4].includes(deviceParams.masterPowerVol.status)" class="red-style">{{ masterPowerVolConfig[deviceParams.masterPowerVol.status] }}</span>
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('mainTwoPowerSupply') }}：</div>
          <div class="double-Power-flex-1">
            {{ [1, 2].includes(deviceParams.master2PowerVol.status) ? masterPowerVolConfig[deviceParams.master2PowerVol.status] : '-' }}
          </div>
        </div>

        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('fanTemperature') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.fanTmp.val }}</span>
            <span v-if="deviceParams.fanTmp" :class="deviceParams.fanTmp.status === 0 ? 'green-style' : 'red-style'">
              {{ fanTemConfig[deviceParams.fanTmp.status] }}
            </span>
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('ACTotalCurrent') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.acCur.val }}</span>
            <span :class="deviceParams.acCur.status === 0 ? 'green-style' : 'red-style'">{{ directCurConfig[deviceParams.acCur.status] }}</span>
          </div>
        </div>
      </Col>
      <Col :md="24" :lg="24" :xl="12" :xxl="8">
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('powerOutputStatus') }}：</div>
          <div class="double-Power-flex-1">{{ powerOutputStatusConfig[deviceParams.powerOutputStatus] }}</div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('backupPower') }}：</div>
          <div class="double-Power-flex-1">
            {{ deviceParams.backupPowerVol && [1, 2].includes(deviceParams.backupPowerVol.status) ? masterPowerVolConfig[deviceParams.backupPowerVol.status] : '-' }}
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('mainTwoPowerSupplyVoltage') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.master2PowerVol.val }}</span>
            <span v-if="[3, 4].includes(deviceParams.master2PowerVol.status)" class="red-style">{{ masterPowerVolConfig[deviceParams.master2PowerVol.status] }}</span>
          </div>
        </div>
        <div class="double-Power-content margin-10">
          <div class="double-Power-flex-1 gray-text text-right">{{ $t('storagePowerTemperature') }}：</div>
          <div class="double-Power-flex-1">
            <span>{{ deviceParams.batteryTem.val }}</span>
            <span :class="deviceParams.batteryTem.status === 0 ? 'green-style' : 'red-style'">{{ batteryTemConfig[deviceParams.batteryTem.status] }}</span>
          </div>
        </div>
      </Col>
    </Row>
    <Modal :title="$t('remoteUpgrade')" v-model="upgradeModal" @on-ok="uploadFile">
      <Upload type="drag" action="//jsonplaceholder.typicode.com/posts/" :before-upload="onBeforeUpload" :on-success="handleSuccess" :on-error="onError" :max-size="2048">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>{{ $t('uploadTips1') }}</p>
        </div>
      </Upload>
    </Modal>
    <Modal title="$t('thresholdConfiguration')" v-model="thresholdConfigModal" width="750">
      <div class="double-Power-content ivu-mt-16">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('upperLowerLimitsMainsInputVoltage') }}：</div>
        <InputNumberRange
          unit="V"
          style="width: 340px"
          class="double-Power-flex-3"
          :minValue.sync="powerConfig.countryVoltageDown"
          @isRed="getRed"
          :maxValue.sync="powerConfig.countryVoltageUp"
          :minPlaceholder="$t('pleaseEnterLowerLimit')"
          :maxPlaceholder="$t('pleaseEnterUpperLimit')"></InputNumberRange>
      </div>
      <div class="double-Power-content ivu-mt-16">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('MainPowerUpDownLimit') }}：</div>
        <InputNumberRange unit="V" class="double-Power-flex-3" style="width: 340px" :minValue.sync="powerConfig.mainPowerDown" @isRed="getRed" :maxValue.sync="powerConfig.mainPowerUp" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')"></InputNumberRange>
      </div>
      <div class="double-Power-content ivu-mt-16">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('backupPowerUpDownLimit') }}：</div>

        <InputNumberRange
          unit="V"
          class="double-Power-flex-3"
          style="width: 340px"
          :minValue.sync="powerConfig.backupsPowerDown"
          @isRed="getRed"
          :maxValue.sync="powerConfig.backupsPowerUp"
          :minPlaceholder="$t('pleaseEnterLowerLimit')"
          :maxPlaceholder="$t('pleaseEnterUpperLimit')"></InputNumberRange>
      </div>
      <div class="double-Power-content ivu-mt-16">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('MainTwoPowerUpDownLimit') }}：</div>
        <InputNumberRange
          unit="V"
          class="double-Power-flex-3"
          style="width: 340px"
          :minValue.sync="powerConfig.mainBackupsPowerDown"
          @isRed="getRed"
          :maxValue.sync="powerConfig.mainBackupsPowerUp"
          :minPlaceholder="$t('pleaseEnterLowerLimit')"
          :maxPlaceholder="$t('pleaseEnterUpperLimit')"></InputNumberRange>
      </div>
      <div class="double-Power-content ivu-mt-16">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('upperLowerLimitsBatteryVoltage') }}：</div>
        <InputNumberRange
          unit="V"
          class="double-Power-flex-3"
          style="width: 340px"
          :minValue.sync="powerConfig.storageBatteryPowerDown"
          @isRed="getRed"
          :maxValue.sync="powerConfig.storageBatteryPowerUp"
          :minPlaceholder="$t('pleaseEnterLowerLimit')"
          :maxPlaceholder="$t('pleaseEnterUpperLimit')"></InputNumberRange>
      </div>
      <div class="double-Power-content ivu-mt-16">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('upperLowerLimitsTemperatureInsideBox') }}：</div>
        <InputNumberRange
          unit="℃"
          style="width: 340px"
          class="double-Power-flex-3"
          :minValue.sync="powerConfig.countryVoltageDown"
          @isRed="getRed"
          :maxValue.sync="powerConfig.countryVoltageUp"
          :minPlaceholder="$t('pleaseEnterLowerLimit')"
          :maxPlaceholder="$t('pleaseEnterUpperLimit')"></InputNumberRange>
      </div>
      <div class="double-Power-content ivu-mt-16 ivu-text-center">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('totalCurrent') }}：</div>
        <div class="double-Power-flex-3 ivu-text-left">
          <Input v-model="powerConfig.allCurrent" v-decimalTwo="0" class="w200"></Input>
          <span class="position-relative-A">
            <span class="position-absolute-A">A</span>
          </span>
        </div>
      </div>
      <div class="double-Power-content ivu-mt-16 ivu-text-center">
        <div class="ivu-text-right double-Power-flex-1 pt-5">{{ $t('ACTotalCurrent') }}：</div>
        <div class="double-Power-flex-3 ivu-text-left">
          <Input v-model="powerConfig.allExchangeCurrent" v-decimalTwo="0" class="w200"></Input>
          <span class="position-relative-A">
            <span class="position-absolute-A">A</span>
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import DeviceParamHead from '../component/DeviceDataHead.vue'
  import { getRealTimeDataThirdDevice } from '@/api/console/device'
  const powerInputConfig = {
    1: window.$t('mainsInput'),
    2: window.$t('backupPowerTransmission'),
    3: window.$t('mainBackupInputs'),
    4: window.$t('UPSInput'),
  }
  const powerInputStatus = {
    0: window.$t('normal'),
    1: window.$t('Overvoltage'),
    2: window.$t('undervoltage'),
  }
  const powerOutputStatusConfig = {
    1: window.$t('mainOutput'),
    2: window.$t('backupOutput'),
    3: window.$t('mainBackupOutput'),
    4: window.$t('MainTwoOutputs'),
    5: window.$t('backupMainTwoOutputs'),
  }
  const masterPowerVolConfig = {
    1: window.$t('open'),
    2: window.$t('close'),
    3: window.$t('Overvoltage'),
    4: window.$t('undervoltage'),
  }
  const fanStatusConfig = {
    0: window.$t('close'),
    1: window.$t('open'),
  }
  const fanTemConfig = {
    0: window.$t('normal'),
    1: window.$t('overTemperature'),
  }
  const batteryTemConfig = {
    0: window.$t('normal'),
    1: window.$t('overTemperature'),
  }
  const directCurConfig = {
    0: window.$t('normal'),
    1: window.$t('overCurrent'),
  }
  export default {
    components: {
      DeviceParamHead,
    },
    props: {
      mac: String,
    },
    data() {
      return {
        directCurConfig,
        batteryTemConfig,
        fanStatusConfig,
        fanTemConfig,
        powerOutputStatusConfig,
        masterPowerVolConfig,
        powerInputStatus,
        powerInputConfig,
        upgradeModal: false,
        thresholdConfigModal: false,
        deviceParams: {},
        isRed: false,
        powerConfig: {
          countryVoltageDown: null,
          countryVoltageUp: null,
          mainPowerUp: null,
          mainPowerDown: null,
          backupsPowerUp: null,
          backupsPowerDown: null,
          mainBackupsPowerUp: null,
          mainBackupsPowerDown: null,
          storageBatteryPowerUp: null,
          storageBatteryPowerDown: null,
          allCurrent: null,
          allExchangeCurrent: null,
        },
      }
    },
    mounted() {
      this.getRealData()
    },
    methods: {
      async getRealData() {
        const res = await getRealTimeDataThirdDevice({ mac: this.mac })
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.deviceParams = res.data
        this.$emit('updateDeviceData', res.data)
      },
      getRed(val) {
        this.isRed = val
      },
      openUpgradeModal() {
        this.upgradeModal = true
      },
      getRed(val) {
        this.isRed = val
      },

      openUpgradeModal() {
        this.upgradeModal = true
      },
      openConfigModal() {
        this.thresholdConfigModal = true
      },
      onError(file) {
        this.$Message.error({ content: this.$t('failTips1') })
      },
      onBeforeUpload(file) {
        const fileExt = file.name.split('.').pop().toLocaleLowerCase()
        let isXlsx
        if (fileExt === 'xlsx' || fileExt === 'xls') {
          isXlsx = true
        } else {
          isXlsx = false
        }
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isXlsx) {
          this.$Message.error(this.$t('uploadExcel'))
        }
        if (!isLt1M) {
          this.$Message.error(this.$t('cannotExceed1m'))
        }
        return isLt1M && isXlsx
      },
      handleSuccess(res, file) {
        if (res.success) {
          this.$Message.success({ content: this.$t('uploadSucess') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      uploadFile() {},
    },
  }
</script>

<style lang="less" scoped>
  .double-Power-flex {
    display: flex;
    flex: end;
  }
  .double-Power-content {
    display: flex;
  }
  .position-relative-A {
    position: relative;
  }
  .position-absolute-A {
    position: absolute;
    top: 0;
    right: 10px;
  }
  .pt-5 {
    padding-top: 5px;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .double-Power-flex-1 {
    flex: 1;
  }
  .double-Power-flex-3 {
    flex: 3;
    /deep/ i {
      margin-top: 5px;
    }
  }
  .text-right {
    text-align: right;
  }
  .text-center {
    text-align: center;
  }
  .w200 {
    width: 200px;
  }
  .green-style {
    padding: 5px;
    margin-left: 10px;
    color: #21f27f;
    background: rgba(0, 186, 138, 0.15);
    border-radius: 4px;
  }
  .red-style {
    padding: 5px;
    margin-left: 10px;
    color: #d83524;
    background: rgba(255, 79, 79, 0.15);
    border-radius: 4px;
  }
  .margin-10 {
    margin: 10px 0;
  }
  .gray-text {
    color: #999;
  }
  .Power-no-wrap {
    white-space: nowrap;
    margin-left: -5px;
  }
</style>
