<template>
  <div class="newAdd">
    <div class="dis-flxs">
      <div class="pointer porelation back marginbtm20" @click="back">
        <span class="posiFixds">
          <span class="icon-v5 icon-v5-xiangzuo" />
          {{ $t('back') }}
        </span>
      </div>
    </div>
    <Row :gutter="16" style="margin-top: 10px">
      <Col :span="4" class="porelation">
        <navigationVue ref="naviGationRef" @customScroll="customScroll" class="posiFixds" :stepArr="stepArr"></navigationVue>
      </Col>
      <Col :span="20">
        <div class="newAddcontent">
          <template>
            <div class="inform bgColor" id="information" @click="getStepClick('one')">
              <a href="#information"></a>
              <h3>{{ $t('baseInfo') }}</h3>
              <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                <FormItem :label="$t('ruleName') + ':'" prop="name">
                  <Input v-model="formValidate.name" :placeholder="$t('giveName')" style="width: 400px"></Input>
                </FormItem>
                <FormItem :label="$t('ruleDescription') + ':'" prop="describe">
                  <Input v-model="formValidate.describe" :placeholder="$t('enterSimpleDescription')" type="textarea" style="width: 400px"></Input>
                </FormItem>
                <FormItem :label="$t('ruleState') + ':'" prop="status">
                  <Switch v-model="formValidate.status" />
                </FormItem>
                <FormItem :label="$t('executionMode') + ':'" prop="status">
                  <RadioGroup v-model="formValidate.type" @on-change="getMarginalValue">
                    <Radio v-for="item in typeList" :key="item.value" :label="item.value" :disabled="type === 'edit'">
                      {{ item.title }}
                      <Tooltip placement="top" max-width="470">
                        <Icon color="#02a7f0" size="16" type="ios-information-circle-outline" />
                        <div slot="content" class="textTiltleStyle">{{ item.textTitle }}</div>
                      </Tooltip>
                    </Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem :label="$t('configuringObjectType') + ':'" prop="configType">
                  <RadioGroup v-model="formValidate.configTypeValue" @on-change="toolTipConfig">
                    <Radio v-for="item in configList" :key="item.value" :label="item.value" :disabled="formValidate.type === 1 && item.value !== 3">{{ item.title }}</Radio>
                  </RadioGroup>
                </FormItem>
              </Form>
            </div>
          </template>
          <template>
            <div class="list bgColor" id="configuration" @click="getStepClick('two')">
              <Row class="threAddContent-tableHead">
                <div>{{ $t('configurationObject') }}</div>
                <Button type="primary" @click="handlePageQueryAddr">{{ $t('addObject') }}</Button>
              </Row>
              <Table :columns="macLineColumns" :data="currentDevicePageData" class="threAddContent-tableContent">
                <template slot-scope="{ row }" slot="lines">
                  <div v-if="row.configs && row.configs.length">
                    <span v-for="(item, indx) in row.configs" :key="indx">
                      <Tag closable @on-close="getCloseLine(item.addr, row)">
                        <span>{{ item.title }}</span>
                      </Tag>
                    </span>
                  </div>
                </template>
                <template slot-scope="{ row }" slot="ports">
                  <div v-if="row.configs && row.configs.length && row.configs[0].digitalOuts">
                    <div v-for="(item, indexs) in row.configs" :key="indexs" class="dig-box">
                      <span v-for="(itm, idx) in item.digitalOuts" :key="`digout${idx}`">
                        <Tag closable @on-close="getClosePort(item.addr, itm, row, '1')" v-if="itm.index">
                          <span>{{ itm.name }}</span>
                        </Tag>
                      </span>
                      <span v-for="(itm, idx) in item.digitalIns" :key="`diins${idx}`">
                        <Tag closable @on-close="getClosePort(item.addr, itm, row, '2')" v-if="itm.index">
                          <span>{{ itm.name }}</span>
                        </Tag>
                      </span>
                    </div>
                  </div>
                </template>
                <template slot-scope="{ row }" slot="action">
                  <Button v-if="formValidate.configTypeValue !== 3" type="text" @click="openEditMoal(row)">{{ $t('edit') }}</Button>
                  <!-- <Button size="small" type="text" style="margin-right: 5px" class="danger-pra" @click="handleEditThresholdDevice(row)"></Button> -->
                  <Button size="small" type="text" class="danger-text" @click="handleDeviceAddrDel(row)">{{ $t('delete') }}</Button>
                </template>
              </Table>

              <Page show-total :current="currentPage" @on-change="changePage" @on-page-size-change="changesize" :page-size="pageSize" :total="maclineTotal" show-elevator />
            </div>
          </template>
          <div class="bgColor" id="cycleperiod" @click="getStepClick('three')">
            <Cycle ref="cycleRef" :formValidateType="formValidate.type" :delCycle="delCycle" @cycleData="handlecycleData" :rowItem="rowItem" :edit="edit" />
          </div>
          <div class="bgColor" id="timeperiods" @click="getStepClick('four')">
            <Periods ref="formDynamic" :formValidateType="formValidate.type" :configType="formValidate.configTypeValue" :delRow="delRow" @formDynamicData="handleformDynamicData" @defaultTimeDynamic="handledefaultTimeDynamic" :rowItem="rowItem" />
          </div>

          <div class="ButtonList">
            <Button type="primary" @click="saveRunTenseDetails">{{ $t('save') }}</Button>
            <Button @click="back">{{ $t('cancel') }}</Button>
          </div>
        </div>
      </Col>
    </Row>
    <DevicePickerModal
      ref="DevicePickerModal"
      v-model="deviceChooseModel"
      :showSearch="!this.editDeviceMac"
      :showPagination="!this.editDeviceMac"
      :initialSelectedIds="initialSelectedIds"
      :conditions="deviceParams"
      @on-ok="deviceSave"
      :level="deviceLevel"
      @on-cancel="deviceChooseModel = false"></DevicePickerModal>
  </div>
</template>

<script>
  import Cycle from '../../../components/cycle'
  import Periods from './periods.vue'
  // import { deepUnique } from './getDay'
  import navigationVue from '../latlongTimer/navigationVue.vue'
  import { selectBoxAbnormalList, snapshotSave, snapshotList, queryBoxAbnormalConfig, deleteSnapshotDevice, saveBoxAbnormalConfig } from '@api/multiManage/runningTense'
  import { getGroupType, getGroupTree, tenseinfosave, tensecycleSave } from '@/api/public'
  import _ from 'lodash'
  export default {
    components: {
      Cycle,
      Periods,
      navigationVue,
    },
    props: {
      type: String,
      rowItem: Object,
    },
    data() {
      return {
        editDeviceMac: '',
        deviceChooseModel: false,
        stepArr: [
          { title: this.$t('baseInfo'), step: 'one' },
          { title: this.$t('configurationObject'), step: 'two' },
          { title: this.$t('cyclePeriod'), step: 'three' },
          { title: this.$t('configureTimePeriods'), step: 'four' },
        ],
        editRow: {},
        curLineSelected: '',
        portSelectAll: false,
        portDeviceData: [],
        editMac: '',
        allDeviceLineList: [],
        lineData: [],
        editLinePortModal: false,
        lineAll: false,
        curMacClicked: '',
        portListData: [],
        portSwitch: false,
        curLineClicked: '',
        lineListData: [],
        lineSwitch: false,
        configList: [
          {
            title: this.$t('breaker'),
            value: 1,
          },
          {
            title: 'T3-808',
            value: 2,
          },
          {
            title: this.$t('gateway'),
            value: 3,
          },
        ],
        airSwitch: false,
        maclineTotal: 0,
        stateList: [
          {
            value: '-1',
            label: this.$t('disconnected'),
          },
          {
            value: '0',
            label: this.$t('offline'),
          },
          {
            value: '1',
            label: this.$t('online'),
          },
        ],
        onlinStatus: '',
        typeList: [
          {
            title: this.$t('executeAtEdge'),
            value: 1,
            textTitle: this.$t('edgeTooltip'),
          },
          {
            title: this.$t('executeInCloud'),
            value: 2,
            textTitle: this.$t('cloudTooltip2'),
          },
        ],
        macLineData: [],

        currentPage: 1,
        pageSize: 10,
        total: 0,
        current: 0,
        formValidate: {
          name: '',
          describe: '',
          type: 1,
          status: true,
          configTypeValue: 3,
        },
        ruleValidate: {
          name: [{ required: true, message: this.$t('enterRuleName'), trigger: 'blur' }],
        },
        configId: '',
        addDevice: false,
        addDeviceItem: {
          type: '',
          name: '',
          typeName: '',
          position: '',
        },
        packetList: [],
        packetFilterList: [],
        deviceLIstOne: [],
        curClickedNode: '',
        checkAllGroups: [],
        formDynamicItem: {},
        defaultTimeDynamicItem: {},
        cycleData: {},
        edit: false,
        InfoSave: false,
        newCalendarType: '',
        delRow: '',
        delCycle: '',
        resetType: '',
      }
    },
    watch: {
      'formValidate.type': {
        handler(newVal) {
          this.formValidate.type = newVal
        },
      },
    },
    computed: {
      initialSelectedIds() {
        let list = []
        for (let index = 0; index < this.macLineData.length; index++) {
          const device = this.macLineData[index]
          let addrs = device.configs
          const resId = device.resId
          if (addrs && addrs.length) {
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
          } else {
            list.push(`${resId}`)
          }
        }
        return list
      },
      currentDevicePageData() {
        return this.macLineData.slice((this.currentPage - 1) * 10, this.currentPage * 10)
      },
      deviceLevel() {
        return this.formValidate.configTypeValue === 3 ? 1 : this.formValidate.configTypeValue + 1
      },
      deviceParams() {
        const params = { lineType: this.formValidate.configTypeValue === 1 ? 'EXCEPT_IO' : this.formValidate.configTypeValue === 2 ? 'ONLY_IO' : '', modelTypes: this.formValidate.configTypeValue === 3 ? 'TP15' : '' }
        if (this.editDeviceMac) {
          params.mac = this.editDeviceMac
        }
        return params
      },
      indeterSelectPort() {
        let indeterSelectPort = this.portDeviceData && this.portDeviceData.filter(v => v.checked).length
        return indeterSelectPort > 0 && indeterSelectPort < this.portDeviceData.length
      },

      indeterPort() {
        let indeterPort = this.portListData.filter(v => v.checked).length
        return indeterPort > 0 && indeterPort < this.portListData.length
      },
      indeterLine() {
        let indeterLine = this.lineListData.filter(v => v.checked).length
        return indeterLine > 0 && indeterLine < this.lineListData.length
      },
      indeterMac() {
        let filterLen = this.deviceLIstOne.filter(v => v.ischeck).length
        return filterLen > 0 && filterLen < this.deviceLIstOne.length
      },
      macLineColumns() {
        let macLineColumns = []
        const type = this.formValidate.configTypeValue
        macLineColumns = [
          {
            title: this.$t('configDevice'),
            key: 'title',
          },
          {
            title: this.$t('equipmentNo'),
            key: 'mac',
          },

          {
            title: this.$t('operation'),
            slot: 'action',
            width: 200,
            align: 'center',
          },
        ]
        const itemOne = { title: this.$t('line'), slot: 'lines' }
        const itemTwo = { title: this.$t('port'), slot: 'ports' }
        if (type === 2) {
          macLineColumns.splice(2, 0, itemOne, itemTwo)
        } else if (type === 1) {
          macLineColumns.splice(2, 0, itemOne)
        }
        return macLineColumns
      },
      indeterLineAll() {
        let indeterLineAll = this.lineData.filter(v => v.checked).length
        return indeterLineAll > 0 && indeterLineAll < this.lineData.length
      },
    },
    mounted() {
      this.configId = this.rowItem.configId
      if (!this.rowItem.isAdd) {
        this.handletenseDeviceDetail()
        this.getConfigTable(true)
      }
      this.getGroupTypes()
    },
    methods: {
      getStepClick(item) {
        this.$refs.naviGationRef.isClick = item
      },
      customScroll(val) {
        if (['one', 'two', 'three'].includes(val)) {
          window.scrollTo({
            top: val === 'one' ? 0 : val === 'two' ? 200 : 400,
            behavior: 'smooth',
          })
        } else {
          document.getElementsByClassName('newAdd')[0].scrollIntoView({ behavior: 'smooth', block: 'end' })
        }
      },
      getMarginalValue(val) {
        if (val === 1) {
          this.formValidate.configTypeValue = 3
        }
      },
      async querySaveEdit() {
        const typeValue = this.formValidate.configTypeValue
        const filterDatas = this.lineData.filter(v => v.checked)
        let parmars = {
          configId: this.configId,
        }
        if (!filterDatas.length) {
          return this.$Message.error({
            content: this.$t('selectedLineSave'),
          })
        }
        if (typeValue === 1) {
          parmars.deviceInfoList = [{ resId: this.editRow.resId, mac: this.editRow.mac, configs: filterDatas.map(v => ({ addr: v.addr })) }]
        } else if (typeValue === 2) {
          let digitalOutsArr = []
          filterDatas.forEach(v => {
            digitalOutsArr.push({ isSelectPort: v.digitalOuts.find(j => j.checked) })
          })
          if (!digitalOutsArr.find(v => v.isSelectPort)) {
            return this.$Message.error({
              content: this.$t('clickLineSelectedPortSave'),
            })
          }
          const configs = filterDatas.map(v => {
            const checekdArr = v.digitalOuts.filter(val => val.checked)
            const digitalOuts = checekdArr.filter(v => v.isOutOrIns === 'digitalOuts').map(itm => ({ index: itm.index }))
            const digitalIns = checekdArr.filter(v => v.isOutOrIns === 'digitalIns').map(itm => ({ index: itm.index }))
            return { addr: v.addr, digitalOuts, digitalIns }
          })
          // console.log('🚀 ~ file: addPage.vue:462 ~ configs ~ filterDatas:', filterDatas)
          parmars.deviceInfoList = [{ resId: this.editRow.resId, mac: this.editRow.mac, configs }]
          // console.log('🚀 ~ file: addPage.vue:463 ~ querySaveEdit ~  parmars.deviceInfoList :', parmars.deviceInfoList)
        }
        const res = await snapshotSave(parmars)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.editLinePortModal = false
        this.getConfigTable(false)
      },
      getPortSelectedAll(val) {
        this.portDeviceData.forEach(v => {
          v.checked = val
        })
      },
      getPortSelect(val, addr) {
        this.portSelectAll = this.portDeviceData.every(v => v.checked)
        this.lineData.forEach(v => {
          if (v.addr === addr) {
            v.indeter = this.indeterSelectPort
            v.checked = this.portDeviceData.filter(v => v.checked).length > 0
          }
        })
      },
      getPortValueAll(val, addr, item) {
        this.lineAll = this.lineData.every(v => v.checked)
        if (this.formValidate.configTypeValue === 2) {
          if (!this.portDeviceData.map(v => v.addr).includes(addr)) {
            this.getAllPortList(addr)
          }
          this.portDeviceData.forEach(v => {
            v.checked = val
          })
        }
        item.indeter = false
      },
      getLineSelectedAll(val) {
        this.lineData.forEach(v => {
          v.checked = val
        })
      },
      getAllPortList(addr) {
        if (this.formValidate.configTypeValue === 1) {
          return false
        }
        this.curLineSelected = addr
        this.lineData.forEach(v => {
          if (v.addr === addr) {
            this.portDeviceData = v.digitalOuts
          }
        })
      },
      openEditMoal(row) {
        this.editDeviceMac = row.mac
        this.deviceChooseModel = true
      },
      async getAllLinePortDeviceList(row) {
        let params = {
          configId: '',
          projectCode: this.$store.state.projectCode,
          pageSize: '1000',
          pageNo: '1',
          onlineStatus: '',
          mac: row.mac,
          location: '',
          nodeIds: '',
          lineType: this.formValidate.configTypeValue === 1 ? 'EXCEPT_IO' : this.formValidate.configTypeValue === 2 ? 'ONLY_IO' : '',
        }
        if (this.formValidate.configTypeValue === 3) {
          params.modelTypes = 'TP15'
        }
        const res = await selectBoxAbnormalList(params)
        this.allDeviceLineList = res.data.filter(v => v.mac === row.mac).map(j => ({ ...j, addrs: j.addrs.map(h => ({ ...h, mac: row.mac })) }))
        // this.lineData
        const type = this.formValidate.configTypeValue
        const filterLine = this.allDeviceLineList.map(v => v.addrs).flat(1)
        const addrArr = row.configs.map(item => +item.addr)
        let lineArrList = filterLine.map(j => ({ ...j, checked: addrArr.includes(j.addr), indeter: false }))
        if (type === 1) {
          this.lineData = lineArrList
        } else if (type === 2) {
          // lineArrList
          // console.log('🚀 ~ file: addPage.vue:546 ~ getAllLinePortDeviceList ~ row.configs:', row.configs)
          const configArr = row.configs.map(v => {
            const digitalInsTag = v.digitalIns && v.digitalIns.map(j => ({ ...j, addr: +v.addr }))
            const digitalOutsTag = v.digitalOuts && v.digitalOuts.map(j => ({ ...j, addr: +v.addr }))
            return { ...v, digitalIns: digitalInsTag, digitalOuts: digitalOutsTag }
          })
          const digArr = configArr.map(v => v.digitalOuts).flat(1)
          // console.log('🚀 ~ file: addPage.vue:555 ~ getAllLinePortDeviceList ~ digArr:', digArr)
          const insArr = configArr.map(v => v.digitalIns).flat(1)
          // console.log('🚀 ~ file: addPage.vue:557 ~ getAllLinePortDeviceList ~ insArr:', insArr)
          // console.log('🚀 ~ file: addPage.vue:545 ~ getAllLinePortDeviceList ~ lineArrList:', lineArrList)

          const portList = lineArrList.map(v => {
            const digFilter = digArr.filter(val => val.addr === v.addr).map(item => item.index)
            const newOuts = (v.digitalOuts && v.digitalOuts.map(j => ({ ...j, isOutOrIns: 'digitalOuts', addr: v.addr, checked: digFilter.includes(j.index) }))) || []
            const insFilter = insArr.filter(val => val.addr === v.addr).map(item => item.index)
            const newIns = v.digitalIns && v.digitalIns.map(j => ({ ...j, isOutOrIns: 'digitalIns', addr: v.addr, checked: insFilter.includes(j.index), insIndex: j.index * 10 }))
            const conCatArr = newOuts.concat(newIns)
            return {
              ...v,
              digitalOuts: conCatArr,
            }
          })
          this.lineData = portList
          this.portDeviceData = this.lineData[0] && this.lineData[0].digitalOuts
          this.curLineSelected = this.lineData[0] && this.lineData[0].addr
        }
      },
      getCloseLine(addr, row) {
        let filterAddr = row.configs.filter(v => v.addr !== addr)
        let params = {
          configId: this.configId,
          addr,
          deviceInfoList: [{ mac: row.mac, resId: row.resId, configs: filterAddr || [] }],
        }
        this.saveTableList(params)
      },
      getClosePort(addr, val, row, type) {
        let rowValue = row.configs
        rowValue.forEach(v => {
          if (v.addr === addr) {
            if (type === '1') {
              v.digitalOuts = v.digitalOuts.filter(j => j.index !== val.index)
            }
            if (type === '2') {
              v.digitalIns = v.digitalIns.filter(j => j.index !== val.index)
            }
          }
        })
        const arrConcat = rowValue.filter(v => !v.digitalOuts.length && !v.digitalIns.length).length === rowValue.length
        console.log('🚀 ~ file: addPage.vue:587 ~ getClosePort ~ arrConcat:', arrConcat)
        let params = {
          configId: this.configId,
          addr,
          deviceInfoList: [{ mac: row.mac, resId: row.resId, configs: arrConcat ? [] : rowValue.filter(v => !!v.digitalOuts.length || !!v.digitalIns.length) }],
        }
        console.log('🚀 ~ file: addPage.vue:592 ~ getClosePort ~ params:', params)
        this.saveTableList(params)
      },
      async saveTableList(params) {
        const res = await snapshotSave(params)
        this.getConfigTable(false)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
      },
      getPortValue(val, addr, mac) {
        this.portSwitch = this.portListData.every(v => v.checked)
        this.lineListData.forEach(v => {
          if (v.addr === addr) {
            v.indeter = this.indeterPort
            v.checked = this.portListData.filter(j => j.checked).length > 0
          }
        })
        this.deviceLIstOne.forEach(v => {
          if (v.mac === mac) {
            v.ischeck = true
            v.indeter = true
          }
        })
      },
      getLineList(mac) {
        if (this.formValidate.configTypeValue === 3) {
          return
        }
        this.curMacClicked = mac
        this.deviceLIstOne.forEach(v => {
          if (v.mac === mac) {
            this.lineListData = v.addrs
          }
        })
      },
      getPortList(val) {
        if (this.formValidate.configTypeValue === 2) {
          this.curLineClicked = val
          this.lineListData.forEach(v => {
            if (v.digitalOuts && v.addr === val) {
              this.portListData = v.digitalOuts
            }
          })
        }
      },
      getAllPortValue(val, mac, addr, item) {
        this.lineSwitch = this.lineListData.length && this.lineListData.every(v => v.checked)
        this.deviceLIstOne.forEach(v => {
          if (v.mac === mac) {
            v.indeter = this.indeterLine
            v.ischeck = this.lineListData.filter(v => v.checked).length > 0
          }
        })
        if (this.formValidate.configTypeValue === 2 && this.portListData.length) {
          if (!this.portListData.map(v => v.addr).includes(addr)) {
            this.getPortList(addr)
          }
          this.portSwitch = val
          this.portListData.forEach(v => {
            v.checked = val
          })
        }
        item.indeter = false
      },
      getAllPortSelected(val) {},
      getAllLineSelected(val) {
        this.lineListData.forEach(v => {
          v.checked = val
        })
      },
      toolTipConfig(val) {
        if (this.macLineData.length) {
          this.$Modal.confirm({
            title: this.$t('tip'),
            content: '<p>' + this.$t('latLngText3') + ' </p>',
            onOk: () => {
              this.getConfigTable(true)
              this.delRow = '1'
              this.delCycle = '1'
            },
            onCancel: () => {
              // 取消则 恢复原值
              this.formValidate.configTypeValue = this.resetType
            },
          })
        } else {
          this.resetType = val
        }
      },
      handlecycleData(item) {
        this.cycleData = item
      },
      handletensecycleSave() {
        let params = {
          configId: this.configId,
          calendarType: this.cycleData.calendar,
          loopType: this.cycleData.loopType,
          loopMode: this.cycleData.loopMode,
          loopRule: this.cycleData.loopRule,
          value: this.cycleData.value,
        }
        tensecycleSave(params).then(res => {})
      },
      async handletenseDeviceDetail() {
        let params = {
          configId: this.configId,
          projectCode: this.$store.state.projectCode,
        }
        this.edit = true
        const res = await queryBoxAbnormalConfig(params)
        const { name, remark, model, status, type } = res.data.baseInfo
        this.resetType = type
        this.formValidate = {
          name,
          describe: remark,
          type: model,
          status: status === 1,
          configTypeValue: type,
        }
      },
      handleformDynamicData(val) {
        this.formDynamicItem = val
      },
      handledefaultTimeDynamic(val) {
        this.defaultTimeDynamicItem = val
      },
      handletenseTimesave() {
        // let params = {
        //   configId: this.configId,
        //   timeInfoList: [],
        // }
        let timeInfoList = []

        if (this.defaultTimeDynamicItem.alarm === '' && this.defaultTimeDynamicItem.model === '' && this.defaultTimeDynamicItem.monitorCycle === '' && this.defaultTimeDynamicItem.state === '') {
          timeInfoList = [...this.formDynamicItem.items]
        } else {
          timeInfoList = [this.defaultTimeDynamicItem, ...this.formDynamicItem.items]
        }
        let arr = []
        timeInfoList.forEach(val => {
          arr.push({
            startTime: val.timer !== undefined ? (val.timer[0] ? val.timer[0] : '') : '',
            endTime: val.timer !== undefined ? (val.timer[1] ? val.timer[1] : '') : '',
            mustStatus: val.state,
            monitorModel: val.model,
            monitorCycle: val.monitorCycle,
            isAlarm: val.alarm,
            actionType: val.action,
            alarmTypeNo: val.alarmType[0] === 'custom' ? 1015 : val.alarmType[1] ? val.alarmType[1] : '0',
            alarmCustomId: val.alarmType[0] === 'custom' ? val.alarmType[1] : '0',
            isPlayAudio: val.switch === true ? 1 : 0,
          })
        })
        return arr
      },
      submit() {
        let length = this.formDynamicItem.items.length
        if (this.formValidate.name === '') {
          return this.$Message.error({
            content: this.$t('enterRuleName'),
          })
        } else if (!this.macLineData.length) {
          return this.$Message.error({
            content: this.$t('seclectConfigDevice'),
          })
        } else {
          this.$refs.cycleRef.handletensecycleSave()
          setTimeout(() => {
            let newname
            for (let i = 0; i < length; i++) {
              newname = 'formDynamic' + i
            }
            this.$refs['formDynamic'].$refs[newname][0].validate(valid => {
              if (valid) {
                this.handletensecycleSave()
                this.handletenseTimesave()
              } else {
                this.$Message.error({
                  content: this.$t('pleaseEnterRequirement'),
                })
              }
            })
          }, 400)
        }
      },
      async saveRunTenseDetails() {
        // ----此处为搬振忠校验代码
        let refChecked = false
        let newname
        let lengths = this.formDynamicItem.items.length
        for (let i = 0; i < lengths; i++) {
          newname = 'formDynamic' + i
        }
        this.$refs['formDynamic'].$refs[newname][0].validate(valid => {
          if (valid) {
            refChecked = true
          }
        })
        //  ---------------
        if (!refChecked) {
          return this.$Message.error({
            content: this.$t('pleaseEnterRequirement'),
          })
        }
        if (!this.formValidate.name) {
          return this.$Message.error({
            content: this.$t('enterRuleName'),
          })
        }
        if (!this.macLineData.length) {
          return this.$Message.error({
            content: this.$t('seclectConfigDevice'),
          })
        }
        this.$refs.cycleRef.handletensecycleSave()
        const { name, describe, type, status, configTypeValue } = this.formValidate
        const { calendar, loopType, loopMode, loopRule, value } = this.cycleData
        if (!loopType) {
          return this.$Message.error({
            content: this.$t('pleaseSelectCyclePeriod'),
          })
        }
        let params = {
          configId: this.configId,
          baseInfo: {
            name,
            projectCode: this.$store.state.projectCode,
            remark: describe,
            model: type,
            status: status ? 1 : 0,
            type: configTypeValue,
          },
          cycleInfo: {
            configId: this.configId,
            calendarType: calendar,
            loopType,
            loopMode,
            loopRule,
            value,
          },
          timeInfoList: this.handletenseTimesave(),
        }
        const res = await saveBoxAbnormalConfig(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.back()
        this.$Message.success({
          content: this.$t('savedSuccessfully'),
        })
        // console.log('🚀 ~ file: addPage.vue:832 ~ saveRunTenseDetails ~ params:', params)
      },
      handletenseinfosave() {
        let params = {
          configId: this.configId,
        }
        tenseinfosave(params).then(res => {
          if (res.success) {
            this.back()
            // this.$parent.handleTenselist()
            this.$Message.success({
              content: this.$t('savedSuccessfully'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleEditThresholdDevice(row) {
        this.addDevice = true
      },

      async handleBoxLine(id) {
        // 添加回显
        // const isNeedEcho = this.macLineData.length === 0
        let params = {
          configId: this.configId || id,
          projectCode: this.$store.state.projectCode,
          pageSize: '1000',
          pageNo: '1',
          onlineStatus: this.onlinStatus,
          mac: this.addDeviceItem.name,
          location: this.addDeviceItem.position,
          nodeIds: this.addDeviceItem.typeName ? this.addDeviceItem.typeName.join() : this.addDeviceItem.typeName,
          lineType: this.formValidate.configTypeValue === 1 ? 'EXCEPT_IO' : this.formValidate.configTypeValue === 2 ? 'ONLY_IO' : '',
        }
        if (this.formValidate.configTypeValue === 3) {
          params.modelTypes = 'TP15'
        }
        const res = await selectBoxAbnormalList(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.airSwitch = false
        this.lineSwitch = false
        this.portSwitch = false
        this.addDevice = true
        this.curMacClicked = ''
        this.deviceLIstOne = res.data.map(v => {
          const addrs =
            (v.addrs &&
              v.addrs.map(val => {
                const newOuts = (val.digitalOuts && val.digitalOuts.map(j => ({ ...j, isOutOrIns: 'digitalOuts', addr: val.addr, checked: false, indeter: false, mac: v.mac }))) || []
                const digitalIns = (val.digitalIns && val.digitalIns.map(j => ({ ...j, index: j.index * 10, isOutOrIns: 'digitalIns', addr: val.addr, checked: false, indeter: false, mac: v.mac }))) || []
                const digitalOuts = digitalIns.concat(newOuts)
                return { ...val, checked: false, indeter: false, mac: v.mac, digitalOuts }
              })) ||
            []
          return { ...v, ischeck: false, indeter: false, addrs }
        })
        this.portListData = []
        this.lineListData = []
      },
      checkSelectQuery(val, mac, item) {
        this.airSwitch = this.deviceLIstOne.every(v => v.ischeck)
        if (this.lineListData.length && !this.lineListData.map(v => v.mac).includes(mac)) {
          this.getLineList(mac)
        }
        this.deviceLIstOne.forEach(v => {
          if (v.mac === mac && v.addrs.length) {
            v.indeter = false
            this.lineSwitch = !!this.lineListData.length && val
            this.lineListData.forEach(j => {
              j.checked = val
            })
          }
        })
        item.indeter = false
      },
      async deviceSave(data) {
        console.log(data, '----------------')
        const newData = data.filter(v => v.data)
        const typeValue = this.formValidate.configTypeValue
        let deviceInfoList = []

        if (typeValue === 3) {
          deviceInfoList = newData.map(v => ({
            mac: v.data.mac,
            resId: v.id,
          }))
        } else {
          // let configs
          let allSelectConfig = newData.map(v => {
            const idArr = v.id.split('-')
            return {
              ...v,
              mac: v.data.parent.mac || v.data.parent.parent.mac,
              addr: idArr[1],
              newResId: idArr[0],
              digitalOuts: idArr[2] === 'out' ? [{ index: idArr[3] }] : [],
              digitalIns: idArr[2] === 'in' ? [{ index: idArr[3] }] : [],
            }
          })
          // console.log('🚀 ~ file: addPage.vue:896 ~ allSelectConfig ~ allSelectConfig:', allSelectConfig)
          const groupByMac = _.groupBy(allSelectConfig, 'mac')
          const macList = Object.keys(groupByMac).map(v => {
            const groupByAddr = _.groupBy(groupByMac[v], 'addr')
            const configs = Object.keys(groupByAddr).map(j => {
              let digitalOuts
              let digitalIns
              if (typeValue === 2) {
                digitalOuts = groupByAddr[j]
                  .filter(v => v.digitalOuts.length > 0)
                  .map(val => val.digitalOuts)
                  .flat(1)
                digitalIns = groupByAddr[j]
                  .filter(v => v.digitalIns.length > 0)
                  .map(val => val.digitalIns)
                  .flat(1)
              }
              return {
                addr: j,
                digitalOuts,
                digitalIns,
              }
            })
            return {
              mac: v,
              resId: groupByMac[v][0].newResId,
              configs,
            }
          })

          deviceInfoList = macList
          // console.log('🚀 ~ file: addPage.vue:914 ~ macList ~ macList:', macList)
        }

        let params = {
          configId: this.configId,
          deviceInfoList,
        }
        const res = await snapshotSave(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        if (!this.editDeviceMac) {
          this.currentPage = 1
        }
        this.deviceChooseModel = false
        this.getConfigTable(false)
      },
      async QueryDeviceAdd() {
        const typeValue = this.formValidate.configTypeValue
        let params = {
          configId: this.configId,
        }
        const filLen = this.deviceLIstOne.filter(v => v.ischeck)
        if (!filLen.length) {
          return this.$Message.error({
            content: this.$t('selectedDeviceSave'),
          })
        }
        if (typeValue === 3) {
          params.deviceInfoList = filLen.map(v => ({ resId: v.resId, mac: v.mac }))
        } else if (typeValue === 1) {
          let filterArr = this.deviceLIstOne.filter(v => v.addrs.filter(j => j.checked).length)
          if (!filterArr.length) {
            return this.$Message.error({
              content: this.$t('selectedDeviceLineSave'),
            })
          }
          params.deviceInfoList = filterArr.map(v => ({ resId: v.resId, mac: v.mac, configs: v.addrs.filter(j => j.checked).map(vals => ({ addr: vals.addr })) }))
        } else if (typeValue === 2) {
          let digitalOutsArr = []
          params.deviceInfoList = filLen.map(v => {
            const configs = v.addrs
              .filter(j => j.checked)
              .map(item => {
                const digitalOuts = item.digitalOuts.filter(h => h.checked && h.index < 10).map(itm => ({ index: itm.index }))
                const digitalIns = item.digitalOuts.filter(h => h.checked && h.index > 9).map(itm => ({ index: itm.index / 10 }))
                return { addr: item.addr, digitalOuts, digitalIns }
              })
            digitalOutsArr = configs
            return {
              resId: v.resId,
              mac: v.mac,
              configs,
            }
          })

          if (!digitalOutsArr.length || digitalOutsArr.filter(v => (!v.digitalOuts || !v.digitalOuts.length) && (!v.digitalIns || !v.digitalIns.length)).length) {
            return this.$Message.error({
              content: this.$t('clickSelectedLInePortSave'),
            })
          }
        }
        const res = await snapshotSave(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.addDevice = false
        this.getConfigTable(false)
      },

      async getConfigTable(val) {
        let params = {
          configId: this.configId,
          pageNo: this.currentPage,
          pageSize: 99999999,
          sync: val,
        }
        const res = await snapshotList(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        const typeValue = this.formValidate.configTypeValue
        const filterData = [1, 2].includes(typeValue) ? res.datas.filter(v => v.configs && !!v.configs.length) : []
        this.maclineTotal = filterData.length

        if (typeValue === 1) {
          this.maclineTotal = filterData.length
          this.macLineData = filterData
        } else if (typeValue === 2) {
          const arrIOlist = filterData.filter(v => v.configs && ((v.configs[0].digitalOuts && v.configs[0].digitalOuts.length) || (v.configs[0].digitalIns && v.configs[0].digitalIns.length)))
          this.macLineData = arrIOlist
          this.maclineTotal = arrIOlist.length
        } else {
          this.maclineTotal = res.total
          this.macLineData = res.datas
        }
      },
      async handleDeviceAddrDel(row) {
        let params = {
          configId: this.configId,
          resId: row.resId,
        }
        const res = await deleteSnapshotDevice(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: this.$t('deleteSuccessful'),
        })
        this.getConfigTable(false)
      },
      getAllDeviceValue(val) {
        this.deviceLIstOne.forEach(v => {
          v.ischeck = val
        })
      },
      reset() {
        this.addDeviceItem = {
          type: '',
          name: '',
          typeName: '',
          position: '',
        }
        this.onlinStatus = ''
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      getGroupTrees() {
        getGroupTree({ groupId: this.packetTypes })
          .then(res => {
            if (res.code === '0') {
              this.packNewlist = res.data
              let resData = this.getTree(res.data)
              this.packetFilterList = this.cloneTree(resData)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            // 递归寻找
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })

        return tree
      },
      // 递归遍历数组为树状结构
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            // 其他你想要添加的属性
            obj.expand = true
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },
      getGroupTypes() {
        let params = {
          projectCode: this.$store.state.projectCode, // 'P00000000012'
        }
        getGroupType(params)
          .then(res => {
            if (res.success) {
              this.packetList = res && res.data
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({
                content: res.message,
              })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
      handlePageQueryAddr() {
        if (this.formValidate.name === '') {
          return this.$Message.error({
            content: this.$t('enterRuleName'),
          })
        } else if (!this.formValidate.configTypeValue) {
          return this.$Message.error({
            content: this.$t('seclectedConfigObjectType'),
          })
        } else {
          this.editDeviceMac = ''
          this.deviceChooseModel = true
          // this.handleBoxLine(this.configId)
        }
      },

      changePage(e) {
        this.currentPage = e
      },
      changesize(e) {
        this.pageSize = e
      },

      back() {
        this.$emit('tenseShow', '1')
      },
      previous() {
        if (this.current === 0) {
          this.current = 0
        } else {
          this.current -= 1
        }
      },
      next() {
        if (this.current === 3) {
          this.current = 0
        } else {
          this.current += 1
        }
      },
    },
  }
</script>
<style lang="less">
  .textTiltleStyle {
    white-space: normal;
    width: 400px;
  }
  .marginbtm20 {
    margin-bottom: 20px;
  }
  .dis-flxs {
    display: flex;
  }
  .porelation {
    position: relative;
  }
  .posiFixds {
    position: fixed;
    z-index: 19;
  }
  .dig-box {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 5px;
  }
  .ivu-anchor-ink {
    position: absolute;
    height: 100%;
    left: 20px;
    top: 0;
    padding: 50px 0px 40px 0px;
  }
  .ivu-affix {
    top: 130px !important;
  }
  // .ivu-anchor-ink-ball{
  //     top: 63px;
  // }
  .ivu-cascader-menu {
    background: #1a202e;
  }
  .addDevice {
    .ivu-form-item {
      margin-bottom: 0;
    }
    .checkboxlist {
      display: block;
      margin: 0 0 20px 0;
    }
    .box-flex {
      margin-top: 20px;
      display: flex;
    }
    .span-calc {
      width: calc(100% - 24px);
      margin-left: 10px;
    }
    .head-select-All {
      padding: 10px;
      background: #283140;
    }
    .flex-1 {
      flex: 1;
      border: 1px solid #3d3d41;
    }
    .checkboxContent {
      padding: 10px;
      height: 500px;
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
  .newAdd {
    .ivu-radio-checked .ivu-radio-inner:after {
      opacity: 1;
      transform: scale(1);
      transition: all 0.2s ease-in-out;
    }
    .ivu-radio-disabled .ivu-radio-inner:after {
      background-color: #cccccc !important;
    }
    .ButtonList {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      Button {
        margin-left: 10px;
      }
    }
    .ivu-anchor-link {
      font-size: 16px;
      padding: 8px 0 18px 16px;
    }
    .back {
      font-size: 16px;
      cursor: pointer;
      // position: fixed;
      // top: 130px;
    }
    .newAddcontent {
      // max-height: 1000px;
      // overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .ruleAnchor {
      // position: fixed;
      // width: 230px;
      // top: 170px;
    }
    .bgColor {
      background: #1a202e;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 10px;
      color: #c7c9cc;
      h3 {
        margin-bottom: 10px;
      }
      .ivu-steps .ivu-steps-head-inner {
        width: 38px;
        height: 38px;
        line-height: 38px;
      }
      .ivu-steps-status-process {
        line-height: 48px;
      }
      .ivu-steps-item {
        height: 100px;
      }
      .ivu-steps-tail {
        left: 19px;
        top: 18px;
        height: 80%;
        i {
          width: 2px;
          background: #195896;
        }
      }
      .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
        border-color: #02a7f0;
        background-color: #02a7f0;
      }
      .inform {
        .ivu-input {
          border-color: #dcdee2;
        }
      }

      .threAddContent-tableHead {
        margin-bottom: 10px;
        justify-content: space-between;
      }
    }
  }
</style>
