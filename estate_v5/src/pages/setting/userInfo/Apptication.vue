<template>
  <div>
    <Row class="alarm-sound-tip">
      <span>
        <i class="icon-v5 icon-v5-xiaoxi"></i>
        {{ $t('localAppTips') }}
      </span>
    </Row>
    <div class="text-right-box">
      <Button type="primary" ghost @click="addNotification">{{ $t('add') }}</Button>
    </div>
    <Col :span="24">
      <Table :data="data" height="480" width="100%" :columns="columnTable">
        <template #prjList="{ row, index }">
          <TagAutoMergeSingleArray :isEdit="row.isEdit" :key="row.prjList.length" @handleAddAlarm="handleAddProject(row.prjList, index)" @handleTypesClose="idx => handleProjectClose(index, idx)" :typeNumbers="row.prjList"></TagAutoMergeSingleArray>
        </template>
        <template slot-scope="{ row, index }" slot="appChnl">
          <CheckboxGroup :value="row.appChnl" @on-change="onAddOptionChange($event, 'appChnl', index)">
            <Checkbox label="iOS" :disabled="!row.isEdit"></Checkbox>
            <Checkbox label="Android" :disabled="!row.isEdit"></Checkbox>
          </CheckboxGroup>
        </template>
        <template slot-scope="{ row, index }" slot="alarmList">
          <TagAutoFoldMerge :isEdit="row.isEdit" @handleAddAlarm="handleAddAlarm(row.alarmList, index, row.customAlarmList, row)" @handleTypesClose="(idx, type) => handleTypesClose(index, idx, type)" :typeNumbers="row.alarmList" :customTypeNumbers="row.customAlarmList"></TagAutoFoldMerge>
        </template>
        <template #timeRanges="{ row, index }">
          <tagAllSingleMerge :isEdit="row.isEdit" :key="row.timeRanges.length" @handleAddList="add(index)" @handleTypesClose="idx => handleTypesCloses(index, idx)" :tagList="row.timeRanges"></tagAllSingleMerge>
        </template>
        <template #silentPeriod="{ row, index }">
          <div v-if="!row.isEdit">{{ findSilenceTimeoutValue(row.silenceTimeout) }}</div>
          <Select v-if="row.isEdit" v-model="row.silenceTimeout" style="width: 80px" @on-change="changeDataSilence($event, index)">
            <Option v-for="item in timeOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </template>
        <template #pushEnable="{ row }">
          <Switch v-model="row.pushEnable" :true-value="1" :false-value="0" :disabled="!row.isEdit" />
        </template>
        <template #operation="{ row, index }">
          <Button v-if="!row.isEdit" type="text" size="small" @click="handleEdit(index)">
            <span style="color: #007eff">{{ $t('edit') }}</span>
          </Button>
          <Button v-if="row.isEdit" type="text" size="small" @click="handleSave(row)">
            <span style="color: #007eff">{{ $t('save') }}</span>
          </Button>
          <Button v-if="row.isEdit" type="text" size="small" @click="handleCancel(index)">
            <span style="color: #ff5b59">{{ $t('cancel') }}</span>
          </Button>
          <Button v-if="!row.isEdit" type="text" size="small" @click="handleDel(row, index)">
            <span style="color: #ff5b59">{{ $t('remove') }}</span>
          </Button>
        </template>
      </Table>
      <div class="tc" style="margin-top: 15px">
        <div class="tc" style="margin-top: 15px">
          <Button @click="handlePage('home')">{{ $t('home') }}</Button>
          <Button @click="handlePage('prev')" :disabled="count <= 1">{{ $t('prev') }}</Button>
          <Button @click="handlePage('next')" :disabled="total < 10">{{ $t('next') }}</Button>
        </div>
      </div>
    </Col>

    <Modal v-model="modalnotice" :title="$t('tip')" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>{{ $t('confirmDeleteConfig') }}</p>
    </Modal>
    <Modal v-model="flag" :title="$t('pleaseSelectTime')" @on-ok="getTime" @on-visible-change="visiblechange">
      <Row>
        <Col span="12">
          <TimePicker v-model="timeArr" type="timerange" format="HH:mm" confirm placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></TimePicker>
        </Col>
      </Row>
    </Modal>
    <Modal :mask="false" :title="$t('alarmTypeSelection')" v-model="alarmTypeFlag" width="1000" @on-cancel="alarmTypeFlag = false" @on-ok="handleSaveTypes">
      <AlarmTreeList ref="alarmListRef" :checkedAlarm="checkedAlarm" :projectList="projectList" :key="alarmKey"></AlarmTreeList>
    </Modal>
    <Modal v-model="projectSelectFlag" :title="$t('projectSelect')" @on-cancel="projectSelectFlag = false" :mask="false" :mask-closable="false" @on-ok="saveProjectSelected">
      <ProjectTable v-if="projectSelectFlag" :prjList="selectPrjList" ref="saveProjectSelectedRef"></ProjectTable>
    </Modal>
  </div>
</template>
<script>
  import { SMSPush, saveAlarmPushConfigInfo, delAlarmPushConfig } from '@/api/public'
  import ProjectSelect from '../../Common/ProjectSelect.vue'
  import receiveTable from '../component/reviceTable.vue'
  import TagAutoFoldMerge from '../component/TagAutoFoldMerge.vue'
  import AlarmTreeList from './AlarmTreeList.vue'
  import ProjectTable from '../component/projectTable.vue'
  import TagAutoMergeSingleArray from '../component/TagAutoMergeSingleArray.vue'
  import { timeOptions, findSilenceTimeoutValue } from './text'
  import tagAllSingleMerge from '../component/tagAllSingleMerge.vue'
  export default {
    components: { ProjectSelect, receiveTable, TagAutoFoldMerge, tagAllSingleMerge, AlarmTreeList, TagAutoMergeSingleArray, ProjectTable },
    data() {
      return {
        selectPrjList: [],
        listData: [],
        addReceiveModal: false,
        category: null,
        projectLists: [],
        popAllCustom: [],
        customProjectList: [],
        flag: false,
        timeArr: [],
        origin: '',
        columnTable: [
          {
            title: this.$t('allodwdProject'),
            slot: 'prjList',
            width: 400,
          },
          { title: this.$t('AppChannel'), slot: 'appChnl', width: 200 },
          { title: this.$t('allowedType'), slot: 'alarmList', width: 300 },
          {
            title: this.$t('timePeriodNotification'),
            slot: 'timeRanges',
            width: 300,
          },
          { title: this.$t('reticentperiod'), slot: 'silentPeriod', width: 120 },
          { title: this.$t('state'), slot: 'pushEnable', width: 120 },
          { title: this.$t('operation'), slot: 'operation', width: 200 },
        ],
        paymentFailureMsg: '',
        paymentResult: '',
        paymentResultFlag: false,
        packagePrice: '',
        quantity: 0,
        modalnotice: false,
        form: {
          phone: '',
        },
        data: [],
        length: 0,
        index: 0,
        count: 1,
        packageFlag: true,
        rechargeOption: 1,
        rechargeOptions: [],
        dataFlag: false,
        projectSelectFlag: false,
        alarmTypeList: [],
        alarmTypeFlag: false,
        remaining: 0,
        options: [
          {
            label: this.$t('disabled'),
            value: 0,
          },
          {
            label: this.$t('enabled'),
            value: 1,
          },
        ],
        timeOptions,
        rowMessage: '',
        rowIndex: '',
        indexs: 0,
        receiveIndex: null,
        pageNo: 1,
        pageSize: 10,
        total: 0,
        remainingSms: null,
        remainingVms: null,
        alarmIndex: null,
        checkedAlarm: [],
        projectList: [],
        alarmKey: null,
      }
    },

    async mounted() {
      await this.queryList()
    },
    computed: {},
    methods: {
      findSilenceTimeoutValue,
      onAddOptionChange(value, type, index) {
        this.data[index][type] = [...value]
      },
      visiblechange(e) {
        if (e) this.timeArr = []
      },

      handleSaveTypes() {
        const checkedList = this.$refs.alarmListRef.checkedList
        this.data[this.alarmIndex].alarmList = checkedList.filter(v => !v.projectCode).map(j => ({ ...j, alarmInfo: j.info }))
        const customList = checkedList.filter(v => !!v.projectCode)
        this.data[this.alarmIndex].customAlarmList = customList.length > 0 ? customList.map(v => ({ ...v, alarmInfo: v.info })) : []
      },
      add(e) {
        this.indexT = e
        this.flag = true
      },
      handlePage(e) {
        if (e === 'home') {
          this.count = 1
        } else if (e === 'prev') {
          this.count--
        } else if (e === 'next') {
          this.count++
        }
        this.queryList()
      },
      async queryList() {
        // 后面改
        // this.dataFlag = false
        let params = {
          pushChannel: 1,
          pageSize: 10,
          pageNo: this.count,
        }
        const res = await SMSPush(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.data = res.data.configList.map(v => {
          const alarmList = v.alarmList && v.alarmList.filter(itm => itm.typeNumber !== '1015')
          const customAlarmList = v.customAlarmList && v.customAlarmList.map(j => ({ ...j, alarmInfo: j.name }))
          const prjList = v.prjList && v.prjList.map(j => ({ ...j, projectName: j.name, projectCode: j.code }))
          const timeRanges = v.timeRanges && v.timeRanges.map(v => ({ label: v }))
          return {
            ...v,
            alarmList,
            customAlarmList,
            isEdit: false,
            prjList,
            timeRanges,
          }
        })
        this.total = res.data.configList.length
      },
      addNotification() {
        if (this.data.length === this.total + 1) return false
        const tableRow = {
          alarmList: [],
          cid: 0,
          isEdit: true,
          appChnl: [],
          phoneNumber: '',
          prjList: [],
          silenceTimeout: '',
          pushEnable: 1,
          timeRanges: [],
        }
        this.data.unshift(tableRow)
      },
      handleAddProject(row, index) {
        this.indexs = index

        this.selectPrjList = row
        this.projectSelectFlag = true
      },
      handleProjectClose(index, idx) {
        this.data[index].prjList.splice(idx, 1)
      },
      isNotEmptyArray(arr = []) {
        return Array.isArray(arr) && arr.length > 0
      },
      handleAddAlarm(typeNumbers = [], index, listCustom = [], row) {
        let customArr = []
        if (Array.isArray(listCustom) && listCustom.length) {
          customArr = listCustom.map(v => ({ ...v, typeNumber: v.id }))
        }
        if (!this.isNotEmptyArray(row.prjList)) {
          return this.$Message.error(this.$t('pleaseSelectProject1'))
        }
        this.alarmIndex = index
        this.checkedAlarm = typeNumbers.concat(customArr).map(v => v.typeNumber)
        this.projectList = row.prjList.map(v => v.code)
        this.alarmKey = Math.random()
        this.alarmTypeFlag = true
      },
      handleTypesClose(index, ids, type) {
        const typeConfig = {
          typeNumbers: 'alarmList',
          customTypeNumbers: 'customAlarmList',
        }
        this.data[index][typeConfig[type]].splice(ids, 1)
      },
      handleTypesCloses(index, idx) {
        this.data[index].timeRanges.splice(idx, 1)
      },
      changeDataSilence(val, index) {
        this.data[index].silenceTimeout = val
      },
      handleEdit(index) {
        this.data[index].isEdit = true
      },
      handleCancel(index) {
        this.data[index].isEdit = false
        this.queryList()
      },
      handleSave(row) {
        const checkConfig = {
          alarmList: item => (!!item.alarmList && !!item.alarmList.length) || (!!row.customAlarmList && !!row.customAlarmList.length),
          prjList: item => !!item.prjList && !!item.prjList.length,
          timeRanges: item => !!item.timeRanges && !!item.timeRanges.length,
          receiveList: item => !!item.receiveList && !!item.receiveList.length,
          silenceTimeout: item => +item.silenceTimeout === 0 || !!item.silenceTimeout,
        }
        let checkArr = []

        for (let key in row) {
          if (checkConfig.hasOwnProperty(key)) {
            checkArr.push(checkConfig[key](row))
          }
        }
        if (checkArr.some(v => !v)) {
          return this.$Message.error({
            content: this.$t('optionTip'),
          })
        }
        let types = row.alarmList.map(item => item.typeNumber)
        let projects = row.prjList.map(item => item.code)
        let customNumbers = Array.isArray(row.customAlarmList) && row.customAlarmList.length && row.customAlarmList.map(item => item.typeNumber || item.id).join()
        let params = {
          id: row.cid,
          pushChannel: 1,
          typeNumbers: customNumbers ? (types.length > 0 ? types.join(',') + ',1015' : '1015') : types.join(','),
          timeRanges: row.timeRanges.map(v => v.label).join(','),
          prjCodes: projects.join(','),
          pushEnable: row.pushEnable,
          customTypeNumbers: customNumbers || 0,
          channelParams: row.appChnl.join(',') + (row.silenceTimeout ? '^' + row.silenceTimeout : ''),
        }

        this.savePushConfig(params)
      },
      async savePushConfig(params, type) {
        const res = await saveAlarmPushConfigInfo(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: res.message,
        })
        this.queryList()
      },
      handleDel(row, index) {
        if (row.cid === 0) {
          this.data.splice(index, 1)
        } else {
          this.modalnotice = true
          this.rowMessage = row
          this.rowIndex = index
        }
      },
      async removeOk() {
        const res = await delAlarmPushConfig({ cid: this.rowMessage.cid })
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success({
          content: res.message,
        })
        this.queryList()
      },
      removeCancel() {
        this.modalnotice = false
        this.$Message.info({
          content: this.$t('cancelDel'),
        })
      },
      getTime() {
        let timeStr = this.timeArr[0] + '~' + this.timeArr[1]
        this.data[this.indexT].timeRanges.unshift({ label: timeStr })
      },
      saveProjectSelected() {
        this.data[this.indexs].prjList = this.$refs.saveProjectSelectedRef.selectTableData
      },
    },
  }
</script>

<style lang="less" scoped>
  .text-right-box {
    text-align: right;
    margin: 10px;
  }
  .mar-r-l-10 {
    margin: 0 10px;
  }
  .mt {
    display: flex;
    margin-top: 30px;
  }
  .alarm-sound-tip {
    font-size: 14px;
    padding: 5px;
    border: 1px solid;
    background: #1a202e;
    color: #999999;
  }
  /deep/.ivu-modal-footer {
    border: transparent;
    padding: 10px;
  }
  .mrl {
    margin-left: 20px;
    margin-top: 10px;
  }

  .check-group {
    display: flex;
    margin-top: 10px;
  }
  .center-checkbox {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #999999;
  }
  .control-box {
    width: 160px;
    height: 100px;
    display: flex;
    border: 1px dashed #ccc;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 20px;
  }
  .boxs-check {
    display: flex;
    align-items: top;
    margin-top: 10px;
    line-height: 40px;
    margin-left: 20px;
    .alarm-check {
      width: 140px;
    }
  }
  .recharge-tip {
    border: 1px solid #666877;
    padding: 5px;
    background: rgba(103, 105, 120, 0.2);
    color: #97999a;
  }
  .btn {
    width: 100%;
    text-align: right;
  }
  .qrCode {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .choice {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
    color: #007eff;
    height: 34px;
    line-height: 34px;
    cursor: pointer;
    padding: 0 10px;
    margin-right: 16px;
    display: inline-block;
  }
  .ivu-tag {
    height: 34px;
    line-height: 34px;
  }
</style>
