<template>
  <div class="edit-add-lalong">
    <div class="dis-flx">
      <div class="pointer posi-relation margin-bm20" @click="backToLalongList">
        <span class="posiFixd" style="z-index: 1">
          <span class="icon-v5 icon-v5-xiangzuo" />
          <span>{{ $t('back') }}</span>
        </span>
      </div>
    </div>

    <Row :gutter="16" class="mart-10" :wrap="false">
      <Col flex="200px" class="posi-relation">
        <navigationVue ref="naviGation" @customScroll="customScroll" class="posiFixd" :stepArr="stepArr"></navigationVue>
      </Col>
      <Col flex="auto" style="overflow: hidden">
        <div class="addEditcontent">
          <div id="information" class="bgColor" @click="getStepClick('one')">
            <h3>{{ $t('baseInfo') }}</h3>
            <Form ref="formInfoRef" :disabled="isEditDisabled" :model="formInforMation" style="margin-top: 20px" :label-width="120" label-colon :rules="formRules">
              <FormItem :label="$t('latLngTimerName')" prop="name">
                <Input v-model="formInforMation.name" class="w-300" :placeholder="$t('pleaseInputName')"></Input>
              </FormItem>
              <FormItem :label="$t('executionMode')" prop="lineType">
                <RadioGroup v-model="formInforMation.model" style="display: flex">
                  <Radio label="1">
                    <span>{{ $t('executeAtEdge') }}</span>
                    <TooltipVue class="toolStyle" :tooltipText="$t('edgeTooltip')"></TooltipVue>
                  </Radio>
                  <Radio label="2">
                    <span>{{ $t('executeInCloud') }}</span>
                    <TooltipVue class="toolStyle" :tooltipText="$t('cloudTooltip')"></TooltipVue>
                  </Radio>
                </RadioGroup>
              </FormItem>
              <FormItem :label="$t('repeat')" prop="weekday">
                <CheckboxGroup v-model="formInforMation.weekday">
                  <Checkbox v-for="item in weekLists" :label="item.value" :key="item.value" class="marR-20">{{ weekConfig[item.label] }}</Checkbox>
                </CheckboxGroup>
              </FormItem>
              <FormItem :label="$t('timeDelay')" prop="time">
                <div class="dis-flx">
                  <Col :span="3">
                    <Select :clearable="true" v-model="formInforMation.type">
                      <Option v-for="item in triggerList" :key="item.value" :label="item.label" :value="item.value"></Option>
                    </Select>
                  </Col>
                  <Col :span="3" class="marl-10">
                    <Select :clearable="true" v-model="formInforMation.triggertype">
                      <Option v-for="item in triggerType" :key="item.value" :label="item.label" :value="item.value"></Option>
                    </Select>
                  </Col>
                  <Col>
                    <Input class="w80 marl-10" v-model="formInforMation.time" v-inputNumber>
                      <i slot="suffix" style="font-style: normal">{{ $t('sec') }}</i>
                    </Input>
                  </Col>
                </div>
              </FormItem>
              <FormItem :label="$t('monitorDuration')" prop="monitorTime">
                <div class="dis-flx">
                  <Input class="w-300" :max="86399" :min="0" v-model="formInforMation.monitorTime" v-inputNumber>
                    <i slot="suffix" style="font-style: normal">{{ $t('sec') }}</i>
                  </Input>
                  <TooltipVue class="toolStyle" :tooltipText="tooltipTexts"></TooltipVue>
                </div>
              </FormItem>
              <FormItem :label="$t('configuringObjectType')" prop="lineType">
                <div class="dis-flx">
                  <RadioGroup style="display: flex" v-model="formInforMation.lineType">
                    <div v-for="item in deviceTypeList" :key="item.value" @click.prevent="beforeControlTypeChange(item.value)">
                      <Radio :key="item.value" :label="item.value">{{ item.title }}</Radio>
                    </div>
                  </RadioGroup>
                </div>
              </FormItem>
            </Form>
          </div>
          <div id="deveiceSelect" class="bgColor mart-10" @click="getStepClick('two')">
            <div class="dis-flx sp-between margin-bm">
              <h3>{{ $t('deviceSelection') }}</h3>
              <div v-if="!isEditDisabled">
                <Button type="primary" ghost @click="openAddModal">{{ $t('addObject') }}</Button>
              </div>
            </div>
            <Table :columns="macLineColumns" :data="currentPageData" maxHeight="400" border class="table-add-list" :span-method="spanMethod">
              <template #deviceName="{ row }">
                {{ row.deviceName }}
              </template>
              <template #ports="{ row }">
                <Tag v-for="(item, index) in row.ports" :key="index" :closable="!isEditDisabled" @on-close="deleteTagPort(item, row)">
                  <span>{{ item.name }}</span>
                </Tag>
              </template>
              <template #lines="{ row }">
                <Tag v-for="(item, i) in row.configs" :key="i" :closable="!isEditDisabled" @on-close="deleteTagLine(item, row)">
                  <span>{{ item.title }}</span>
                </Tag>
              </template>
              <template #deveceAdrres="{ row }">{{ row.deviceInfo.location }}</template>
              <template #lalongs="{ row }">{{ `${row.deviceInfo.longitude}/${row.deviceInfo.latitude}` }}</template>
              <template slot-scope="{ row }" slot="action">
                <Button type="primary" size="small" ghost @click="openDeviceModal(row)">{{ $t('macPositionModify') }}</Button>
                <Button type="primary" style="margin-left: 5px" size="small" ghost @click="editTableItem(row)">{{ $t('edit') }}</Button>
                <Button type="error" class="b-warning" size="small" ghost @click="deleteTable(row)">{{ $t('delete') }}</Button>
              </template>
            </Table>
            <Page @on-change="handlePageSize" show-elevator show-total :current="tableData.currentPage" :page-size="tableData.pageSize" :total="tableData.total"></Page>
          </div>
          <div id="excuteConfig" style="padding-bottom: 20px" class="bgColor mart-10 h-100" @click="getStepClick('three')">
            <h3>{{ $t('actionConfig') }}</h3>
            <Form :model="formInforMation" :disabled="isEditDisabled" :label-width="120" label-colon>
              <FormItem :label="$t('action')" prop="action">
                <Select :clearable="true" v-model="formInforMation.action" style="width: 200px" transfer>
                  <Option v-for="item in actionsList" :key="item.value" :label="item.label" :value="item.value"></Option>
                </Select>
              </FormItem>
            </Form>
          </div>
        </div>
        <div v-if="!isEditDisabled">
          <Button type="primary" ghost @click.stop="submitSave">{{ $t('save') }}</Button>
          <Button class="marl-10" @click.stop="backToLalongList">{{ $t('cancel') }}</Button>
        </div>
      </Col>
    </Row>
    <Modal v-model="deviceFlag" footer-hide width="1000" :title="$t('macPositionModify')">
      <DeviceAdress v-if="deviceFlag" :propmapValue="propmapValue" @closeFlag="closeFlag"></DeviceAdress>
    </Modal>
    <DevicePickerModal
      ref="DevicePickerModal"
      :initialSelectedIds="initialSelectedIds"
      :conditions="deviceParams"
      v-model="deviceChooseModel"
      :level="deviceLevel"
      :checkDisabled="checkDisabled"
      @on-ok="deviceSelectConfirm"
      @on-cancel="deviceChooseModel = false"
      :showSearch="!this.editDeviceMac"
      :showPagination="!this.editDeviceMac"></DevicePickerModal>
  </div>
</template>

<script>
  import navigationVue from './navigationVue.vue'
  import DeviceAdress from '../../console/device/deviceAdress.vue'
  import { findBoxByMac } from '@/api/public'
  import { getConfigId, saveTimeConfig, getDeviceSnapshotList, saveDeviceSnapshotList, deleteDeviceSnapshotList, getConfigInfo } from '@/api/multiManage/latlongTimer'
  import { sortBy, uniqBy } from 'lodash'
  import { weekConfig } from '@/untils/weekMap'
  export default {
    props: {
      rowPropData: {
        type: Object,
        default: () => {},
      },
    },
    components: {
      DeviceAdress,
      navigationVue,
    },
    data() {
      return {
        weekConfig,
        deviceTypeList: [
          { title: this.$t('breaker'), value: '1' },
          { title: '808', value: '5' },
        ],
        stepArr: [
          { title: this.$t('baseInfo'), step: 'one' },
          { title: this.$t('deviceSelection'), step: 'two' },
          { title: this.$t('executeConfiguration'), step: 'three' },
        ],
        deviceType: 1,
        latlongAction: '',
        deviceChooseModel: false,
        deviceFlag: false,
        propmapValue: {},
        tableData: { list: [], currentPage: 1, pageSize: 10, total: 0 },
        tooltipTexts: this.$t('monitorDurationTooltip'),
        formInforMation: {
          projectCode: this.$store.state.projectCode,
          configId: null,
          name: '',
          type: 2,
          triggertype: -1,
          time: 0,
          monitorTime: '',
          lineType: '1',
          weekday: [],
          status: '1',
          skipCloseLockCheck: 'true',
          model: '1',
        },
        weekLists: [
          { value: '一', label: '一' },
          { value: '二', label: '二' },
          { value: '三', label: '三' },
          { value: '四', label: '四' },
          { value: '五', label: '五' },
          { value: '六', label: '六' },
          { value: '日', label: '日' },
        ],
        triggerType: [
          { value: -1, label: this.$t('advance') },
          { value: 1, label: this.$t('delay2') },
        ],
        editDeviceMac: '',
        deviceMap: new Map(),
        formRules: {
          name: [{ required: true, message: this.$t('pleaseInputName'), trigger: 'blur' }],
          weekday: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, cb) => {
                if (value.length === 0 || !value) return cb(new Error(this.$t('pleaseSelect')))
                cb()
              },
            },
          ],
          monitorTime: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, cb) => {
                if (value === '') return cb(new Error(this.$t('pleaseInputMonitorDuration')))
                if (+value > 3600 * 24) return cb(new Error(this.$t('exceededDuration', { duration: '86400s' })))
                cb()
              },
            },
          ],
          time: [
            {
              required: true,
              trigger: 'change',
              validator: (rule, value, cb) => {
                if (value === '') return cb(new Error(this.$t('pleaseInputDuration')))
                if (+value > 3600) return cb(new Error(this.$t('exceededDuration', { duration: '3600s' })))
                cb()
              },
            },
          ],
        },
        isEditDisabled: false,
      }
    },
    computed: {
      macLineColumns() {
        if (!this.isEditDisabled) {
          return this.formInforMation.lineType === '1'
            ? [
                { title: this.$t('configDevice'), key: 'deviceName', minWidth: 90 },
                { title: this.$t('line'), slot: 'lines', minWidth: 200 },
                { title: this.$t('equipmentLocation'), slot: 'deveceAdrres', minWidth: 130 },
                { title: this.$t('latLng'), slot: 'lalongs', minWidth: 130 },
                { title: this.$t('operation'), slot: 'action', width: 230, align: 'center', fixed: 'right' },
              ]
            : [
                { title: this.$t('configDevice'), key: 'deviceName', minWidth: 90 },
                { title: this.$t('line'), key: 'addrName', minWidth: 90 },
                { title: this.$t('port'), slot: 'ports', minWidth: 250 },
                { title: this.$t('equipmentLocation'), slot: 'deveceAdrres', minWidth: 100 },
                { title: this.$t('latLng'), slot: 'lalongs', minWidth: 100 },
                { title: this.$t('operation'), slot: 'action', width: 230, align: 'center', fixed: 'right' },
              ]
        } else {
          return this.formInforMation.lineType === '1'
            ? [
                { title: this.$t('configDevice'), key: 'deviceName', minWidth: 90 },
                { title: this.$t('line'), slot: 'lines', minWidth: 200 },
                { title: this.$t('equipmentLocation'), slot: 'deveceAdrres', minWidth: 130 },
                { title: this.$t('latLng'), slot: 'lalongs', minWidth: 130 },
              ]
            : [
                { title: this.$t('configDevice'), key: 'deviceName', minWidth: 90 },
                { title: this.$t('line'), key: 'addrName', minWidth: 90 },
                { title: this.$t('port'), slot: 'ports', minWidth: 250 },
                { title: this.$t('equipmentLocation'), slot: 'deveceAdrres', minWidth: 100 },
                { title: this.$t('latLng'), slot: 'lalongs', minWidth: 100 },
              ]
        }
      },
      actionsList() {
        if (this.formInforMation.lineType === '1') {
          return [
            { label: this.$t('opening'), value: 'false' },
            { label: this.$t('closing'), value: 'true' },
            { label: this.$t('openAndLock'), value: 'closeAndLock' },
          ]
        } else {
          return [
            { label: 'ON', value: '1' },
            { label: 'OFF', value: '2' },
            { label: this.$t('inching'), value: '4' },
          ]
        }
      },
      deviceLevel() {
        return this.formInforMation.lineType === '1' ? 2 : 3
      },
      deviceParams() {
        const params = { lineType: this.formInforMation.lineType === '1' ? 'EXCEPT_IO' : 'ONLY_IO_OUT' }
        if (this.editDeviceMac) {
          params.mac = this.editDeviceMac
        }
        return params
      },
      initialSelectedIds() {
        let list = []
        const uniqueMacList = uniqBy(this.tableData.list, 'mac')
        for (let index = 0; index < uniqueMacList.length; index++) {
          const device = uniqueMacList[index]
          let addrs = device.deviceInfo.configs
          const resId = device.resId
          for (let i = 0; i < addrs.length; i++) {
            const addrInfo = addrs[i]
            if ((Array.isArray(addrInfo.digitalIns) && addrInfo.digitalIns.length > 0) || (Array.isArray(addrInfo.digitalOuts) && addrInfo.digitalOuts.length > 0)) {
              addrInfo.digitalIns &&
                addrInfo.digitalIns.forEach(v => {
                  list.push(`${resId}-${addrInfo.addr}-in-${v.index}`)
                })
              addrInfo.digitalOuts &&
                addrInfo.digitalOuts.forEach(v => {
                  list.push(`${resId}-${addrInfo.addr}-out-${v.index}`)
                })
            } else {
              list.push(`${resId}-${addrInfo.addr}`)
            }
          }
        }
        return list
      },
      triggerList() {
        return [
          { value: this.formInforMation.lineType === '1' ? 2 : 5, label: this.$t('sunrise') },
          { value: this.formInforMation.lineType === '1' ? 3 : 6, label: this.$t('sunset') },
        ]
      },
      currentPageData() {
        return this.tableData.list.slice((this.tableData.currentPage - 1) * this.tableData.pageSize, this.tableData.currentPage * this.tableData.pageSize)
      },
    },
    created() {},
    mounted() {
      if (!this.rowPropData.isNewAdd) {
        this.isEditDisabled = this.rowPropData.isEditDisabled
        this.formInforMation.configId = this.rowPropData.configId
        this.getConfigInfo()
        this.tableData.currentPage = 1
        this.getDeviceTable(true)
      } else {
        this.getConfigId()
      }
    },
    methods: {
      checkDisabled(data) {
        if (this.formInforMation.lineType === '5') {
          return false
        } else {
          return !data.isSupportOc
        }
      },
      async getConfigId() {
        let res = await getConfigId()
        if (res.success) {
          this.formInforMation.configId = res.data.configId
        } else {
          this.$parent.curPageView = '1'
          this.$Message.error({ content: res.message })
        }
      },
      beforeControlTypeChange(value) {
        if (this.formInforMation.lineType === value) return
        if (!this.rowPropData.isNewAdd) return
        if (this.rowPropData.isNewAdd) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: this.$t('latLngText3'),
            onOk: () => {
              this.tableData.currentPage = 1
              this.getDeviceTable(true)
              this.formInforMation.action = ''
              const timeTypeMap = {
                2: 5,
                5: 2,
                3: 6,
                6: 3,
              }
              this.formInforMation.type = timeTypeMap[this.formInforMation.type]
              this.formInforMation.lineType = value
            },
            onCancel: () => {},
          })
        }
      },
      async getConfigInfo() {
        let res = await getConfigInfo({ configId: this.formInforMation.configId })
        if (res.success) {
          let info = res.data
          this.formInforMation.action = info.action
          this.formInforMation.status = info.status
          this.formInforMation.lineType = info.lineType.toString()
          this.formInforMation.name = info.name
          this.formInforMation.type = info.type
          this.formInforMation.weekday = info.weekday ? [...info.weekday.split('')] : []
          this.formInforMation.triggertype = +info.time < 0 ? -1 : 1
          this.formInforMation.time = +info.time < 0 ? (info.time * -1).toString() : info.time.toString()
          this.formInforMation.model = info.model.toString()
          this.formInforMation.monitorTime = info.monitorTime.toString()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async deviceSelectConfirm(data) {
        let params = {
          configId: this.formInforMation.configId,
          deviceInfoList: this.convertSelectList(data),
        }
        this.saveDeviceSetting(params)
      },
      async saveDeviceSetting(params) {
        let res = await saveDeviceSnapshotList(params)
        if (res.success) {
          if (!this.editDeviceMac) {
            this.tableData.currentPage = 1
          }
          this.getDeviceTable()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getDeviceInfoList(lowList) {
        let resIds = [...new Set(lowList.map(it => it.resId))]
        return resIds.map(it => {
          let resId = it
          let obj = { resId: +resId, mac: this.deviceMap.get(resId) }
          let addrList = [...new Set(lowList.filter(v => v.resId === resId).map(v => v.addr))]
          obj.configs = addrList.map(addr => {
            return {
              addr: +addr,
              digitalOuts: lowList.filter(k => k.resId === resId && k.addr === addr && k.portType === 'out').map(u => ({ index: +u.digitalIndex })),
              digitalIns: lowList.filter(k => k.resId === resId && k.addr === addr && k.portType === 'in').map(u => ({ index: +u.digitalIndex })),
            }
          })
          return obj
        })
      },
      convertSelectList(data) {
        let lowList = data.map(it => {
          let spList = it.id.split('-')
          let mac
          if (it.data) {
            mac = it.data.parent.mac || it.data.parent.parent.mac
          } else {
            mac = this.tableData.list.find(item => item.resId === Number(spList[0])).mac
          }
          if (!this.deviceMap.has(spList[0])) {
            this.deviceMap.set(spList[0], mac)
          }
          let obj = { resId: spList[0], mac, addr: spList[1] }
          if (spList.length === 4) {
            obj.portType = spList[2]
            obj.digitalIndex = spList[3]
          }
          return obj
        })
        return this.getDeviceInfoList(lowList)
      },
      idsToParams(ids) {
        let lowList = ids.map(it => {
          let spList = it.split('-')
          let obj = { resId: spList[0], addr: spList[1] }
          if (spList.length === 4) {
            obj.portType = spList[2]
            obj.digitalIndex = spList[3]
          }
          return obj
        })
        return this.getDeviceInfoList(lowList)
      },
      openDeviceModal(info) {
        let params = { mac: info.mac }
        findBoxByMac(params).then(res => {
          if (res.success) {
            this.propmapValue = res.data
            this.deviceFlag = true
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      closeFlag() {
        this.propmapValue = {}
        this.deviceFlag = false
      },
      async deleteTable(row) {
        let res = await deleteDeviceSnapshotList({ configId: this.formInforMation.configId, resId: row.resId })
        if (res.success) {
          this.tableData.currentPage = 1
          this.getDeviceTable()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      editTableItem(row) {
        this.editDeviceMac = row.mac
        this.deviceChooseModel = true
      },
      getStepClick(item) {
        this.$refs.naviGation.isClick = item
      },
      openAddModal() {
        this.editDeviceMac = ''
        this.deviceChooseModel = true
      },
      handlePageSize(e) {
        this.tableData.currentPage = e
      },
      deleteTagPort(item, row) {
        if (row.ports.length === 1 && this.tableData.list.filter(it => it.resId === row.resId).length === 1) {
          this.deleteTable(row)
        } else {
          let ids = this.initialSelectedIds.filter(it => it !== `${row.resId}-${row.addr}-${item.type}-${item.index}`)
          let params = {
            configId: this.formInforMation.configId,
            deviceInfoList: this.idsToParams(ids),
          }
          this.saveDeviceSetting(params)
        }
      },
      deleteLine(row, item) {
        let params = {
          configId: this.formInforMation.configId,
          deviceInfoList: [{ resId: row.resId, mac: row.mac, configs: row.configs.filter(it => it.addr !== item.addr) }],
        }
        this.saveDeviceSetting(params)
      },
      deleteTagLine(item, row) {
        if (row.configs.length === 1) {
          this.deleteTable(row)
        } else {
          this.deleteLine(row, item)
        }
      },
      spanMethod({ row, column, rowIndex }) {
        if (column.key === 'deviceName' || column.slot === 'lalongs' || column.slot === 'deveceAdrres' || column.slot === 'action') {
          const preRow = this.tableData.list[rowIndex - 1]
          const resIdLength = this.tableData.list.filter(it => it.resId === row.resId).length
          return !preRow || row.resId !== preRow.resId ? [resIdLength, 1] : [0, 0]
        }
      },
      handleTableData(data) {
        let list = []
        if (this.formInforMation.lineType === '1') {
          for (let index = 0; index < data.length; index++) {
            const it = data[index]
            if (!this.deviceMap.has(it.resId)) {
              this.deviceMap.set(it.resId.toString(), it.mac)
            }
            list.push({ ...it, deviceInfo: it, deviceName: it.title })
          }
        } else {
          for (let index = 0; index < data.length; index++) {
            const item = data[index]
            if (!this.deviceMap.has(item.resId)) {
              this.deviceMap.set(item.resId.toString(), item.mac)
            }
            list.push(
              ...item.configs.map(it => {
                let ports = []
                if (it.digitalIns) {
                  ports.push(...it.digitalIns.map(v => ({ ...v, type: 'in' })))
                }
                if (it.digitalOuts) {
                  ports.push(...it.digitalOuts.map(v => ({ ...v, type: 'out' })))
                }
                return {
                  ...it,
                  resId: item.resId,
                  mac: item.mac,
                  addrName: it.title,
                  deviceName: item.title,
                  ports,
                  deviceInfo: item,
                }
              })
            )
          }
        }
        return list
      },
      async getDeviceTable(sync = false) {
        let res = await getDeviceSnapshotList({
          configId: this.formInforMation.configId,
          // 前端分页，暂时先给一个较大的pageSize
          pageNo: 1,
          pageSize: 9999999,
          sync,
        })
        if (res.success) {
          this.deviceChooseModel = false
          this.tableData.list = this.handleTableData(sortBy(res.datas, ['mac']))
          this.tableData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      submitSave() {
        this.$refs.formInfoRef.validate(valid => {
          if (valid) {
            if (!this.formInforMation.action) return this.$Message.error({ content: this.$t('pleaseSelectAction') })
            let params = {
              ...this.formInforMation,
              weekday: this.formInforMation.weekday.join(''),
              time: (this.formInforMation.time * this.formInforMation.triggertype).toString(),
            }
            delete params.triggertype
            saveTimeConfig(params).then(res => {
              if (res.success) {
                this.$Message.success({ content: this.$t('savedSuccessfully') })
                this.$parent.queryList()
                this.backToLalongList()
              } else {
                this.$Message.error({ content: res.message })
              }
            })
          }
        })
      },
      backToLalongList() {
        this.formInforMation = {
          projectCode: this.$store.state.projectCode,
          configId: null,
          name: '',
          type: '',
          triggertype: -1,
          time: 0,
          monitorTime: '',
          lineType: '1',
          weekday: [],
          status: '1',
          skipCloseLockCheck: 'true',
          model: '2',
        }
        this.isEditDisabled = false
        this.$emit('lalongShow', '1')
      },
      customScroll(val) {
        if (val === 'one') {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          const positons = val === 'two' ? 'center' : 'end'
          document.getElementsByClassName('edit-add-lalong')[0].scrollIntoView({ behavior: 'smooth', block: positons })
        }
      },
    },
    beforeDestroy() {},
  }
</script>

<style lang="less" scoped>
  .h-340 {
    height: 340px;
  }
  .posi-relation {
    position: relative;
  }
  .posiFixd {
    position: fixed;
    z-index: 19;
  }
  .edit-add-lalong {
    .h-100 {
      height: 100px;
    }
    .w80 {
      width: 100px;
      text-align: right;
      margin: 0 10px 0 30px;
    }
    .w-300 {
      width: 200px;
    }
    .toolStyle {
      display: inline-block;
      margin-left: -5px;
    }
    .suffix-classs {
      font-style: normal;
    }
    .dis-flx {
      display: flex;
    }
    .sp-between {
      justify-content: space-between;
    }
    .margin-bm {
      margin-bottom: 10px;
    }
    .margin-bm20 {
      margin-bottom: 20px;
    }
    .mart-10 {
      margin-top: 10px;
    }
    .marl-10 {
      margin-left: 10px;
    }
    .marR-20 {
      margin-right: 20px;
    }
    .h-300 {
      height: 300px;
    }
    .bgColor {
      background: #1a202e;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 10px;
      color: #c7c9cc;
    }
  }
  .table-add-list {
    /deep/.ivu-table-cell {
      padding-left: 10px;
      padding-top: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
    }
  }
</style>
