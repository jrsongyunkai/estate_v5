<template>
  <div class="rule-form">
    <div class="top-class">
      <div class="header">
        <div class="left">{{ $t('energyConsumptionType') }}</div>
      </div>
      <div class="top-content">
        <Form ref="form" :model="formData" :label-width="100">
          <FormItem :label="$t('energyConsumptionType')">
            <Select v-width="200" v-model="formData.energyType" :disabled="!!editInfo" :placeholder="$t('pleaseSelectEnergyConsumptionType')" @on-change="changeType">
              <Option v-for="option in typeOptions" :value="option.value" :key="option.value">{{ option.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </div>
    <div class="obj-class">
      <div class="header">
        <div class="left">{{ $t('objectSelect') }}</div>
        <div class="right">
          <Button class="b-blue ml-10" @click.stop="openAddModal">{{ $t('addObject') }}</Button>
        </div>
      </div>
      <div class="table-box">
        <Table :columns="macLineColumns" :data="tableData" maxHeight="400" border class="table-add-list">
          <template #deviceName="{ row }">{{ `${row.name}（${row.mac}）` }}</template>
          <template #lines="{ row }">
            <template v-if="row.configs && row.configs.length">
              <Tag v-for="(item, i) in row.configs" :key="i" closable @on-close="deleteTagLine(i, row)">
                <span>{{ item.title }}</span>
              </Tag>
            </template>
            <template v-else>-</template>
          </template>
          <template #deviceAddress="{ row }">{{ row.location }}</template>
          <template slot-scope="{ row }" slot="action">
            <Button type="primary" style="margin-left: 5px" v-if="formData.energyType === 1" size="small" ghost @click="editTableItem(row)">{{ $t('edit') }}</Button>
            <Button type="error" class="b-warning" size="small" ghost @click="deleteTable(row)">{{ $t('delete') }}</Button>
          </template>
        </Table>
      </div>
    </div>
    <div class="rule-class">
      <div class="header">
        <div class="left">{{ $t('ruleConfiguration') }}</div>
      </div>
      <div class="tips">
        <Alert>{{ $t('ruleConfigurationExplain') }}</Alert>
      </div>
      <div class="rule-group-list">
        <Collapse class="rule-group-collapse" v-model="collapseValue">
          <Panel class="rule-group-item" v-for="(item, index) in ruleGroupList" :key="item.id" :name="`${item.id}${index}`">
            <div class="group-item-title">
              <div @click.stop>
                <span v-if="!item.isEditName">{{ item.groupName }}</span>
                <span v-else><Input v-width="200" v-model="item.groupName" /></span>
                <span class="ml-10" style="color: #007eff">
                  <Icon type="md-create" v-if="!item.isEditName" @click.stop="item.isEditName = true" />
                  <Icon type="md-checkmark-circle" v-else @click.stop="item.isEditName = false" />
                </span>
              </div>
              <div>
                <Button @click.stop="copyGroupItem(item)" ghost type="primary" icon="md-copy"></Button>
                <Button @click.stop="deleteGroupItem(index)" ghost class="ml-10" type="error" custom-icon="icon-v5 icon-v5-changyonggoupiaorenshanchu"></Button>
              </div>
            </div>
            <div slot="content">
              <div class="condition-item" v-for="(it, i) in item.conditions" :key="i">
                <div class="left-content">
                  <div class="item-title">{{ numberToLetter(i + 1) }}</div>
                  <div class="item-content">
                    <span>{{ $t('conditionType') }}:</span>
                    <Select class="ml-10" v-width="100" v-model="it.type" :placeholder="$t('pleaseSelectConditionType')">
                      <Option v-for="option in conditionOptions" :value="option.value" :key="option.value">{{ option.label }}</Option>
                    </Select>
                    <template v-if="it.type === 'time'">
                      <i18n class="ml-10" path="inputTimeConditionValue">
                        <TimePicker place="input" class="ml-10" :value="[it.lowerBoundEqual, it.upperBoundEqual]" @on-change="changeTimePick(it, $event)" type="timerange" format="HH:mm" :placeholder="$t('pleaseSelectATimeRange')" style="width: 168px" />
                      </i18n>
                    </template>
                    <template v-if="it.type === 'status'">
                      <i18n class="ml-10" path="inputStateConditionValue">
                        <Select place="input" style="margin: 0 10px" v-width="100" v-model="it.duration" :placeholder="$t('pleaseSelectTheDuration')">
                          <Option v-for="option in conditionTimeOptions" :value="option.value" :key="option.value">{{ option.label }}</Option>
                        </Select>
                      </i18n>
                    </template>
                    <template v-if="it.type === 'power'">
                      <i18n class="ml-10" path="inputPowerConditionValue">
                        <Input place="input" style="margin: 0 10px" v-model="it.upperBound" v-inputNumberRule="'TwoDecimal'" v-width="100" />
                      </i18n>
                    </template>
                  </div>
                </div>
                <div class="item-op">
                  <Button @click="copyConditionItem(it, item)" ghost type="primary" icon="md-copy"></Button>
                  <Button class="ml-10" type="error" ghost custom-icon="icon-v5 icon-v5-changyonggoupiaorenshanchu" @click.stop="deleteConditionItem(i, item)"></Button>
                </div>
              </div>
              <div class="add-button">
                <Button type="primary" ghost @click.stop="addCondition(item)">{{ $t('add') }}</Button>
              </div>
            </div>
          </Panel>
        </Collapse>
        <div class="add-button">
          <Button type="primary" ghost long @click.stop="addConditionGroup">{{ $t('addConditionGroup') }}</Button>
        </div>
      </div>
    </div>
    <div class="btn-class">
      <Button type="primary" @click.stop="saveSubmit">{{ $t('save') }}</Button>
      <Button class="b-blue ml-10" @click.stop="$emit('cancel')">{{ $t('cancel') }}</Button>
    </div>
    <DevicePickerModal ref="DevicePickerModal" :initialSelectedIds="initialSelectedIds" :conditions="deviceParams" v-model="deviceChooseModel" :level="deviceLevel" @on-ok="deviceSelectConfirm" @on-cancel="deviceChooseModel = false" :showSearch="!editDeviceMac" :showPagination="!editDeviceMac">
      <template v-if="formData.energyType !== 1" #device>
        <el-table-column headerAlign="center" prop="deviceType" :label="$t('deviceType')">
          <template #default="{ row }">
            {{ row[0].equipmentTypeName }}
          </template>
        </el-table-column>
      </template>
    </DevicePickerModal>
  </div>
</template>
<script>
  import { uniqBy, cloneDeep, omit } from 'lodash'
  import { numberToLetter } from '@/untils/common'
  import { addRule, getRuleInfo, updateRule } from '@/api/energySaving/index'
  import deviceClassification from '@/mixins/deviceClassification'
  import { energyTypeMap } from '@/untils/configuration'
  export default {
    props: {
      editInfo: { type: Object, default: () => {} },
    },
    mixins: [deviceClassification],
    data() {
      return {
        typeOptions: energyTypeMap,
        tableData: [],
        formData: { energyType: 1 },
        ruleGroupList: [],
        deviceChooseModel: false,
        editDeviceMac: '',
        conditionStateOptions: [
          { label: this.$t('opening'), value: 1 },
          { label: this.$t('closing'), value: 0 },
          { label: this.$t('closeAndLock'), value: 2 },
        ],
        conditionTimeOptions: [
          { label: this.$t('hoursValue', { num: 1 }), value: 3600 },
          { label: this.$t('hoursValue', { num: 2 }), value: 7200 },
          { label: this.$t('hoursValue', { num: 5 }), value: 18000 },
          { label: this.$t('hoursValue', { num: 10 }), value: 36000 },
        ],
        deviceMap: new Map(),
        deviceIdList: [],
        collapseValue: [],
      }
    },
    computed: {
      initialSelectedIds() {
        let list = []
        const uniqueMacList = uniqBy(this.tableData, 'mac')
        for (let device of uniqueMacList) {
          const resId = device.resId
          if (this.deviceLevel > 1) {
            let addrs = device.configs
            if (addrs && addrs.length > 0) {
              list = list.concat(addrs.map(addrInfo => `${resId}-${addrInfo.addr}`))
            } else {
              list.push(`${resId}-`)
            }
          } else {
            list.push(`${resId}`)
          }
        }
        return list
      },
      conditionOptions() {
        return this.formData.energyType === 1
          ? [
              { label: this.$t('time'), value: 'time' },
              { label: this.$t('state'), value: 'status' },
              { label: this.$t('power'), value: 'power' },
            ]
          : [{ label: this.$t('time'), value: 'time' }]
      },
      macLineColumns() {
        let { energyType } = this.formData
        return energyType === 1
          ? [
              { title: this.$t('deviceMessage'), slot: 'deviceName', minWidth: 90 },
              { title: this.$t('line'), slot: 'lines', minWidth: 200 },
              { title: this.$t('equipmentLocation'), slot: 'deviceAddress', minWidth: 130 },
              { title: this.$t('operation'), slot: 'action', width: 160, align: 'center', fixed: 'right' },
            ]
          : [
              { title: this.$t('deviceMessage'), slot: 'deviceName', minWidth: 90 },
              { title: this.$t('equipmentLocation'), slot: 'deviceAddress', minWidth: 130 },
              { title: this.$t('operation'), slot: 'action', width: 200, align: 'center', fixed: 'right' },
            ]
      },
      deviceLevel() {
        let { energyType } = this.formData
        return energyType === 1 ? 2 : 1
      },
      ruleProtocolContent() {
        return this.ruleGroupList.map(it => {
          let groupRules = it.conditions.map(it => {
            let elementText = ''
            let name = ''
            if (it.type === 'time') {
              elementText = JSON.stringify({ type: it.type, upperBoundEqual: it.upperBoundEqual, lowerBoundEqual: it.lowerBoundEqual })
              name = 'monitorTime'
            } else if (it.type === 'status') {
              elementText = JSON.stringify({ type: it.type, duration: it.duration, status: it.status })
              name = 'deviceStatus'
            } else {
              elementText = JSON.stringify({ type: it.type, upperBound: it.upperBound })
              name = 'powerRange'
            }
            return { type: it.type, name, elementText }
          })
          let obj = { groupRules, groupName: it.groupName }
          return obj
        })
      },
      deviceParams() {
        let { energyType } = this.formData
        return { filterType: 'energy', filterIds: `${this.$store.state.projectCode}-${energyType}` }
      },
      deviceList() {
        return this.tableData.flatMap(it => {
          return it.configs.length
            ? it.configs.map(item => ({
                deviceId: item.deviceId || '',
                resId: it.resId,
                mac: it.mac,
                projectCode: this.$store.state.projectCode,
                addr: item.addr,
                equipmentType: it.equipmentType,
              }))
            : {
                deviceId: it.deviceId || '',
                resId: it.resId,
                mac: it.mac,
                projectCode: this.$store.state.projectCode,
                addr: '',
                equipmentType: it.equipmentType,
              }
        })
      },
      updateDeviceList() {
        return this.tableData.flatMap(it => {
          if (it.configs.length) {
            return it.configs.map(item => {
              let obj = { deviceId: item.deviceId || '', resId: it.resId, mac: it.mac, projectCode: this.$store.state.projectCode, addr: item.addr, equipmentType: it.equipmentType }
              if (item.id) {
                Object.assign(obj, { id: item.id, ruleBizSceneType: item.ruleBizSceneType, status: item.status })
              }
              return obj
            })
          } else {
            let obj = { deviceId: it.deviceId || '', resId: it.resId, mac: it.mac, projectCode: this.$store.state.projectCode, equipmentType: it.equipmentType }
            if (it.id) {
              Object.assign(obj, { id: it.id, ruleBizSceneType: it.ruleBizSceneType, status: it.status })
            }
            return obj
          }
        })
      },
      deleteDeviceIdList() {
        let list = []
        const uniqueMacList = uniqBy(this.tableData, 'mac')
        for (let device of uniqueMacList) {
          let addrs = device.configs
          if (addrs && addrs.length) {
            for (let addrInfo of addrs) {
              list.push(addrInfo.id)
            }
          } else if (device.id) {
            list.push(device.id)
          }
        }
        return this.deviceIdList.filter(it => !list.includes(it))
      },
    },
    methods: {
      numberToLetter: numberToLetter,
      changeType() {
        this.tableData = []
        this.ruleGroupList = []
        this.collapseValue = []
      },
      addConditionGroup() {
        let obj = {
          groupName: `${this.$t('conditionGroup')}${numberToLetter(this.ruleGroupList.length + 1)}`,
          id: `${new Date().getTime()}${this.ruleGroupList.length + 1}`,
          isEditName: false,
          conditions: [],
        }
        this.ruleGroupList.push(obj)
        this.collapseValue.push(`${obj.id}${this.ruleGroupList.length - 1}`)
      },
      deleteTagLine(i, row) {
        this.tableData[row._index].configs.splice(i, 1)
      },
      deleteTable(row) {
        this.tableData.splice(row._index, 1)
      },
      editTableItem(row) {
        this.editDeviceMac = row.mac
        this.deviceChooseModel = true
      },
      changeTimePick(it, value) {
        it.lowerBoundEqual = value[0]
        it.upperBoundEqual = value[1]
      },
      validFormData() {
        if (this.tableData.length === 0) {
          this.$message.error(this.$t('pleaseAddObjectTip'))
          return false
        } else if (this.ruleGroupList.length === 0) {
          this.$message.error(this.$t('pleaseAddRuleConditionGroup'))
          return false
        } else {
          let hasError = this.ruleGroupList.some(
            it =>
              it.conditions.some(item => {
                if (item.type === 'time') {
                  return !item.upperBoundEqual || !item.lowerBoundEqual
                } else if (item.type === 'status') {
                  return !item.duration
                } else if (item.type === 'power') {
                  return item.upperBound === ''
                }
                return false
              }) || it.conditions.length === 0
          )
          if (hasError) {
            this.$message.error(this.$t('pleaseImproveRuleConditionGroup'))
            return false
          }
        }
        return true
      },
      async saveSubmit() {
        if (this.validFormData()) {
          const params = {
            bizSceneType: this.formData.energyType.toString(),
            ruleName: '',
            projectCode: this.$store.state.projectCode,
            deviceList: this.deviceList,
            ruleProtocolContent: JSON.stringify(this.ruleProtocolContent),
          }
          let res = null
          if (this.editInfo && this.editInfo.id) {
            res = await updateRule({
              ...params,
              id: this.editInfo.id,
              deleteDeviceIdList: this.deleteDeviceIdList,
              deviceList: this.updateDeviceList,
              status: this.editInfo.status,
              bizScene: this.editInfo.bizScene,
              ruleName: this.editInfo.ruleName,
            })
          } else {
            res = await addRule(params)
          }
          if (res.success) {
            this.$Message.success(this.$t('savedSuccessfully'))
            this.$emit('cancel', true)
          } else {
            this.$Message.error({ content: res.message })
          }
        }
      },
      deviceSelectConfirm(data) {
        let deviceList = this.convertSelectList(data)
        this.tableData = deviceList
        this.deviceChooseModel = false
      },
      getDeviceInfoList(lowList) {
        let resIds = [...new Set(lowList.map(it => it.resId))]
        return resIds.map(resId => {
          const deviceInfo = cloneDeep(this.deviceMap.get(resId))
          let configs = [...new Set(lowList.filter(v => v.resId === resId && v.addr).map(v => ({ addr: +v.addr, title: v.title })))]
          return { ...deviceInfo, resId: +resId, configs }
        })
      },
      convertSelectList(data) {
        let lowList = data.map(it => {
          let spList = it.id.split('-')
          let macInfo, title
          let resId = spList[0]
          const info = cloneDeep(it.data)
          if (info) {
            macInfo = this.deviceLevel === 1 ? omit(info, ['children', 'id']) : omit(info.parent, ['children', 'id'])
            if (this.deviceLevel === 2) {
              title = info.title
            }
          } else {
            macInfo = this.tableData.find(item => item.resId === Number(spList[0]))
            if (this.deviceLevel === 2 && spList[1]) {
              title = (macInfo && macInfo.configs.find(item => item.addr === Number(spList[1])).title) || ''
            }
          }
          if (!this.deviceMap.has(resId)) {
            this.deviceMap.set(resId, macInfo)
          }
          if (this.deviceLevel === 1) {
            return { resId, mac: macInfo.mac }
          }
          return { resId, mac: macInfo.mac, addr: spList[1], title }
        })
        return this.getDeviceInfoList(lowList)
      },
      openAddModal() {
        this.editDeviceMac = ''
        this.deviceChooseModel = true
      },
      addCondition(item) {
        item.conditions.push({ type: 'time', name: '', duration: 3600, lowerBoundEqual: '', upperBoundEqual: '', status: 2, upperBound: 0 })
      },
      copyGroupItem(item) {
        let obj = { ...cloneDeep(item), id: `${new Date().getTime()}${this.ruleGroupList.length + 1}` }
        this.ruleGroupList.push(obj)
        this.collapseValue.push(`${obj.id}${this.ruleGroupList.length - 1}`)
      },
      deleteGroupItem(index) {
        this.ruleGroupList.splice(index, 1)
      },
      copyConditionItem(it, item) {
        item.conditions.push({ ...cloneDeep(it) })
      },
      deleteConditionItem(i, item) {
        item.conditions.splice(i, 1)
      },
      getDeviceListForTableData(lowList) {
        let resIds = [...new Set(lowList.map(it => it.resId))]
        return resIds.map(resId => {
          const deviceInfo = lowList.find(it => it.resId === resId)
          let configs = lowList.filter(v => v.resId === resId && v.addr).map(v => ({ ...v, addr: +v.addr, title: v.addrName }))
          return { ...deviceInfo, name: deviceInfo.macName, location: deviceInfo.macAddress, resId: resId, configs }
        })
      },
      async getRuleInfo(id) {
        const res = await getRuleInfo({ id })
        if (res.success) {
          this.formData.energyType = +res.data.bizSceneType
          let ruleProtocolContent = JSON.parse(res.data.ruleProtocolContent)
          this.ruleGroupList = ruleProtocolContent.map((it, index) => ({
            groupName: it.groupName,
            id: `${new Date().getTime()}${index}`,
            isEditName: false,
            conditions: it.groupRules.map(v => ({
              type: v.type,
              name: v.name,
              duration: 3600,
              lowerBoundEqual: '',
              upperBoundEqual: '',
              status: 0,
              upperBound: 0,
              ...JSON.parse(v.elementText),
            })),
          }))
          this.collapseValue = this.ruleGroupList.map((item, index) => `${item.id}${index}`)
          this.tableData = [...this.getDeviceListForTableData(res.data.deviceList)]
          this.deviceIdList = res.data.deviceList.map(it => it.id)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {
      if (this.editInfo) {
        this.getRuleInfo(this.editInfo.id)
      }
    },
  }
</script>

<style lang="less" scoped>
  .rule-form {
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      div.left {
        text-align: left;
        font-size: 16px;
      }
      div.right {
        display: flex;
        flex: 1;
        justify-content: flex-end;
      }
    }
    .tips {
      margin-bottom: 10px;
      margin-top: 10px;
    }
    .top-class {
      padding: 15px 15px 0px 15px;
      background: #1a202e;
      font-size: 14px;
      .top-content {
        padding: 0px 15px;
        padding-top: 15px;
        padding-bottom: 5px;
      }
    }
    .obj-class {
      margin-top: 10px;
      padding: 15px 15px 0px 15px;
      background: #1a202e;
      .table-box {
        padding: 10px 0px;
        .primary {
          color: #007eff;
        }
        .error {
          color: #ed4014;
        }
      }
    }
    .rule-class {
      margin-top: 10px;
      padding: 15px 15px 10px 15px;
      background: #1a202e;
      .rule-group-collapse {
        background: none;
        border: none;
      }
      .rule-group-item {
        margin-top: 10px;
        border: 1px solid #3d3d41;
        border-radius: 4px;
        background: #090f19;
        /deep/.ivu-collapse-header {
          height: 50px;
          line-height: 50px;
        }
        .group-item-title {
          display: inline-flex;
          width: calc(~'100% - 42px');
          justify-content: space-between;
          align-items: center;
        }
        .condition-item {
          display: flex;
          height: 50px;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #797979;
          border-radius: 4px;
          padding-right: 10px;
          margin-bottom: 10px;
          .left-content {
            flex: 1;
            display: flex;
            align-items: center;
            .item-title {
              height: 50px;
              line-height: 50px;
              width: 60px;
              padding: 0px 15px;
              text-align: center;
              background: #797979;
              margin-right: 10px;
            }
          }
        }
      }
      .add-button {
        margin-top: 10px;
      }
    }
    .btn-class {
      margin-top: 10px;
    }
  }
</style>
