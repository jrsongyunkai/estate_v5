<template>
  <div class="statementList">
    <Row class="select-list" v-if="$store.state.billingTarget !== 1">
      <ELPCascader v-if="$store.state.billingTarget === 2" filterable :options="$store.state.charginMacList" v-model="mac" style="width: 250px" :transfer="true" :placeholder="$t('pleaseSelectDeviceLine2')">
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
      <template v-if="$store.state.billingTarget === 3">
        <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" class="ml-10" :clearable="true">
          <Option v-for="item in $store.state.packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
        </Select>
        <TreeSelect :placeholder="$t('selectGroup')" show-checkbox v-model="packetFilter" transfer :data="packetFilterList" class="ml-10" style="width: 200px" />
      </template>
      <Button class="b-blue ml-10" @click="search">{{ $t('query') }}</Button>
      <Button class="b-info ml-10" @click="reset">{{ $t('reset') }}</Button>
    </Row>
    <div class="statementListcontent">
      <Row style="justify-content: space-between">
        <h3>{{ $t('statementList') }}</h3>
        <Button class="b-blue" @click="handleExport" :disabled="exportStatus">{{ $t('batchExport') }}</Button>
      </Row>
      <Table :columns="statementColumns" :data="dataList" :no-data-text="$t('statementListEmptyTip')" show-summary :summary-method="handleSummary" style="margin-top: 10px">
        <template slot-scope="{ row }" slot="periods">
          <span>
            {{
              !row.billNo ? $t('openBillWithTimeRange', { startTime: row.statStartTime ? row.statStartTime : '-', endTime: row.statEndTime ? row.statEndTime : '-' }) : $t('timeRangeValue', { startTime: row.statStartTime ? row.statStartTime : '-', endTime: row.statEndTime ? row.statEndTime : '-' })
            }}
          </span>
        </template>
        <template slot-scope="{ row }" slot="accountBeginAmount">
          <span>{{ row.accountBeginAmount > 0 ? '+' + row.accountBeginAmount : row.accountBeginAmount }}</span>
        </template>
        <template slot-scope="{ row }" slot="rechargeAmount">
          <span>{{ row.rechargeAmount > 0 ? '+' + row.rechargeAmount : row.rechargeAmount }}</span>
        </template>
        <template slot-scope="{ row }" slot="giveAmount">
          <span>{{ row.giveAmount }}</span>
        </template>
        <template slot-scope="{ row }" slot="spendingAmount">
          <span class="c-danger">{{ row.spendingAmount > 0 ? '-' + row.spendingAmount : row.spendingAmount }}</span>
        </template>
        <template slot-scope="{ row }" slot="refundAmount">
          <span class="c-danger">{{ row.refundAmount > 0 ? '-' + row.refundAmount : row.refundAmount }}</span>
        </template>
        <template slot-scope="{ row }" slot="accountEndAmount">
          <span>{{ row.accountEndAmount }}</span>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button class="text-btn-primary" size="small" type="text" @click="handleBillingDetails(row)">{{ $t('viewBills') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleRectification(row, 'rectification')" :disabled="!row.billNo">{{ $t('rectification') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleRectification(row, 'recoil')" :disabled="!row.billNo">{{ $t('recoil') }}</Button>
          <Button class="text-btn-primary" size="small" type="text" @click="handleRectificationRecord(row)" :disabled="!row.billNo">{{ $t('rectificationOrRecoilRecords') }}</Button>
        </template>
      </Table>
    </div>
    <Modal v-model="rectification" :title="recType === 'rectification' ? $t('billReversal') : $t('billBackflush')" class-name="recharge" width="500">
      <Form>
        <FormItem :label="recType === 'rectification' ? $t('reversalAmount') : $t('backflushAmount')">
          <MoneyInput v-model="electricity.amt" />
        </FormItem>
        <FormItem :label="$t('remark')">
          <Input v-model="electricity.notes" :placeholder="$t('pleaseEnter')" type="textarea" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleTransaction">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="handleCancel">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="billChargePost" :title="recType === 'rectification' ? $t('billReversal') : $t('billBackflush')" isAlways>
      <Form>
        <FormItem :label="`${$t('ns_billingDetails.label6')}:`">
          <span>￥ {{ rechargItem && rechargItem.accountEndAmount }}</span>
        </FormItem>
        <FormItem :label="recType === 'rectification' ? $t('reversalAmount') : $t('backflushAmount')">
          <h1>￥ {{ `${this.electricity.amt}` }}</h1>
        </FormItem>
        <FormItem :label="recType === 'rectification' ? $t('adjustedAmount') : $t('amountAfterRecoil')">
          <h1 v-if="recType === 'rectification'">￥ {{ (Number(rechargItem.accountEndAmount) + Number(`${electricity.amt}`)).toFixed(2) }}</h1>
          <h1 v-else>￥ {{ (Number(rechargItem.accountEndAmount) - Number(`${electricity.amt}`)).toFixed(2) }}</h1>
        </FormItem>
      </Form>
    </OperationCheckAuth>

    <Modal v-model="record" title="" class-name="recordModal" width="920">
      <div slot="header"></div>
      <Tabs :value="recordType" name="record" @on-click="handleRecordType">
        <TabPane :label="$t('correctionRecord')" name="name1" tab="record">
          <Table :columns="recordcolumns" :data="recorddata"></Table>
        </TabPane>
        <TabPane :label="$t('recoilRecord')" name="name2" tab="record">
          <Table :columns="recordcolumns" :data="recorddata"></Table>
        </TabPane>
      </Tabs>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>
<script>
  import { billList, billCharge, getGroupNodeQueryCondition, balanceAndDeviceInfo, repairBill } from '@/api/public'
  export default {
    data() {
      return {
        exportStatus: true,
        recordType: 'name1',
        recordcolumns: [],
        recorddata: [],
        record: false,
        mac: [],
        packetTypes: '',
        packetFilter: '',
        packetFilterList: [],
        rechargeStatus: 'true',
        electricity: { amt: 0, notes: '' },
        recType: '',
        rectification: false,
        dataList: [],
        statementColumns: [
          { type: 'selection', width: 60, align: 'center', fixed: 'left' },
          { title: this.$t('accountPeriod'), slot: 'periods', key: 'periods', align: 'center', width: 300 },
          { title: this.$t('ns_billingDetails.label1'), slot: 'accountBeginAmount', key: 'accountBeginAmount', width: 170 },
          { title: this.$t('ns_billingDetails.label7'), slot: 'rechargeAmount', key: 'rechargeAmount', width: 170 },
          { title: this.$t('ns_rechargeOverView.label4'), slot: 'giveAmount', key: 'giveAmount', width: 170 },
          { title: this.$t('ns_billingDetails.label2'), slot: 'spendingAmount', key: 'spendingAmount', width: 170 },
          { title: this.$t('ns_billingDetails.label3'), slot: 'refundAmount', key: 'refundAmount', width: 170 },
          { title: this.$t('ns_billingDetails.label6'), slot: 'accountEndAmount', key: 'accountEndAmount', width: 170 },
          { title: this.$t('operation'), slot: 'action', minWidth: 310, fixed: 'right', align: 'center' },
        ],
        statementData: [],
        balance: '',
        recordData: '',
        rechargItem: { accountEndAmount: 0 },
      }
    },
    methods: {
      async handlerepairBill(val) {
        let params = { accountIdList: this.recordData.accountId, projectCode: this.$store.state.projectCode, bizTypeList: val === 'name1' ? '6' : '7', billNo: this.recordData.billNo, pageNum: '1', pageSize: '1000' }
        const res = await repairBill(params)
        if (res.success) {
          this.recorddata = res.data.list
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleRecordType(val) {
        this.handlerepairBill(val)
        this.recordcolumns = []
        if (val === 'name1') {
          this.recordcolumns.push(
            { title: this.$t('serialNumber'), key: 'billRepairNo' },
            { title: this.$t('rectificationTime'), key: 'createTime' },
            { title: this.$t('reversalAmountWithUnit'), key: 'repairAmount' },
            { title: this.$t('billReversalAfterAmountWithUnit'), key: 'accountAmount' },
            { title: this.$t('remark'), key: 'remark' },
            { title: this.$t('rectificationAccount'), key: 'staffName' }
          )
        } else {
          this.recordcolumns.push(
            { title: this.$t('serialNumber'), key: 'billRepairNo' },
            { title: this.$t('backwashTime'), key: 'createTime' },
            { title: this.$t('backflushAmountWithUnit'), key: 'repairAmount' },
            { title: this.$t('billBackflushAfterAmountWithUnit'), key: 'accountAmount' },
            { title: this.$t('remark'), key: 'remark"' },
            { title: this.$t('backflushAccount'), key: 'staffName' }
          )
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
      cloneTree(score, parentId = 0) {
        let tree = []
        score.map(item => {
          if (item.parentId === parentId) {
            item.children = this.cloneTree(score, item.id)
            tree.push(item)
          }
        })
        return tree
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
      handleExport() {
        let targetValue = this.$store.state.billingTarget === 1 ? this.$store.state.projectCode : this.$store.state.billingTarget === 2 ? (this.mac.length === 0 ? '' : `${this.mac[0]}:${this.mac[1]}`) : this.packetFilter
        this.$func.windowCountDown('/billing/export/billList.as?projectCode=' + this.$store.state.projectCode + '&pageSize=1000' + '&pageNum=1' + '&billingTarget=' + this.$store.state.billingTarget + '&targetValue=' + targetValue)
      },
      handleTransaction() {
        this.$refs.operationCheckAuth.openModal()
      },
      async billChargePost() {
        let params = {
          projectCode: this.$store.state.projectCode,
          billingTarget: this.rechargItem.billingTarget,
          targetValue: this.rechargItem.targetValue,
          opType: this.recType === 'rectification' ? '1' : '2',
          amt: this.electricity.amt,
          remark: this.electricity.notes,
          bno: this.rechargItem.billNo,
        }
        const res = await billCharge(params)
        if (res.success) {
          this.rectification = false
          this.search()
          this.$Message.success({ content: this.recType === 'rectification' ? this.$t('correctSuccessfully') : this.$t('recoilSuccessful') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleCancel() {
        this.rectification = false
      },
      async handleBillList() {
        let params = {
          level: '1',
          projectCode: this.$store.state.projectCode,
          billingTarget: this.$store.state.billingTarget,
          targetValue: this.$store.state.billingTarget === 1 ? this.$store.state.projectCode : this.$store.state.billingTarget === 2 ? `${this.mac[0]}:${this.mac[1]}` : `${this.packetFilter}`,
        }
        const res = await billList(params)
        if (res.success) {
          res.data.forEach(val => {
            val.accountAmount = this.$func.NumFormat(val.accountAmount)
            val.giveAmount = this.$func.NumFormat(val.giveAmount)
            val.accountBeginAmount = this.$func.NumFormat(val.accountBeginAmount)
            val.rechargeAmount = this.$func.NumFormat(val.rechargeAmount)
            val.refundAmount = this.$func.NumFormat(val.refundAmount)
            val.spendingAmount = val.spendingAmount
            val.statEndTime = val.statEndTime.split(' ')[0]
            val.statStartTime = val.statStartTime.split(' ')[0]
          })
          this.dataList = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleSummary({ columns, data }) {
        const sums = {}
        columns.forEach((column, index) => {
          const key = column.key
          const values = data.map(item => Number(item[key]))
          if (!values.every(value => isNaN(value))) {
            const v = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return +(prev + curr).toFixed(2)
              } else {
                return +prev.toFixed(2)
              }
            }, 0)
            if (index === 5 || index === 6) {
              sums[key] = { key, value: v > 0 ? '-' + this.$func.NumFormat(v) : this.$func.NumFormat(v) }
            } else if (index === 2 || index === 7) {
              sums[key] = { key, value: '' }
            } else {
              sums[key] = { key, value: v > 0 ? '+' + this.$func.NumFormat(v) : this.$func.NumFormat(v) }
            }
          } else {
            if (index === 1) {
              sums[key] = { key, value: this.$t('total') }
            } else {
              sums[key] = { key, value: '' }
            }
          }
        })
        return sums
      },
      async handleBalanceAndDeviceInfo() {
        let params = { projectCode: this.$store.state.projectCode, targetValue: this.rechargItem.targetValue, billingTarget: this.rechargItem.billingTarget, billCycle: this.$store.state.billCycle }
        const res = await balanceAndDeviceInfo(params)
        if (res.success) {
          this.balance = res.data.balance
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleBillingDetails(val) {
        this.$emit('billingDetails', { pageType: 'billingDetails', data: val })
      },
      handleRectificationRecord(row) {
        this.electricity = { amt: 0, notes: '' }
        this.recordData = row
        this.recordType = 'name1'
        this.record = true
        this.handleRecordType('name1')
      },
      handleRectification(v, type) {
        this.rechargItem = v
        this.recType = type
        this.rectification = true
        this.handleBalanceAndDeviceInfo()
      },
      search() {
        if (this.$store.state.billingTarget === 2 && this.mac.length === 0) {
          this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
        } else if (this.$store.state.billingTarget === 3 && this.packetFilter === '') {
          this.$Message.error({ content: this.$t('selectGroup') })
        } else {
          this.exportStatus = false
          this.handleBillList()
        }
      },
      reset() {
        this.mac = []
        this.packetTypes = ''
        this.packetFilter = ''
      },
    },
    mounted() {
      if (this.$store.state.billingTarget === 1) {
        this.exportStatus = false
        this.handleBillList()
      }
    },
  }
</script>
<style lang="less">
  .recordModal {
    .ivu-modal-header {
      border-bottom: 1px solid transparent;
      padding: 0px;
      line-height: 1;
    }
    .ivu-modal-footer {
      border-top: 1px solid transparent;
      padding: 0px;
    }
  }
  .statementList {
    .ivu-table-wrapper {
      .ivu-table-summary {
        .ivu-table-tbody {
          .ivu-table-row td:nth-child(6) {
            color: #d83524;
          }
          .ivu-table-row td:nth-child(7) {
            color: #d83524;
          }
        }
      }
    }
    .statementListcontent {
      background: #1a202e !important;
      padding: 20px;
    }
    .ivu-table-summary tr td {
      background-color: #28313f;
    }
    .select-list {
      margin-bottom: 10px;
    }
  }
</style>
