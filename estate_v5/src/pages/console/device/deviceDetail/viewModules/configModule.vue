<template>
  <div class="config-view">
    <div class="left">
      <LinesSelectView ref="LinesSelectViewRef" @nodeClick="nodeClick"></LinesSelectView>
    </div>
    <div class="right" v-if="addrInfo.addr">
      <div class="mo-item">
        <div class="header">
          <div class="left-title">
            <div class="bor"></div>
            <div>{{ $t('parameterConfiguration') }}</div>
          </div>
          <div class="right-button" v-if="!addrInfo.clearModel.includes('JIA_HE')">
            <Button v-if="addrInfo.lineType === 'IO'" type="primary" ghost @click="openExcuteModal">{{ $t('switchingValueSplitEndAlarm') }}</Button>
            <template v-else>
              <Button v-if="configInfo.isEnableAlarm" type="primary" class="ml-5" ghost @click.stop="handleCharginShow">{{ $t('electricityConsumptionAndFeeMonitoring') }}</Button>
              <Button type="primary" class="ml-5" ghost @click.stop="handleTheft">{{ $t('electricityTheftMonitoringConfiguration') }}</Button>
              <Button v-if="configInfo.isEnableAlarm" type="primary" class="ml-5" ghost @click.stop="handleEnable('alarm')">{{ $t('enableAlarmconfigure') }}</Button>
              <Button v-if="configInfo.isEnableTrip" type="primary" class="ml-5" ghost @click.stop="handleEnable('trip')">{{ $t('enableTripconfigure') }}</Button>
              <Button v-if="deviceInfo.equipmentType === 1" type="primary" class="ml-5" ghost @click.stop="reCloseEnableConfig">{{ $t('reCloseConfig') }}</Button>
              <Button v-if="deviceInfo.equipmentType === 1" type="primary" class="ml-5" ghost @click.stop="reCloseTimeConfig">{{ $t('reCloseTime') }}</Button>
            </template>
          </div>
        </div>
        <div class="content">
          <Table class="table-content" v-if="addrInfo.lineType === 'IO' || addrInfo.clearModel.includes('JIA_HE')" :columns="threliCoulumsNew" max-height="600" :data="thresholdTypeListNew" :no-data-text="addrInfo.clearModel.includes('JIA_HE') ? $t('toolTipText14') : $t('toolTipText15')">
            <template slot-scope="{ row }" slot="model">
              <span>{{ row.model === 1 ? $t('simpleMode') : row.model === 2 ? $t('timeSharingMode') : $t('defaultMode') }}</span>
            </template>
            <template slot-scope="{ row }" slot="alertThresholdRange">
              <div v-if="!row.isSelected">
                <span class="warn">{{ row.warnValueList[0] }}</span>
                <span style="margin: 0 10px; color: #f7a352">-</span>
                <span class="warn">{{ row.warnValueList[1] }}</span>
              </div>
              <div v-if="row.isSelected" style="display: flex; align-items: center">
                <div v-if="row.isSelectedSub">
                  <InputNumber v-model="row.warnValueList[0]" @on-focus="handlefocusWarnValue(row.warnValueList[0])" class="warn" />
                </div>
                <span style="margin: 0 10px; color: #f7a352">-</span>
                <div v-if="row.isSelectedSub">
                  <InputNumber v-model="row.warnValueList[1]" @on-focus="handlefocusWarnValue(row.warnValueList[1])" class="warn" />
                </div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="alertType">
              <span v-if="!row.isSelected">{{ row.warnCustomName === '' ? '-' : row.warnCustomName }}</span>
              <Select :transfer="true" v-else v-model="row.warnCustomId" style="width: 100%" :clearable="true" :not-found-text="$t('customNodata')">
                <Option v-for="item in customName" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </template>
            <template slot-scope="{ row }" slot="alarmThresholdRange">
              <div v-if="!row.isSelected">
                <span class="alarm">{{ row.alarmValueList[0] }}</span>
                <span style="margin: 0 10px; color: #da3b39">-</span>
                <span class="alarm">{{ row.alarmValueList[1] }}</span>
              </div>
              <div v-if="row.isSelected && row.isSelectedSub" style="display: flex; align-items: center">
                <div v-if="row.isSelectedSub">
                  <InputNumber v-model="row.alarmValueList[0]" @on-focus="handlefocusAlarmValue(row.alarmValueList[0])" class="warn" />
                </div>
                <span style="margin: 0 10px; color: #da3b39">-</span>
                <div>
                  <InputNumber v-model="row.alarmValueList[1]" @on-focus="handlefocusAlarmValue(row.alarmValueList[1])" class="warn" />
                </div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="alarmTpye">
              <span v-if="!row.isSelected">{{ row.alarmCustomName === '' ? '-' : row.alarmCustomName }}</span>
              <Select :transfer="true" v-else v-model="row.alarmCustomId" style="width: 100%" :clearable="true" :not-found-text="$t('customNodata')">
                <Option v-for="item in customName" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </template>
            <template slot-scope="{ row }" slot="unit">
              <span>{{ row.unit === '' ? '--' : row.unit }}</span>
            </template>
            <template slot-scope="{ row, index }" slot="action">
              <Button type="text" class="action" @click="thresholdSetting(row)" v-if="!row.isSelected">{{ $t('thresholdSetting') }}</Button>
              <template v-if="row.isSelected">
                <Button type="text" class="action" @click="openPwdsModal(row)">{{ $t('save') }}</Button>
                <Button type="text" class="alarm" @click="cancle(row, index)">{{ $t('cancel') }}</Button>
              </template>
            </template>
          </Table>
          <Table class="table-content" v-else max-height="600" :columns="threliCoulums" :data="thresholdTypeList">
            <template slot-scope="{ row }" slot="thresholdName">
              <span>{{ `${row.thresholdName}` }}{{ row.unit === '' ? '' : `(${row.unit})` }}</span>
            </template>
            <template slot-scope="{ row }" slot="limitType">
              <span>
                <i :class="row.limitType === 1 ? 'icon-v5 icon-v5-shangxian shangxian' : row.limitType === 2 ? 'icon-v5 icon-v5-xiaxian xiaxian' : row.limitType === 3 ? 'icon-v5 icon-v5-xiaxian xiaxian' : '-'"></i>
                {{ row.limitType === 1 ? $t('upperLimit') : row.limitType === 2 ? $t('lowerLimit') : row.limitType === 3 ? $t('lowerLimit') : '-' }}
              </span>
            </template>
            <template slot-scope="{ row }" slot="model">
              <span>{{ row.model === 1 ? $t('simpleMode') : row.model === 2 ? $t('timeSharingMode') : $t('defaultMode') }}</span>
            </template>
            <template slot-scope="{ row }" slot="warning">
              <span class="warn" v-if="!row.isSelected">{{ row.warnValue || '-' }}</span>
              <div v-if="row.isSelected && row.isSelectedSub">
                <Icon custom="icon-v5 icon-v5-ic_prohibited24px" style="color: #999" v-if="row.subType === 901" />
                <Input
                  v-inputNumberRule="row.thresholdName === $t('current') ? 'TwoDecimal' : row.thresholdName.includes($t('leakageMonitoring')) ? 'OneDecimal' : row.thresholdName.includes($t('temperature')) ? 'OneRealNumber' : ''"
                  v-model="row.warnValue"
                  @on-focus="handlefocusWarnValue(row.warnValue)"
                  class="warn"
                  v-else />
                <div class="dis-position">
                  <div class="position-Right pointer" @click="row.warnValue = row.defWarnThreshold">{{ $t('writeDefault') }}</div>
                </div>
              </div>
            </template>
            <template slot-scope="{ row }" slot="alarm">
              <span class="alarm" v-if="!row.isSelected">{{ row.alarmValue || '-' }}</span>
              <div v-if="row.isSelected">
                <InputNumber :max="100" :min="0" v-model="row.alarmValue" @on-focus="handlefocusAlarmValue(row.alarmValue)" class="alarm" v-if="row.subType === 901" style="width: 178px" />
                <Input
                  v-inputNumberRule="row.thresholdName === $t('current') ? 'TwoDecimal' : row.thresholdName.includes($t('leakageMonitoring')) ? 'OneDecimal' : row.thresholdName.includes($t('temperature')) ? 'OneRealNumber' : ''"
                  v-model="row.alarmValue"
                  @on-focus="handlefocusAlarmValue(row.alarmValue)"
                  class="alarm"
                  v-else />
                <div class="dis-position">
                  <div class="position-Right pointer" @click="row.alarmValue = row.defAlarmThreshold">{{ $t('writeDefault') }}</div>
                </div>
              </div>
            </template>

            <template slot-scope="{ row, index }" slot="action">
              <Button type="text" class="action" @click="thresholdSetting(row, index)" v-if="!row.isSelected">{{ $t('thresholdSetting') }}</Button>
              <template v-if="row.isSelected">
                <Button type="text" class="action" @click="openPwdsModal(row)">{{ $t('save') }}</Button>
                <Button type="text" class="alarm" @click="cancle(row, index)">{{ $t('cancel') }}</Button>
              </template>
              <Button v-if="row.subType === 701" type="text" class="action" @click="electricityCharge('power', row)">{{ $t('detectionPeriod') }}</Button>
              <Button v-if="row.subType === 702" type="text" class="action" @click="electricityCharge('fees', row)">{{ $t('detectionPeriod') }}</Button>
            </template>
          </Table>
        </div>
      </div>
    </div>
    <OperationCheckAuth ref="operationCheckAuth" :action="thresholdSave"></OperationCheckAuth>
    <Modal v-model="electricityShow" :title="electricityTitle" class="electrcity">
      <Form>
        <FormItem :label="$t('detectionPeriod')">
          <Select v-model="rangeType" style="width: 200px">
            <Option v-for="item in datePickerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="68">
          <template v-if="rangeType === 2">
            <div class="timer">
              <Select v-model="StartMonth" style="width: 150px" class="startMonth" :placeholder="$t('startTime')">
                <Option v-for="item in dataDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              -
              <Select v-model="EndMonth" style="width: 150px" class="endMonth" :placeholder="$t('endTime')">
                <Option v-for="item in dataDay" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </div>
          </template>
          <template v-if="rangeType === 3">
            <div class="timer">
              <DatePicker type="date" v-model="startDayValue" :placeholder="$t('startTime')" format="MM-dd" style="width: 200px" @on-change="startDay"></DatePicker>
              -
              <DatePicker type="date" v-model="endDayValue" :placeholder="$t('endTime')" format="MM-dd" style="width: 200px" @on-change="endDay"></DatePicker>
            </div>
          </template>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="handleSaveThres">{{ $t('confirm') }}</Button>
        <Button type="text" @click="electricityShow = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <ElectricMonitoringModal ref="electricMonitoringModal" :addrInfo="addrInfo"></ElectricMonitoringModal>
    <EnableConfigModal ref="enableConfigModal" :addrInfo="addrInfo" :configInfo="configInfo" @updateConfigInfo="rehandleQueryParams"></EnableConfigModal>
    <Modal :title="$t('executeDetail')" v-model="excuteModal" :mask="false" :mask-closable="false" width="480">
      <div v-for="(item, index) in opneCloseMeasure" :key="index" class="mr-15">
        <div class="dis-flex">
          <span class="mr-top">{{ item.name }}:</span>
          <span>
            <Cascader v-model="item.alarmType" :data="alarmsLists" :show-all-levels="false" :clearable="false" class="w-200"></Cascader>
          </span>
        </div>
      </div>
      <div slot="footer">
        <Button type="primary" @click="saveExcuteDetails">{{ $t('save') }}</Button>
        <Button @click="excuteModal = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import LinesSelectView from './modulesSubView/LinesSelectView.vue'
  import ElectricMonitoringModal from './modulesSubView/ElectricMonitoringModal.vue'
  import EnableConfigModal from './modulesSubView/EnableConfigModal.vue'
  import { queryParams, saveDefaultThresholdConfig, queryAlarmForConfig, saveThresholdConfigTimeRange, querySwitchQuantityAlarmDetails } from '@/api/public'
  import { saveBoxProperty } from '@/api/control/index'
  import { dataDay } from '@/pages/multiManage/threShold/data'
  import { retry } from '@utils/common'
  import ReCloseEnableModal from './component/ReCloseEnableModal.vue'
  import ReCloseTimeModal from './component/ReCloseTimeModal.vue'

  export default {
    components: { LinesSelectView, ElectricMonitoringModal, EnableConfigModal },
    inject: ['rowDeviceInfo', 'openBizModal'],
    data() {
      return {
        deviceInfo: this.rowDeviceInfo,
        addrInfo: {},
        downCmd: true,
        configInfo: {},
        threliCoulums: [
          { title: this.$t('paramsType'), slot: 'thresholdName', minWidth: 120 },
          { title: this.$t('upperLowerlimit'), slot: 'limitType', width: 100 },
          { title: this.$t('thresholdType'), slot: 'model', width: 100 },
          { title: this.$t('warningValue'), key: 'warning', slot: 'warning', minWidth: 150 },
          { title: this.$t('defaultWarnValue'), key: 'defWarnThreshold', width: 120 },
          { title: this.$t('alarmValue'), key: 'alarm', slot: 'alarm', minWidth: 150 },
          { title: this.$t('defaultAlarmValue'), key: 'defAlarmThreshold', width: 120 },
          { title: this.$t('operation'), key: 'action', slot: 'action', align: 'center', fixed: 'right', width: 160 },
        ],
        threliCoulumsNew: [
          { title: this.$t('port'), key: 'thresholdName', minWidth: 100 },
          { title: this.$t('thresholdType'), slot: 'model', minWidth: 100 },
          { title: this.$t('alertThresholdRange'), slot: 'alertThresholdRange', minWidth: 160 },
          { title: this.$t('alertType'), slot: 'alertType', minWidth: 100 },
          { title: this.$t('alarmThresholdRange'), slot: 'alarmThresholdRange', minWidth: 160 },
          { title: this.$t('alarmType'), slot: 'alarmTpye', minWidth: 100 },
          { title: this.$t('unit'), slot: 'unit' },
          { title: this.$t('operation'), slot: 'action', minWidth: 100, fiexd: 'right' },
        ],
        thresholdTypeList: [],
        thresholdTypeListNew: [],
        warnValue: '',
        alarmValue: '',
        focusWarn: false,
        focusAlarm: false,
        rowsDatas: {},
        openSeconedPwd: false,
        customName: [],
        dataDay,
        charge: {},
        electricityShow: false,
        electricityTitle: '',
        rangeType: 1,
        StartMonth: '',
        EndMonth: '',
        startDayValue: '',
        endDayValue: '',
        datePickerList: [
          { value: 1, label: this.$t('everyday') },
          { value: 2, label: this.$t('monthly') },
          { value: 3, label: this.$t('annually') },
        ],
        alarmsLists: [],
        opneCloseMeasure: [],
        excuteModal: false,
        cancelRetry: null,
      }
    },
    methods: {
      // 选择线路
      nodeClick(info) {
        this.addrInfo = JSON.parse(JSON.stringify(info))
        this.handleQueryParams()
      },
      // 线路信息查询
      async handleQueryParams() {
        let params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr, downCmd: this.downCmd }
        let res = await queryParams(params)
        if (res.success) {
          this.configInfo = res.data
          this.thresholdTypeList = []
          this.thresholdTypeListNew = []
          if (this.addrInfo.lineType !== 'IO') {
            this.thresholdTypeList = res.data.boxAddrThresholdList.map(item => {
              return { ...item, isSelected: false, isSelectedSub: true, leakageSoft: false }
            })
          } else if (res.data.supportThresholdConfig === true) {
            this.thresholdTypeListNew = res.data.boxAddrThresholdNewList.map(val => {
              return {
                ...val,
                isSelected: false,
                isSelectedSub: true,
                leakageSoft: false,
                alarmValueList: val.alarmValueList.map(v => (v !== '-' ? +v : '')),
                warnValueList: val.warnValueList.map(v => (v !== '-' ? +v : '')),
              }
            })
          }
        } else {
          this.$message.error(res.message)
        }
      },
      // 阈值设定
      thresholdSetting(row) {
        if (row.model === 0) {
          row.isSelected = !row.isSelected
        } else if (this.lineType === 'IO') {
          this.$router.push({ name: 'multiManage-threShold', params: { topaddrs: `${this.deviceInfo.mac}_${this.addrInfo.addr}_${row.subTypeList[0]}_${row.subTypeList[1]}` } })
        } else {
          this.$router.push({ name: 'multiManage-threShold', params: { topaddrs: `${this.deviceInfo.mac}_${this.addrInfo.addr}_${row.subType}` } })
        }
      },
      rehandleQueryParams() {
        this.cancelRetry && this.cancelRetry()
        this.cancelRetry = retry(this.handleQueryParams, 0, 3000, false)
      },
      handlefocusWarnValue(val) {
        this.warnValue = val
        this.focusWarn = true
      },
      handlefocusAlarmValue(val) {
        this.alarmValue = val
        this.focusAlarm = true
      },
      cancle(row) {
        if (this.focusWarn) {
          row.warnValue = this.warnValue
        }
        if (this.focusAlarm) {
          row.alarmValue = this.alarmValue
        }
        row.isSelected = !row.isSelected
      },
      openPwdsModal(row) {
        this.$refs.operationCheckAuth.openModal(row)
      },
      startDay(val) {
        this.startDayValue = `${val.split('-')[0]}${val.split('-')[1]}`
      },
      endDay(val) {
        this.endDayValue = `${val.split('-')[0]}${val.split('-')[1]}`
      },
      electricityCharge(type, data) {
        this.charge = data
        this.electricityShow = true
        this.electricityTitle = type === 'power' ? this.$t('emonitoringPeriods') : this.$t('priceMonitoringPeriod')
        this.rangeType = JSON.parse(data.attrValue).rangeType
        if (this.rangeType === 2) {
          this.StartMonth = JSON.parse(data.attrValue).range.split('~')[0]
          this.EndMonth = JSON.parse(data.attrValue).range.split('~')[1]
        } else if (this.rangeType === 3) {
          const obj = JSON.parse(data.attrValue).range.split('~')
          this.startDayValue = `${obj[0].substring(0, 2)}${obj[0].substring(2, 4)}`
          this.endDayValue = `${obj[1].substring(0, 2)}${obj[1].substring(2, 4)}`
        }
      },
      async handleSaveThres() {
        let range = ''
        switch (this.rangeType) {
          case 1:
            range = '00~23'
            break
          case 2:
            range = `${this.StartMonth}~${this.EndMonth}`
            break
          default:
            range = `${this.startDayValue}~${this.endDayValue}`
            break
        }
        let params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr, subType: this.charge.subType, rangeType: this.rangeType, range }
        const res = await saveThresholdConfigTimeRange(params)
        if (res.success) {
          this.electricityShow = false
          this.$Message.success({ content: this.$t('savedSuccessfully') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      // 阈值设定保存
      async thresholdSave(row) {
        let params = { id: row.id, mac: this.deviceInfo.mac, addr: this.addrInfo.addr, _operate_at: '5' }
        if (this.addrInfo.lineType === 'IO') {
          params = { ...params, subTypeList: `${row.subTypeList}`, warnThresholdList: `${row.warnValueList}`, alarmThresholdList: `${row.alarmValueList}`, warnCustomId: row.warnCustomId, alarmCustomId: row.alarmCustomId }
          if (row.warnValueList === '-') {
            row.warnValueList = ''
          }
          if (row.alarmValueList === '-') {
            row.alarmValueList = ''
          }
        } else {
          if (row.warnValue === '' && row.alarmValue === '') {
            return this.$Message.error({ content: this.$t('enterNumValue') })
          }
          params = { ...params, subType: row.subType, warnThreshold: row.warnValue, alarmThreshold: row.alarmValue }
        }
        const res = await saveDefaultThresholdConfig(params)
        if (res.success) {
          this.$Message.success({ content: res.message })
          this.handleQueryParams()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCharginShow() {
        this.$refs.electricMonitoringModal.openModal()
      },
      handleTheft() {
        this.$router.replace({ path: '/multiManage/stealingElectricity' })
      },
      handleEnable(type) {
        if (type === 'alarm') {
          this.$refs.enableConfigModal.openModal(this.configInfo.enableAlarm, type, this.configInfo.platAlarmEnable)
        } else if (type === 'trip') {
          this.$refs.enableConfigModal.openModal(this.configInfo.enableTrip, type, this.configInfo.platTripEnable)
        }
      },
      customList(arr = []) {
        if (arr.length) {
          return arr.map(val => ({ value: val.id ? val.id : val.typeNumber, label: val.name ? val.name : val.info }))
        } else {
          return []
        }
      },
      async getAlarmList() {
        this.customName = []
        let params = { projectCodes: this.$store.state.projectCode }
        const res = await queryAlarmForConfig(params)
        if (res.success) {
          const { alarms, warns, customs } = res.data
          this.alarmsLists = [
            { value: 'alarms', label: this.$t('alarm'), children: this.customList(alarms.filter(v => v.typeNumber !== '1015')) },
            { value: 'warns', label: this.$t('earlyWarning'), children: this.customList(warns) },
            { value: 'custom', label: this.$t('customAlarm'), children: customs.length > 0 ? this.customList(customs[0].alarms) : [] },
          ].filter(v => v.children.length)
          res.data.customs.forEach(val => {
            val.alarms.forEach(v => {
              this.customName.push({ value: v.id, label: v.name })
            })
          })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async openExcuteModal() {
        this.excuteModal = true
        let params = { mac: this.deviceInfo.mac, addr: this.addrInfo.addr }
        const res = await querySwitchQuantityAlarmDetails(params)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.opneCloseMeasure = res.data.map(v => ({ ...v, alarmType: v.type ? [v.type, v.tno || ''] : ['alarms', '1012'] }))
      },
      filterInfoFun(arr, item) {
        let resultItem = arr.find(v => v.value === item)
        return resultItem || { value: '', label: '' }
      },
      openHighPowerReClosingModal() {
        this.hightPowerReCloseModal = true
      },
      async saveExcuteDetails() {
        let parObjValue = {}
        let infoList = this.alarmsLists.map(v => v.children).flat(Infinity)
        this.opneCloseMeasure.forEach((v, i) => {
          parObjValue[`din${i + 1}`] = { type: v.alarmType[0], tno: v.alarmType[1] ? v.alarmType[1] : '', info: this.filterInfoFun(infoList, v.alarmType[1]).label }
        })
        let parmas = {
          mac: this.deviceInfo.mac,
          property: `IO_ALARM_MAP_CFG_${this.addrInfo.addr}`,
          value: JSON.stringify(parObjValue),
        }
        const res = await saveBoxProperty(parmas)
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.excuteModal = false
        this.$Message.success({ content: this.$t('savedSuccessfully') })
      },
      reCloseEnableConfig() {
        this.openBizModal(ReCloseEnableModal, {
          props: {
            mac: this.deviceInfo.mac,
            addr: this.addrInfo.addr,
            bits: this.configInfo.enableReclose,
          },
        })
      },
      reCloseTimeConfig() {
        this.openBizModal(ReCloseTimeModal, {
          props: {
            mac: this.deviceInfo.mac,
            addr: this.addrInfo.addr,
            values: [this.configInfo.rclDelayTime1, this.configInfo.rclDelayTime2, this.configInfo.rclDelayTime3, this.configInfo.rclDelayTime4, this.configInfo.rclDelayTime5, this.configInfo.rclClearTime],
          },
        })
      },
    },
    mounted() {
      this.getAlarmList()
    },
  }
</script>

<style lang="less" scoped>
  .config-view {
    height: 100%;
    display: flex;
    .left {
      width: 300px;
      height: 100%;
      padding: 15px 10px;
      background: #1a202e;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .right {
      width: calc(~'100% - 310px');
      height: 100%;
      border-radius: 4px;
      background: #1a202e;
      .mo-item {
        width: 100%;
        height: 100%;
        background: #1a202e;
        margin-bottom: 10px;
        padding: 0px 15px;
        .header {
          height: 50px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #5e626c;
          margin-top: 0 !important;
          justify-content: space-between;
          .left-title {
            display: flex;
            align-items: center;
            font-size: 14px;
            width: auto;
          }
          .right-button {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .ml-5 {
              margin-left: 5px;
            }
          }
        }
        .content {
          width: 100%;
          padding: 10px;
          height: calc(~'100% - 50px');
          overflow: auto;
          scrollbar-width: none;
          &::-webkit-scrollbar {
            height: 0px;
            width: 0px;
          }
          .table-content {
            width: 100%;
            .dis-position {
              position: relative;
              height: 100%;
              .position-Right {
                color: #007aff;
                position: absolute;
                right: 10px;
                top: -25px;
              }
            }
            .shangxian {
              color: #007aff;
            }
            .xiaxian {
              color: #74ffff;
            }
            .editStatus {
              .ivu-input {
                color: red;
              }
            }
            .show-error {
              padding: 10px 0;
              .error-span {
                font-size: 12px;
                height: 12px;
                line-height: 12px;
                width: 100%;
                margin-top: 7px;
                color: #e03c3a;
              }
            }
            .ivu-spin-fix {
              background: transparent;
            }
            .warn {
              color: #f7a352;
              input {
                color: #f7a352;
              }
            }
            .alarm {
              color: #da3b39;
              input {
                color: #da3b39;
              }
              .ivu-btn-text:hover {
                color: #da3b39 !important;
              }
            }
            .action {
              color: #0375f4;
            }
          }
        }
      }
    }
  }
</style>
