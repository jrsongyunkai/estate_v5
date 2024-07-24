<template>
  <div class="billingDetails">
    <div class="back" @click="back">
      <span class="icon-v5 icon-v5-xiangzuo"></span>
      {{ $t('back') }}
    </div>
    <div ref="container">
      <div class="infomation">
        <Row style="justify-content: space-between">
          <span style="font-size: 20px">{{ $t('billOverviewWithTimeRange', { startTime: detailData.statStartTime.split('  ')[0], endTime: detailData.statEndTime.split('  ')[0] }) }}</span>
          <Button class="b-blue" @click="printFn">{{ $t('export') }}</Button>
        </Row>
        <Row class="info">
          <Col :span="12">
            <Form>
              <FormItem :label="detailData.billingTarget === 2 ? `${$t('device')}:` : detailData.billingTarget === 3 ? `${$t('groupType')}:` : `${$t('projectName')}:`">
                {{ detailData.value1 }}
              </FormItem>
              <FormItem :label="`${$t('ns_billingDetails.label1')}:`">
                <span class="c-danger">{{ detailData.accountBeginAmount }}</span>
              </FormItem>
              <FormItem :label="`${$t('ns_billingDetails.label2')}:`">
                <span class="c-danger">-{{ detailData.spendingAmount }}</span>
              </FormItem>
              <FormItem :label="`${$t('ns_billingDetails.label3')}:`">
                <span class="c-danger">-{{ detailData.refundAmount }}</span>
              </FormItem>
              <FormItem :label="$t('ns_billingDetails.label4')">
                {{ billObj.couponValue }}
              </FormItem>
              <FormItem :label="$t('ns_billingDetails.label5')" v-if="detailData.billNo">
                {{ detailData.billPlusAmount === undefined ? 0 : detailData.billPlusAmount }}
                <span class="billamout" @click="handleHistory('rectification')">{{ $t('history') }}</span>
              </FormItem>
            </Form>
          </Col>

          <Col :span="12">
            <Form>
              <FormItem :label="detailData.billingTarget === 2 ? `${$t('line')}:` : detailData.billingTarget === 3 ? `${$t('groupName')}:` : ''">
                {{ detailData.value2 }}
              </FormItem>
              <FormItem :label="`${$t('ns_billingDetails.label6')}:`">
                <span>{{ detailData.accountEndAmount }}</span>
              </FormItem>
              <FormItem :label="`${$t('ns_billingDetails.label7')}:`">
                <span>{{ detailData.rechargeAmount }}</span>
              </FormItem>
              <FormItem label=" ">
                <div style="height: 34px"></div>
              </FormItem>
              <FormItem :label="$t('ns_billingDetails.label8')">
                {{ detailData.giveAmount }}
              </FormItem>
              <FormItem :label="$t('ns_billingDetails.label9')" v-if="detailData.billNo">
                {{ detailData.billRevertAmount === undefined ? 0 : detailData.billRevertAmount }}
                <span class="billamout" @click="handleHistory('recoil')">{{ $t('history') }}</span>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
      <div class="detail">
        <h3>{{ $t('billDetails') }}</h3>
        <Table :height="billDataHeight" :columns="detailColumns" :data="billData" show-summary :summary-method="handleSummary" style="margin-top: 10px">
          <template slot-scope="{ row }" slot="startAmount">
            <span :class="row.startAmount < 0 ? 'c-danger' : ''">{{ row.startAmount }}</span>
          </template>
          <template slot-scope="{ row }" slot="tradeType">
            <span>{{ row.tradeValue }}</span>
          </template>
          <template slot-scope="{ row }" slot="tradeNo">
            <span>{{ row.tradeNo === undefined ? '-' : row.tradeNo }}</span>
          </template>

          <template slot-scope="{ row }" slot="totalPower">
            <span class="consumption" :class="row.totalPower < 0 ? 'c-danger' : ''">{{ row.totalPower === undefined ? '-' : row.totalPower }}</span>
          </template>
          <template slot-scope="{ row }" slot="tradeAmount">
            <span class="duringRefund" :class="row.tradeAmount < 0 ? 'c-danger' : ''">{{ row.tradeAmount === undefined ? '-' : row.tradeAmount }}</span>
          </template>
          <template slot-scope="{ row }" slot="accountAmount">
            <span :class="row.accountAmount < 0 ? 'c-danger' : ''">{{ row.accountAmount === undefined ? '-' : row.accountAmount }}</span>
          </template>
          <template slot-scope="{ row }" slot="action">
            <Button class="c-primary" type="text" @click="handleBillingDetails(row)" v-if="row.tradeType === 8">{{ $t('detail') }}</Button>
          </template>
        </Table>
        <div class="total" v-if="detailData.billNo">
          <Form class="total-left" label-position="right" :label-width="200" :style="{ left: `${left1}px` }">
            <FormItem :label="$t('ns_billingDetails.label10')">
              {{ billObj.couponValue }}
            </FormItem>
            <FormItem :label="$t('ns_billingDetails.label11')">
              <h3>{{ billObj.payableElec }}</h3>
            </FormItem>
            <FormItem :label="$t('ns_billingDetails.label12')">
              <span>{{ billObj.remainValue }}</span>
            </FormItem>
          </Form>
          <Form class="total-right" label-position="right" :label-width="200" :style="{ left: `${left2}px` }">
            <FormItem :label="$t('ns_billingDetails.label13')">
              {{ detailData.giveAmount }}
            </FormItem>
            <FormItem :label="$t('ns_billingDetails.label14')">
              <h3>{{ billObj.payableElecFee }}</h3>
            </FormItem>
            <FormItem :label="$t('ns_billingDetails.label15')">
              <span>{{ detailData.remainGiveAmount }}</span>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>

    <Modal v-model="record" title="" class-name="recordModal" width="920">
      <div slot="header"></div>
      <Tabs :value="tabsName" @on-click="handleRecordType">
        <TabPane :label="$t('correctionRecord')" name="name1">
          <Table :columns="recordcolumns" :data="recorddata"></Table>
        </TabPane>
        <TabPane :label="$t('recoilRecord')" name="name2">
          <Table :columns="recordcolumns" :data="recorddata"></Table>
        </TabPane>
      </Tabs>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import { billDetailList, repairBill } from '@/api/public'
  export default {
    props: {
      billDetailParams: { type: Object },
    },
    data() {
      return {
        totalNumArray: [],
        tabsName: 'name1',
        record: false,
        recordcolumns: [],
        recorddata: [],
        detailData: this.billDetailParams.data,
        left1: '',
        left2: '',
        curData: {},
        detailColumns: [
          { title: this.$t('bookDate'), key: 'tradeTime', minWidth: 150 },
          { title: this.$t('startingAmount'), key: 'startAmount', slot: 'startAmount', minWidth: 150 },
          { title: this.$t('transactionType'), slot: 'tradeType', minWidth: 100 },
          { title: this.$t('serialNumber'), key: 'tradeNo', slot: 'tradeNo', minWidth: 200 },
          { title: `${this.$t('powerConsumption')}(kW·h)`, key: 'totalPower', slot: 'totalPower', minWidth: 300 },
          { title: this.$t('transactionAmountOrConsumptionAmount'), key: 'tradeAmount', slot: 'tradeAmount', minWidth: 200 },
          { title: this.$t('settlementBalanceWithUnit'), key: 'accountAmount', slot: 'accountAmount', minWidth: 150 },
          { title: this.$t('detail'), slot: 'action', minWidth: 100 },
        ],
        billData: [],
        billDataHeight: '',
        billObj: {},
      }
    },
    methods: {
      printFn() {
        // /billing/export/billDetailList.as
        let startTime = this.detailData.statStartTime + ' ' + '00:00:00'
        let endTime = this.detailData.statEndTime + ' ' + '23:59:59'
        let billNo = this.detailData.billNo ? this.detailData.billNo : ''
        let billPlusAmount = this.detailData.billPlusAmount === undefined ? '-' : this.detailData.billPlusAmount
        let billRevertAmount = this.detailData.billRevertAmount === undefined ? '-' : this.detailData.billRevertAmount

        this.$func.windowCountDown(
          '/billing/export/billDetailList.as?projectCode=' +
            this.$store.state.projectCode +
            '&billingTarget=' +
            this.detailData.billingTarget +
            '&targetValue=' +
            this.detailData.targetValue +
            '&beginningBalance=' +
            this.detailData.accountBeginAmount +
            '&endingBalance=' +
            this.detailData.accountEndAmount +
            '&periodConsumptionAmount=' +
            this.detailData.spendingAmount +
            '&periodRechargeAmount=' +
            this.detailData.rechargeAmount +
            '&giveAmount=' +
            this.detailData.giveAmount +
            '&refundAmount=' +
            this.detailData.refundAmount +
            '&giveElectricity=' +
            this.billObj.couponValue +
            '&positiveAmount=' +
            billPlusAmount +
            '&negativeAmount=' +
            billRevertAmount +
            '&billEndTime=' +
            endTime +
            '&billStartTime=' +
            startTime +
            '&pageNum=1' +
            '&pageSize=10' +
            '&billNo=' +
            billNo +
            '&value1=' +
            this.detailData.value1 +
            '&value2=' +
            this.detailData.value2
        )
      },
      handleHistory(type) {
        this.record = true
        if (type === 'rectification') {
          this.tabsName = 'name1'
          this.handleRecordType('name1')
        } else {
          this.tabsName = 'name2'
          this.handleRecordType('name2')
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
      async handlerepairBill(val) {
        let params = {
          accountIdList: this.detailData.accountId,
          projectCode: this.$store.state.projectCode,
          billEndTime: this.detailData.statEndTime + ' ' + '23:59:59',
          billStartTime: this.detailData.statStartTime + ' ' + '00:00:00',
          bizTypeList: val === 'name1' ? '6' : '7',
          pageNum: '1',
          pageSize: '1000',
        }
        const res = await repairBill(params)
        if (res.success) {
          this.recorddata = res.data.list
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async hanleBillDetailList() {
        let params = {
          billEndTime: this.detailData.statEndTime + ' ' + '23:59:59',
          billStartTime: this.detailData.statStartTime + ' ' + '00:00:00',
          projectCode: this.$store.state.projectCode,
          accountId: this.detailData.accountId,
          billNo: this.detailData.billNo ? this.detailData.billNo : '',
          pageNum: '1',
          pageSize: '10',
          billingTarget: this.detailData.billingTarget,
          targetValue: this.detailData.targetValue,
        }
        const res = await billDetailList(params)
        if (res.success) {
          this.totalNumArray = res.data.pageInfo.list[res.data.pageInfo.list.length - 1]
          this.billData = res.data.pageInfo.list.filter((item, index) => index !== res.data.pageInfo.list.length - 1)
          this.billObj = res.data
          // 1-线上充值,2-线下充值,3-线上退费,4-线下退费,5-赠送电费,6-账单冲正,7-冲反
          this.billData.forEach(val => {
            if (val.tradeType === 1) {
              val['tradeValue'] = this.$t('onlineRecharge')
            } else if (val.tradeType === 2) {
              val['tradeValue'] = this.$t('offlineRecharge')
            } else if (val.tradeType === 3) {
              val['tradeValue'] = this.$t('onlineRefund')
            } else if (val.tradeType === 4) {
              val['tradeValue'] = this.$t('offlineRefund')
            } else if (val.tradeType === 5) {
              val['tradeValue'] = this.$t('giftsOrDiscounts')
            } else if (val.tradeType === 6) {
              val['tradeValue'] = this.$t('billReversal')
            } else if (val.tradeType === 7) {
              val['tradeValue'] = this.$t('billBackflush')
            } else if (val.tradeType === 8) {
              val['tradeValue'] = this.$t('electricityBillDuringThePeriod')
            }
          })
          if (this.billData.length >= 10) {
            this.billDataHeight = '500'
          } else {
            this.billDataHeight = ''
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleBillingDetails(row) {
        let params = {}
        if (this.detailData.billingTarget === 2) {
          params = { mac: this.detailData.mac, timer: row.tradeTime.split(' ')[0] }
        } else if (this.detailData.billingTarget === 3) {
          params = { groupId: this.detailData.groupId, nodeId: this.detailData.nodeId, timer: row.tradeTime.split(' ')[0] }
        }
        this.$router.push({ name: 'energyMonitor-report', params: params })
      },
      back() {
        this.$emit('index', 'index')
      },
      handleSummary({ columns, data }) {
        const sums = {}
        columns.forEach((column, index) => {
          const key = column.key
          if (index === 0) {
            sums[key] = { key, value: this.$t('total') }
            return
          }
          if (index === 4) {
            sums[key] = { key, value: this.totalNumArray.totalPower }
          } else if (index === 5) {
            sums[key] = { key, value: this.totalNumArray.tradeAmount }
          } else {
            sums[key] = { key, value: '' }
          }
        })
        return sums
      },
      computedLeft() {
        setTimeout(() => {
          if (document.getElementsByClassName('detail')[0].getElementsByClassName('consumption')[0]) {
            const left1Obj = document.getElementsByClassName('detail')[0].getElementsByClassName('consumption')[0].getBoundingClientRect()
            this.left1 = left1Obj.left - 485
          } else {
            this.left1 = 500
          }
          if (document.getElementsByClassName('detail')[0].getElementsByClassName('duringRefund')[0]) {
            const left2Obj = document.getElementsByClassName('detail')[0].getElementsByClassName('duringRefund')[0].getBoundingClientRect()
            this.left2 = left2Obj.left - 485
          } else {
            this.left2 = 800
          }
        }, 500)
      },
    },
    mounted() {
      this.hanleBillDetailList()
      this.computedLeft()
      window.addEventListener(
        'resize',
        () => {
          this.$nextTick(() => {
            this.computedLeft()
          })
        },
        false
      )
    },
  }
</script>
<style lang="less">
  .billingDetails {
    .billamout {
      margin-left: 20px;
      color: #02a7f0;
      cursor: pointer;
    }
    .back {
      font-size: 16px;
      cursor: pointer;
    }
    .infomation {
      background: #1a202e !important;
      padding: 20px;
      border-radius: 5px;
      margin-top: 10px;
      .info {
        margin-top: 20px;
        .ivu-form-item-label {
          color: #aaaaaa;
        }
      }
    }
    .detail {
      background: #1a202e !important;
      padding: 20px;
      border-radius: 5px;
      margin-top: 10px;
      .ivu-table-summary tr td {
        background-color: #28313f;
      }
    }
    .total {
      position: relative;
      height: 300px;
      overflow: hidden;
      margin-top: 20px;
      .total-left {
        position: absolute;
        width: 300px;
      }
      .total-right {
        position: absolute;
        width: 300px;
      }
    }
  }
</style>
