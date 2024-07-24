<template>
  <div class="rechargeRecord">
    <Row class="select-list">
      <Input v-model="transaction" :placeholder="$t('searchSerialNumberTip')" style="width: 200px" />
      <ELPCascader v-if="billingTarget === 2" filterable :options="$store.state.charginMacList" v-model="mac" style="width: 250px" :transfer="true" :placeholder="$t('pleaseSelectDeviceLine2')" class="ml-10">
        <template slot-scope="{ data }">
          <div class="el-cascader-label-content">
            <Tooltip placement="left" :disabled="data.label.length < 8" transfer transfer-class-name="el-cascader-label-tips">
              <div class="label-text-content">{{ data.label }}</div>
              <template #content>
                <div>{{ data.label }}</div>
              </template>
            </Tooltip>
          </div>
        </template>
      </ELPCascader>
      <template v-if="billingTarget === 3">
        <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" class="ml-10" :clearable="true">
          <Option v-for="item in $store.state.packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
        </Select>
        <TreeSelect :placeholder="$t('selectGroup')" show-checkbox v-model="packetFilter" transfer :data="packetFilterList" class="ml-10" style="width: 200px" />
      </template>
      <DatePicker format="yyyy-MM-dd HH:mm:ss" :value="timer" type="daterange" placement="bottom-end" :placeholder="type === 'recharge' ? $t('transactionTime') : $t('refundTime')" @on-change="handleTimer" style="width: 320px" class="ml-10"></DatePicker>
      <Select v-model="rechargeChannels" style="width: 200px" :transfer="true" :placeholder="$t('rechargeChannels')" class="ml-10" :clearable="true" v-if="type === 'recharge'">
        <Option v-for="item in rechargeChannelsList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Select v-model="state" style="width: 200px" :transfer="true" :placeholder="$t('pleaseSelect')" class="ml-10" :clearable="true">
        <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button class="b-blue ml-10" @click="search">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
      <Button class="b-blue ml-10" @click="handleExportChargeHistory">{{ $t('export') }}</Button>
    </Row>
    <div class="rechargeRecordcontent">
      <Row style="justify-content: flex-end; margin-bottom: 10px">
        <div>
          <Button @click="handleActive('online')" :class="onlineStatus === true ? 'Active' : ''">{{ type === 'recharge' ? $t('onlineRecharge') : $t('onlineRefund') }}</Button>
          <Button @click="handleActive('offline')" :class="offlineStatus === true ? 'Active' : ''" class="ml-10">{{ type === 'recharge' ? $t('offlineRecharge') : $t('offlineRefund') }}</Button>
        </div>
      </Row>
      <template v-if="onlineStatus">
        <Table :columns="transactionColumns" :data="rechargeList" v-if="type === 'recharge'" show-summary :summary-method="handleSummary">
          <template slot-scope="{ row }" slot="orderNo">
            <span>{{ row.orderNo ? row.orderNo : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="payCompletedTime">
            <span>{{ row.payCompletedTime }}</span>
          </template>
          <template slot-scope="{ row }" slot="payAmount">
            <span>￥+{{ row.payAmount }}</span>
          </template>
          <template slot-scope="{ row }" slot="payChannelDesc">
            <span>{{ row.payChannelDesc }}</span>
          </template>
          <template slot-scope="{ row }" slot="tradeNo">
            <span>{{ row.tradeNo }}</span>
          </template>
          <template slot-scope="{ row }" slot="buyerAccName">
            <span>{{ row.extendMsg }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountAmount">
            <span :class="row.accountAmount < 0 ? 'c-danger' : ''">￥{{ row.accountAmount > 0 ? `${parseFloat(row.accountAmount.toFixed(10))}` : `${parseFloat(row.accountAmount.toFixed(10))}` }}</span>
          </template>
          <template slot-scope="{ row }" slot="state">
            <span :class="row.status === 0 ? 'b-warning' : row.status === 2 ? 'b-success' : 'b-danger'" type="text">{{ row.statusDesc }}</span>
            <template v-if="row.refundStatusDesc">
              <span :class="row.refundStatus === 1 ? 'b-warning' : row.refundStatus === 2 ? 'b-blueing' : row.refundStatus === 3 ? 'b-danger' : 'b-warning'" type="text" class="ml-10">{{ row.refundStatusDesc }}</span>
            </template>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button class="c-primary" type="text" @click="refundBtnClick(row)" v-if="row.isRefund && row.refundStatus !== 2 && row.refundStatus !== 1">{{ $t('refund') }}</Button>
            <Button class="c-primary" type="text" @click="refundDetailBtnClick(row)" v-if="row.situation">{{ $t('refundSituation') }}</Button>
          </template>
        </Table>
        <Table :columns="transactionColumns" :data="refundList" v-if="type === 'refund'" show-summary :summary-method="handleSummary">
          <template slot-scope="{ row }" slot="refundNo">
            <span>{{ row.refundNo ? row.refundNo : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="rechargeNumber">
            <span>{{ row.refundOrderDetailList[0].payOrderNo }}</span>
          </template>
          <template slot-scope="{ row }" slot="refundCompletedTime">
            <span>{{ row.refundCompletedTime }}</span>
          </template>
          <template slot-scope="{ row }" slot="refundTotalAmount">
            <span :class="row.refundTotalAmount < 0 ? 'c-danger' : ''">￥-{{ row.refundTotalAmount }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountAmount">
            <span :class="row.accountAmount < 0 ? 'c-danger' : ''">{{ row.accountAmount ? parseFloat(row.accountAmount.toFixed(10)) : 0 }}</span>
          </template>
          <template slot-scope="{ row }" slot="channel">
            <span>{{ row.refundOrderDetailList.length > 0 ? (row.refundOrderDetailList[0].refundChannel === 1 ? $t('weChat') : $t('alipay')) : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="tradeNo">
            <span>{{ row.refundOrderDetailList[0].tradeNo }}</span>
          </template>
          <template slot-scope="{ row }" slot="remark">
            <span>{{ row.refundOrderDetailList[0].remark ? row.refundOrderDetailList[0].remark : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="refundUser">
            <span>{{ row.extendMsg }}</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span :class="row.status === 1 ? 'b-warning' : 'b-danger'" type="text">{{ row.statusDesc }}</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button class="c-primary" type="text" @click="refundDetailBtnClick(row)" v-if="row.refundCreateTime">{{ $t('refundSituation') }}</Button>
          </template>
        </Table>
      </template>
      <template v-else>
        <Table :columns="transactionColumns" :data="rechargeList" v-if="type === 'recharge'" show-summary :summary-method="handleSummary">
          <template slot-scope="{ row }" slot="billRepairNo">
            <span>{{ row.billRepairNo ? row.billRepairNo : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="createTime">
            <span>{{ row.createTime }}</span>
          </template>
          <template slot-scope="{ row }" slot="repairAmount">
            <span>￥+{{ row.repairAmount ? row.repairAmount : 0 }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountAmount">
            <span :class="row.accountAmount ? (row.accountAmount < 0 ? 'c-danger' : '') : ''">￥{{ row.accountAmount ? (row.accountAmount > 0 ? `${parseFloat(row.accountAmount.toFixed(10))}` : `${parseFloat(row.accountAmount.toFixed(10))}`) : 0 }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountId">
            <span>{{ row.extendMsg }}</span>
          </template>
        </Table>
        <Table :columns="transactionColumns" :data="refundList" v-if="type === 'refund'" show-summary :summary-method="handleSummary">
          <template slot-scope="{ row }" slot="billRepairNo">
            <span>{{ row.billRepairNo ? row.billRepairNo : '-' }}</span>
          </template>
          <template slot-scope="{ row }" slot="createTime">
            <span>{{ row.createTime }}</span>
          </template>
          <template slot-scope="{ row }" slot="repairAmount">
            <span :class="row.repairAmount < 0 ? 'c-danger' : ''">￥-{{ row.repairAmount }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountAmount">
            <span :class="row.accountAmount < 0 ? 'c-danger' : ''">{{ row.accountAmount ? parseFloat(row.accountAmount.toFixed(10)) : 0 }}</span>
          </template>
          <template slot-scope="{ row }" slot="remark">
            <span>{{ row.remark }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountId">
            <span>{{ row.extendMsg }}</span>
          </template>
        </Table>
      </template>
      <Page :page-size="pageSize" @on-change="currentpage" :current="listPageNo" :total="listTotal" show-elevator show-total></Page>
    </div>
    <Modal v-model="refund" :title="$t('refund')" class-name="tripping" width="550">
      <div class="alarmprompt" style="display: flex">
        <Row style="align-items: center">
          <Icon color="#d9001b" size="20" type="ios-information-circle-outline" style="margin-left: 10px" />
        </Row>
        <div class="ml-10">{{ $t('refundModalTip2') }}</div>
      </div>
      <Form>
        <FormItem :label="$t('refundAmount')">
          <Row>
            <div style="position: relative">
              <MoneyInput v-model="cost.amt" />
              <span style="position: absolute; left: 0px; top: 32px; cursor: pointer" class="c-primary" @click="hanleAccountAmount('clearing')">{{ $t('currentSettlementBalance') }}</span>
              <span style="position: absolute; right: 0px; top: 32px; cursor: pointer" class="c-primary" @click="hanleAccountAmount('recharge')">{{ $t('amountOfThisRecharge') }}</span>
            </div>
          </Row>
        </FormItem>
        <div class="detail">
          <div style="margin-bottom: 10px; margin-top: 36px">{{ $t('rechargeDetails') }}</div>
          <template v-if="billingTarget === 1">
            <FormItem :label="`${$t('projectName')}:`">{{ refundInfo.value1 }}</FormItem>
          </template>
          <template v-if="billingTarget === 2">
            <FormItem :label="`${$t('device')}:`">{{ refundInfo.value1 }}</FormItem>
            <FormItem :label="`${$t('line')}:`">{{ refundInfo.value2 }}</FormItem>
          </template>
          <template v-if="billingTarget === 3">
            <FormItem :label="`${$t('groupType')}:`">{{ refundInfo.value1 }}</FormItem>
            <FormItem :label="`${$t('groupName')}:`">{{ refundInfo.value2 }}</FormItem>
          </template>
          <FormItem :label="`${$t('rechargeAccount')}:`">{{ staffName }} {{ `(${$store.state.mobile})` }}</FormItem>
          <FormItem :label="`${$t('rechargeAmount')}:`">
            <Row>
              ￥
              <h3>{{ refundInfo.payAmount }}</h3>
            </Row>
          </FormItem>
          <FormItem :label="`${$t('serialNumber')}:`">{{ refundInfo.orderNo }}</FormItem>
          <FormItem :label="`${$t('rechargeChannels')}:`">{{ refundInfo.payChannelDesc }}</FormItem>
          <FormItem :label="`${$t('rechargeChannelSerialNumber')}:`">{{ refundInfo.tradeNo }}</FormItem>
          <FormItem :label="`${$t('rechargeRemarks')}:`">{{ refundInfo.remark }}</FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="confirmRefund">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="handleCancel">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="refundDetail" :title="$t('refundDetails')" class-name="tripping" width="400">
      <Form>
        <div class="detail">
          <span>{{ $t('refundDetails') }}</span>
          <FormItem :label="`${$t('currentSettlementBalance')}:`">
            <span style="font-size: 16px">￥{{ balance ? balance : 0 }}</span>
          </FormItem>
          <FormItem :label="`${$t('refundAmount')}:`">
            <span style="color: #d9001b; font-size: 16px">￥{{ `${cost.amt}` }}</span>
          </FormItem>
          <FormItem :label="`${$t('balanceAfterRefund')}:`">
            <span style="font-size: 16px">￥{{ (Number(balance) - Number(`${cost.amt}`)).toFixed(2) }}</span>
          </FormItem>
        </div>
      </Form>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleRechargeSure" :disabled="flag">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="handleCancel">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <Modal v-model="situation" :title="$t('refundSituation')" class-name="tripping" width="500">
      <Steps :current="situationCurrent" :status="situationStatus">
        <template v-if="refundNum">
          <Step :title="$t('requestRefund')" :content="refundNum.refundCreateTime"></Step>
          <template v-if="refundNum.status === 1">
            <Step :title="$t('refundProcessing')" :content="refundNum.refundCompletedTime"></Step>
          </template>
          <!-- 0-待退款，1-退款中，2-退款成功，3-退款失败，4-退款取消 -->
          <template v-if="refundNum.status !== 1">
            <Step :title="refundNum.status === 2 ? $t('refundSuccessful2') : $t('refundException')" :content="refundNum.refundCompletedTime"></Step>
          </template>
        </template>
      </Steps>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { chargeHistory, refundHistory, refundCreate, balanceAndDeviceInfo, offlineRechargeAndRefund, refundOrderByPayOrder, getGroupNodeQueryCondition } from '@/api/public'
  export default {
    props: {
      type: String,
      billParams: { type: Object, default: () => {} },
    },
    data() {
      return {
        flag: false,
        situationCurrent: 0,
        situationStatus: 'process',
        offlineStatus: false,
        onlineStatus: true,
        balance: '',
        listTotal: 0,
        pageSize: 10,
        listPageNo: 1,
        packetTypes: '',
        packetFilter: '',
        packetFilterList: [],
        billingTarget: '',
        rechargeList: [],
        refundList: [],
        cost: { amt: 0, timerType: 'aday' },
        transactionColumns: [],
        transaction: '',
        mac: [],
        timerList: [],
        timer: [],
        rechargeChannelsList: [],
        rechargeChannels: '',
        stateList: [],
        state: '',
        refund: false,
        refundDetail: false,
        situation: false,
        refundInfo: {},
        refundNum: null,
        staffName: window.sessionStorage.getItem('staffName'),
        total: '',
      }
    },
    computed: {},
    mounted() {
      setTimeout(() => {
        this.timerList = this.$store.state.charginTimer
      }, 1000)
      this.billingTarget = this.$store.state.billingTarget
      this.state = this.billParams.typeValue ? this.billParams.typeValue : ''
      this.mac = this.billParams.value ? (this.billParams.value.length !== 0 ? this.billParams.value : []) : this.billParams.targetVal ? [+this.billParams.targetVal.split(':')[0], +this.billParams.targetVal.split(':')[1]] : []
      if (this.billingTarget === 3 && this.billParams.targetVal) {
        this.packetTypes = this.billParams.targetVal.split(':')[0]
        this.handleTypes(this.packetTypes)
      }
      if (this.billParams.timer) {
        let timer = this.billParams.timer.split('~')
        timer.forEach((val, index) => {
          val = index === 0 ? val + ' ' + '00:00:00' : val + ' ' + '23:59:59'
          this.timer.push(val)
        })
      }
      if (this.billParams.type) {
        this.rechargeChannels = this.billParams.typeValue
        this.handleActive(this.billParams.type)
      } else {
        this.handleActive('online')
      }
      if (this.type === 'recharge') {
        this.stateList = [
          { value: '1,2,3', label: this.$t('whole') },
          { value: '2', label: this.$t('rechargedSuccessfully') },
          { value: '3', label: this.$t('rechargeFailed') },
        ]
        let columnBefore = [
          { title: this.$t('serialNumber'), key: 'orderNo', slot: 'orderNo', align: 'center', width: 200 },
          { title: this.$t('transactionTime'), key: 'payCompletedTime', align: 'center', width: 170 },
        ]
        let columnAfter = [
          { title: this.$t('rechargeAmountWithUnit'), key: 'payAmount', slot: 'payAmount', width: 150, align: 'center' },
          { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', width: 150, align: 'center' },
          { title: this.$t('rechargeChannels'), key: 'payChannelDesc', slot: 'payChannelDesc', width: 100, align: 'center' },
          { title: this.$t('rechargeChannelSerialNumber'), key: 'tradeNo', slot: 'tradeNo', width: 300, align: 'center' },
          { title: this.$t('rechargeRemarks'), key: 'remark', align: 'center', width: 200 },
          { title: this.$t('rechargeAccount'), key: 'buyerAccName', slot: 'buyerAccName', align: 'center', width: 200 },
          { title: this.$t('state'), slot: 'state', align: 'center', width: 200 },
          { title: this.$t('operation'), slot: 'action', align: 'center', minWidth: 100, fixed: 'right' },
        ]
        if (this.billingTarget === 1) {
          this.transactionColumns = [...columnBefore, { title: this.$t('projectName'), key: 'value1', width: 250 }, ...columnAfter]
        } else if (this.billingTarget === 2) {
          this.transactionColumns = [...columnBefore, { title: this.$t('device'), key: 'value1', width: 350 }, { title: this.$t('line'), key: 'value2', width: 250 }, ...columnAfter]
        } else {
          this.transactionColumns = [...columnBefore, { title: this.$t('groupType'), key: 'value1', width: 100 }, { title: this.$t('groupName'), key: 'value2', width: 100 }, ...columnAfter]
        }
      } else {
        this.stateList = [
          { value: '0,1,2,3,4', label: this.$t('whole') },
          { value: '1', label: this.$t('refundStatusOption.label1') },
          { value: '2', label: this.$t('refundStatusOption.label2') },
          { value: '3', label: this.$t('refundStatusOption.label7') },
        ]
        let columnBefore = [
          { title: this.$t('refundSerialNumber'), key: 'refundNo', slot: 'refundNo', align: 'center', width: 200 },
          { title: this.$t('correspondingRechargeSerialNumber'), key: 'rechargeNumber', slot: 'rechargeNumber', align: 'center', width: 200 },
          { title: this.$t('refundTime'), key: 'refundCompletedTime', slot: 'refundCompletedTime', align: 'center', width: 200 },
        ]
        let columnAfter = [
          { title: this.$t('refundAmountWithUnit'), key: 'refundTotalAmount', slot: 'refundTotalAmount', width: 150 },
          { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', width: 150 },
          { title: this.$t('refundChannels'), key: 'channel', slot: 'channel', width: 150 },
          { title: this.$t('refundChannelSerialNumber'), key: 'tradeNo', slot: 'tradeNo', width: 300 },
          { title: this.$t('refundRemarks'), key: 'remark', slot: 'remark', minWidth: 150 },
          { title: this.$t('refundAccount'), key: 'refundUser', slot: 'refundUser', width: 350 },
          { title: this.$t('state'), key: 'status', slot: 'status', width: 150 },
          { title: this.$t('operation'), slot: 'action', align: 'center', minWidth: 100, fixed: 'right' },
        ]
        if (this.billingTarget === 1) {
          this.transactionColumns = [...columnBefore, { title: this.$t('projectName'), key: 'value1', width: 250 }, ...columnAfter]
        } else if (this.billingTarget === 2) {
          this.transactionColumns = [...columnBefore, { title: this.$t('device'), key: 'value1', width: 350 }, { title: this.$t('line'), key: 'value2', width: 250 }, ...columnAfter]
        } else {
          this.transactionColumns = [...columnBefore, { title: this.$t('groupType'), key: 'value1', width: 100 }, { title: this.$t('groupName'), key: 'value2', width: 100 }, ...columnAfter]
        }
      }
    },
    methods: {
      handleActive(val) {
        this.rechargeList = []
        this.refundList = []
        if (val === 'online') {
          this.onlineStatus = true
          this.offlineStatus = false
          this.handlechargeHistory(this.type)
          if (this.type === 'recharge') {
            this.rechargeChannelsList = [
              { value: '1', label: this.$t('weChat') },
              { value: '2', label: this.$t('alipay') },
            ]
            let columnBefore = [
              { title: this.$t('serialNumber'), key: 'orderNo', slot: 'orderNo', align: 'center', width: 350 },
              { title: this.$t('transactionTime'), key: 'payCompletedTime', align: 'center', width: 170 },
            ]
            let columnAfter = [
              { title: this.$t('rechargeAmountWithUnit'), key: 'payAmount', slot: 'payAmount', width: 150, align: 'center' },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', width: 150, align: 'center' },
              { title: this.$t('rechargeChannels'), key: 'payChannelDesc', slot: 'payChannelDesc', width: 100, align: 'center' },
              { title: this.$t('rechargeChannelSerialNumber'), key: 'tradeNo', slot: 'tradeNo', width: 350, align: 'center' },
              { title: this.$t('rechargeRemarks'), key: 'remark', align: 'center', width: 200 },
              { title: this.$t('rechargeAccount'), key: 'accountId', slot: 'accountId', align: 'center', width: 200 },
              { title: this.$t('state'), slot: 'state', align: 'center', width: 200 },
              { title: this.$t('operation'), slot: 'action', align: 'center', minWidth: 100, fixed: 'right' },
            ]
            if (this.billingTarget === 1) {
              this.transactionColumns = [...columnBefore, { title: this.$t('projectName'), key: 'value1', width: 350 }, ...columnAfter]
            } else if (this.billingTarget === 2) {
              this.transactionColumns = [...columnBefore, { title: this.$t('device'), key: 'value1', width: 350 }, { title: this.$t('line'), key: 'value2', width: 300 }, ...columnAfter]
            } else {
              this.transactionColumns = [...columnBefore, { title: this.$t('groupType'), key: 'value1', width: 100 }, { title: this.$t('groupName'), key: 'value2', width: 100 }, ...columnAfter]
            }
          } else {
            let columnBefore = [
              { title: this.$t('refundSerialNumber'), key: 'refundNo', slot: 'refundNo', align: 'center', width: 300 },
              { title: this.$t('correspondingRechargeSerialNumber'), key: 'rechargeNumber', slot: 'rechargeNumber', align: 'center', width: 300 },
              { title: this.$t('refundTime'), key: 'refundCompletedTime', slot: 'refundCompletedTime', align: 'center', width: 200 },
            ]
            let columnAfter = [
              { title: this.$t('refundAmountWithUnit'), key: 'refundTotalAmount', slot: 'refundTotalAmount', width: 150 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', width: 150 },
              { title: this.$t('refundChannels'), key: 'channel', slot: 'channel', width: 150 },
              { title: this.$t('refundChannelSerialNumber'), key: 'tradeNo', slot: 'tradeNo', width: 150 },
              { title: this.$t('refundRemarks'), key: 'remark', slot: 'remark', minWidth: 150 },
              { title: this.$t('refundAccount'), key: 'refundUser', slot: 'refundUser', width: 150 },
              { title: this.$t('state'), key: 'status', slot: 'status', width: 150 },
              { title: this.$t('operation'), slot: 'action', align: 'center', minWidth: 100, fixed: 'right' },
            ]
            if (this.billingTarget === 1) {
              this.transactionColumns = [...columnBefore, { title: this.$t('projectName'), key: 'value1', width: 170 }, ...columnAfter]
            } else if (this.billingTarget === 2) {
              this.transactionColumns = [...columnBefore, { title: this.$t('device'), key: 'value1', width: 170 }, { title: this.$t('line'), key: 'value2', width: 170 }, ...columnAfter]
            } else {
              this.transactionColumns = [...columnBefore, { title: this.$t('groupType'), key: 'value1', width: 100 }, { title: this.$t('groupName'), key: 'value2', width: 100 }, ...columnAfter]
            }
          }
        } else {
          this.onlineStatus = false
          this.offlineStatus = true
          this.handlerepairBill()
          if (this.type === 'recharge') {
            this.rechargeChannelsList = [
              { value: '5', label: this.$t('giftsOrDiscounts') },
              { value: '2', label: this.$t('offlineRecharge') },
            ]
            let columnBefore = [
              { title: this.$t('serialNumber'), key: 'billRepairNo', slot: 'billRepairNo', align: 'center', width: 200 },
              { title: this.$t('transactionTime'), key: 'createTime', align: 'center', width: 200 },
            ]
            let columnAfter = [
              { title: this.$t('rechargeAmountWithUnit'), key: 'repairAmount', slot: 'repairAmount', align: 'center', width: 200 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', align: 'center', width: 200 },
              { title: this.$t('rechargeChannels'), key: 'bizTypeDesc', align: 'center', width: 200 },
              { title: this.$t('rechargeRemarks'), key: 'remark', align: 'center', width: 200 },
              { title: this.$t('rechargeAccount'), key: 'accountId', slot: 'accountId', align: 'center', width: 400 },
            ]
            if (this.billingTarget === 1) {
              this.transactionColumns = [...columnBefore, { title: this.$t('projectName'), key: 'value1', width: 350 }, ...columnAfter]
            } else if (this.billingTarget === 2) {
              this.transactionColumns = [...columnBefore, { title: this.$t('device'), key: 'value1', width: 350 }, { title: this.$t('line'), key: 'value2', width: 300 }, ...columnAfter]
            } else {
              this.transactionColumns = [...columnBefore, { title: this.$t('groupType'), key: 'value1', width: 100 }, { title: this.$t('groupName'), key: 'value2', width: 100 }, ...columnAfter]
            }
          } else {
            let columnBefore = [
              { title: this.$t('refundSerialNumber'), key: 'billRepairNo', slot: 'billRepairNo', align: 'center', width: 300 },
              { title: this.$t('refundTime'), key: 'createTime', slot: 'createTime', align: 'center', width: 200 },
            ]
            let columnAfter = [
              { title: this.$t('refundAmountWithUnit'), key: 'repairAmount', slot: 'repairAmount', width: 150 },
              { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', width: 150 },
              { title: this.$t('refundRemarks'), key: 'remark', slot: 'remark', minWidth: 150 },
              { title: this.$t('refundAccount'), key: 'accountId', slot: 'accountId', width: 400 },
            ]
            if (this.billingTarget === 1) {
              this.transactionColumns = [...columnBefore, { title: this.$t('projectName'), key: 'value1', width: 350 }, ...columnAfter]
            } else if (this.billingTarget === 2) {
              this.transactionColumns = [...columnBefore, { title: this.$t('device'), key: 'value1', width: 350 }, { title: this.$t('line'), key: 'value2', width: 300 }, ...columnAfter]
            } else {
              this.transactionColumns = [...columnBefore, { title: this.$t('groupType'), key: 'value1', width: 100 }, { title: this.$t('groupName'), key: 'value2', width: 100 }, ...columnAfter]
            }
          }
        }
      },
      newDate(time) {
        var date = new Date(time)
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        var d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d
      },
      async handleBalanceAndDeviceInfo() {
        let params = {
          projectCode: this.$store.state.projectCode,
          targetValue: this.refundInfo.targetValue,
          billingTarget: this.refundInfo.billingTarget,
          billCycle: this.$store.state.billCycle,
        }
        const res = await balanceAndDeviceInfo(params)
        if (res.success) {
          this.balance = res.data.balance
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      hanleAccountAmount(type) {
        if (type === 'clearing') {
          let newAmout = Number(this.refundInfo.newAccountAmount)
          this.cost.amt = +newAmout
        } else {
          let payAmount = this.refundInfo.payAmount
          this.cost.amt = +payAmount
        }
      },
      handleExportChargeHistory() {
        let startTimer = this.timer.length > 0 ? this.timer[0] : ''
        let endTimer = this.timer.length > 0 ? this.timer[1] : ''
        this.state = this.state ? this.state : '1,2,3'
        let targetValue = this.billingTarget === 1 ? '' : this.billingTarget === 2 ? (this.mac.length > 0 ? `${this.mac[0]}:${this.mac[1]}` : '') : this.billingTarget === 3 ? this.packetFilter : ''
        if (this.type === 'recharge') {
          if (this.onlineStatus) {
            this.$func.windowCountDown(
              '/billing/export/chargeHistory.as?projectCode=' +
                this.$store.state.projectCode +
                '&tradeNo=' +
                this.transaction +
                '&channel=' +
                this.rechargeChannels +
                '&billingTarget=' +
                this.billingTarget +
                '&statusList=' +
                this.state +
                '&pageSize=10' +
                '&pageNum=' +
                this.listPageNo +
                '&startTime=' +
                startTimer +
                '&endTime=' +
                endTimer +
                '&targetValue=' +
                targetValue
            )
          } else {
            this.$func.windowCountDown(
              '/billing/export/offlineRechargeAndRefund.as?projectCode=' +
                this.$store.state.projectCode +
                '&billingTarget=' +
                this.billingTarget +
                '&bizTypeList=2,5' +
                '&pageSize=10' +
                '&pageNum=' +
                this.listPageNo +
                '&startTime=' +
                startTimer +
                '&endTime=' +
                endTimer +
                '&targetValue=' +
                targetValue
            )
          }
        } else {
          if (this.onlineStatus) {
            this.$func.windowCountDown(
              '/billing/export/refundHistory.as?projectCode=' +
                this.$store.state.projectCode +
                '&tradeNo=' +
                this.transaction +
                '&channel=' +
                this.rechargeChannels +
                '&billingTarget=' +
                this.billingTarget +
                '&statusList=' +
                this.state +
                '&pageSize=10' +
                '&pageNum=' +
                this.listPageNo +
                '&startTime=' +
                startTimer +
                '&endTime=' +
                endTimer +
                '&targetValue=' +
                targetValue
            )
          } else {
            this.$func.windowCountDown(
              '/billing/export/offlineRechargeAndRefund.as?projectCode=' + this.$store.state.projectCode + '&billingTarget=' + this.billingTarget + '&bizTypeList=4' + '&pageSize=10' + '&pageNum=' + this.listPageNo + '&startTime=' + startTimer + '&endTime=' + endTimer + '&targetValue=' + targetValue
            )
          }
        }
      },
      search() {
        if (this.onlineStatus) {
          this.handlechargeHistory(this.type)
        } else {
          this.handlerepairBill()
        }
      },
      handlerepairBill() {
        let params = {
          projectCode: this.$store.state.projectCode,
          billEndTime: this.timer[1],
          billStartTime: this.timer[0],
          bizTypeList: this.rechargeChannels !== '' ? this.rechargeChannels : this.type === 'recharge' ? '2,5' : '4',
          pageNum: this.listPageNo,
          pageSize: '10',
          billingTarget: this.billingTarget,
          billRepairNo: this.transaction,
        }
        if (this.billingTarget === 1) {
          params.targetValue = this.$store.state.projectCode
        }
        if (this.billingTarget === 2) {
          params.targetValue = this.mac.length === 0 ? '' : `${this.mac[0]}:${this.mac[1]}`
        }
        if (this.billingTarget === 3) {
          params.targetValue = this.packetFilter ? this.packetFilter : ''
        }
        offlineRechargeAndRefund(params).then(res => {
          if (res.success) {
            if (this.type === 'recharge') {
              this.total = res.data.list[res.data.list.length - 1]
              this.rechargeList = res.data.list.filter((item, index) => index !== res.data.list.length - 1)
            } else {
              this.total = res.data.list[res.data.list.length - 1]
              this.refundList = res.data.list.filter((item, index) => index !== res.data.list.length - 1)
            }
            this.listTotal = res.data.totalRow
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handlechargeHistory(type) {
        let params = {
          projectCode: this.$store.state.projectCode,
          tradeNo: this.transaction,
          channel: this.rechargeChannels,
          billingTarget: this.billingTarget,
          pageSize: '10',
          pageNum: this.listPageNo,
          startTime: this.timer[0],
          endTime: this.timer[1],
        }
        if (this.billingTarget === 1) {
          params.targetValue = this.$store.state.projectCode
        }
        if (this.billingTarget === 2) {
          params.targetValue = this.mac.length === 0 ? '' : `${this.mac[0]}:${this.mac[1]}`
        }
        if (this.billingTarget === 3) {
          params.targetValue = this.packetFilter ? this.packetFilter : ''
        }

        if (type === 'recharge') {
          params.statusList = this.state ? this.state : '1,2,3'
          chargeHistory(params).then(res => {
            if (res.success) {
              this.total = res.data.list[res.data.list.length - 1]
              this.rechargeList = res.data.list.filter((item, index) => index !== res.data.list.length - 1)
              this.listTotal = res.data.totalRow
              this.rechargeList.forEach(val => {
                if (val.refundStatus) {
                  if (val.refundStatus === 0 || val.refundStatus === 1 || val.refundStatus === 2 || val.refundStatus === 3 || val.refundStatus === 4) {
                    val.situation = true
                  } else {
                    val.situation = false
                  }
                } else {
                  val.situation = false
                }
              })
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        } else {
          params.status = this.state ? this.state : ''
          // todo  同步后端返回再翻译
          refundHistory(params).then(res => {
            if (res.success) {
              this.total = res.data.list[res.data.list.length - 1]
              this.listTotal = res.data.totalRow
              this.refundList = res.data.list.filter((item, index) => index !== res.data.list.length - 1)
              this.refundList.forEach(val => {
                if (val.status === '退款中' || val.status === '退款成功') {
                  val.situation = true
                } else {
                  val.situation = false
                }
              })
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
      },
      handleTimer(val) {
        this.timer = val
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      async getGroupTrees() {
        let params = { projectCode: this.$store.state.projectCode, groupId: this.packetTypes }
        const res = await getGroupNodeQueryCondition(params)
        if (res.success) {
          this.packetFilterList = this.getTree(res.data)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      getTree(tree = []) {
        let arr = []
        if (!!tree && tree.length !== 0) {
          tree.forEach(item => {
            let obj = {}
            obj.id = item.id
            obj.value = item.id
            obj.parentId = item.parentId
            obj.title = item.name
            obj.expand = false
            obj.selected = false
            obj.checked = false
            obj.children = this.getTree(item.children) // 递归调用
            arr.push(obj)
          })
        }
        return arr
      },

      handleSummary({ columns, data }) {
        const sums = {}
        columns.forEach((column, index) => {
          const key = column.key
          if (index === 0) {
            sums[key] = { key, value: this.$t('total') }
            return
          }
          if (this.onlineStatus) {
            if (this.billingTarget === 1) {
              if (this.type === 'recharge') {
                if (index === 3) {
                  sums[key] = { key, value: '￥+' + this.total.payAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              } else {
                if (index === 4) {
                  sums[key] = { key, value: '￥-' + this.total.refundTotalAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              }
            } else {
              if (this.type === 'recharge') {
                if (index === 4) {
                  sums[key] = { key, value: '￥+' + this.total.payAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              } else {
                if (index === 5) {
                  sums[key] = { key, value: '￥-' + this.total.refundTotalAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              }
            }
          } else {
            if (this.billingTarget === 1) {
              if (this.type === 'recharge') {
                if (index === 3) {
                  sums[key] = { key, value: '￥+' + this.total.payAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              } else {
                if (index === 4) {
                  sums[key] = { key, value: '￥-' + this.total.refundTotalAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              }
            } else {
              if (this.type === 'recharge') {
                if (index === 4) {
                  sums[key] = { key, value: '￥+' + this.total.repairAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              } else {
                if (index === 4) {
                  sums[key] = { key, value: '￥-' + this.total.repairAmount }
                } else {
                  sums[key] = { key, value: '' }
                }
              }
            }
          }
        })
        return sums
      },
      handleRechargeSure(type) {
        let money = Number(this.cost.amt)
        let status = false
        let payOrderNo = ''
        if (money > +this.refundInfo.payAmount) {
          status = false
          this.$Message.error({ content: this.$t('refundAmountLimitTip3') })
        }
        if (money < +this.refundInfo.payAmount) {
          status = true
          payOrderNo = 1
        }
        if (money === +this.refundInfo.payAmount) {
          status = true
          payOrderNo = 0
        }
        // todo  同步后端返回再翻译
        let array = [
          {
            payChannelDesc: this.refundInfo.payChannelDesc === '微信' ? '1' : '2', // 退款渠道
            refundAmount: money, // 退款金额
            refundType: payOrderNo, // 0-全额退款,1-部分退款
            payOrderNo: this.refundInfo.orderNo, // 原支付单号
          },
        ]
        let params = {
          refundTotalAmount: money,
          tradeType: '3',
          billingTarget: this.refundInfo.billingTarget,
          targetValue: this.refundInfo.targetValue,
          projectCode: this.$store.state.projectCode,
          refundUser: this.refundInfo.payUser,
          refundDetailList: JSON.stringify(array),
          nickName: JSON.parse(this.refundInfo.extend).buyerAccName,
        }
        // 设置按钮不可点击（disable: false）
        this.flag = true
        // 等待事件执行完或者相应的间隔时间后，恢复按钮为可点击状态
        if (status) {
          refundCreate(params).then(res => {
            this.refundDetail = false
            if (res.success) {
              this.flag = false
              this.handlechargeHistory(this.type)
              this.$Modal.info({ content: this.$t('refundSuccessfulAfterTip') })
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        }
      },
      currentpage(e) {
        this.listPageNo = e
        if (this.onlineStatus) {
          this.handlechargeHistory(this.type)
        } else {
          this.handlerepairBill()
        }
      },
      handleCancel() {
        this.refund = false
        this.refundDetail = false
      },
      handleRefund(type) {
        if (type === '1') {
          this.refund = true
        } else {
          this.situation = true
        }
      },
      refundBtnClick(row) {
        this.refundInfo = row
        this.refund = true
        this.flag = false
      },
      confirmRefund() {
        this.refund = false
        this.handleBalanceAndDeviceInfo()
        this.refundDetail = true
      },
      refundDetailBtnClick(row) {
        this.situation = true
        this.situationStatus = 'wait'
        if (this.type === 'recharge') {
          let params = { projectCode: this.$store.state.projectCode, payOrderNo: row.orderNo }
          refundOrderByPayOrder(params).then(res => {
            if (res.success) {
              this.refundNum = res.data.refundOrderDetailList[0]
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        } else {
          this.refundNum = row
        }
        setTimeout(() => {
          this.situationCurrent = 1
          if (this.refundNum.status === 2) {
            this.situationStatus = 'finish'
          }
          if (this.refundNum.status === 3 || this.refundNum.status === 4) {
            this.situationStatus = 'error'
          }
        }, 500)
      },
      reset() {
        this.timer = []
        this.transaction = ''
        this.mac = ''
        this.packetTypes = ''
        this.packetFilter = ''
        this.rechargeChannels = ''
        this.state = ''
      },
    },
  }
</script>
<style lang="less">
  .ivu-steps-status-process {
    width: 100px;
  }
  .Active {
    border: 1px solid #007eff !important;
    background: rgba(0, 127, 255, 0.2) !important;
    color: #007eff !important;
  }
  .rechargeRecordcontent {
    background: #1a202e;
    margin-top: 10px;
    padding: 10px;
  }
</style>
