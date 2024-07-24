<template>
  <Modal v-model="charginState" :title="modalTitle" class-name="recharge" width="650">
    <div style="color: #d7d7d7; margin-bottom: 20px">{{ $t('timePeriodValueMonitoring') }}</div>
    <Form>
      <FormItem :label="$t('bucketType')">
        <div style="display: flex">
          <Select v-model="charginForm.rangeType" style="width: 120px">
            <Option v-for="item in charginTimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>

          <div class="time-expand-row" v-if="charginForm.rangeType === '1'">
            <Select v-model="StartTime" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <Select v-model="EndTime" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>

          <div class="time-expand-row" v-if="charginForm.rangeType === '2'">
            <Select v-model="StartMonth" style="width: 150px" class="startMonth" :placeholder="$t('startDate')">
              <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="StartTime" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <Select v-model="EndMonth" style="width: 150px" class="endMonth" :placeholder="$t('endDate')">
              <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-model="EndTime" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>

          <div class="time-expand-row" v-if="charginForm.rangeType === '3'">
            <DatePicker type="date" v-model="startDayValue" :placeholder="$t('startDate')" format="MM-dd" style="width: 150px" transfer :clearable="false" @on-change="startDayChange"></DatePicker>
            <Select v-model="StartTime" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <DatePicker type="date" v-model="endDayValue" :placeholder="$t('endDate')" format="MM-dd" style="width: 150px" transfer :clearable="false" @on-change="endDayChange"></DatePicker>
            <Select v-model="EndTime" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </FormItem>
      <FormItem>
        <Row>
          <span style="margin-right: 10px">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label1') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip1') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange unit="kW·h" style="width: 340px" :minValue.sync="charginForm.pwrWarnDw" @isRed="getRed" :maxValue.sync="charginForm.pwrWarnUp" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')" />
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <span style="margin-right: 10px">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label2') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip2') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange unit="kW·h" style="width: 340px" :minValue.sync="charginForm.pwrAlarmDw" @isRed="getRed" :maxValue.sync="charginForm.pwrAlarmUp" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')" />
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <span style="margin-right: 10px">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label3') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip1') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange :unit="$t('yuan')" style="width: 340px" :disabled="isDisabledInput" :minValue.sync="charginForm.feeWarnDw" @isRed="getRed" :maxValue.sync="charginForm.feeWarnUp" :minPlaceholder="holderText" :maxPlaceholder="holderText2" />
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <span style="margin-right: 10px">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label4') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip2') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange :unit="$t('yuan')" style="width: 340px" :disabled="isDisabledInput" :minValue.sync="charginForm.feeAlarmDw" @isRed="getRed" :maxValue.sync="charginForm.feeAlarmUp" :minPlaceholder="holderText" :maxPlaceholder="holderText2" />
        </Row>
      </FormItem>
    </Form>
    <div style="color: #d7d7d7; margin-bottom: 20px">{{ $t('dailyValueMutationMonitoring') }}</div>
    <Form>
      <FormItem>
        <span style="margin-right: 10px">
          {{ $t('ns_electricityAndFeeMonitoringConfig.label5') }}
          <Tooltip placement="top" max-width="250">
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content" style="white-space: normal; max-width: 250px">{{ textsTipElecUp }}</div>
          </Tooltip>
          :
        </span>
        <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayPwrUpRatio" :placeholder="$t('pleaseEnter')" />
        <span style="position: relative">
          <i style="position: absolute; left: -20px">%</i>
        </span>
      </FormItem>
      <FormItem>
        <span style="margin-right: 10px">
          {{ $t('ns_electricityAndFeeMonitoringConfig.label6') }}
          <Tooltip placement="top" max-width="250">
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content" style="white-space: normal; max-width: 250px">
              {{ textsTipElecFall }}
            </div>
          </Tooltip>
          :
        </span>
        <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayPwrDwRatio" :placeholder="$t('pleaseEnter')" />
        <span style="position: relative">
          <i style="position: absolute; left: -20px">%</i>
        </span>
      </FormItem>
      <FormItem>
        <span style="margin-right: 10px">
          {{ $t('ns_electricityAndFeeMonitoringConfig.label7') }}
          <Tooltip placement="top" max-width="250">
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content" style="white-space: normal; max-width: 250px">
              {{ textsTipUp }}
            </div>
          </Tooltip>
          :
        </span>
        <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayFeeUpRatio" :disabled="isDisabledInput" :placeholder="holderText3" />
        <span style="position: relative">
          <i style="position: absolute; left: -20px">%</i>
        </span>
      </FormItem>
      <FormItem>
        <span style="margin-right: 10px">
          {{ $t('ns_electricityAndFeeMonitoringConfig.label8') }}
          <Tooltip placement="top" max-width="250">
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content" style="white-space: normal; max-width: 250px">
              {{ textsTipFall }}
            </div>
          </Tooltip>
          :
        </span>
        <InputNumber style="width: 340px" class="suddenlyChange none-handler-wrap" type="number" :min="0" v-model="charginForm.dayFeeDwRatio" :disabled="isDisabledInput" :placeholder="holderText3" />
        <span style="position: relative">
          <i style="position: absolute; left: -20px">%</i>
        </span>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="queryDeviceFeeConfig">{{ $t('save') }}</Button>
      <Button @click="charginState = false">{{ $t('cancel') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { monthDateday, timeSpan } from '@/pages/multiManage/threShold/data'
  import { chnPlatAttrFeeMonitorConfig, chnPlatAttrsavePowerFeeMonitorConfig } from '@/api/public'
  export default {
    props: {
      addrInfo: {
        type: Object,
        default: () => {},
      },
    },
    inject: ['rowDeviceInfo'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        isDisabledInput: false,
        charginState: false,
        charginTimeList: [
          { value: '0', label: this.$t('hourly') },
          { value: '1', label: this.$t('everyDay') },
          { value: '2', label: this.$t('monthly') },
          { value: '3', label: this.$t('annually') },
        ],
        charginForm: {
          rangeType: '',
          pwrWarnDw: null,
          pwrWarnUp: null,
          pwrAlarmDw: null,
          pwrAlarmUp: null,
          feeWarnDw: null,
          feeWarnUp: null,
          feeAlarmDw: null,
          feeAlarmUp: null,
          dayPwrUpRatio: null,
          dayPwrDwRatio: null,
          dayFeeUpRatio: null,
          dayFeeDwRatio: null,
        },
        holderText: this.$t('pleaseEnterLowerLimit'),
        holderText2: this.$t('pleaseEnterUpperLimit'),
        holderText3: this.$t('pleaseEnter'),
        textsTipFall: this.$t('ns_electricityAndFeeMonitoringConfig.tip8'),
        textsTipUp: this.$t('ns_electricityAndFeeMonitoringConfig.tip7'),
        textsTipElecFall: this.$t('ns_electricityAndFeeMonitoringConfig.tip6'),
        textsTipElecUp: this.$t('ns_electricityAndFeeMonitoringConfig.tip5'),
        isRed: false,
        monthData: monthDateday(),
        dataDayOptions: timeSpan,
        StartTime: '00',
        EndTime: '23',
        StartMonth: '01',
        EndMonth: '31',
        startDayValue: '01-01',
        endDayValue: '12-31',
      }
    },
    computed: {
      modalTitle() {
        return ` ${this.$t('monitoringConfigurationElectricityConsumptionFees')} - ${this.addrInfo.title}`
      },
      rangeText() {
        if (this.charginForm.rangeType === '1') {
          return `${this.StartTime}~${this.EndTime}`
        } else if (this.charginForm.rangeType === '2') {
          return `${this.StartMonth}${this.StartTime}~${this.EndMonth}${this.EndTime}`
        } else if (this.charginForm.rangeType === '3') {
          return `${this.startDayValue.replace('-', '')}${this.StartTime}~${this.endDayValue.replace('-', '')}${this.EndTime}`
        }
      },
      dataDayOptionsEndHour() {
        const startHour = this.dataDayOptions.findIndex(it => it.value === this.StartTime)
        return this.dataDayOptions.map((it, index) => ({
          label: `${index <= startHour ? this.$t('nextDay') : ''}${it.label}`,
          value: it.value,
        }))
      },
    },
    methods: {
      openModal() {
        this.getProjectEnergyView()
      },
      getRed(val) {
        this.isRed = val
      },
      async getProjectEnergyView() {
        let params = { projectCode: this.$store.state.projectCode, mac: this.deviceInfo.mac, addr: this.addrInfo.addr }
        const res = await chnPlatAttrFeeMonitorConfig(params)
        if (res.success) {
          this.charginState = true
          const keys = Object.keys(this.charginForm)
          for (let index = 0; index < keys.length; index++) {
            const key = keys[index]
            this.charginForm[key] = typeof this.charginForm[key] === 'number' ? +res.data[key] : res.data[key]
          }
          this.isDisabledInput = !res.data.isSupportFee
          this.holderText = this.isDisabledInput ? this.$t('noConfigDeviceElectricityPrice') : this.$t('pleaseEnterLowerLimit')
          this.holderText2 = this.isDisabledInput ? this.$t('noConfigDeviceElectricityPrice') : this.$t('pleaseEnterUpperLimit')
          this.holderText3 = this.isDisabledInput ? this.$t('noConfigDeviceElectricityPrice') : this.$t('pleaseEnter')
          let timeRange = res.data.range && res.data.range.split('~')
          if (res.data.rangeType === '1') {
            this.StartTime = timeRange[0]
            this.EndTime = timeRange[1]
          } else if (res.data.rangeType === '2') {
            this.StartMonth = timeRange[0].substring(0, 2)
            this.EndMonth = timeRange[1].substring(0, 2)
            this.StartTime = timeRange[0].substring(2)
            this.EndTime = timeRange[1].substring(2)
          } else if (res.data.rangeType === '3') {
            this.startDayValue = timeRange[0].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
            this.endDayValue = timeRange[1].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
            this.StartTime = timeRange[0].substring(4)
            this.EndTime = timeRange[1].substring(4)
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryDeviceFeeConfig() {
        if (this.isRed) {
          return this.$Message.error({ content: this.$t('ns_electricityAndFeeMonitoringConfig.saveTip1') })
        }
        if (this.charginForm.rangeType === '2' || this.charginForm.rangeType === '3') {
          let startTime = this.rangeText.split('~')[0]
          let endTime = this.rangeText.split('~')[1]
          if (endTime < startTime) {
            return this.$Message.error({ content: this.$t('ns_electricityAndFeeMonitoringConfig.saveTip2') })
          }
        }
        let params = { projectCode: this.$store.state.projectCode, mac: this.deviceInfo.mac, addr: this.addrInfo.addr, range: this.rangeText, ...this.charginForm }
        const res = await chnPlatAttrsavePowerFeeMonitorConfig(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.charginState = false
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      startDayChange(e) {
        this.startDayValue = e
      },
      endDayChange(e) {
        this.endDayValue = e
      },
    },
  }
</script>

<style lang="less">
  .recharge {
    .startMonth,
    .endMonth {
      .ivu-select-selection {
        border: transparent;
        box-shadow: 0 0 0 0;
        .ivu-icon-ios-arrow-down:before {
          content: '';
        }
      }
      .ivu-select-dropdown {
        &::-webkit-scrollbar {
          display: none;
        }
        scrollbar-width: thin;
        -ms-overflow-style: none;
      }
      .ivu-select-placeholder,
      .ivu-select-selected-value {
        text-align: center;
        padding: 0;
      }
    }
    .time-expand-row {
      border: 1px solid #3d3d41;
      border-radius: 5px;
      display: flex;
      width: 280px;
      margin-left: 10px;
      .ivu-input {
        border: transparent;
        box-shadow: 0 0 0 0;
        text-align: center;
        padding: 0;
        color: #fff;
      }
      .ivu-date-picker-focused input:not([disabled]) {
        box-shadow: none;
      }
      .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
        line-height: 32px;
        height: 32px;
      }
      .ivu-date-picker-header-label:first-child,
      .ivu-date-picker-prev-btn-arrow-double,
      .ivu-date-picker-next-btn-arrow-double {
        display: none;
      }
      .ivu-icon-ios-calendar-outline:before {
        content: '';
      }
    }
  }
</style>
