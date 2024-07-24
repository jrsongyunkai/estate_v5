<template>
  <div class="excuteConfigss">
    <div class="disflx mtb delayExcute">
      <span>{{ $t('deferredExecution') }}：</span>
      <Switch v-model="dalayTimeObj.statusExcute" class="marl-5" />
      <div class="inputVal" v-if="dalayTimeObj.statusExcute">
        <InputNumbers :isNeedArrow="false" class="wL150" :precision="0" :placeholder="$t('pleaseEnter')" :min="0" v-model="dalayTimeObj.delayExecSecond" />
        <i>S</i>
      </div>
    </div>
    <div class="disflx mtb">
      <div v-if="$store.state.linkage.triggerMode === '2'">
        <span class="mar-30">{{ $t('executeNumber') }}：</span>
        <InputNumbers :isNeedArrow="false" class="w200" :precision="0" :placeholder="$t('pleaseEnter')" :min="1" :max="linkageMode !== 'marginal' ? 99 : Infinity" v-model="dalayTimeObj.repeatNum" />
      </div>
      <div class="pdt-5" :class="$store.state.linkage.triggerMode === '2' ? 'marl-20 ' : 'mal--10'">
        <span>{{ $t('repeatExecutionInterval') }}：</span>
      </div>
      <div class="inputVal">
        <InputNumbers :isNeedArrow="false" class="w200" :precision="0" :placeholder="$t('pleaseEnter')" :min="minNum" :max="linkageMode !== 'marginal' ? 100000 : Infinity" v-model="dalayTimeObj.repeatExecIntervalSecond" @on-blur="blurEvent(dalayTimeObj.repeatExecIntervalSecond)" />
        <i>S</i>
      </div>
    </div>
    <div class="execution" v-if="linkageMode === 'marginal'">
      <Form :label-width="120">
        <Row class="pdl">
          <FormItem :label="`${$t('executionDeviceType')}：`">
            <Select v-model="excuteDeviceObj.deviceType" style="width: 200px" @on-change="getChangeDevice" @on-select="deletePortValue">
              <Option v-for="item in deviceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem :label="`${$t('executionDevice')}：`" class="ml-20" :label-width="135">
            <Select v-model="excuteDeviceObj.excuteLine" style="width: 500px" :max-tag-count="2" multiple @on-change="getActionList" @on-select="deletePortValue">
              <Option v-for="item in lineList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Row>
        <FormItem class="pdl" :label="`${$t('actionSequence')}：`">
          <Row class="childList" v-for="(item, index) in formValidate" :key="index">
            <div class="childletter">{{ item.letter }}</div>
            <Row style="width: 97%; justify-content: space-between; align-items: center">
              <div class="arrange">
                <Col>
                  <span>{{ $t('port') }}：</span>
                  <Select v-model="item.conditionPort" style="width: 160px" :placeholder="$t('pleaseSelectPort')" @on-change="getCondtionPortChange($event, item)">
                    <Option v-for="itm in conditionPortList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                  </Select>
                </Col>
                <Col class="ml-20">
                  <span>{{ $t('actionType') }}：</span>
                  <Select v-model="item.conditionStatusType" style="width: 160px" :placeholder="$t('pleaseSelectStateType')" @on-change="getStatusEventList($event, item)">
                    <Option v-for="itm in conditionStatusTypeList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                  </Select>
                </Col>
                <Col class="ml-20" v-if="item.conditionStatusType === 'downCmd'">
                  <span>{{ $t('action') }}：</span>
                  <!-- <span>参数：</span> -->
                  <!-- <span>事件：</span> -->
                  <Select v-model="item.conditionEvent" style="width: 160px" :placeholder="$t('pleaseSelectActionType')">
                    <Option v-for="itm in item.conditionEventList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                  </Select>
                </Col>
                <Col class="ml-20" v-if="item.conditionStatusType === 'modifyParam'">
                  <span>{{ $t('parameter') }}：</span>
                  <Select v-model="item.conditionEvent" style="width: 160px" :placeholder="$t('pleaseSelectParameter')">
                    <Option v-for="itm in item.conditionEventList" :value="itm.value" :key="itm.value">{{ itm.label + (itm.unit ? `(${itm.unit})` : '') }}</Option>
                  </Select>
                </Col>
                <Col class="ml-20" v-if="item.conditionStatusType === 'generateAlarm'">
                  <span>{{ $t('event') }}：</span>
                  <Select v-model="item.conditionEvent" style="width: 160px" :placeholder="$t('pleaseSelectEvent')">
                    <Option v-for="itm in item.conditionEventList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                  </Select>
                </Col>
                <Col class="ml-20" v-if="item.conditionStatusType === 'modifyParam'">
                  <span>{{ $t('modifyTo') }}：</span>
                  <Input :placeholder="$t('pleaseEnter')" v-model="item.modifyValue" style="width: 160px"></Input>
                </Col>
              </div>
              <div class="action">
                <Button class="ml-10 b-blue" @click="handleAction(item, 'copy')">
                  <Icon type="md-copy" />
                </Button>
                <Button class="b-dger" @click="handleDelete(index)">
                  <Icon custom="icon-v5 icon-v5-lajitong"></Icon>
                </Button>
              </div>
            </Row>
          </Row>
          <Button class="addrGroup" @click="handleAction('', 'add')">{{ $t('addAction') }}</Button>
        </FormItem>
      </Form>
    </div>
    <div v-else>
      <div class="disflx mtb weekNoSay">
        <div class="pdt-5">{{ $t('reticentperiod') }}：</div>
        <div class="inputVal">
          <InputNumber :min="0" :max="86400" class="custom-number w200" type="number" :precision="0" :placeholder="$t('pleaseEnter')" v-model="dalayTimeObj.exeFrequency" @on-blur="setChangeValue" />
          <i>S</i>
        </div>
      </div>
      <div class="disflx marl-20 acion-pd">
        <div>{{ $t('actionSequence') }}：</div>
        <div class="flex-1">
          <div class="actionClouds disflx space-bte" v-for="(item, index) in actionList" :key="index">
            <div class="disflx">
              <div class="left-head-title">{{ item.letter }}</div>
              <div>
                <div class="arrange">
                  <div class="disflx pd-t">
                    <span class="ml-20 pdt-5">{{ $t('executionObject') }}：</span>
                    <div class="inputDeviceStyle" v-textRoll>{{ item.deviceName }}</div>
                    <!-- <Input v-model="item.deviceName" class="w150" readonly placeholder="请选择执行对象"></Input> -->
                    <Button type="primary" ghost class="marl-5" @click="openDeviceModal(item, index)">{{ $t('selectObject') }}</Button>
                    <div class="ml-20" v-if="['hasAddr', 'hasPort'].includes(item.resType)">
                      <span>{{ $t('line') }}：</span>
                      <Select v-model="item.lineValue" style="width: 220px" :placeholder="$t('pleaseSelectLine2')" @on-change="changeLine($event, item)">
                        <Option v-for="itm in item.lineTypeList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                      </Select>
                    </div>
                    <div class="ml-20" v-if="item.resType === 'hasPort'">
                      <span>{{ $t('port') }}：</span>
                      <Select v-model="item.portValue" style="width: 160px" :placeholder="$t('pleaseSelectPort')" @on-change="changeEventList($event, item)">
                        <Option v-for="itm in item.portTypeList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                      </Select>
                    </div>
                  </div>
                  <div class="disflx pd-t mar-t">
                    <div class="ml-20">
                      <span>{{ $t('actionType') }}：</span>
                      <Select v-model="item.conditionEvenType" style="width: 160px" :placeholder="$t('pleaseSelectActionType')" @on-change="getEventOrAction($event, item)">
                        <Option v-for="item in item.conditionEventLists" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                    </div>
                    <div class="ml-20 disflx" v-if="item.conditionEvenType === 'generateAlarm'">
                      <span class="pdt-5">{{ $t('event') }}：</span>
                      <Cascader class="ml-10 w180" v-model="item.eventValue" clearable :data="alarmsList" :show-all-levels="false" style="width: 200px"></Cascader>
                    </div>
                    <div class="ml-20" v-if="item.conditionEvenType !== 'generateAlarm'">
                      <span v-if="item.conditionEvenType === 'modifyParam'">{{ $t('event') }}：</span>
                      <span v-else>{{ $t('action') }}：</span>
                      <Select v-model="item.equipmentType" style="width: 160px; margin-right: 10px" v-if="item.equipmentType === 33 && item.conditionEvenType === 'downCmd'">
                        <Option v-for="itm in airDinfetectorList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                      </Select>
                      <Select v-model="item.actionValue" style="width: 160px" :placeholder="$t('pleaseSelect')">
                        <Option v-for="itm in item.actionType" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                      </Select>
                      <span v-if="item.equipmentType === 33 && item.conditionEvenType === 'downCmd'">
                        <Input :placeholder="$t('pleaseEnter')" v-model="item.modifyValue" style="width: 150px; margin-left: 10px"></Input>
                        <span class="min-position">
                          <span class="min-absolute">min</span>
                        </span>
                      </span>
                      <span class="ml-20" v-if="item.conditionEvenType === 'modifyParam'">
                        <span>{{ $t('modifyTo') }}：</span>
                        <Select v-model="item.modifyValue" v-if="item.equipmentType === 33" style="width: 160px">
                          <Option v-for="itm in filesList" :value="itm.value" :key="itm.value">{{ itm.label }}</Option>
                        </Select>
                        <Input v-else :placeholder="$t('pleaseEnter')" v-model="item.modifyValue" style="width: 160px"></Input>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="action">
              <Button class="mar-10 b-blue" @click="handleCopyAddAction(item, 'copy')">
                <Icon type="md-copy" />
              </Button>
              <Button class="b-dger mar-10" @click="handleDeleteAction(index)">
                <Icon custom="icon-v5 icon-v5-lajitong"></Icon>
              </Button>
            </div>
          </div>
          <Button class="addrGroup" @click="handleCopyAddAction('', 'add')">{{ $t('addAction') }}</Button>
        </div>
      </div>
    </div>
    <Modal v-model="modalStatus" :title="$t('selectDevice')" width="900" class-name="selectDeviceLists" :scrollable="true">
      <Row>
        <Input v-model="selectDeviceLists.name" style="width: 200px" :placeholder="$t('topologyPlaceholder2')"></Input>
        <Select v-model="selectDeviceLists.deivceType" style="width: 200px" class="ml-10" :placeholder="$t('deviceType')">
          <Option v-for="item in selectDeviceLists.deivceTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Select v-model="selectDeviceLists.deivceState" style="width: 200px" class="ml-10" :placeholder="$t('equipmentStatus')">
          <Option v-for="item in selectDeviceLists.deivceStateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <Button type="primary" class="ml-10" @click="querLists">{{ $t('query') }}</Button>
        <Button class="ml-10" @click="resetOption">{{ $t('reset') }}</Button>
      </Row>
      <Table :columns="selectDeviceLists.columns" :data="selectDeviceLists.data" style="margin-top: 10px">
        <template #info="{ row }">{{ `${row.name}(${row.mac})` }}</template>
        <template #state="{ row }">
          <span :class="row.onlineStats === 0 ? 'b-danger' : row.onlineStats === -1 ? 'grays-box' : 'b-success'">
            {{ row.onlineStats === 0 ? $t('offline') : row.onlineStats === -1 ? $t('disconnected') : $t('online') }}
          </span>
        </template>
        <template #action="{ row }">
          <Button type="text" @click="getDeviceValue(row)">{{ $t('select') }}</Button>
        </template>
      </Table>
      <Page :current="pageNo" @on-change="changePage" :total="totalMac" show-elevator />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { getDeviceList, getActionOptionList, getEdgePortTypeList, getEdgePortValTypeList } from '@api/multiManage/linkagePro'
  import { copyActions, deviceTypeList, allDeviceTypeList, getLineId, regexMac, onehundredLetters } from './constants'
  import { mapMutations } from 'vuex'
  import lodash from 'lodash'
  import InputNumbers from '../../trafficRenewal/input-Number.vue'
  export default {
    props: {
      alarmsList: {
        type: Array,
        default: () => [],
      },
      editData: {
        type: Object,
        default: () => {},
      },
      rowEditData: {
        type: Object,
        default: () => {},
      },
      allMacLineport: {
        type: Array,
        default: () => [],
      },
    },
    components: { InputNumbers },
    data() {
      return {
        airDinfetectorList: [{ value: 33, label: this.$t('commandIssuance') }],
        filesList: [
          { value: 1, label: this.$t('firstGear') },
          { value: 2, label: this.$t('secondGear') },
          { value: 3, label: this.$t('thirdGear') },
          { value: 4, label: this.$t('fourthGear') },
          { value: 5, label: this.$t('fifthGear') },
        ],
        triggerMode: '2',
        lineSelectList: {},
        excuteDeviceObj: {
          deviceType: '',
          excuteLine: [],
        },
        pageNo: 1,
        totalMac: 0,
        modalStatus: false,
        selectDeviceLists: {
          name: '',
          deivceType: '',
          deivceTypeList: allDeviceTypeList,
          deivceState: '',
          deivceStateList: [
            { label: this.$t('online'), value: 1 },
            { label: this.$t('offline'), value: 0 },
            { label: this.$t('disconnected'), value: -1 },
          ],
          columns: [
            {
              title: this.$t('deviceMessage'),
              slot: 'info',
            },
            {
              title: this.$t('deviceType'),
              key: 'equipmentTypeName',
            },
            {
              title: this.$t('equipmentStatus'),
              slot: 'state',
            },
            {
              title: this.$t('position'),
              key: 'location',
            },
            {
              title: this.$t('operation'),
              slot: 'action',
            },
          ],
          data: [],
        },
        actionList: [
          { deviceName: '', resId: '', letter: 'A', lineTypeList: [], lineValue: '', resType: 'hasResId', portValue: '', portTypeList: [], conditionEvenType: '', modifyValue: '', actionType: [], actionValue: '', equipmentType: null, conditionEventLists: [], actionEventLists: [], eventValue: [] },
        ],
        linkageMode: this.$store.state.linkageMode,
        conditionPortList: [],
        conditionStatusTypeList: [
          {
            value: 'downCmd',
            label: this.$t('sendCommand'),
          },
          {
            value: 'modifyParam',
            label: this.$t('modifyParameters'),
          },
          {
            value: 'generateAlarm',
            label: this.$t('generateEvent'),
          },
          {
            value: 'cancelAlarm',
            label: this.$t('cancelEvent'),
          },
        ],
        conditionEventList: [],
        letterNum: 0,
        dalayTimeObj: {
          statusExcute: false,
          delayExecSecond: 1,
          repeatNum: 1,
          repeatExecIntervalSecond: 60,
          exeFrequency: 180,
        },
        formValidate: [
          {
            letter: 'A',

            status: false,
            deviceType: '',
            line: '',
            conditionPort: '',
            conditionEvent: '',
            conditionStatusType: '',
            conditionEventList: [],
            modifyValue: '',
          },
        ],
        lineList: [],
        deviceTypeList,
        actionItem: {},
        actionIndex: '',
      }
    },
    computed: {
      minNum() {
        return this.linkageMode !== 'marginal' ? 60 : 0
      },
    },
    mounted() {
      if (this.rowEditData.isEdit) {
        if (this.rowEditData.linkageMode === 2) {
          this.linkageMode = 'clouds'
        }
        this.getDetailExcute()
      } else {
        this.linkageMode = 'clouds'
      }
    },
    methods: {
      ...mapMutations('linkage', ['setTriggerMode']),
      getDetailExcute() {
        const { baseInfo } = this.editData
        const actionEditList = this.editData.actionList
        const isEditMarginal = baseInfo.linkageMode === 1
        this.setTriggerMode(`${baseInfo.triggerMode}`)
        this.dalayTimeObj = {
          statusExcute: !!baseInfo.delayExecSecond,
          delayExecSecond: baseInfo.delayExecSecond,
          repeatNum: baseInfo.repeatExecTimes,
          repeatExecIntervalSecond: baseInfo.repeatExecIntervalSecond,
          exeFrequency: isEditMarginal ? 0 : baseInfo.exeFrequency,
        }
        if (isEditMarginal) {
          // 边缘端
          // -------------
          this.lineSelectList = this.allMacLineport.find(v => actionEditList[0].resId === v.resId)
          this.getChangeDevice(`${actionEditList[0].deviceType}`, '1')
          this.excuteDeviceObj = {
            deviceType: `${actionEditList[0].deviceType}`,
            excuteLine: actionEditList[0].addrList,
          }
          // console.log('🚀 ~ file: executionConfiguration.vue:350 ~ getDetailExcute ~ this.excuteDeviceObj:', this.excuteDeviceObj, this.lineList)
          this.conditionPortList = actionEditList[0] && actionEditList[0].edgePortOptionList && actionEditList[0].edgePortOptionList.map(v => ({ ...v, value: v.type, label: v.typeName }))
          this.formValidate = actionEditList.map((v, i) => {
            const conditionPort = v.portList.length ? `${v.portList[0]}` : ''
            return {
              letter: onehundredLetters(i),
              conditionPort,
              conditionStatusType: v.type,
              conditionEvent: v.subType,
              conditionEventList: v.optionList.map(v => ({ ...v, value: v.type, label: v.typeName })),
              modifyValue: v.value,
            }
          })
        } else {
          // 云端
          this.actionList = actionEditList.map((v, ids) => {
            const addrPortList = v.addrPort.includes('^') ? +v.addrPort.split('^')[0] : +v.addrPort

            const macItem = this.allMacLineport.find(j => j.resId === v.resId)
            const lineTypeList = (macItem && macItem.addrs && macItem.addrs.map(j => ({ ...j, value: j.addr, label: j.title + getLineId(macItem.mac, j.addr) })).filter(item => `${item.value}` !== '101')) || []
            let portTypeList = v.cloudPortOptionList.map(item => ({ ...item, value: item.type, label: item.typeName }))
            const portValue = v.portList.length ? `${v.portList[0]}` : ''
            // 执行回显未补全
            const conditionEventLists = v.optionList.map(j => ({ ...j, value: j.type, label: j.typeName }))
            const newActionType = conditionEventLists.find(j => j.type === v.type)

            const actionType = newActionType ? newActionType.subTypeList.map(j => ({ ...j, value: j.type, label: j.typeName })) : []
            const resType = portValue && addrPortList ? 'hasPort' : addrPortList && !portValue ? 'hasAddr' : 'hasResId'
            let eventValue
            if (v.type === 'generateAlarm') {
              let newAlarmValue = []
              this.alarmsList.forEach(t => {
                t.children.forEach(h => {
                  if (v.value.includes('1015-')) {
                    let value1015 = v.value.split('-')[1]
                    if (`${h.value}` === value1015) {
                      newAlarmValue = [t.value, value1015]
                    }
                  } else if (h.value === v.value) {
                    newAlarmValue = [t.value, v.value]
                  }
                })
              })
              eventValue = newAlarmValue
            }
            return {
              letter: onehundredLetters(ids),
              resType,
              equipmentType: v.equipmentType || null,
              resId: v.resId,
              deviceName: macItem && `${macItem.name}(${macItem.mac})`,
              lineValue: addrPortList,
              portValue,
              lineTypeList,
              portTypeList,
              conditionEventLists,
              actionType,
              conditionEvenType: v.type,
              modifyValue: v.equipmentType === 33 ? +v.value : v.type === 'modifyParam' ? v.value : '',
              actionValue: ['downCmd', 'modifyParam'].includes(v.type) ? v.subType : v.value || '',
              eventValue: v.type === 'generateAlarm' ? eventValue : [],
            }
          })
        }
      },
      blurEvent(val) {
        if (val < 60 && this.linkageMode !== 'marginal') {
          this.dalayTimeObj.repeatExecIntervalSecond = 60
        }
      },
      async getActionList(val) {
        if (!val.length) {
          return
        }
        const params = {
          mac: this.lineSelectList.mac,
          addrs: this.excuteDeviceObj.deviceType === '1' ? '101' : val.join(','),
        }
        const { message, success, data } = await getEdgePortTypeList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        this.conditionPortList = data.map(v => ({ ...v, value: v.type, label: v.typeName }))
      },
      setChangeValue() {
        if (+this.dalayTimeObj.exeFrequency < 3) {
          this.dalayTimeObj.exeFrequency = 3
        }
      },
      deletePortValue() {
        this.formValidate.forEach(v => {
          v.conditionPort = ''
          v.conditionStatusType = ''
        })
      },
      getCondtionPortChange(val, item) {
        if (!item.conditionStatusType) {
          return
        }
        item.conditionEvent = ''
        this.getEvenlistCondition(item)
      },
      getStatusEventList(val, item) {
        // console.log('🚀 ~ file: executionConfiguration.vue:420 ~ getStatusEventList ~ item:', item)
        if (!item.conditionPort) {
          return this.$Message.error(this.$t('pleaseSelectPortFirst'))
        }
        this.getEvenlistCondition(item)
        // console.log('🚀 ~ file: executionConfiguration.vue:436 ~ getStatusEventList ~  item.conditionEventList:', item.conditionEventList)
      },
      async getEvenlistCondition(item) {
        const params = {
          mac: this.lineSelectList.mac,
          addrs: this.excuteDeviceObj.deviceType === '1' ? '101' : this.excuteDeviceObj.excuteLine.join(','),
          portType: item.conditionPort,
          optionType: item.conditionStatusType,
        }
        const { message, success, data } = await getEdgePortValTypeList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        item.conditionEventList = data.map(v => ({ ...v, value: v.type, label: v.typeName }))
      },
      getLineType(val) {
        this.lineSelectList = this.allMacLineport.find(v => val.resId === v.resId)
      },
      getChangeDevice(val, type) {
        const addrsList = this.lineSelectList && this.lineSelectList.addrs
        if (!type) {
          this.excuteDeviceObj.excuteLine = []
        }

        if (val === '1') {
          this.lineList = addrsList.filter(v => v.addr === 101).map(v => ({ ...v, value: v.addr, label: v.title + getLineId(this.lineSelectList.mac, v.addr) }))
        } else if (val === '2') {
          this.lineList = addrsList.filter(v => v.isSwitchLine).map(v => ({ ...v, value: v.addr, label: v.title + getLineId(this.lineSelectList.mac, v.addr) }))
        } else if (val === '3') {
          this.lineList = addrsList.filter(v => v.isIoLine).map(v => ({ ...v, value: v.addr, label: v.title + getLineId(this.lineSelectList.mac, v.addr) }))
        } else if (val === '4') {
          this.lineList = addrsList.filter(v => v.isMonitorLine).map(v => ({ ...v, value: v.addr, label: v.title + getLineId(this.lineSelectList.mac, v.addr) }))
        }
      },
      handleDeleteAction(index) {
        this.actionList.splice(index, 1)
      },
      handleCopyAddAction(item, type) {
        if (this.actionList.length + 1 > 100) {
          return this.$Message.error({
            content: this.$t('currentConfigExceed100'),
          })
        }
        const letter = onehundredLetters(this.actionList.length)
        if (type === 'copy') {
          const cipyItem = () => item
          const newItem = cipyItem()
          this.actionList.push({ ...newItem, letter })
        } else {
          const addItem = copyActions()
          this.actionList.push({ ...addItem, letter })
        }
      },
      changePage(e) {
        this.pageNo = e
        this.getSeclectDeviceList()
      },
      resetOption() {
        this.delSelect()
      },
      getEventOrAction(val, item) {
        item.actionValue = ''
        item.modifyValue = null
        item.eventValue = []
        const itemArr = item.conditionEventLists.filter(v => v.value === val)
        if (val === 'generateAlarm') {
          item.actionType = []
        } else {
          const lodashSubTypeList = lodash.get(itemArr[0], 'subTypeList', [])
          item.actionType = lodashSubTypeList.map(v => ({ ...v, value: v.type, label: v.typeName }))
        }
      },

      querLists() {
        this.getSeclectDeviceList()
      },
      openDeviceModal(item, index) {
        this.actionItem = item
        this.actionIndex = index
        this.modalStatus = true
        this.delSelect()
        this.getSeclectDeviceList()
      },
      async getDeviceValue(row) {
        this.actionList[this.actionIndex].deviceName = `${row.name}(${row.mac})`
        this.actionList[this.actionIndex].resId = row.resId

        this.actionList[this.actionIndex].equipmentType = row.equipmentType
        this.actionList[this.actionIndex].lineTypeList = row.addrs ? row.addrs.map(v => ({ ...v, value: v.addr, label: v.title + getLineId(row.mac, v.addr) })).filter(v => `${v.value}` !== '101') : []
        this.actionList[this.actionIndex].resType = row.addrs ? 'hasAddr' : 'hasResId'
        this.actionList.forEach((v, i) => {
          if (this.actionIndex === i) {
            v.lineValue = ''
            v.portValue = ''
            v.conditionEvenType = ''
            v.actionValue = ''
            v.modifyValue = ''
          }
        })
        if (!row.addrs) {
          const params = {
            mac: row.mac,
            addr: 0,
          }
          const { data, message, success } = await getActionOptionList(params)
          if (!success) {
            return this.$Message.error({
              content: message,
            })
          }
          this.actionList[this.actionIndex].conditionEventLists = data.map(v => ({ ...v, label: v.typeName, value: v.type }))
        }
        this.modalStatus = false
      },
      changeLine(val, item) {
        item.portTypeList = []
        if (!val) {
          return
        }
        const filterItem = item.lineTypeList.filter(v => v.value === val)
        if (filterItem.length && filterItem[0].isIoLine) {
          const outsArr = filterItem[0].digitalOuts.map(t => ({ ...t, value: t.index, label: t.name }))
          const insArr = filterItem[0].digitalIns.map(t => ({ ...t, value: t.index, label: t.name }))
          item.portTypeList = outsArr.concat(insArr)
          item.resType = 'hasPort'
        }
        this.getEventOptionList(val, item, '0')
      },

      async getEventOptionList(val, item, portParam) {
        const params = {
          mac: item.deviceName && regexMac(item.deviceName),
          addr: val,
          port: portParam,
        }
        const { data, message, success } = await getActionOptionList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        item.conditionEventLists = data.map(v => ({ ...v, label: v.typeName, value: v.type }))
      },
      changeEventList(val, item) {
        if (!item.lineValue) {
          return
        }
        item.conditionEvenType = ''
        item.actionValue = ''
        this.getEventOptionList(item.lineValue, item, val)
      },
      delSelect() {
        this.selectDeviceLists.deivceType = ''
        this.selectDeviceLists.deivceState = ''
        this.selectDeviceLists.name = ''
      },
      async getSeclectDeviceList() {
        const { name, deivceType, deivceState } = this.selectDeviceLists
        const params = {
          projectCode: this.$store.state.projectCode,
          equipmentTypes: deivceType || '1,2,3,26,18,23,24,25,22,29,33,39,40,41,42,45', // 所有支持联动动作的设备equipmentTypes
          pageSize: 10,
          pageNo: this.pageNo,
          mac: name,
          onlineStatus: deivceState,
        }
        const { datas, success, message, total } = await getDeviceList(params)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        this.totalMac = total
        this.selectDeviceLists.data = datas
      },
      handleAction(item, type) {
        if (this.formValidate.length + 1 > 16) {
          return this.$Message.error(this.$t('currentConfigExceed16'))
        }
        const randomAbc = this.setDesc().splice(65 + 1)
        if (type === 'add') {
          this.formValidate.push({
            letter: randomAbc[this.letterNum],
            status: false,
            deviceType: '',
            line: '',
            conditionPort: '',
            conditionEvent: '',
            conditionEventList: [],
            conditionStatusType: '',
            modifyValue: '',
          })
        } else if (type === 'copy') {
          let newItem = {
            letter: randomAbc[this.letterNum],
            status: item.status,
            deviceType: item.deviceType,
            line: item.line,
            conditionPort: item.conditionPort,
            conditionEvent: item.conditionEvent,
            conditionEventList: item.conditionEventList,
            conditionStatusType: item.conditionStatusType,
            modifyValue: item.modifyValue,
          }
          this.formValidate.push(newItem)
        }
        this.letterNum++
      },
      handleDelete(index) {
        const randomAbc = this.setDesc().splice(65)
        this.formValidate.splice(index, '1')
        this.letterNum--
        this.formValidate.forEach((val, ind) => {
          randomAbc.map((ranval, ranInd) => {
            if (ind === ranInd) {
              val.conditionLetter = ranval
            }
          })
        })
      },
      setDesc() {
        const letterArr = []
        // 字母A的code值是65
        for (let i = 65; i < 91; i++) {
          letterArr[i] = String.fromCharCode(i)
        }
        return letterArr
      },
    },
    watch: {
      '$store.state.linkageMode': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.linkageMode = newVal
            if (!this.rowEditData.isEdit) {
              if (this.linkageMode === 'marginal') {
                this.dalayTimeObj.repeatExecIntervalSecond = 5
                this.dalayTimeObj.repeatNum = 3
              } else {
                this.dalayTimeObj.repeatExecIntervalSecond = 60
                this.dalayTimeObj.repeatNum = 1
              }
            }
          }
        },
      },
    },
  }
</script>
<style lang="less">
  .excuteConfigss {
    .min-position {
      position: relative;
    }
    .min-absolute {
      position: absolute;
      top: 0;
      right: 5px;
    }
    .inputDeviceStyle {
      padding: 5px 0 5px 5px;
      display: inline-block;
      width: 160px;
      height: 32px;
      border: 1px solid #3d3d41;
      border-radius: 4px;
    }
    .inputDeviceStyle:hover {
      border-color: #57a3f3;
    }
    .ivu-select-dropdown {
      overflow: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .ivu-input-number-handler {
      display: none;
    }
    .mal--10 {
      margin-left: -27px;
    }
    .marl-5 {
      margin-left: 5px;
    }
    .delayExcute {
      padding-left: 30px;
    }
    .mar-30 {
      margin-left: 28px;
    }
    .acion-pd {
      padding-left: 25px;
    }
    .pdt-5 {
      padding-top: 5px;
    }
    .weekNoSay {
      padding-left: 27px;
    }
    .pdl {
      padding-left: 10px;
    }
    .disflx {
      display: flex;
    }
    .marl-20 {
      margin-left: 20px;
    }
    .pd-t {
      padding: 8px;
    }
    .mar-10 {
      margin: 10px;
    }
    .mar-t {
      margin-top: 5px;
    }
    .w200 {
      width: 200px;
      margin-left: 10px;
    }
    .wL150 {
      width: 150px;
      margin-left: 10px;
    }
    .mtb {
      margin: 10px 0 10px 20px;
    }
    .left-head-title {
      width: 30px;
      height: 100%;
      background: #363d4d;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .flex-1 {
      flex: 1;
    }
    .space-bte {
      justify-content: space-between;
    }
    .w150 {
      width: 150px;
    }
    .inputVal {
      position: relative;
      i {
        position: absolute;
        right: 10px;
        top: 5px;
      }
    }
    .action {
      Button {
        padding: 5px;
        margin-right: 10px;
      }
      .ivu-icon {
        font-size: 20px;
      }
    }
    .actionClouds {
      border: 1px solid #55575c;
      border-radius: 5px;
      margin-bottom: 10px;
    }
    .addrGroup {
      margin-top: 10px;
      background: rgba(2, 167, 240, 0.1);
      border: 1px dotted #02a7f0;
      color: #02a7f0;
    }
    .execution {
      .childList {
        border: 1px solid #55575c;
        border-radius: 5px;
        // padding: 10px;
        margin-bottom: 10px;
        .childletter {
          background: #363d4d;
          width: 3%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .arrange {
          display: flex;
          padding: 16px;
        }
      }
    }
  }
</style>
