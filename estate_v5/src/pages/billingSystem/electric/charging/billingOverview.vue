<template>
  <div class="billingOverview">
    <Row class="select-list">
      <ELPCascader v-if="billingTarget === 2" filterable :options="$store.state.charginMacList" v-model="mac" style="width: 250px; margin-right: 10px" :transfer="true" :placeholder="$t('pleaseSelectDeviceLine2')">
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
        <Select v-model="packetTypes" @on-change="handleTypes" style="width: 200px" :placeholder="$t('selectGroupingType')" :clearable="true">
          <Option v-for="item in $store.state.packetList" :value="item.id" :key="item.id" :label="item.type"></Option>
        </Select>
        <TreeSelect :placeholder="$t('selectGroup')" show-checkbox v-model="packetFilter" transfer :data="packetFilterList" class="ml-10" style="width: 200px; margin-right: 10px" />
      </template>
      <Select v-model="timer" style="width: 200px" :transfer="true" :placeholder="$t('pleaseSelect')" :clearable="true">
        <Option v-for="item in timerList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button class="b-blue ml-10" @click="handleSearch">{{ $t('query') }}</Button>
      <Button class="b-info ml-10">{{ $t('reset') }}</Button>
    </Row>
    <div class="content">
      <h3>{{ $t('overviewWithRange', { start: rechargeObj.staStartDate ? rechargeObj.staStartDate : '', end: rechargeObj.staEndDate ? rechargeObj.staEndDate : '' }) }}</h3>
      <Row style="margin-top: 20px" :gutter="24">
        <Col>
          <div class="amountType">{{ $t('balance') }}</div>
          <h1 class="c-warning">￥{{ parseFloat((overviewAccount.initalAmount + overviewAccount.rechargeAmount + overviewAccount.giveAmount - overviewAccount.spendingAmount - overviewAccount.refundTotalAmount).toFixed(10)) }}</h1>
        </Col>
        <Col>
          <h1>=</h1>
        </Col>
        <Col>
          <div class="amountType">{{ $t('ns_billingDetails.label1') }}</div>
          <h1>￥{{ overviewAccount.initalAmount }}</h1>
        </Col>
        <Col>
          <h1>+</h1>
        </Col>
        <Col>
          <div class="amountType">{{ $t('ns_billingDetails.label7') }}:</div>
          <h1>￥{{ overviewAccount.rechargeAmount }}</h1>
          <div class="c-primary" style="cursor: pointer" @click="handleSeeDetail('rechargeAmount')">{{ $t('viewDetails2') }}</div>
        </Col>
        <Col>
          <h1>+</h1>
        </Col>
        <Col>
          <div class="amountType">{{ $t('ns_billingDetails.label13') }}</div>
          <h1>￥{{ overviewAccount.giveAmount }}</h1>
          <div class="c-primary" style="cursor: pointer" @click="handleSeeDetail('giveAmount')">{{ $t('viewDetails2') }}</div>
        </Col>
        <Col>
          <h1>-</h1>
        </Col>
        <Col>
          <div class="amountType">{{ $t('ns_billingDetails.label2') }}:</div>
          <h1>￥{{ overviewAccount.spendingAmount }}</h1>
          <div class="c-primary" style="cursor: pointer" @click="handleSeeDetail('spendingAmount')">{{ $t('viewDetails2') }}</div>
        </Col>
        <Col>
          <h1>-</h1>
        </Col>
        <Col>
          <div class="amountType">{{ $t('refundAmountWithUnit') }}</div>
          <h1>￥{{ overviewAccount.refundTotalAmount }}</h1>
          <div class="c-primary" style="cursor: pointer" @click="handleSeeDetail('refundTotalAmount')">{{ $t('viewDetails2') }}</div>
        </Col>
        <Col>
          <Row style="align-items: center; position: absolute; bottom: 0px; width: 200px">
            <Button class="b-blue ml-10" style="margin-right: 10px" @click="handleBOfflineRecharge" :disabled="recharge === ''">{{ $t('offlineRecharge') }}</Button>
            <QRCodeCell :text="createQrCodeText()" :width="600" isNeedBackColor isCustomDownload @downloadPng="customDownload" v-if="recharge">
              <div ref="QrTable2">
                <div ref="QrTable1">
                  <div ref="QrName" style="margin-top: 10px; text-align: center">
                    {{ $t('target') }}：{{
                      billingTarget === 1 ? `${recharge.targetName1}` : billingTarget === 2 ? `${recharge.targetName1} (${recharge.mac})/${recharge.targetName2} (${recharge.mac}-${recharge.addrId.toString().padStart(2, '0')})` : `${recharge.targetName2}/${recharge.targetName1}`
                    }}
                  </div>
                  <div style="border-top: 1px solid #797979; margin-top: 10px">
                    <Table :columns="codejsrColumns" :data="recharge.notifier"></Table>
                  </div>
                </div>
                <div style="border-top: 1px solid #797979; margin-top: 10px">
                  <Table :columns="codeuserColumns" :data="recharge.user"></Table>
                </div>
              </div>
            </QRCodeCell>
          </Row>
        </Col>
      </Row>
    </div>
    <div class="echarts">
      <Row style="justify-content: space-between">
        <h3>{{ $t('trendOfBillingStatistics') }}</h3>
        <Row>
          <Col>
            <span style="width: 10px; background: #02a7f0; height: 10px; display: inline-block"></span>
            <span class="ml-10">{{ $t('remainingAmountOfTheDay') }}</span>
          </Col>
          <Col class="ml-10">
            <span style="width: 10px; background: #f59a23; height: 10px; display: inline-block; border-radius: 10px"></span>
            <span class="ml-10">{{ $t('dailyTotalElectricityBill') }}</span>
          </Col>
          <Col class="ml-10">
            <span style="width: 10px; background: #00ffff; height: 10px; display: inline-block; border-radius: 10px"></span>
            <span class="ml-10">{{ $t('dailyRechargeAmount') }}</span>
          </Col>
        </Row>
      </Row>
      <BillingTrends :options="dataList" />
    </div>
    <Modal v-model="bofflineRecharge" :title="$t('offlineRecharge')" class-name="recharge" width="600">
      <div class="prompt">
        <Icon color="#f59a23" size="16" type="ios-information-circle-outline" style="margin-left: 10px" />
        {{ $t('rechargeTip') }}
      </div>
      <div class="source">
        <Form>
          <FormItem :label="$t('rechargeSource')">
            <Row>
              <i18n path="rechargeToValue" :places="{ username: staffName, phone: $store.state.mobile }"></i18n>
              <Select v-if="recharge" place="target" v-model="electricity.user" style="width: 200px; margin: 0 10px" :transfer="true" :placeholder="$t('pleaseSelect')">
                <Option v-for="item in recharge.user" :value="`${item.name}(${item.telephone});${item.id}`" :key="item.telephone">{{ `${item.name}(${item.telephone})` }}</Option>
              </Select>
            </Row>
          </FormItem>
          <FormItem :label="$t('rechargeAmount')">
            <MoneyInput v-model="electricity.amt" />
          </FormItem>
          <FormItem :label="$t('remark')"><Input v-model="electricity.notes" :placeholder="$t('pleaseEnter')" type="textarea" v-width="400" /></FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button class="b-blue ml-10" @click="handleRechargeSureAuth">{{ $t('confirm2') }}</Button>
        <Button class="b-info ml-10" @click="handleCancel">{{ $t('cancel') }}</Button>
      </div>
    </Modal>
    <OperationCheckAuth ref="operationCheckAuth" :action="handleRechargeSure" :title="$t('offlineRecharge')" isAlways>
      <Form>
        <FormItem :label="`${$t('balance')}:`">
          <span>￥ {{ recharge.balance }}</span>
        </FormItem>
        <FormItem :label="`${$t('giftAmount')}:`">
          <h1>￥ {{ `${electricity.amt}` }}</h1>
        </FormItem>
        <FormItem :label="`${$t('amountAfterGift')}:`">
          <h1>￥ {{ (Number(recharge.balance) + Number(`${this.electricity.amt}`)).toFixed(2) }}</h1>
        </FormItem>
      </Form>
    </OperationCheckAuth>
  </div>
</template>
<script>
  import { billingOverviewAccount, getGroupNodeQueryCondition, billingOverviewCurve, accountBalanceList, offlineAccountCharge } from '@/api/public'
  import BillingTrends from '@/pages/Common/BillingTrends.vue'
  import QRCodeCell from '@/pages/billingSystem/component/QRCodeCell.vue'
  import { QrCode } from '@/untils/QrCode'
  export default {
    components: { BillingTrends, QRCodeCell },
    data() {
      return {
        staffName: window.sessionStorage.getItem('staffName'),
        timerList: [],
        timer: null,
        mac: [],
        packetTypes: '',
        packetFilter: '',
        packetFilterList: [],
        electricity: { orechargeType: 'oRecharge', user: '', amt: 0, notes: '' },
        bofflineRecharge: false,
        isActive: '1',
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
        dataList: { data1: [], data2: [], data3: [], xAxisData: [] },
        newTime: '',
        overviewAccount: { initalAmount: 0, rechargeAmount: 0, giveAmount: 0, spendingAmount: 0, refundTotalAmount: 0 },
        recharge: '',
        offlineRecharge: false,
        rechargeObj: {},
      }
    },
    created() {
      this.billingTarget = this.$store.state.billingTarget
      this.timerList = this.$store.state.charginTimer
      this.timer = this.timerList ? this.timerList[0].value : []
      if (this.$route.params.mac && this.$route.params.line) {
        this.mac = [+this.$route.params.targetValue.split(':')[0], +this.$route.params.line]
        this.handleSearch()
      } else if (!this.$route.params.mac && !this.$route.params.line && this.$route.params.name && this.$route.params.nodeId) {
        let filterName = this.$store.state.packetList.filter(v => v.type === this.$route.params.name)
        if (filterName.length) {
          this.packetTypes = +filterName[0].id
          this.handleTypes(this.packetTypes)
          this.handleSearch()
        }
      } else if (this.billingTarget === 1) {
        this.handleSearch()
      }
    },
    methods: {
      createQrCodeText() {
        let domain = this.$func.ctxPaths()
        let domainStatus = domain.includes('sndtest') || domain.includes('localhost')
        let redirectUri = domainStatus ? 'https://v5.sndtest.com/billPayment' : 'https://v5.snd02.com/billPayment'
        return `${redirectUri}?project=${this.$store.state.projectCode}&targetValue=${this.recharge.targetValue}&billingTarget=${this.recharge.billingTarget}&billCycle=${this.$store.state.billCycle}`
      },
      async customDownload(text) {
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
      },
      async handleAccountBalanceList() {
        let params = { projectCode: this.$store.state.projectCode, billingTarget: this.billingTarget, period: this.timer ? this.timer : this.timerList[0].value }
        if (this.billingTarget === 2) {
          if (this.mac.length > 0) {
            params.targetValue = `${this.mac[0]}:${this.mac[1]}`
          }
        } else if (this.billingTarget === 3) {
          if (this.packetFilter.length > 0) {
            params.targetValue = this.packetFilter[0]
          }
        }
        const res = await accountBalanceList(params)
        if (res.success) {
          this.recharge = res.data.datas[0]
          this.rechargeObj = res.data
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      TowTimeDayFormat(time1, time2) {
        let totalDays = ''
        let total = ''
        let t1 = Date.parse(new Date(time1.replace(/-/g, '/')))
        let t2 = Date.parse(new Date(time2.replace(/-/g, '/')))
        this.newTime = t2
        total = Math.abs(t2 - t1)
        totalDays = Math.floor(total / (1000 * 3600 * 24))
        return totalDays
      },
      getData(val, day) {
        var today = new Date(val)
        var targetday = today.getTime() + 1000 * 60 * 60 * 24 * day
        today.setTime(targetday)
        var tYear = today.getFullYear()
        var tMonth = today.getMonth()
        var tDate = today.getDate()
        tMonth = this.doHandMonth(tMonth + 1)
        tDate = this.doHandMonth(tDate)
        return tYear + '-' + tMonth + '-' + tDate
      },
      doHandMonth(month) {
        return month.toString().padStart(2, '0')
      },
      handleSeeDetail(type) {
        if (!this.timer) return this.$Message.error({ content: this.$t('pleaseSelectTheAccountingPeriod') })
        if (this.billingTarget === 1) {
        } else if (this.billingTarget === 2 && this.mac.length === 0) {
          return this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
        } else if (this.billingTarget === 3 && this.packetFilter === '') {
          return this.$Message.error({ content: this.$t('selectGroup') })
        }
        if (type === 'rechargeAmount') {
          this.$emit('billingType', { pageType: 'rechargeRecord', value: this.billingTarget === 2 ? this.mac : this.billingTarget === 3 ? this.packetFilter[0] : '', timer: this.timer })
        } else if (type === 'giveAmount') {
          this.$emit('billingType', { pageType: 'rechargeRecord', typeValue: '5', type: 'offline' })
        } else if (type === 'spendingAmount') {
          let newTimer = ''
          if (this.timer === this.timerList[0].value) {
            newTimer = `${this.getData(this.$Date().format('YYYY-MM-DD'), -31)}:${this.$Date().format('YYYY-MM-DD')}`
          } else {
            let a = this.timer.split('~')[0]
            let b = this.timer.split('~')[1]
            let daysNum = this.TowTimeDayFormat(a, b)
            if (daysNum > 31) {
              newTimer = `${this.getData(b, -31)}:${this.timer.split('~')[1]}`
            } else {
              newTimer = `${this.timer.split('~')[0]}:${this.timer.split('~')[1]}`
            }
          }
          this.$router.push({ name: 'billingSystem-period', params: { targetValue: this.billingTarget === 2 ? `${this.mac[0]}:${this.mac[1]}` : `${this.packetTypes}:${this.packetFilter}`, timer: newTimer } })
        } else if (type === 'refundTotalAmount') {
          this.$emit('billingType', { pageType: 'refund', typeValue: '2' })
        }
      },
      async handlebillingOverviewCurve() {
        let targetValue = this.billingTarget === 1 ? this.$store.state.projectCode : this.billingTarget === 2 ? (this.mac.length > 0 ? `${this.mac[0]}:${this.mac[1]}` : '') : this.billingTarget === 3 ? this.packetFilter : ''
        let params = {
          level: '1',
          projectCode: this.$store.state.projectCode,
          billingTarget: this.billingTarget,
          targetValue: targetValue,
        }
        if (this.timer) {
          params.staEndTime = this.timer.split('~')[1] + ' 23:59:59'
          params.staStartTime = this.timer.split('~')[0] + ' 00:00:00'
        } else {
          params.staEndTime = ''
          params.staStartTime = ''
        }
        const res = await billingOverviewCurve(params)
        if (res.success) {
          this.dataList.data1 = []
          this.dataList.data2 = []
          this.dataList.data3 = []
          this.dataList.xAxisData = []
          this.dataList.data1 = res.data.rechargeAmountArr
          this.dataList.data2 = res.data.totalFeeArr
          this.dataList.data3 = res.data.accountAmountArr
          this.dataList.xAxisData = res.data.timeArr
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handlebillingOverviewAccount() {
        let targetValue = this.billingTarget === 1 ? this.$store.state.projectCode : this.billingTarget === 2 ? (this.mac.length > 0 ? `${this.mac[0]}:${this.mac[1]}` : '') : this.billingTarget === 3 ? this.packetFilter : ''
        let params = { level: '1', projectCode: this.$store.state.projectCode, billingTarget: this.billingTarget, targetValue: targetValue }
        if (this.timer) {
          params.staEndTime = this.timer.split('~')[1] + ' 23:59:59'
          params.staStartTime = this.timer.split('~')[0] + ' 00:00:00'
        } else {
          params.staEndTime = ''
          params.staStartTime = ''
        }
        const res = await billingOverviewAccount(params)
        if (res.success) {
          this.overviewAccount = res.data
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
            obj.children = this.getTree(item.children)
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
          let resData = res.data
          this.packetFilterList = this.getTree(resData)
          if (this.$route.params.nodeId) {
            this.packetFilter = [+this.$route.params.nodeId]
          }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTypes(val) {
        this.packetTypes = val
        this.getGroupTrees()
      },
      handleSearch() {
        let searchState = true
        if (this.billingTarget === 2) {
          if (this.mac.length === 0) {
            searchState = false
            this.$Message.error({ content: this.$t('pleaseSelectDeviceLine') })
          }
        } else if (this.billingTarget === 3) {
          if (this.packetFilter === '') {
            searchState = false
            this.$Message.error({ content: this.$t('selectGroup') })
          }
        }
        if (!this.timer) {
          searchState = false
          this.$Message.error({ content: this.$t('pleaseSelectTheAccountingPeriod') })
        }
        if (searchState) {
          this.handlebillingOverviewAccount()
          this.handlebillingOverviewCurve()
          this.handleAccountBalanceList()
        }
      },
      handleBOfflineRecharge() {
        this.bofflineRecharge = true
      },
      handleCancel() {
        this.bofflineRecharge = false
      },
      handleRechargeSureAuth() {
        if (this.electricity.amt === 0) {
          this.$Message.error({ content: this.$t('theAmountCannotBeEmpty') })
        } else if (this.electricity.user === '') {
          if (this.rechargeType === 'recharge') {
            this.$Message.error({ content: this.$t('rechargeSourceCannotBeEmpty') })
          } else {
            this.$Message.error({ content: this.$t('refundObjectCannotBeEmpty') })
          }
        }
        this.$refs.operationCheckAuth.openModal()
      },
      async handleRechargeSure() {
        let params = { projectCode: this.$store.state.projectCode, billingTarget: this.billingTarget, opType: '1', amt: this.electricity.amt, remark: this.electricity.notes, userName: this.electricity.user.split(';')[0] }
        if (this.billingTarget === 2) {
          if (this.mac.length > 0) {
            params.targetValue = `${this.mac[0]}:${this.mac[1]}`
          }
        } else if (this.billingTarget === 3) {
          if (this.packetFilter.length > 0) {
            params.targetValue = this.packetFilter[0]
          }
        }
        params.uid = this.electricity.user.split(';')[1]
        const res = await offlineAccountCharge(params)
        if (res.success) {
          this.offlineRecharge = false
          this.$Message.success({ content: this.$t('rechargedSuccessfully') })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handlePaymentType(v) {
        this.isActive = v
      },
    },
  }
</script>
<style lang="less">
  .billingOverview {
    .demo-spin-icon-load {
      animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
      from {
        transform: rotate(0deg);
      }
      50% {
        transform: rotate(180deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
    .demo-spin-col {
      height: 100px;
      position: relative;
      border: 1px solid #eee;
    }
    .active {
      border-bottom: 2px solid #007eff;
      color: #007eff;
    }
    .content {
      background: #1a202e !important;
      padding: 20px;
      h1 {
        font-size: 46px;
      }
      .amountType {
        color: #a9a9a9;
      }
    }
    .echarts {
      background: #1a202e !important;
      padding: 20px;
      margin-top: 10px;
    }
  }
</style>
