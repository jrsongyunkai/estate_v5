<template>
  <Modal v-model="isOpened" :title="$t('carbonEmissionAlarmSettings')" width="520px" :mask-closable="false">
    <MForm ref="form" v-if="isOpened" :formSetting="formSetting" v-model="formData" :labelWidth="120">
      <template #ceAlarmUp>
        <span>
          {{ $t('ns_carbonEmissionAlarm.label1') }}
          <Tooltip placement="top" max-width="250" transfer>
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content">{{ $t('ns_carbonEmissionAlarm.tip1') }}</div>
          </Tooltip>
          <span>:</span>
        </span>
      </template>
      <template #ceWarmUp>
        <span>
          {{ $t('ns_carbonEmissionAlarm.label2') }}
          <Tooltip placement="top" max-width="250" transfer>
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content">{{ $t('ns_carbonEmissionAlarm.tip2') }}</div>
          </Tooltip>
          <span>:</span>
        </span>
      </template>
      <template #ceSurgeRatio>
        <span>
          {{ $t('ns_carbonEmissionAlarm.label3') }}
          <Tooltip placement="top" max-width="250" transfer>
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content">{{ $t('ns_carbonEmissionAlarm.tip3') }}</div>
          </Tooltip>
          <span>:</span>
        </span>
      </template>
      <template #ceDropRatio>
        <span>
          {{ $t('ns_carbonEmissionAlarm.label4') }}
          <Tooltip placement="top" max-width="250" transfer>
            <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
            <div slot="content">{{ $t('ns_carbonEmissionAlarm.tip4') }}</div>
          </Tooltip>
          <span>:</span>
        </span>
      </template>
      <template #periodType>
        <div class="flex">
          <Select class="select-type" v-model="formData.periodType" style="width: 80px" transfer>
            <Option v-for="item in timeSpanTypeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <div class="time-expand-row" v-if="formData.periodType === 2 && [3, 4].includes(formData.objType)">
            <Select v-model="StartTime" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <Select v-model="EndTime" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="time-expand-row" v-if="formData.periodType === 3">
            <Select v-model="StartMonth" style="width: 150px" class="startMonth" :placeholder="$t('startDate')">
              <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-if="[3, 4].includes(formData.objType)" v-model="StartTime" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <Select v-model="EndMonth" style="width: 150px" class="endMonth" :placeholder="$t('endDate')">
              <Option v-for="item in monthData" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Select v-if="[3, 4].includes(formData.objType)" v-model="EndTime" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
          <div class="time-expand-row" v-if="formData.periodType === 4">
            <DatePicker type="date" v-model="startDayValue" :placeholder="$t('startDate')" transfer format="MM-dd" style="width: 150px" @on-change="startDayChange"></DatePicker>
            <Select v-if="[3, 4].includes(formData.objType)" v-model="StartTime" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            -
            <DatePicker type="date" v-model="endDayValue" :placeholder="$t('endDate')" transfer format="MM-dd" style="width: 150px" @on-change="endDayChange"></DatePicker>
            <Select v-if="[3, 4].includes(formData.objType)" v-model="EndTime" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
              <Option v-for="item in dataDayOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </div>
      </template>
      <template #objSlot>
        <GroupPick v-if="formData.objType === 2" v-model="groupInfo"></GroupPick>
        <DevicePick v-if="formData.objType === 3" v-model="deviceInfo.resId"></DevicePick>
        <DeviceAddrPick v-if="formData.objType === 4" v-model="addrInfo" />
      </template>
    </MForm>
    <div slot="footer">
      <Button type="primary" class="ml-10" @click.stop="saveInfo">{{ $t('confirm2') }}</Button>
      <Button type="default" class="ml-10" @click.stop="closeModal">{{ $t('cancel') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import DevicePick from './DevicePick.vue'
  import DeviceAddrPick from './DeviceAddrPick.vue'
  import { queryByProjectCode, saveOrUpdate } from '@/api/energyMonitor/carbon'
  import { monthDateday, timeSpan } from '@/pages/multiManage/threShold/data'
  export default {
    components: { DevicePick, DeviceAddrPick },
    data() {
      return {
        isOpened: false,
        formData: { id: '', objType: 1, periodType: 1, obj: null, ceAlarmUp: null, ceWarmUp: null, ceSurgeRatio: null, ceDropRatio: null },
        groupInfo: { groupId: '', groupNodeId: '' },
        deviceInfo: { resId: '', addr: '' },
        addrInfo: [],
        objTypeOptions: [
          { label: this.$t('ns_carbonEmissionAlarm.level1'), value: 1 },
          { label: this.$t('ns_carbonEmissionAlarm.level2'), value: 2 },
          { label: this.$t('ns_carbonEmissionAlarm.level3'), value: 3 },
          { label: this.$t('ns_carbonEmissionAlarm.level4'), value: 4 },
        ],
        StartTime: '00',
        EndTime: '23',
        StartMonth: '01',
        EndMonth: '31',
        dataDayOptions: timeSpan,
        monthData: monthDateday(),
        startDayValue: '01-01',
        endDayValue: '12-31',
      }
    },
    computed: {
      formSetting() {
        const { objType } = this.formData
        return [
          { formType: 'Select', label: `${this.$t('configurationObject')}:`, prop: 'objType', options: this.objTypeOptions, colSpan: 24, event: '' },
          { formType: 'Slot', isLoad: objType !== 1 && objType, label: ' ', prop: 'objSlot', colSpan: 24 },
          { formType: 'Slot', label: `${this.$t('bucketType')}:`, prop: 'periodType', colSpan: 24 },
          { formType: 'NumberInput', labelSlot: 'ceWarmUp', label: `${this.$t('ns_carbonEmissionAlarm.label2')}:`, prop: 'ceWarmUp', InputRule: 'ThreeDecimal', unit: 'kgCO₂', colSpan: 24, event: '' },
          { formType: 'NumberInput', labelSlot: 'ceAlarmUp', label: `${this.$t('ns_carbonEmissionAlarm.label1')}:`, prop: 'ceAlarmUp', InputRule: 'ThreeDecimal', unit: 'kgCO₂', colSpan: 24, event: '' },
          { formType: 'NumberInput', labelSlot: 'ceSurgeRatio', label: `${this.$t('ns_carbonEmissionAlarm.label3')}:`, prop: 'ceSurgeRatio', InputRule: 'TwoDecimal', colSpan: 24, unit: '%', event: '' },
          { formType: 'NumberInput', labelSlot: 'ceDropRatio', label: `${this.$t('ns_carbonEmissionAlarm.label4')}:`, prop: 'ceDropRatio', InputRule: 'TwoDecimal', colSpan: 24, unit: '%', event: '' },
        ]
      },
      period() {
        const { objType, periodType } = this.formData
        if (periodType === 1) {
          return ['', '']
        } else if (periodType === 2) {
          return [3, 4].includes(objType) ? [`${this.StartTime}`, `${this.EndTime}`] : ['00', '00']
        } else if (periodType === 3) {
          return [3, 4].includes(objType) ? [`${this.StartMonth}${this.StartTime}`, `${this.EndMonth}${this.EndTime}`] : [`${this.StartMonth}00`, `${this.EndMonth}00`]
        } else if (periodType === 4) {
          return [3, 4].includes(objType) ? [`${this.startDayValue.replace('-', '')}${this.StartTime}`, `${this.endDayValue.replace('-', '')}${this.EndTime}`] : [`${this.startDayValue.replace('-', '')}00`, `${this.endDayValue.replace('-', '')}00`]
        }
      },
      timeSpanTypeOptions() {
        return [1, 2].includes(this.formData.objType)
          ? [
              { label: this.$t('everyDay'), value: 2 },
              { label: this.$t('monthly'), value: 3 },
              { label: this.$t('annually'), value: 4 },
            ]
          : [
              { label: this.$t('hourly'), value: 1 },
              { label: this.$t('everyDay'), value: 2 },
              { label: this.$t('monthly'), value: 3 },
              { label: this.$t('annually'), value: 4 },
            ]
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
      startDayChange(e) {
        this.startDayValue = e
      },
      endDayChange(e) {
        this.endDayValue = e
      },
      async openModel() {
        const res = await queryByProjectCode({ projectCode: this.$store.state.projectCode })
        if (res.success) {
          this.isOpened = true
          if (res.data) {
            let { objType, periodType, period, thresholdCfg, obj } = res.data
            this.formData.id = res.data.id
            this.formData.objType = objType
            this.formData.periodType = periodType
            let { ceAlarmUp, ceWarmUp, ceSurgeRatio, ceDropRatio } = JSON.parse(thresholdCfg)
            let { groupId, groupNodeId, resId, addr } = JSON.parse(obj)
            if (objType === 1) {
            } else if (objType === 2) {
              this.groupInfo = { groupId, groupNodeId }
            } else if (objType === 3) {
              this.deviceInfo = { resId, addr }
            } else if (objType === 4) {
              this.addrInfo = [resId, addr]
            }
            this.formData.ceAlarmUp = ceAlarmUp
            this.formData.ceWarmUp = ceWarmUp
            this.formData.ceSurgeRatio = ceSurgeRatio
            this.formData.ceDropRatio = ceDropRatio
            let periodRange = period.split('~')
            if (periodType === 2) {
              this.StartTime = periodRange[0]
              this.EndTime = periodRange[1]
            } else if (periodType === 3) {
              this.StartMonth = periodRange[0].substring(0, 2)
              this.EndMonth = periodRange[1].substring(0, 2)
              this.StartTime = periodRange[0].substring(2)
              this.EndTime = periodRange[1].substring(2)
            } else if (periodType === 4) {
              this.startDayValue = periodRange[0].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
              this.endDayValue = periodRange[1].substring(0, 4).replace(/(\d{2})(\d{2})/, '$1-$2')
              this.StartTime = periodRange[0].substring(4)
              this.EndTime = periodRange[1].substring(4)
            }
          }
        } else {
          this.$Message.error(res.message)
        }
      },
      closeModal() {
        this.isOpened = false
      },
      async saveInfo() {
        const { objType, periodType } = this.formData
        let obj = { projectCode: this.$store.state.projectCode, ...this.groupInfo, ...this.deviceInfo }
        if (objType === 1) {
          obj = { projectCode: this.$store.state.projectCode }
        } else if (objType === 2) {
          obj = { projectCode: this.$store.state.projectCode, ...this.groupInfo }
        } else if (objType === 3) {
          obj = { projectCode: this.$store.state.projectCode, ...this.deviceInfo }
        } else if (objType === 4) {
          obj = { ...obj, resId: this.addrInfo[0], addr: this.addrInfo[1] }
        }
        if ([3, 4].includes(periodType) && +this.period[1] < +this.period[0]) {
          return this.$Message.error({ content: this.$t('ns_carbonEmissionAlarm.saveTip') })
        }
        let params = {
          id: this.formData.id || '',
          projectCode: this.$store.state.projectCode,
          objType: this.formData.objType,
          obj: JSON.stringify(obj),
          periodType: this.formData.periodType,
          period: this.period.join('~'),
          thresholdCfg: JSON.stringify({
            ceAlarmUp: this.formData.ceAlarmUp,
            ceWarmUp: this.formData.ceWarmUp,
            ceSurgeRatio: this.formData.ceSurgeRatio,
            ceDropRatio: this.formData.ceDropRatio,
          }),
        }
        const res = await saveOrUpdate(params)
        if (res.success) {
          this.$Message.success(this.$t('savedSuccessfully'))
          this.closeModal()
        } else {
          this.$Message.error(res.message)
        }
      },
    },
  }
</script>

<style lang="less" scoped>
  .flex {
    display: flex;
    align-items: center;
    .select-type {
      width: 80px;
    }
    .time-expand-row {
      border: 1px solid #3d3d41;
      border-radius: 5px;
      display: flex;
      width: 280px;
      margin-left: 10px;
      align-items: center;
      /deep/ .ivu-input {
        border: transparent;
        box-shadow: 0 0 0 0;
        text-align: center;
        padding: 0;
      }
      /deep/.ivu-select-selection {
        border: transparent;
        box-shadow: 0 0 0 0;
        text-align: center;
        padding: 0;
      }
      /deep/.ivu-select-placeholder {
        line-height: 32px;
      }
      /deep/ .ivu-date-picker-header-label:first-child,
      /deep/.ivu-date-picker-prev-btn-arrow-double,
      /deep/ .ivu-date-picker-next-btn-arrow-double {
        display: none;
      }
      /deep/.ivu-icon-ios-calendar-outline:before {
        content: '';
      }
    }
    .startMonth,
    .endMonth {
      /deep/ .ivu-select-selection {
        border: transparent;
        box-shadow: 0 0 0 0;
        .ivu-icon-ios-arrow-down:before {
          content: '';
        }
      }
      /deep/ .ivu-select-dropdown {
        scrollbar-width: thin;
        -ms-overflow-style: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      /deep/ .ivu-select-placeholder,
      /deep/.ivu-select-selected-value {
        text-align: center;
        padding: 0;
      }
    }
  }
</style>
