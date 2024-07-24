<template>
  <div class="collectionbalance">
    <div class="bottom-list" v-if="billingTarget !== 1">
      <QRCodeCell :text="createQrCodeTextProject()" :title="$t('projectPaymentCode')" :width="250" isNeedBackColor>
        <Button slot="action" class="b-blue">{{ $t('projectPaymentCode') }}</Button>
        <div style="white-space: normal; margin-top: 20px; text-align: center; padding: 0 20px 20px 10px">{{ $t('projectName') }}：{{ $store.state.prjName }}</div>
      </QRCodeCell>
    </div>
    <Row class="select-list">
      <Select v-model="timer" style="width: 200px" :transfer="true" :placeholder="$t('pleaseSelect')">
        <Option v-for="item in $store.state.charginTimer" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <ELPCascader v-if="billingTarget === 2" :filterable="true" :options="$store.state.charginMacList" v-model="mac" style="width: 250px" :transfer="true" :placeholder="$t('pleaseSelectDeviceLine2')" class="ml-10">
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
        <TreeSelect :placeholder="$t('selectGroup')" v-model="packetFilter" transfer :data="packetFilterList" class="ml-10" style="width: 200px" />
      </template>
      <Select v-model="supervisor" style="width: 200px" :transfer="true" :placeholder="$t('supervisor')" class="ml-10" :clearable="true">
        <Option v-for="item in supervisorList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Select v-model="electricityUser" style="width: 200px" :transfer="true" :placeholder="$t('electricityUser')" class="ml-10" :clearable="true">
        <Option v-for="item in electricityUserList" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <Button class="b-blue ml-10" @click="search">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
      <Button class="b-blue ml-10" @click="handleExport">{{ $t('export') }}</Button>
    </Row>
    <div class="information">
      <Row class="header">
        <div style="display: flex; font-size: 16px">
          <div>{{ $t('settlementCycle') }}：{{ $store.state.billingCycleName }}</div>
          <div style="margin-left: 60px">{{ $t('thisSettlementPeriod') }}:{{ $t('timeRangeValue', { startTime: staStartDate, endTime: staEndDate }) }}</div>
        </div>
        <div>
          <Button class="b-blue ml-10" @click="downloadCode" :disabled="selectData.length === 0">{{ $t('batchExportOfQRCodes') }}</Button>
          <Button class="b-blue ml-10" :disabled="selectData.length === 0" @click="handlepaymentCollection('batch')">{{ $t('batchCollection') }}</Button>
        </div>
      </Row>
      <Table :columns="infoColuns" :data="infoData" style="margin-top: 10px" @on-selection-change="selectList" show-summary :summary-method="handleSummary">
        <template slot-scope="{ row }" slot="targetName1">
          <span v-if="billingTarget === 1" :class="row.targetRemain === 'true' ? '' : 'c-danger'">
            {{ row.targetName1 ? `${row.targetName1}` : '-' }}
            <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
          </span>
          <span v-if="billingTarget === 2" :class="row.targetRemain === 'true' ? '' : 'c-danger'">
            {{ row.targetName1 ? `${row.targetName1} (${row.mac})` : '-' }}
            <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
          </span>
          <span v-if="billingTarget === 3" :class="row.targetRemain === 'true' ? '' : 'c-danger'">
            {{ row.targetName1 ? `${row.targetName1}` : '-' }}
            <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
          </span>
        </template>
        <template slot-scope="{ row }" slot="targetName2">
          <span v-if="billingTarget === 2">{{ row.targetName2 ? `${row.targetName2} (${row.mac}-${row.addrId < 10 ? `0${row.addrId}` : row.addrId})` : '-' }}</span>
          <span v-if="billingTarget === 3">{{ row.targetName2 ? row.targetName2 : '-' }}</span>
        </template>
        <template slot-scope="{ row }" slot="balance">
          <span :class="+row.balance < 0 ? 'c-danger' : ''">¥ {{ row.balance ? Number(row.balance) : 0 }}</span>
        </template>
        <template slot-scope="{ row }" slot="cyclePower">
          <span>{{ Number(row.cyclePower) }}</span>
        </template>
        <template slot-scope="{ row }" slot="cycleFee">
          <span>{{ Number(row.cycleFee) === 0 ? Number(row.cycleFee) : `￥-${Number(row.cycleFee)}` }}</span>
        </template>
        <template slot-scope="{ row }" slot="lastNilTime">
          <span>{{ row.lastNilTime ? row.lastNilTime : '-' }}</span>
        </template>
        <template #jfcode="{ row }">
          <div style="position: relative">
            <QRCodeCell :text="createQrCodeText(row)" :width="600" isNeedBackColor isCustomDownload @downloadPng="customDownload($event, row)">
              <div style="text-align: center">{{ $t('target') }}：{{ billingTarget === 1 || billingTarget === 2 ? `${row.targetName1}${row.targetName2 ? '/' + row.targetName2 : ''}` : `${row.targetName2}${row.targetName1 ? '/' + row.targetName1 : ''}` }}</div>
              <div style="border-top: 1px solid #797979; margin-top: 10px">
                <Table :columns="codejsrColumns" :data="row.notifier"></Table>
              </div>
              <div style="border-top: 1px solid #797979; margin-top: 10px">
                <Table :columns="codeuserColumns" :data="row.user"></Table>
              </div>
            </QRCodeCell>
          </div>
        </template>
        <template slot-scope="{ row }" slot="user">
          <TagsAutoTableCell v-if="row.user && row.user.length > 0" :tagList="row.user" :returnLabel="item => `${item.name}(${item.telephone})`" />
        </template>
        <template slot-scope="{ row }" slot="notifier">
          <TagsAutoTableCell v-if="row.notifier && row.notifier.length > 0" :tagList="row.notifier" :returnLabel="item => `${item.name}(${item.telephone})`" />
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button class="text-btn-primary" size="small" type="text" @click="handleOfflineRecharge('recharge', row)">{{ $t('offlineRecharge') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleOfflineRecharge('refund', row)">{{ $t('offlineRefund') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleGiftDiscounts(row)">{{ $t('giftsOrDiscounts') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleChargeRecord(row)">{{ $t('rechargeRecords') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleEnableShow(row)">{{ $t('releaseEnable') }}</Button>
          <Button class="text-btn-error" size="small" type="text" @click="handlepaymentCollection('single', row)" :disabled="row.balance >= 0">{{ $t('callForPayment') }}</Button>
        </template>
      </Table>
      <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="currentPage" :page-size="pageSize" :total="total" show-total show-elevator />
    </div>

    <Modal v-model="paymentCollection" :title="$t('callForPayment')" class-name="tripping" width="500">
      <Form>
        <FormItem :label="$t('reminders')">
          <CheckboxGroup v-model="electricity.callType">
            <Checkbox label="0">{{ $t('phone') }}</Checkbox>
            <Checkbox label="1">{{ $t('sms') }}</Checkbox>
            <Checkbox label="2">{{ $t('email') }}</Checkbox>
            <Checkbox label="3">{{ $t('systemNotification') }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleBatchCall('paymentCollection')">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="paymentCollection = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>

    <Modal v-model="paymentCollectionBatch" :title="$t('batchCollection')" class-name="tripping" width="1300">
      <div class="prompt">
        <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
        {{ $t('batchCollectionTip') }}
      </div>
      <Form>
        <FormItem :label="$t('reminders')">
          <CheckboxGroup v-model="electricity.callType">
            <Checkbox label="0">{{ $t('phone') }}</Checkbox>
            <Checkbox label="1">{{ $t('sms') }}</Checkbox>
            <Checkbox label="2">{{ $t('email') }}</Checkbox>
            <Checkbox label="3">{{ $t('systemNotification') }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <Table :columns="pcBatchColumns" :data="selectData">
        <template slot-scope="{ row }" slot="targetName1">
          <template v-if="billingTarget === 2 || billingTarget === 3">
            <span :class="row.targetRemain === 'true' ? '' : 'c-danger'">
              {{ row.targetName1 ? `${row.targetName1} (${row.mac})` : '-' }}
              <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
            </span>
          </template>
          <template v-else>
            <span :class="row.targetRemain === 'true' ? '' : 'c-danger'">
              {{ row.targetName1 ? `${row.targetName1}` : '-' }}
              <i v-if="row.targetRemain === 'false'">({{ $t('removed') }})</i>
            </span>
          </template>
        </template>
        <template slot-scope="{ row }" slot="targetName2">
          <span>{{ row.targetName2 ? `${row.targetName2} (${row.mac}-${row.addrId < 10 ? `0${row.addrId}` : row.addrId})` : '-' }}</span>
        </template>
        <template slot-scope="{ row }" slot="balance">
          <span :class="+row.balance < 0 ? 'c-danger' : ''">¥{{ row.balance ? Number(row.balance) : '-' }}</span>
        </template>
        <template slot-scope="{ row }" slot="user">
          <TagsAutoTableCell v-if="row.user && row.user.length > 0" :tagList="row.user" :returnLabel="item => `${item.name}(${item.telephone})`" />
        </template>
        <template slot-scope="{ row }" slot="notifier">
          <TagsAutoTableCell v-if="row.notifier && row.notifier.length > 0" :tagList="row.notifier" :returnLabel="item => `${item.name}(${item.telephone})`" />
        </template>
        <template slot-scope="{ index }" slot="action">
          <Button class="c-danger" type="text" @click="handleClearbatchCall(index)">{{ $t('clear') }}</Button>
        </template>
      </Table>
      <div slot="footer" style="margin-top: 20px">
        <Button class="b-blue ml-10" @click="handleBatchCall('paymentCollectionBatch')">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="paymentCollectionBatch = false">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <div class="generate">
      <div class="content" v-for="(item, index) in selectData" :key="index">
        <div ref="majorQrCode" style="width: 520px">
          <div ref="infoQrCode" style="width: 520px">
            <div ref="nameQrCode" style="text-align: center">{{ $t('target') }}：{{ `${item.targetName1}(${item.mac})/${item.targetName2}(${item.mac}-${item.addrId.toString().padStart(2, '0')})` }}</div>
            <Table :border="true" :columns="codejsrColumns" :data="item.notifier"></Table>
          </div>
          <div style="margin-top: 10px">
            <Table :border="true" :columns="codeuserColumns" :data="item.user"></Table>
          </div>
        </div>
      </div>
      <div v-if="downloadQrCodeObject" style="position: relative">
        <div ref="QrTable2" style="width: 600px">
          <div ref="QrTable1" style="width: 600px">
            <div ref="QrName" style="text-align: center">
              {{ $t('target') }}：{{
                billingTarget === 1 || billingTarget === 2 ? `${downloadQrCodeObject.targetName1}${downloadQrCodeObject.targetName2 ? '/' + downloadQrCodeObject.targetName2 : ''}` : `${downloadQrCodeObject.targetName2}${downloadQrCodeObject.targetName1 ? '/' + downloadQrCodeObject.targetName1 : ''}`
              }}
            </div>
            <div style="border-top: 1px solid #797979; margin-top: 10px">
              <Table :columns="codejsrColumns" style="background: red" :data="downloadQrCodeObject.notifier"></Table>
            </div>
          </div>
          <div style="border-top: 1px solid #797979; margin-top: 10px">
            <Table :columns="codeuserColumns" :data="downloadQrCodeObject.user"></Table>
          </div>
        </div>
      </div>
    </div>
    <component :is="modalName" :record="rechargItem" :rechargeType="rechargeType" :callback="callbackAction" @close="modalName = null" />
  </div>
</template>
<script>
  import uuid from 'uuid/v1'
  import QRCodeCell from '@/pages/billingSystem/component/QRCodeCell.vue'
  import TagsAutoTableCell from '@/pages/billingSystem/component/TagsAutoTableCell.vue'
  import { accountBalanceList, getGroupNodeQueryCondition, UserElectricity, batchCall } from '@/api/public'
  import { QrCode } from '@/untils/QrCode'
  export default {
    components: {
      QRCodeCell,
      TagsAutoTableCell,
      offlineModal: () => import('./modals/offlineModal.vue'),
      giftDiscountsModal: () => import('./modals/giftDiscountsModal.vue'),
      trippingEnableModal: () => import('./modals/trippingEnableModal.vue'),
    },
    data() {
      return {
        modalName: '',
        modalInfo: null,
        callbackAction: null,
        pageNo: 1,
        pageSize: 10,
        currentPage: 1,
        total: 0,
        codejsrColumns: [
          { title: this.$t('supervisor'), key: 'name' },
          { title: this.$t('phone'), key: 'telephone' },
          { title: this.$t('mailbox'), key: 'email' },
        ],
        codeuserColumns: [
          { title: this.$t('electricityUser'), key: 'name' },
          { title: this.$t('phone'), key: 'telephone' },
          { title: this.$t('mailbox'), key: 'email' },
        ],
        paymentCollection: false,
        paymentCollectionBatch: false,
        electricity: { callType: [] },
        infoData: [],
        timerList: [],
        timer: null,
        mac: [],
        packetTypes: '',
        packetFilter: '',
        packetFilterList: [],
        supervisorList: [],
        supervisor: '',
        electricityUserList: [],
        electricityUser: '',
        offlineRecharge: false,
        rechargeType: 'recharge',
        timeTipString: '',
        rechargItem: null,
        selectData: [],
        staEndDate: '',
        staStartDate: '',
        trippingid: '',
        batchCallRow: {},
        downloadQrCodeObject: null,
      }
    },
    computed: {
      infoColuns() {
        let columns = [
          { title: this.$t('periodPower'), slot: 'cyclePower', key: 'cyclePower', width: 200 },
          { title: this.$t('timeElectricityBill'), slot: 'cycleFee', key: 'cycleFee', width: 200 },
          { title: this.$t('balance'), slot: 'balance', key: 'balance', width: 200 },
          { title: this.$t('zeroTimeOfSettlement'), slot: 'lastNilTime', key: 'lastNilTime', width: 200 },
          { title: this.$t('paymentCode'), slot: 'jfcode', key: 'jfcode', width: 200 },
          { title: this.$t('supervisor'), slot: 'notifier', key: 'notifier', width: 230 },
          { title: this.$t('electricityUser'), slot: 'user', key: 'user', width: 230 },
          { title: this.$t('operation'), slot: 'action', key: 'action', align: 'center', width: 460, fixed: 'right' },
        ]
        return this.billingTarget === 1
          ? [{ type: 'selection', width: 60, align: 'center', fixed: 'left' }, { title: this.$t('projectName'), slot: 'targetName1', key: 'targetName1', width: 200, fixed: 'left' }, ...columns]
          : this.billingTarget === 2
          ? [{ type: 'selection', width: 60, align: 'center', fixed: 'left' }, { title: this.$t('device'), slot: 'targetName1', key: 'targetName1', width: 200, fixed: 'left' }, { title: this.$t('line'), slot: 'targetName2', key: 'targetName2', width: 200, fixed: 'left' }, ...columns]
          : this.billingTarget === 3
          ? [{ type: 'selection', width: 60, align: 'center', fixed: 'left' }, { title: this.$t('groupType'), slot: 'targetName2', key: 'targetName2', width: 200, fixed: 'left' }, { title: this.$t('groupName'), slot: 'targetName1', key: 'targetName1', width: 200, fixed: 'left' }, ...columns]
          : []
      },
      pcBatchColumns() {
        let columns = [
          { title: this.$t('balance'), slot: 'balance', key: 'balance', width: 200 },
          { title: this.$t('supervisor'), slot: 'notifier', key: 'notifier', width: 200 },
          { title: this.$t('electricityUser'), slot: 'user', key: 'user', width: 200 },
          { title: this.$t('operation'), slot: 'action', align: 'center' },
        ]
        return this.billingTarget === 1
          ? [{ title: this.$t('projectName'), slot: 'targetName1', key: 'targetName1', width: 200, fixed: 'left' }, ...columns]
          : this.billingTarget === 2
          ? [{ title: this.$t('device'), slot: 'targetName1', key: 'targetName1', width: 200, fixed: 'left' }, { title: this.$t('line'), slot: 'targetName2', key: 'targetName2', width: 200, fixed: 'left' }, ...columns]
          : this.billingTarget === 3
          ? [{ title: this.$t('groupType'), slot: 'targetName2', key: 'targetName2', width: 200, fixed: 'left' }, { title: this.$t('groupName'), slot: 'targetName1', key: 'targetName1', width: 200, fixed: 'left' }, ...columns]
          : []
      },
    },
    created() {
      this.billingTarget = this.$store.state.billingTarget
      this.billCycle = this.$store.state.billCycle
      this.timerList = this.$store.state.charginTimer
      this.timer = this.timerList[0].value
    },
    mounted() {
      this.handleSupervisor()
      this.handleElectricityUser()
      this.handleAccountBalanceList()
    },
    methods: {
      handleSizeChange(val) {
        this.pageSize = val
        this.handleAccountBalanceList()
      },
      handleCurrentChange(val) {
        this.pageNo = val
        this.handleAccountBalanceList()
      },
      handleExport() {
        let time = this.timer ? this.timer : this.timerList[0].value
        let targetVal = this.billingTarget === 1 ? '' : this.billingTarget === 2 ? (this.mac.length > 0 ? `${this.mac[0]}:${this.mac[1]}` : '') : this.billingTarget === 3 ? (this.packetFilter ? this.packetFilter : '') : ''
        this.$func.windowCountDown(
          '/billing/export/accountBillBalanceAndDeviceInfo.as?projectCode=' + this.$store.state.projectCode + '&period=' + time + '&billingTarget=' + this.billingTarget + '&targetValue=' + targetVal + '&uid=' + this.electricityUser + '&nid=' + this.supervisor + '&pageSize=10' + '&pageNum=1'
        )
      },
      async handleEnableShow(item) {
        this.rechargItem = item
        this.modalName = 'trippingEnableModal'
      },
      async handleAccountBalanceList(type) {
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: this.billingTarget,
          period: this.timer ? this.timer : this.timerList[0].value,
          nid: this.supervisor,
          uid: this.electricityUser,
          pageSize: this.pageSize,
          pageNo: this.pageNo,
        }
        if (type === 'search') {
          if (this.billingTarget === 2) {
            params.targetValue = this.mac.length ? this.mac.join(':') : null
          } else if (this.billingTarget === 3) {
            params.targetValue = this.packetFilter
          }
        }
        const res = await accountBalanceList(params)
        if (res.success) {
          this.infoData = res.data.datas
          this.total = res.data.total
          this.staEndDate = res.data.staEndDate
          this.staStartDate = res.data.staStartDate
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      createQrCodeText(row) {
        let domain = this.$func.ctxPaths()
        let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
        let redirectUri = domainStatus ? 'https://v5.sndtest.com/billPayment' : 'https://v5.snd02.com/billPayment'
        return `${redirectUri}?project=${this.$store.state.projectCode}&targetValue=${row.targetValue}&billingTarget=${row.billingTarget}&billCycle=${this.billCycle}&uuid=${uuid()}&codeType=within`
      },
      createQrCodeTextProject() {
        let domain = this.$func.ctxPaths()
        let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
        let redirectUri = domainStatus ? 'https://v5.sndtest.com/billPayment' : 'https://v5.snd02.com/billPayment'
        return `${redirectUri}?project=${this.$store.state.projectCode}&billingTarget=${this.billingTarget}&billCycle=${this.$store.state.billCycle}&uuid=${uuid()}&codeType=project`
      },
      handlepaymentCollection(type, row) {
        if (type === 'single') {
          this.batchCallRow = row
          this.paymentCollection = true
        } else {
          this.paymentCollectionBatch = true
        }
      },
      handleClearbatchCall(index) {
        this.selectData.splice(index, 1)
      },
      async handleBatchCall(type) {
        if (this.electricity.callType.length === 0) {
          return this.$Message.error({ content: this.$t('selectReminder') })
        }
        let params = { projectCode: this.$store.state.projectCode, noticeTypeList: `${this.electricity.callType}` }
        if (type === 'paymentCollectionBatch') {
          if (this.selectData.length === 0) {
            return this.$Message.error({ content: this.$t('theCollectionObjectCannotBeEmpty') })
          }
          let arr = this.selectData.map(val => val.accountId)
          params.accountIdList = `${arr}`
        } else {
          params.accountIdList = this.batchCallRow.accountId
        }
        const res = await batchCall(params)
        this.paymentCollection = false
        this.paymentCollectionBatch = false
        if (res.success) {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleGiftDiscounts(item) {
        this.rechargItem = item
        this.modalName = 'giftDiscountsModal'
        this.callbackAction = this.handleAccountBalanceList
      },
      handleOfflineRecharge(type, item) {
        this.rechargeType = type
        this.rechargItem = item
        this.modalName = 'offlineModal'
        this.callbackAction = this.handleAccountBalanceList
      },
      getTree(tree = []) {
        let arr = []
        tree.forEach(item => {
          let obj = {}
          obj.id = item.id
          obj.value = item.id
          obj.parentId = item.parentId
          obj.title = item.name
          obj.expand = false
          obj.selected = false
          obj.checked = false
          obj.children = this.getTree(item.children)
          arr.push(obj)
        })
        return arr
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
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      handleSummary({ columns, data }) {
        const sums = {}
        columns.forEach((column, index) => {
          const key = column.key
          if (index === 1) {
            sums[key] = { key, value: this.$t('total') }
            return
          }
          const values = data.map(item => Number(item[key]))
          const v = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return +(prev + curr)
            } else {
              return +prev
            }
          }, 0)
          if (this.billingTarget === 1) {
            if (index === 2) {
              sums[key] = { key, value: parseFloat(v.toFixed(10)) }
            } else if (index === 3) {
              sums[key] = { key, value: v > 0 ? '￥-' + parseFloat(v.toFixed(10)) : '￥-' + parseFloat(v.toFixed(10)) }
            } else {
              sums[key] = { key, value: '' }
            }
          } else {
            if (index === 3) {
              sums[key] = { key, value: parseFloat(v.toFixed(10)) }
            } else if (index === 4) {
              sums[key] = { key, value: v > 0 ? '￥-' + parseFloat(v.toFixed(10)) : parseFloat(v.toFixed(10)) }
            } else {
              sums[key] = { key, value: '' }
            }
          }
        })
        return sums
      },
      async handleSupervisor() {
        let params = { projectCode: this.$store.state.projectCode, type: '1' }
        const res = await UserElectricity(params)
        if (res.success) {
          this.supervisorList = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleElectricityUser() {
        let params = { projectCode: this.$store.state.projectCode, type: '2' }
        const res = await UserElectricity(params)
        if (res.success) {
          this.electricityUserList = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      search() {
        this.pageNo = 1
        this.handleAccountBalanceList('search')
      },
      reset() {
        this.timer = ''
        this.mac = ''
        this.packetTypes = ''
        this.packetFilter = ''
        this.supervisor = ''
        this.electricityUser = ''
      },
      handleChargeRecord(row) {
        this.$emit('billingChargeRecord', { pageType: 'rechargeRecord', targetVal: row.targetValue })
      },
      selectList(list) {
        this.selectData = list
      },
      customDownload(text, row) {
        this.$Spin.show({
          render: h => {
            return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', this.$t('exportQrCodeWaitingTip'))])
          },
        })
        this.downloadQrCodeObject = row
        setTimeout(async () => {
          const doms = [
            { fileName: this.$t('conciseQRCode'), el: this.$refs.QrName },
            { fileName: this.$t('detailsQRCode'), el: this.$refs.QrTable1 },
            { fileName: this.$t('professionalQRCode'), el: this.$refs.QrTable2 },
          ]
          let imgInstances = doms.map(async item => {
            const canvas = await QrCode.createdCustomQrCodeCanvas(text, item.el)
            let file = await QrCode.canvasToBlob(canvas)
            return { fileName: item.fileName, file }
          })
          QrCode.downloadZip(await Promise.all(imgInstances), this.$t('qRCode'))
          this.downloadQrCodeObject = null
          this.$Spin.hide()
        }, 100)
      },
      loadIngTips() {
        this.$Spin.show({
          render: h => {
            return h('div', [h('Icon', { class: 'demo-spin-icon-load', props: { type: 'ios-loading', size: 18 } }), h('div', this.$t('exportQrCodeWaitingTip'))])
          },
        })
      },
      downloadCode() {
        this.loadIngTips()
        setTimeout(() => {
          this.exportQrZip(this.selectData)
        }, 100)
      },
      async exportQrZip(list) {
        let imgInstances = list.map(async (row, i) => {
          let text = this.createQrCodeText(row)
          let fileName = `${row.targetName1}(${row.mac})-${row.targetName2}(${row.mac}-${row.addrId.toString().padStart(2, '0')}`
          let infoDom = this.$refs.nameQrCode[i]
          const canvas = await QrCode.createdCustomQrCodeCanvas(text, infoDom)
          let file = await QrCode.canvasToBlob(canvas)
          return { fileName, file, folder: this.$t('conciseQRCode') }
        })
        let imgInstancesDetails = list.map(async (row, i) => {
          let text = this.createQrCodeText(row)
          let fileName = `${row.targetName1}(${row.mac})-${row.targetName2}(${row.mac}-${row.addrId.toString().padStart(2, '0')}`
          let infoDom = this.$refs.infoQrCode[i]
          const canvas = await QrCode.createdCustomQrCodeCanvas(text, infoDom)
          let file = await QrCode.canvasToBlob(canvas)
          return { fileName, file, folder: this.$t('detailsQRCode') }
        })
        let imgInstancesMajor = list.map(async (row, i) => {
          let text = this.createQrCodeText(row)
          let fileName = `${row.targetName1}(${row.mac})-${row.targetName2}(${row.mac}-${row.addrId.toString().padStart(2, '0')}`
          let infoDom = this.$refs.majorQrCode[i]
          const canvas = await QrCode.createdCustomQrCodeCanvas(text, infoDom)
          let file = await QrCode.canvasToBlob(canvas)
          return { fileName, file, folder: this.$t('professionalQRCode') }
        })
        QrCode.downloadZip(await Promise.all([...imgInstances, ...imgInstancesDetails, ...imgInstancesMajor]), this.$t('qRCode'))
        this.$Spin.hide()
      },
      download(imgUrl) {
        let imgData = imgUrl // 这里放需要下载的base64
        this.downloadFile('test.png', imgData)
      },
      // 下载
      downloadFile(fileName, content) {
        let aLink = document.createElement('a')
        let blob = this.base64ToBlob(content) // new Blob([content]);
        let evt = document.createEvent('HTMLEvents')
        evt.initEvent('click', true, true) // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName
        aLink.href = URL.createObjectURL(blob)
        // aLink.dispatchEvent(evt);
        aLink.click()
      },
    },
  }
</script>
<style lang="less">
  #projectQrcodeUrl {
    display: flex;
    justify-content: center;
  }
  .generate {
    position: fixed;
    top: 0;
    opacity: 0;
    z-index: -100;
    pointer-events: none;
    .ivu-table th,
    .ivu-table td,
    .ivu-table-row-hover {
      background-color: #fff !important;
      color: #333;
    }
  }
  .ivu-cascader-menu-item {
    color: #fff !important;
  }
  .ivu-cascader-menu-item:hover {
    background: #2c2c2e !important;
  }
  .userBoxs {
    border: 1px solid #797979;
    border-radius: 4px;
    color: #fff;
    padding: 2px 8px;
    margin-top: 5px;
    margin-right: 5px;
    background: rgba(121, 121, 121, 0.2);
  }
  .ivu-table-summary tr td {
    background-color: #28313f !important;
    height: 36px;
  }

  .collectionbalance {
    .information {
      .userBoxs {
        border: 1px solid #797979;
        border-radius: 4px;
        color: #fff;
        padding: 2px 8px;
        margin-top: 5px;
        margin-right: 5px;
        background: rgba(121, 121, 121, 0.2);
      }
    }
  }
</style>
