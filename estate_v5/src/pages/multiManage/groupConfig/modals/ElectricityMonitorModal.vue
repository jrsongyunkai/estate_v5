<template>
  <div>
    <Modal v-model="isShow" :title="$t('electricityConsumptionAndFeeMonitoring')" class-name="recharge-group" width="650" @on-cancel="$emit('close')" :mask-closable="false">
      <div style="color: #d7d7d7; margin-bottom: 20px">{{ $t('timePeriodValueMonitoring') }}</div>
      <Form :model="formData" label-position="right" :label-width="150">
        <FormItem :label="`${$t('bucketType')}:`">
          <div style="display: flex">
            <Select v-model="formData.rangeType" style="width: 150px">
              <Option v-for="item in rangeTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <div class="time-group-config" v-if="formData.rangeType === '2'">
              <Select v-model="StartMonth" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
                <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              -
              <Select v-model="EndMonth" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
                <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
            <div class="time-group-config" v-if="formData.rangeType === '3'">
              <DatePicker type="date" v-model="startDayValue" :placeholder="$t('startTime')" format="MM-dd" style="width: 200px" @on-change="startDay"></DatePicker>
              -
              <DatePicker type="date" v-model="endDayValue" :placeholder="$t('endTime')" format="MM-dd" style="width: 200px" @on-change="endDay"></DatePicker>
            </div>
          </div>
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label1') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip1') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange unit="kW·h" style="width: 340px" :minValue.sync="formData.pwrWarnDw" @isRed="getRed" :maxValue.sync="formData.pwrWarnUp" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')" />
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label2') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip2') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange unit="kW·h" style="width: 340px" :minValue.sync="formData.pwrAlarmDw" @isRed="getRed" :maxValue.sync="formData.pwrAlarmUp" :minPlaceholder="$t('pleaseEnterLowerLimit')" :maxPlaceholder="$t('pleaseEnterUpperLimit')" />
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label3') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip2') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange :unit="$t('yuan')" style="width: 340px" :disabled="isDisabledInput" :minValue.sync="formData.feeWarnDw" :maxValue.sync="formData.feeWarnUp" @isRed="getRed" :minPlaceholder="holderText" :maxPlaceholder="holderText2" />
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label4') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; width: 400px">{{ $t('ns_electricityAndFeeMonitoringConfig.tip2') }}</div>
            </Tooltip>
            :
          </span>
          <InputNumberRange :unit="$t('yuan')" style="width: 340px" :disabled="isDisabledInput" :minValue.sync="formData.feeAlarmDw" :maxValue.sync="formData.feeAlarmUp" @isRed="getRed" :minPlaceholder="holderText" :maxPlaceholder="holderText2" />
        </FormItem>
        <div style="color: #d7d7d7; margin-bottom: 20px">{{ $t('dailyValueMutationMonitoring') }}</div>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label5') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; max-width: 250px">{{ textsTipElecUp }}</div>
            </Tooltip>
            :
          </span>
          <InputNumber style="width: 340px" class="none-handler-wrap" type="number" :min="0" v-model="formData.dayPwrUpRatio" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label6') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; max-width: 250px">{{ textsTipElecFall }}</div>
            </Tooltip>
            :
          </span>
          <InputNumber style="width: 340px" class="none-handler-wrap" type="number" :min="0" v-model="formData.dayPwrDwRatio" :placeholder="$t('pleaseEnter')" />
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label7') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; max-width: 250px">{{ textsTipUp }}</div>
            </Tooltip>
            :
          </span>
          <InputNumber style="width: 340px" class="none-handler-wrap" type="number" :min="0" v-model="formData.dayFeeUpRatio" :disabled="isDisabledInput" :placeholder="holderText3" />
        </FormItem>
        <FormItem>
          <span slot="label">
            {{ $t('ns_electricityAndFeeMonitoringConfig.label8') }}
            <Tooltip placement="top" max-width="250">
              <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
              <div slot="content" style="white-space: normal; max-width: 250px">{{ textsTipFall }}</div>
            </Tooltip>
            :
          </span>
          <InputNumber style="width: 340px" class="none-handler-wrap" type="number" :min="0" v-model="formData.dayFeeDwRatio" :disabled="isDisabledInput" :placeholder="holderText3" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="default" @click.stop="$emit('close')">{{ $t('cancel') }}</Button>
        <Button type="primary" @click.stop="queryDeviceFeeConfig">{{ $t('save') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { monthDateday } from '../../threShold/data'
  import { boxGroupPowerFeeMonitorConfig, boxGroupsavePowerFeeMonitorConfig } from '@/api/public'
  import { omit } from 'lodash'
  export default {
    props: {
      record: { type: Object, default: () => {} },
      callback: { type: Function, default: () => {} },
    },
    data() {
      return {
        textsTipFall: this.$t('ns_electricityAndFeeMonitoringConfig.tip8'),
        textsTipUp: this.$t('ns_electricityAndFeeMonitoringConfig.tip7'),
        textsTipElecFall: this.$t('ns_electricityAndFeeMonitoringConfig.tip6'),
        textsTipElecUp: this.$t('ns_electricityAndFeeMonitoringConfig.tip5'),
        holderText: this.$t('pleaseEnterLowerLimit'),
        holderText2: this.$t('pleaseEnterUpperLimit'),
        holderText3: this.$t('pleaseEnter'),
        isDisabledInput: false,
        monthData: monthDateday(),
        isShow: false,
        formData: { rangeType: '', pwrWarnDw: '', pwrWarnUp: '', pwrAlarmDw: '', pwrAlarmUp: '', feeWarnDw: '', feeWarnUp: '', feeAlarmDw: '', feeAlarmUp: '', dayPwrUpRatio: '', dayPwrDwRatio: '', dayFeeUpRatio: '', dayFeeDwRatio: '' },
        rangeTypeOptions: [
          { value: '0', label: this.$t('hourly') },
          { value: '1', label: this.$t('everyDay') },
          { value: '2', label: this.$t('monthly') },
          { value: '3', label: this.$t('annually') },
        ],
        startDayValue: '01-01',
        endDayValue: '12-31',
        StartMonth: '01',
        EndMonth: '31',
        StartTime: '00',
        EndTime: '23',
      }
    },
    computed: {
      rangeText() {
        if (this.formData.rangeType === '1') {
          return `${this.StartTime}~${this.EndTime}`
        } else if (this.formData.rangeType === '2') {
          return `${this.StartMonth}${this.StartTime}~${this.EndMonth}${this.EndTime}`
        } else if (this.formData.rangeType === '3') {
          return `${this.startDayValue.replace('-', '')}${this.StartTime}~${this.endDayValue.replace('-', '')}${this.EndTime}`
        }
      },
    },
    methods: {
      startDay(val) {
        this.startDayValue = val
      },
      endDay(val) {
        this.endDayValue = val
      },
      getRed(val) {
        this.isRed = val
      },
      async getProjectEnergyView() {
        let params = { projectCode: this.$store.state.projectCode, nodeId: this.record.id }
        const res = await boxGroupPowerFeeMonitorConfig(params)
        if (res.success) {
          this.formData = { ...this.formData, ...omit(res.data, ['isSupportFee']) }
          this.isDisabledInput = !res.data.isSupportFee
          this.holderText = this.isDisabledInput ? this.$t('unconfiguredGroupElectricityPrice') : this.$t('pleaseEnterLowerLimit')
          this.holderText2 = this.isDisabledInput ? this.$t('unconfiguredGroupElectricityPrice') : this.$t('pleaseEnterUpperLimit')
          this.holderText3 = this.isDisabledInput ? this.$t('unconfiguredGroupElectricityPrice') : this.$t('pleaseEnter')
          let timeRange = res.data.range && res.data.range.split('~')
          if (res.data.rangeType === '1') {
            this.StartTime = '00'
            this.EndTime = '23'
          } else if (res.data.rangeType === '2') {
            this.StartMonth = timeRange[0].substring(0, 2)
            this.EndMonth = timeRange[1].substring(0, 2)
            this.StartTime = '00'
            this.EndTime = '23'
          } else if (res.data.rangeType === '3') {
            this.startDayValue = timeRange[0].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
            this.endDayValue = timeRange[1].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
            this.StartTime = '00'
            this.EndTime = '23'
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryDeviceFeeConfig() {
        if (this.isRed) return this.$Message.error({ content: this.$t('ns_electricityAndFeeMonitoringConfig.saveTip1') })
        let { rangeType } = this.formData
        let otherParams = {}
        Object.keys(this.formData).forEach(key => {
          otherParams[key] = `${this.formData[key]}`
        })
        if (rangeType === '2' || rangeType === '3') {
          let startTime = this.rangeText.split('~')[0]
          let endTime = this.rangeText.split('~')[1]
          if (endTime < startTime) {
            return this.$Message.error({ content: this.$t('ns_carbonEmissionAlarm.saveTip') })
          }
        }
        let params = { projectCode: this.$store.state.projectCode, nodeId: this.record.id, range: this.rangeText, ...otherParams }
        const res = await boxGroupsavePowerFeeMonitorConfig(params)
        if (res.success) {
          this.$Message.success({ content: this.$t('savedSuccessfully') })
          this.$emit('close')
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {
      this.getProjectEnergyView()
    },
    mounted() {
      this.isShow = true
    },
  }
</script>
<style lang="less">
  .recharge-group {
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
      }
      .ivu-select-placeholder,
      .ivu-select-selected-value {
        text-align: center;
        padding: 0;
      }
    }

    .time-group-config {
      border: 1px solid #3d3d41;
      border-radius: 5px;
      display: flex;
      width: 280px;
      margin-left: 20px;
      .ivu-input {
        border: transparent;
        box-shadow: 0 0 0 0;
        text-align: center;
        padding: 0;
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
