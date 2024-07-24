<template>
  <div class="balance">
    <div class="content" v-show="pageType === 'index'">
      <Tabs :value="tabName" name="sub-tab" @on-click="handleTabsSelect">
        <TabPane :label="$t('listOfMonitoringBalance')" name="balanceList" tab="sub-tab">
          <CollectionbalanceList v-if="tabName === 'balanceList'" @changetab="changetab" @billingChargeRecord="billingChargeRecord" />
        </TabPane>
        <TabPane :label="$t('monitoringNotificationConfiguration')" name="notification" tab="sub-tab">
          <MNConfiguration v-if="tabName === 'notification'" @supervisorList="handlesupervisorList" @electricityList="handlesupervisorList" />
        </TabPane>
        <TabPane :label="$t('rechargeRecords')" name="rechargeRecord" tab="sub-tab">
          <RechargeRecord v-if="tabName === 'rechargeRecord'" :type="'recharge'" @newType="newType" :billParams="billParams" />
        </TabPane>
        <TabPane :label="$t('refundRecord')" name="refund" tab="sub-tab">
          <RechargeRecord v-if="tabName === 'refund'" :type="'refund'" @newType="newType" :billParams="billParams" />
        </TabPane>
        <TabPane :label="$t('billingOverview')" name="billingOverview" tab="sub-tab">
          <BillingOverview v-if="tabName === 'billingOverview'" @billingType="billingType" />
        </TabPane>
        <TabPane :label="$t('statementList')" name="statementList" tab="sub-tab">
          <StatementList v-if="tabName === 'statementList'" @billingDetails="billingDetails" />
        </TabPane>
      </Tabs>
    </div>
    <SupervisorList v-if="pageType === 'supervisorList'" @index="handleIndex" :type="'supervisorList'" />
    <SupervisorList v-if="pageType === 'electricityList'" @index="handleIndex" :type="'electricityList'" />
    <BillingDetails v-if="pageType === 'billingDetails'" @index="handleIndex" :billDetailParams="billParams" />
  </div>
</template>
<script>
  import CollectionbalanceList from './collectionbalanceList.vue'
  import MNConfiguration from './mnConfiguration.vue'
  import SupervisorList from './supervisorList.vue'
  import RechargeRecord from './rechargeRecord.vue'
  import BillingOverview from './billingOverview.vue'
  import StatementList from './statementList.vue'
  import BillingDetails from './billingDetails.vue'
  import store from '@/store/index'
  import { getGroupTypeQueryCondition, getMacChnQueryCondition } from '@/api/public'
  export default {
    components: { CollectionbalanceList, MNConfiguration, SupervisorList, RechargeRecord, BillingOverview, StatementList, BillingDetails },
    created() {
      if (this.$route.params.isFee) {
        this.tabName = 'billingOverview'
      }
    },
    data() {
      return {
        paymentCode: true,
        pageType: 'index',
        tabName: 'balanceList',
        billParams: {},
        macList: [],
        packetList: [],
      }
    },
    mounted() {
      this.getGroupTypes()
      this.handleGetMacChnQueryCondition()
    },
    methods: {
      newType(val) {
        this.tabName = val
      },
      billingDetails(params) {
        this.tabName = 'statementList'
        this.pageType = params.pageType
        this.billParams = { ...params }
      },
      billingChargeRecord(params) {
        this.pageType = 'index'
        this.tabName = params.pageType
        this.billParams = { ...params }
      },
      billingType(params) {
        this.pageType = 'index'
        this.tabName = params.pageType
        this.billParams = { ...params }
      },
      handleIndex(v) {
        this.pageType = v
      },
      handlesupervisorList(v) {
        this.pageType = v
      },
      handleTabsSelect(type) {
        this.billParams = {}
        this.tabName = type
        this.paymentCode = type === 'balanceList'
      },
      changetab(value) {
        this.tabName = value
      },
      async getGroupTypes() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getGroupTypeQueryCondition(params)
        if (res.success) {
          this.packetList = res && res.data
          store.commit('packetList', this.packetList)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleGetMacChnQueryCondition() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getMacChnQueryCondition(params)
        if (res.success) {
          this.macList = res.data.map(item => {
            let obj = { value: item.resId, label: item.name }
            if (item.addrs) {
              obj.children = item.addrs.map(data => ({ value: data.addr, label: data.title }))
            }
            return obj
          })
          store.commit('charginMacList', this.macList)
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less">
  .ivu-input-number-handler-wrap {
    display: none;
  }
  .paymentType {
    .ivu-poptip-body {
      padding: 0px;
    }
    .type {
      span {
        padding-bottom: 5px;
        font-size: 14px;
      }
    }
    .active {
      border-bottom: 2px solid #007eff;
      color: #007eff;
    }
    .ivu-tooltip-inner {
      width: 400px;
      max-width: 400px;
      background-color: #28313f;
      padding: 0;
    }
    .header {
      display: flex;
      justify-content: center;
      position: relative;
      font-size: 12px;
      padding: 10px 10px 0px 10px;
      align-items: center;
      .type {
        font-size: 16px;
      }
      .saveas {
        position: absolute;
        right: 10px;
        top: 1 0px;
        text-decoration: underline;
        color: #0698d9;
        cursor: pointer;
      }
    }

    .content {
      border-top: 1px solid #797979;
      background: #28313f;
      padding: 20px;
      .imageCode {
        display: flex;
        justify-content: center;
        .jfcode {
          width: 200px;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .recharge {
    .ivu-radio-wrapper:first-child {
      border-left: 1px solid #3d3d41;
    }
    .ivu-radio-wrapper-checked:first-child,
    .ivu-radio-wrapper-checked:last-child {
      background: rgba(5, 144, 207, 0.2);
    }
    .drop {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: #fff;
      margin: 20px 5px 0px 5px;
    }
    .electricity {
      align-items: center;
      margin-top: 20px;
    }
    .prompt {
      color: #f29e31;
      background: rgba(245, 154, 35, 0.2);
      padding: 5px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .ivu-modal-body {
      padding: 16px 16px 0px 16px;
    }
    .ivu-modal-footer {
      padding: 0px 18px 12px 18px;
      border-color: transparent;
    }
  }
  .tripping {
    .ivu-steps-icon.ivu-icon {
      border-radius: 32px;
      font-size: 40px !important;
    }
    .ivu-steps-item {
      position: relative;
    }
    .ivu-steps-status-error,
    .ivu-steps-status-wait,
    .ivu-steps-status-finish {
      width: 100px;
    }
    .ivu-steps-head {
      padding-left: 30px !important;
      margin-left: 0px;
    }
    .ivu-steps-title {
      position: absolute;
      width: 100px;
      top: 100px;
      left: -58px;
      color: #fff !important;
    }
    .ivu-steps-status-process,
    .ivu-steps-status-wait {
      .ivu-steps-head-inner {
        background-color: rgba(2, 167, 240, 0.2) !important;
        border: 1px solid #02a7f0 !important;
        span {
          color: #02a7f0 !important;
        }
      }
    }
    .ivu-steps-tail {
      left: 10px !important;
    }
    .ivu-steps-content {
      position: absolute;
      text-align: center;
      padding-left: 0px;
      width: 100px;
      left: -76px;
      top: 40px;
      font-size: 14px;
      margin-top: 10px;
    }

    .ivu-steps-status-finish {
      .ivu-steps-content {
        color: #02a7f0 !important;
      }
    }
    .ivu-steps-status-error {
      color: #d9001b !important;
    }
    .ivu-steps-head-inner {
      width: 40px;
      height: 40px;
      line-height: 40px;
      background-color: transparent !important;
    }
    .ivu-icon-ios-checkmark {
      background-color: rgba(2, 167, 240, 0.2);
    }
    .ivu-steps {
      height: 150px;
    }
    .detail {
      .ivu-form-item-label {
        color: #7f7f7f;
      }
      .ivu-form-item {
        margin-bottom: 12px;
      }
    }
    .drop {
      width: 5px;
      height: 5px;
      border-radius: 5px;
      background: #fff;
      margin: 20px 5px 0px 5px;
    }
    .alarmprompt {
      color: #d9001b;
      background: rgba(207, 17, 40, 0.2);
      padding: 5px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .prompt {
      color: #f29e31;
      background: rgba(245, 154, 35, 0.2);
      padding: 5px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .ivu-modal-body {
      padding: 16px 16px 0px 16px;
    }
    .ivu-modal-footer {
      padding: 0px 18px 12px 18px;
      border-color: transparent;
    }
  }
  .balancecode {
    .header {
      display: flex;
      justify-content: center;
      position: relative;
      font-size: 12px;
      .saveas {
        position: absolute;
        right: 0px;
        text-decoration: underline;
        color: #0698d9;
        cursor: pointer;
      }
    }
    .jfcode {
      padding: 20px;
      img {
        width: 100%;
      }
    }
  }
  .balance {
    .tips {
      background: #363c44;
      padding: 6px;
      border-radius: 5px;
      i {
        color: red;
      }
    }
    .content {
      margin-top: 10px;
      background: transparent;
      position: relative;
      .bottom-list {
        position: absolute;
        top: -50px;
        right: 10px;
      }
      .select-list {
        padding: 10px;
        background: #1a202e;
        border-radius: 5px;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
      }
      .ivu-tabs-bar {
        margin-bottom: 10px;
      }
      .ivu-tabs-nav-scroll {
        background: #1a202e;
        padding: 5px;
        border-radius: 5px;
        font-size: 16px;
      }
      .information {
        background: #1a202e;
        padding: 10px;
        border-radius: 5px;
        margin-top: 10px;
        .header {
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
</style>
