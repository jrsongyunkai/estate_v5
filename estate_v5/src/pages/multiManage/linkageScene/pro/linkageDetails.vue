<template>
  <div class="linkage-Detail">
    <div @click="backLists" class="pointer pd-10">
      <Icon type="ios-arrow-back" />
      {{ $t('back') }}
    </div>
    <div class="psi-relative">
      <div class="bg-head-box"></div>
    </div>
    <Tabs v-model="tabName" class="mar-t15" :animated="false" @on-click="getTabChange">
      <TabPane :label="$t('configurationInformation')" name="name1">
        <div class="detail-content">
          <h4 class="execu-list-title">{{ $t('baseInfo') }}</h4>
          <div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('linkageName') }}：</div>
              <div class="flex-3">{{ baseInfos.name }}</div>
            </div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('linkageRemark') }}：</div>
              <div class="flex-3">{{ baseInfos.remark }}</div>
            </div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('linkageMode') }}：</div>
              <div class="flex-3">{{ baseInfos.linkageMode }}</div>
            </div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('loopMode2') }}：</div>
              <div class="flex-3">{{ baseInfos.loopMode }}</div>
            </div>
            <div class="dis-flex mar-t-10" v-if="baseInfos.loopMode !== $t('everyDay')">
              <div class="flex-1 text-gray">{{ $t('date') }}：</div>
              <div class="flex-3">{{ baseInfos.loopCycle }}</div>
            </div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('linkageState') }}：</div>
              <div class="flex-3">{{ baseInfos.status }}</div>
            </div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('triggerMode') }}：</div>
              <div class="flex-3">{{ baseInfos.triggerMode }}</div>
            </div>
            <div class="dis-flex mar-t-10">
              <div class="flex-1 text-gray">{{ $t('effectiveTimePeriod') }}：</div>
              <div class="flex-3">{{ baseInfos.timeRanges }}</div>
            </div>
            <div class="dis-flex mar-t-10" v-if="baseInfos.linkageMode === $t('edge')">
              <div class="flex-1 text-gray">{{ $t('configurationObject') }}：</div>
              <div class="flex-3">{{ baseInfos.macName + `(${baseInfos.mac})` }}</div>
            </div>
          </div>
        </div>
        <div class="detail-content">
          <h4 class="execu-list-title">{{ $t('conditionConfig') }}</h4>
          <div>
            <div class="inform bgBlueColor">
              <div class="tips">
                <Icon color="#02a7f0" size="24" type="ios-information-circle" class="ml-10" />
                <span class="ml-10">{{ $t('conditionGroupTips') }}</span>
              </div>
            </div>
            <Collapse v-for="(item, index) in conditionGroups" :key="index" v-model="item.panelValue" class="mar-t10">
              <Panel name="1">
                <div>{{ item.name }}</div>
                <div slot="content">
                  <div v-for="(val, idx) in item.conditionListType" :key="`condition${idx}`" class="pd-10-15 border-type mar-t10">
                    <div>{{ $t('conditionType') }}：{{ val.itemType === 'status' ? $t('stateCondition') : $t('valueCondition') }}</div>
                    <div v-for="(grandson, grandIdx) in val.lineListPort" :key="`grand${grandIdx}`">
                      <div class="dis-flex line-boxs">
                        <div class="center-text">{{ String.fromCharCode(65 + grandIdx) }}</div>
                        <div class="pd-20 flx1">
                          <span v-if="baseInfos.linkageMode === $t('cloud')">{{ $t('device') }}：{{ `${grandson.macTitle}(${grandson.macName})` }}</span>
                          <span class="mar-lf-50" v-if="grandson.addrTitle">{{ $t('line') }}：{{ grandson.addrTitle + getLineId(grandson.macName, grandson.addrList) }}</span>
                          <span class="mar-lf-50" v-if="grandson.portTitle">{{ $t('port') }}：{{ grandson.portTitle }}</span>
                          <span class="mar-lf-50" v-if="val.itemType === 'status'">{{ $t('stateType') }}：{{ grandson.typeName }}</span>
                          <span class="mar-lf-50" v-if="grandson.type === 'runStatus'">{{ $t('runningState') }}：{{ grandson.valueName }}</span>
                          <span class="mar-lf-50" v-if="val.itemType === 'status' && grandson.type !== 'runStatus' && grandson.valueName">{{ $t('state') }}：{{ grandson.valueName || getAlarmName(grandson.value) }}</span>
                          <span class="mar-lf-50" v-if="val.itemType === 'number'">{{ $t('valueType') }}：{{ grandson.valueType }}</span>
                          <span class="mar-lf-50" v-if="val.itemType === 'number'">{{ $t('correctionFactor') }}:{{ getMathCaulater(grandson.correctType) + grandson.correctFactor }}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {{ $t('conditionJudgment') }}：
                      <span v-if="val.itemType === 'status'">
                        <span>{{ val.logicType === 'any' ? $t('anyCondition') : $t('allCondition') }}</span>
                        <span>{{ val.logicValue === 'true' ? $t('isTrue') : $t('isFalse') }}</span>
                      </span>
                      <span v-if="val.itemType === 'number'">
                        <span>{{ getAllConditionText(val.logicType) }}</span>
                        <span>{{ getCompareText(val.logicCompare) }}</span>
                        <span>{{ val.logicValue }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Panel>
            </Collapse>
          </div>
        </div>
        <div class="detail-content">
          <h4 class="execu-list-title">{{ $t('executeConfiguration') }}</h4>
          <div>
            <div class="dis-flex mar-t-15">
              <div class="mar-47 text-gray">{{ $t('deferredExecution') }}：</div>
              <div>{{ baseInfos.delayExecSecond }} S</div>
            </div>
            <div class="dis-flex mar-t-15">
              <div class="dis-flex mar-t-15" v-if="baseInfos.triggerMode === $t('eventMode')">
                <div class="marl-custom text-gray">{{ $t('executeNumber') }}：</div>
                <div>{{ baseInfos.repeatExecTimes }}</div>
              </div>
              <div class="dis-flex mar-t-15">
                <div class="text-gray" :class="baseInfos.triggerMode === $t('eventMode') ? 'mar-47' : 'margin-custom'">{{ $t('repeatExecutionInterval') }}：</div>
                <div class="">{{ baseInfos.repeatExecIntervalSecond }}S</div>
              </div>
            </div>
            <div class="dis-flex mar-t-15" v-if="baseInfos.linkageMode === $t('cloud')">
              <div class="flex-1 text-gray">{{ $t('reticentperiod') }}：</div>
              <div class="flex-3">{{ baseInfos.exeFrequency }}S</div>
            </div>
            <div class="dis-flex" v-if="baseInfos.linkageMode === $t('edge')">
              <div class="dis-flex marlr-10 text-nowrap">
                <div class="text-gray marlr-10">{{ $t('executionDeviceType') }}：</div>
                <div>{{ getDeviceType(actionLine[0].deviceType) }}</div>
              </div>
              <div class="dis-flex mar-37">
                <div class="text-gray mar-47 text-nowrap">{{ $t('executionDevice') }}：</div>
                <div class="dis-wrap mart-5">
                  <span v-for="(item, index) in actionLine[0].addrTitle.split(',')" :key="index" class="bor-line margin-5">
                    {{ item + getLineId(baseInfos.mac, actionLine[0].addrList[index]) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="dis-flex mar-t-15">
              <div class="flex-1 text-gray">{{ $t('linkageOldFeat2') }}：</div>
              <div class="flex-3">
                <div v-for="(item, grandIdx) in actionLine" :key="`grand${grandIdx}`">
                  <div class="dis-flex line-boxs">
                    <div class="center-text">{{ String.fromCharCode(65 + grandIdx) }}</div>
                    <div class="pd-20 flx1 dis-flex">
                      <div v-if="baseInfos.linkageMode === $t('cloud')">
                        <span>{{ $t('device') }}：{{ `${item.macName}(${item.mac})` }}</span>
                        <span v-if="item.addrTitle.length" class="mar-lf-20">
                          {{ $t('line') }}:
                          <span v-for="(itm, index) in item.addrTitle.split(',')" :key="index" class="bor-line margin-10">{{ itm + getLineId(item.mac, item.addrList) }}</span>
                        </span>
                      </div>
                      <span v-if="item.portTitle" class="mar-lf-20">
                        {{ $t('port') }}：
                        <span class="bor-line margin-10">{{ item.portTitle }}</span>
                      </span>
                      <span class="mar-lf-50">{{ $t('actionType') }}：{{ item.typeName }}</span>
                      <span class="mar-lf-50" v-if="item.type === 'downCmd'">{{ $t('action') }}：{{ item.subTypeName && item.equipmentType === 33 ? $t('commandIssuanceTip', { subTypeName: item.subTypeName, value: item.value }) : item.subTypeName || '' }}</span>
                      <span class="mar-lf-50" v-if="item.type === 'generateAlarm'">{{ $t('event') }}：{{ item.subTypeName || getEventName(item.value) }}</span>
                      <span class="mar-lf-50" v-if="item.type === 'modifyParam'">{{ $t('parameter') }}：{{ item.subTypeName }}</span>
                      <span class="mar-lf-50" v-if="item.type === 'modifyParam'">{{ $t('modifyTo') }}：{{ item.value && item.equipmentType === 33 ? $t('manyLevel', { num: item.value }) : item.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TabPane>
      <TabPane :label="$t('executeRecords')" name="name2">
        <div class="eccute-record">
          <h4 class="mar-10">{{ $t('executeHistory') }}</h4>
          <div class="mar-10">
            <DatePicker type="datetimerange" placement="bottom-end" :placeholder="$t('pleaseSelectDateTime')" transfer class="w350" v-model="excuteTime"></DatePicker>
            <Button type="primary" @click="getHistroyList" class="marlr-10">{{ $t('query') }}</Button>
            <Button @click="excuteTime = []">{{ $t('reset') }}</Button>
          </div>

          <Table :columns="historyColumns" :data="historyTableListData">
            <template #delayExcute="{ row }">
              {{ row.delayExecSecond }}
            </template>
            <template #repeatNum="{ row }">{{ row.repeatExecTimes }}</template>
            <template #repeatExecIntervalSecond="{ row }">{{ row.repeatExecIntervalSecond }}</template>
            <template #excuteDetail="{ row }">
              <Button type="text" class="b-blue" @click="openActionDetail(row)">{{ $t('viewDetails') }}</Button>
            </template>
          </Table>
          <Page show-total :current="pageNo" @on-change="changeactionPage" :total="total" show-elevator />
        </div>
      </TabPane>
    </Tabs>
    <Modal :title="$t('executeDetail')" v-model="detailModal" width="800">
      <Table :columns="excuteColumns" :data="detailTableData">
        <template #mac="{ row }">{{ row.mac + (row.addrTitle ? `(${row.addrTitle})` : '') }}</template>
      </Table>
      <Page show-total :current="pageDetailNo" @on-change="changePage" :total="detailTotal" show-elevator />
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import { getDetail, getDeviceList, getExecHistory, getExecDetail } from '@api/multiManage/linkagePro'
  import { conditionalList, conditionalTypeList, deviceTypeList, getLineId } from './constants'
  import { queryAlarmForConfig } from '@/api/multiManage/builtlnTimer'
  import dayjs from 'dayjs'
  import lodash from 'lodash'
  import { weekConfig } from '@/untils/weekMap'
  export default {
    props: {
      idAndRowData: {
        type: Object,
        default: () => {},
      },
      tabTohis: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        rowPageData: {},
        alarmsList: [],
        actionLine: [],
        pageDetailNo: 1,
        detailTotal: 0,
        excuteTime: [],
        detailsData: {},
        conditionGroups: [],
        detailModal: false,
        excuteColumns: [
          { title: this.$t('executionTime'), key: 'createTime' },
          { title: this.$t('executionObject'), slot: 'mac' },
          { title: this.$t('actionType'), key: 'typeName' },
          { title: this.$t('actionDetail'), key: 'detail' },
          { title: this.$t('issuanceOfResults'), key: 'downStatusName' },
        ],
        detailTableData: [],
        historyTableListData: [],
        total: 0,
        pageNo: 1,
        tabName: 'name1',
        historyTriggerMode: '',
        baseInfos: {
          name: '',
          remark: '',
          linkageMode: '',
          triggerMode: '',
          status: '',
          loopMode: '',
          loopCycle: '',
          timeRanges: '',
          delayExecSecond: '',
          repeatExecTimes: '',
          repeatExecIntervalSecond: '',
          exeFrequency: '',
          mac: '',
          macName: '',
        },
      }
    },
    async mounted() {
      await this.getAllAlarmConfig()
      await this.getEditDetails()
      if (this.tabTohis) {
        this.tabName = 'name2'
        this.getTabChange('name2')
      }
    },
    computed: {
      historyColumns() {
        let columnArr = [
          { title: this.$t('index'), type: 'index' },
          { title: this.$t('executionTime'), key: 'createTime' },
          { title: this.$t('deferredExecution'), slot: 'delayExcute' },
          { title: this.$t('repeatExecutionInterval2'), slot: 'repeatExecIntervalSecond' },
          { title: this.$t('executeDetail'), slot: 'excuteDetail' },
        ]
        if (this.historyTriggerMode === 1) {
          return columnArr
        } else {
          columnArr.splice(3, 0, { title: this.$t('executeNumber'), slot: 'repeatNum' })
          return columnArr
        }
      },
    },
    methods: {
      getLineId,
      async getAllAlarmConfig() {
        const { data, success, message } = await queryAlarmForConfig({ projectCodes: this.$store.state.projectCode })
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }

        const lodashList = lodash.get(data, 'customs[0].alarms', [])
        const customList = lodashList.map(v => ({ value: v.id, label: v.name }))
        this.alarmsList = [
          {
            value: 'alarms',
            label: this.$t('alarm'),
            children: data.alarms.map(v => ({ value: v.typeNumber, label: v.info })).filter(v => v.value !== '1015'),
          },
          {
            value: 'warns',
            label: this.$t('earlyWarning'),
            children: data.warns.map(v => ({ value: v.typeNumber, label: v.info })),
          },
          {
            value: 'customs',
            label: this.$t('customAlarm'),
            children: customList,
          },
        ]
      },
      getEventName(val) {
        let newAlarmValue = []
        this.alarmsList.forEach(t => {
          t.children.forEach(h => {
            if (val.includes('1015-')) {
              let splitVal = val.split('-')[1]
              if (`${h.value}` === splitVal) {
                newAlarmValue = `${t.label}${h.label}`
              }
            } else {
              if (`${h.value}` === val) {
                newAlarmValue = `${t.label}${h.label}`
              }
            }
          })
        })

        return newAlarmValue
      },
      getAlarmName(val) {
        console.log('🚀 ~ file: linkageDetails.vue:322 ~ getAlarmName ~ val:', val)
        if (!val) {
          return ''
        }
        const valParse = JSON.parse(val)
        const findrAlarmList = this.alarmsList.find(v => v.value === valParse[0])
        const findAlarm = findrAlarmList && findrAlarmList.children && findrAlarmList.children.find(v => `${v.value}` === valParse[1])
        return findAlarm ? findAlarm.label : ''
      },
      getDeviceType(val) {
        const lineTpe = deviceTypeList
        const findList = lineTpe.find(v => +v.value === val)
        return findList && findList.label
      },
      getAllConditionText(val) {
        const configText = conditionalList
        const findText = configText.find(v => v.value === val)
        return findText && findText.label
      },
      getCompareText(val) {
        const configText = conditionalTypeList
        const findText = configText.find(v => v.value === val)
        return findText && findText.label
      },
      getMathCaulater(val) {
        return +val === 1 ? this.$t('plus') : +val === 2 ? this.$t('subtract') : +val === 3 ? this.$t('multiply') : +val === 4 ? this.$t('divide') : ''
      },
      async getEditDetails() {
        const param = {
          projectCode: this.$store.state.projectCode,
          sceneId: this.idAndRowData.sceneId,
        }
        const { message, success, data } = await getDetail(param)
        if (!success) {
          return this.$Message.error({
            content: message,
          })
        }
        // actionList,
        const { baseInfo, conditionGroupList, actionList } = data
        const params = {
          projectCode: this.$store.state.projectCode,
          equipmentTypes: 'all',
          pageSize: 9999,
          pageNo: 1,
        }
        const res = await getDeviceList(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        const allMacLineList = res.datas
        const macDevice = allMacLineList.find(v => v.resId === resId)
        this.conditionGroups = conditionGroupList.map(v => {
          const conditionListType = v.subGroupList.map(j => {
            const isStatusType = j.itemType === 'status'
            const lineList = isStatusType ? j.statusConfList : j.numberConfList
            const lineListPort = lineList.map(h => {
              let lineValue
              if (!h.addrPort.includes('^')) {
                lineValue = macDevice && macDevice.addrs.find(val => val.addr === +h.addrPort)
              } else {
                // Todo 区分端口输入输出量
                // let IoLine = macDevice.addrs.find(val => val.addr === +h.addrPort && val.isIoLine)
              }
              const macName = allMacLineList.find(k => k.resId === h.resId)
              const findIem = h.optionList.find(itm => itm.type === h.type)
              const statusType = isStatusType ? findIem : ''
              const statusValue = statusType ? statusType.subTypeList && statusType.subTypeList.find(val => val.type === h.value) : ''
              const valueType = isStatusType ? '' : findIem
              const correctType = isStatusType ? '' : h.correctType
              const correctFactor = isStatusType ? '' : h.correctFactor
              //
              // const subTypeList= isStatusType ? h.optionList.find():''
              return {
                ...h,
                isStatusType,
                macName: macName ? macName.mac : '',
                macTitle: h.macName,
                lineValue: lineValue ? lineValue.title : '',
                // subTypeList,
                statusType: statusValue ? statusValue.typeName : '',
                valueType: valueType ? valueType.typeName : '',
                correctType,
                correctFactor,
              }
            })
            return { ...j, lineListPort }
          })
          return {
            name: v.name,
            conditionListType,
            panelValue: '1',
          }
        })
        const { delayExecSecond, linkageMode, triggerMode, triggerModeName, loopCycle, exeFrequency, loopMode, weekday, name, mac, macName, repeatExecIntervalSecond, repeatExecTimes, resId, status, timeRangeList, remark } = baseInfo
        this.historyTriggerMode = triggerMode
        this.baseInfos = {
          name,
          remark,
          linkageMode: linkageMode === 1 ? this.$t('edge') : this.$t('cloud'),
          triggerMode: triggerModeName,
          status: status === 1 ? this.$t('enabled') : this.$t('disabled'),
          loopMode: loopMode === 1 ? this.$t('single') : loopMode === 2 ? this.$t('everyDay') : loopMode === 3 ? this.$t('weekly') : '',
          loopCycle:
            loopMode === 3
              ? weekday
                  .split(',')
                  .map(v => weekConfig[v])
                  .join(',')
              : loopCycle,
          timeRanges: timeRangeList.map(v => `${this.$t('timeRangeValue', v)} `).join(','),
          delayExecSecond,
          repeatExecTimes,
          repeatExecIntervalSecond,
          exeFrequency,
          mac,
          macName,
        }

        this.baseInfos.mac = linkageMode === 1 ? mac : ''
        this.actionLine = actionList
      },
      backLists() {
        this.$emit('changePageMode', 'index')
      },
      changeactionPage(e) {
        this.pageNo = e
        this.getHistroyList()
      },
      getTabChange(val) {
        if (val === 'name2') {
          this.getHistroyList()
        }
      },
      async getHistroyList() {
        const tiemLen = !!this.excuteTime.length
        const params = {
          projectCode: this.$store.state.projectCode,
          sceneId: this.idAndRowData.sceneId,
          startTime: tiemLen ? dayjs(this.excuteTime[0]).format('YYYY-MM-DD HH:mm:ss') : '',
          endTime: tiemLen ? dayjs(this.excuteTime[1]).format('YYYY-MM-DD HH:mm:ss') : '',
          pageNo: this.pageNo,
          pageSize: 10,
        }
        const res = await getExecHistory(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.historyTableListData = res.datas
        this.total = res.total
      },
      changePage(e) {
        this.pageDetailNo = e
        this.openActionDetail(this.rowPageData)
      },
      async openActionDetail(row) {
        this.rowPageData = row
        this.detailModal = true
        const params = {
          projectCode: this.$store.state.projectCode,
          pageNo: this.pageDetailNo,
          pageSize: 10,
          hisId: row.hisId,
        }
        const res = await getExecDetail(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.detailTableData = res.datas
        this.detailTotal = res.total
      },
    },
  }
</script>

<style lang="less">
  .linkage-Detail {
    .text-nowrap {
      white-space: nowrap;
    }
    .mart-5 {
      margin-top: -5px;
    }
    .dis-wrap {
      display: flex;
      flex-wrap: wrap;
    }
    .w350 {
      width: 350px;
    }
    .mar-lf-20 {
      margin-left: 20px;
    }
    .bor-line {
      border: 1px solid #797979;
      border-radius: 5px;
      padding: 2px 10px;
    }
    .margin-5 {
      margin: 3px 10px;
    }
    .margin-10 {
      margin: 0 10px;
    }
    .mar-lf-50 {
      margin: 0 50px;
    }
    .margin-custom {
      margin-left: -10px;
    }
    .marl-custom {
      margin-left: 45px;
    }
    .mar-47 {
      margin-left: 47px;
    }
    .mar-37 {
      margin-left: 37px;
    }
    .border-type {
      border: 1px solid #55575c;
      border-radius: 5px;
    }
    .bgBlueColor {
      border: 1px solid #02a7f0;
      padding: 5px;
      margin-top: 10px;
      color: #02a7f0;
      background: #172d41;
    }
    .text-gray {
      color: #999;
    }
    .mar-10 {
      margin: 10px;
    }
    .marlr-10 {
      margin: 0 10px;
    }
    .mar-t-10 {
      margin: 20px 0;
    }
    .mar-t-15 {
      margin: 15px 0;
    }
    .line-boxs {
      border: 1px solid #55575c;
      margin: 10px;
      border-radius: 5px;
    }
    .mar-t10 {
      margin-top: 10px;
    }
    .pd-20 {
      padding: 20px;
    }
    .center-text {
      display: flex;
      justify-content: center;
      align-items: center;
      background: #363d4d;
      width: 30px;
    }
    .pd-10-15 {
      padding: 15px 10px;
    }
    .flex-1 {
      flex: 1;
      text-align: right;
    }
    .flx1 {
      flex: 1;
    }
    .flex-3 {
      flex: 12;
    }
    .dis-flex {
      display: flex;
    }
    .pd-10 {
      padding: 10px;
    }
    .eccute-record {
      padding-top: 10px;
      background: #1a202e;
    }
    .psi-relative {
      position: relative;
    }
    .detail-content {
      margin-top: 15px;
      background: #1a202e;
      padding: 20px;
    }
    .mar-t15 {
      margin-top: 15px;
    }
    .bg-head-box {
      height: 60px;
      width: 100%;
      background: #1a202e;
      position: absolute;
    }
    .ivu-collapse-header {
      height: 50px !important;
      display: flex;
      align-items: center;
      background: #363d4d;
      border-color: #797979 !important;
      padding: 5px 0px;
    }
    .ivu-collapse-content-box {
      padding-top: 6px;
    }
    .ivu-collapse {
      border: 1px solid #797979;
    }
  }
</style>
