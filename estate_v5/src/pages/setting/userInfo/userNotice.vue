<template>
  <div>
    <Row class="alarm-sound-tip">
      <span>
        <i class="icon-v5 icon-v5-xiaoxi"></i>
        {{ promptNotice }}
      </span>
    </Row>
    <div class="text-right-box">
      <Button type="primary" ghost @click="instantRecharge(6)">{{ $t('voiceRecharge') }}{{ remainingVms ? `(${$t('remaining')}${remainingVms})` : '' }}</Button>
      <Button type="primary" ghost @click="instantRecharge(3)" class="mar-r-l-10">{{ $t('SMSRecharge') }}{{ remainingSms ? `(${$t('remaining')}${remainingSms})` : '' }}</Button>
      <Button type="primary" ghost @click="addNotification">{{ $t('addReceive') }}</Button>
    </div>
    <Col :span="24">
      <Table :data="data" height="480" width="100%" :columns="columnTable">
        <template #prjList="{ row, index }">
          <TagAutoMergeSingleArray :isEdit="row.isEdit" :key="row.prjList.length" @handleAddAlarm="handleAddProject(row.prjList, index)" @handleTypesClose="idx => handleProjectClose(index, idx)" :typeNumbers="row.prjList"></TagAutoMergeSingleArray>
        </template>
        <template #receive="{ row, index }">
          <tagAllSingleMerge :isEdit="row.isEdit" :key="row.receiveList.length" @handleAddList="addUser(row.receiveList, index)" @handleTypesClose="idx => handleReceiveClose(index, idx)" :tagList="row.receiveList"></tagAllSingleMerge>
        </template>
        <template #alarmList="{ row, index }">
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
        <template #generalSignName="{ row }">
          <Checkbox v-model="row.generalSignName" :disabled="!row.isEdit">{{ $t('currency') }}</Checkbox>
        </template>
        <template #pushEnable="{ row }">
          <Switch v-model="row.pushEnable" :true-value="1" :false-value="0" @on-change="changePushEnableStatus($event, row)" />
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
        <Page background show-elevator @on-change="handlePage" :current="pageNo" :page-size="pageSize" :total="total" show-total></Page>
      </div>
    </Col>

    <Modal v-model="modalnotice" :title="$t('tip')" @on-ok="removeOk" @on-cancel="removeCancel">
      <p>{{ $t('confirmDeleteConfig') }}</p>
    </Modal>
    <Modal :title="category === 3 ? $t('SMSRecharge') : $t('voiceRecharge')" :mask="false" v-model="rechargeFlag" @on-cancel="handleCloseRecharge" id="recharge-form">
      <template v-if="packageFlag">
        <div class="fw recharge-tip">
          <i class="icon-v5 icon-v5-huifu"></i>
          <span>{{ $t('rechargeInstructions') }}</span>
        </div>
        <Row style="display: flex; margin: 20px 0">
          <Col :span="6">{{ $t('rechargePackage') }}:</Col>
          <Col :span="18">
            <RadioGroup v-model="rechargeOption" id="rechargeOption">
              <Radio style="width: 150px; margin-bottom: 10px" v-for="(item, index) in rechargeOptions" :key="index" :label="item.split(':')[0]">
                {{ `${item.split(':')[2]}` + `${category === 3 ? $t('piece') : $t('minute')}` + ' ' + `(${item.split(':')[1]}${$t('yuan')})` }}
              </Radio>
            </RadioGroup>
          </Col>
        </Row>
        <div class="btn">
          <Button type="primary" @click="payImmediately">{{ $t('recharge') }}</Button>
        </div>
      </template>
      <template v-if="!packageFlag">
        <Row style="display: flex" :gutter="30">
          <template v-if="!paymentResultFlag">
            <Col :span="10">
              <div class="qrCode">
                <img :src="qrCode" class="qr-code" />
              </div>
            </Col>
            <Col :span="14">
              <div style="width: 100px">
                <img style="width: 100%" src="../../../assets/images/weChat.png" />
              </div>
              <div style="margin-top: 20px; margin-bottom: 60px">
                {{ $t('completePayment') }}
              </div>
              <h3 style="margin-bottom: 10px">
                {{ $t('pay') + packagePrice + $t('yuan') }}
              </h3>
              <div style="display: flex">
                <h4>{{ $t('packageChoose') }}：</h4>
                <h4>
                  {{ quantity + (category === 3 ? $t('piece') : $t('minute')) }}
                </h4>
              </div>
            </Col>
          </template>

          <div v-if="paymentResultFlag" class="payment-result">
            <p v-if="paymentResult === '1'">
              <i class="el-icon-success c-success"></i>
              <span class="fw">{{ $t('paySuccess') }}</span>
            </p>
            <p v-if="paymentResult === '2'">
              <i class="el-icon-warning c-danger"></i>
              <span>
                <div class="fw">{{ $t('payFailed') }}</div>
                <div class="failure-msg">{{ paymentFailureMsg }}</div>
              </span>
            </p>
          </div>
        </Row>
      </template>

      <div slot="footer"></div>
    </Modal>
    <Modal v-model="flag" :title="$t('pleaseSelectTime')" @on-ok="getTime" @on-visible-change="visiblechange">
      <Row>
        <Col span="12">
          <TimePicker v-model="timeArr" type="timerange" format="HH:mm" confirm placement="bottom-end" :placeholder="$t('pleaseSelectTime')" style="width: 168px"></TimePicker>
        </Col>
      </Row>
    </Modal>
    <Modal :title="$t('addReceiver')" v-model="addReceiveModal" @on-cancel="closeReceiveModal" @on-ok="addReceiveTag">
      <receiveTable v-if="addReceiveModal" :listData="listData" ref="receiveTableRef"></receiveTable>
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
  import { getPayQuotaConfig, payQrCode, confirmPayStatus, payStatus } from '@/api/public'
  import ProjectSelect from '../../Common/ProjectSelect.vue'
  import receiveTable from '../component/reviceTable.vue'
  import TagAutoFoldMerge from '../component/TagAutoFoldMerge.vue'
  import AlarmTreeList from './AlarmTreeList.vue'
  import ProjectTable from '../component/projectTable.vue'
  import TagAutoMergeSingleArray from '../component/TagAutoMergeSingleArray.vue'
  import { saveUserNotice, getUserNoticeList, delUserNotice, getAccTypeQuantity, modifyStatus4UserNotice } from '@api/setting/projectInfo'
  import { timeOptions, findSilenceTimeoutValue } from './text'
  import tagAllSingleMerge from '../component/tagAllSingleMerge.vue'
  import { cloneDeep } from 'lodash'
  export default {
    components: { ProjectSelect, receiveTable, TagAutoFoldMerge, tagAllSingleMerge, AlarmTreeList, TagAutoMergeSingleArray, ProjectTable },
    data() {
      return {
        selectPrjList: [],
        listData: [],
        addReceiveModal: false,
        category: null,
        promptNotice: this.$t('promptNotice'),
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
          { title: this.$t('receiver'), slot: 'receive', width: 300 },
          { title: this.$t('allowedType'), slot: 'alarmList', width: 300 },
          {
            title: this.$t('timePeriodNotification'),
            slot: 'timeRanges',
            width: 300,
          },
          { title: this.$t('reticentperiod'), slot: 'silentPeriod', width: 120 },
          {
            title: this.$t('SMSsignature'),
            slot: 'generalSignName',
            width: 100,
          },
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
        rechargeFlag: false,
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
      await this.getRemaining()
    },
    computed: {},
    methods: {
      findSilenceTimeoutValue,
      async getRemaining() {
        const res = await getAccTypeQuantity()
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.remainingSms = res.data.sms
        this.remainingVms = res.data.vms
      },
      addUser(list = [], index) {
        this.receiveIndex = index
        this.addReceiveModal = true
        this.listData = list
      },
      closeReceiveModal() {
        this.addReceiveModal = false
      },
      addReceiveTag() {
        this.data[this.receiveIndex].receiveList = cloneDeep(this.$refs.receiveTableRef.selectTableData)
        this.closeReceiveModal()
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
        this.pageNo = e
        this.queryList()
      },
      async queryList() {
        // 后面改
        // this.dataFlag = false
        let params = {
          pageSize: 10,
          pageNo: this.pageNo,
        }
        const res = await getUserNoticeList(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.data = res.datas.map(v => {
          const alarmList = v.alarmList && v.alarmList.filter(itm => itm.typeNumber !== '1015')
          const customAlarmList = v.customAlarmList && v.customAlarmList.map(j => ({ ...j, alarmInfo: j.name }))
          const prjList = v.prjList && v.prjList.map(j => ({ ...j, projectName: j.name, projectCode: j.code }))
          const receiveList = v.pushObjectList && v.pushObjectList.map(j => ({ ...j, label: `${j.name}(${j.address})` }))
          const timeRanges = v.timeRanges && v.timeRanges.map(v => ({ label: v }))
          return {
            ...v,
            alarmList,
            customAlarmList,
            receiveList,
            isEdit: false,
            prjList,
            timeRanges,
          }
        })
        this.total = res.total
      },
      async instantRecharge(val) {
        this.category = val
        this.rechargeFlag = true
        this.packageFlag = true
        this.rechargeOption = 1
        const res = await getPayQuotaConfig({ chargeType: val === 3 ? 1 : 2 })
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        this.rechargeOptions = res.data
      },
      addNotification() {
        if (this.data.length === this.total + 1) return false
        const tableRow = {
          alarmList: [],
          cid: 0,
          generalSignName: false,
          isEdit: true,
          phoneNumber: '',
          prjList: [],
          receiveList: [],
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
      handleReceiveClose(index, idx) {
        this.data[index].receiveList.splice(idx, 1)
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
      async changePushEnableStatus(val, row) {
        const res = await modifyStatus4UserNotice({ id: row.id, pushEnable: val })
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.$Message.success(res.message)
        this.queryList()
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
          id: row.id,
          pushObjectIds: row.receiveList.map(v => v.id).join(','),
          typeNumbers: customNumbers ? (types.length > 0 ? types.join(',') + ',1015' : '1015') : types.join(','),
          timeRanges: row.timeRanges.map(v => v.label).join(','),
          prjCodes: projects.join(','),
          pushEnable: row.pushEnable,
          customTypeNumbers: customNumbers || 0,
          silenceTimeout: row.silenceTimeout,
          generalSignName: row.generalSignName,
        }

        this.savePushConfig(params)
      },
      async savePushConfig(params, type) {
        const res = await saveUserNotice(params)
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
        const res = await delUserNotice({ id: this.rowMessage.id })
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
      handleCloseRecharge() {
        this.rechargeFlag = false
        clearInterval(this.polling)
        this.polling = null
      },
      async payImmediately() {
        let recharge = this.rechargeOptions[this.rechargeOption - 1].split(':')
        this.quantity = recharge[2]
        this.packagePrice = recharge[1]
        let params = {
          quotaId: this.rechargeOption,
          chargeType: this.category === 3 ? 1 : 2,
        }
        const res = await payQrCode(params)
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        this.packageFlag = false
        this.paymentResultFlag = false
        this.qrCode = 'data:image/gif;base64,' + res.data.qrCode
        this.polling = setInterval(() => {
          this.queryPaymentResult(res.data.tradeNo)
        }, 2000)
      },
      async queryPaymentResult(tradeNo) {
        const res = await payStatus({ tradeNo: tradeNo })
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        let code = res.data.statu
        if (code !== '0') {
          clearInterval(this.polling)
          if (code === '1') {
            this.paymentResultFlag = true
            this.paymentResult = code
            this.queryList()
          } else if (code === '2') {
            this.confirmPaymentResult(tradeNo)
          }
        }
      },
      async confirmPaymentResult(tradeNo) {
        const res = await confirmPayStatus({ tradeNo: tradeNo })
        if (!res.success) {
          return this.$Message.error({
            content: res.message,
          })
        }
        let code = res.data.statu
        if (code === '1' || code === '2') {
          this.paymentResultFlag = true
          this.paymentResult = code
        }
        if (code === '2') {
          this.paymentFailureMsg = res.data.desc
        }
      },
      saveProjectSelected() {
        this.data[this.indexs].prjList = this.$refs.saveProjectSelectedRef.selectTableData
      },
    },
    destroyed() {
      this.polling && clearInterval(this.polling)
      this.polling = null
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
