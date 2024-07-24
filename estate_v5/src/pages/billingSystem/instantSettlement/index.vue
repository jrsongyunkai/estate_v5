<template>
  <div v-if="isOverLoad" class="page-view">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="checkRtSettlement" />
    <div v-else v-show="!subPageName" class="page-billing-box">
      <div class="content-page-tab">
        <Tabs :value="tabName" name="sub-tab" @on-click="handleTabsSelect">
          <TabPane v-for="tab in tabs" :key="tab.prop" :label="tab.label" :name="tab.prop" tab="sub-tab">
            <component v-if="tab.prop === tabName" :is="tab.prop" />
          </TabPane>
        </Tabs>
      </div>
    </div>
    <component v-if="!!subPageName" :is="subPageName" :record="rowInfo" :callback="closeCallback" @close="subPageName = null" />
    <component :is="modalName" :record="modalInfo" :callback="callbackAction" @close="modalName = null" />
  </div>
</template>

<script>
  import EnablingView from './modules/enablingView.vue'
  import objListView from './modules/objListView.vue'
  import noticeConfigView from './modules/noticeConfigView.vue'
  import userListView from './modules/userListView.vue'
  import consumeRecordView from './modules/consumeRecordView.vue'
  import rechargeRecordView from './modules/rechargeRecordView.vue'
  import refundRecordView from './modules/refundRecordView.vue'
  import { checkRtSettlement } from '@/api/billingSystem/instantSettlement'
  export default {
    name: 'billingSystem-instantSettlement',
    components: {
      EnablingView,
      objListView,
      noticeConfigView,
      userListView,
      consumeRecordView,
      rechargeRecordView,
      refundRecordView,
      addObjectForm: () => import('./modules/subPages/addObjectForm.vue'),
      SettlementHistory: () => import('./modules/subPages/SettlementHistory.vue'),
      inspectUserList: () => import('./modules/subPages/inspectUserList.vue'),
      FlowRecordView: () => import('./modules/subPages/FlowRecordView.vue'),
      refundModal: () => import('./modules/modals/refundModal.vue'),
      offLineRechargeModal: () => import('./modules/modals/offLineRechargeModal.vue'),
      offLineRefundModal: () => import('./modules/modals/offLineRefundModal.vue'),
      giftDiscountsModal: () => import('./modules/modals/giftDiscountsModal.vue'),
      appletModal: () => import('./modules/modals/appletModal.vue'),
      importInspectUserModal: () => import('./modules/modals/importInspectUserModal.vue'),
      addInspectUserModal: () => import('./modules/modals/addInspectUserModal.vue'),
      BatchConfigForm: () => import('./modules/subPages/BatchConfigForm.vue'),
      refundSituationModal: () => import('./modules/modals/refundSituationModal.vue'),
      ObjConfigInfo: () => import('./modules/subPages/ObjConfigInfo.vue'),
      forceEndOrderModal: () => import('./modules/modals/forceEndOrderModal.vue'),
    },
    provide() {
      return { openSubPage: this.openSubPage, openModal: this.openModal }
    },
    data() {
      return {
        isOverLoad: false,
        isNeedAuth: true,
        subPageName: null,
        modalName: null,
        tabName: 'objListView',
        tabs: [
          { label: this.$t('listOfInstantSettlementObjects'), prop: 'objListView' },
          { label: this.$t('settlementNotificationConfiguration'), prop: 'noticeConfigView' },
          { label: this.$t('userList'), prop: 'userListView' },
          { label: this.$t('overviewOfConsumptionRecords'), prop: 'consumeRecordView' },
          { label: this.$t('overviewOfRechargeRecords'), prop: 'rechargeRecordView' },
          { label: this.$t('overviewOfRefundRecords'), prop: 'refundRecordView' },
        ],
        rowInfo: null,
        modalInfo: null,
        callbackAction: null,
        closeCallback: null,
      }
    },
    methods: {
      handleTabsSelect(e) {
        this.tabName = e
      },
      openSubPage(e, row, cb = null) {
        this.rowInfo = row
        this.closeCallback = cb
        this.subPageName = e
      },
      openModal(e, row, cb) {
        this.modalInfo = row
        this.callbackAction = cb
        this.modalName = e
      },
      async checkRtSettlement() {
        let params = { projectCode: this.$store.state.projectCode, isThrowError: false }
        const res = await checkRtSettlement(params)
        if (res.success) {
          this.isNeedAuth = !res.data
        } else {
          this.$message.error(res.message)
        }
        this.isOverLoad = true
      },
    },
    mounted() {},
    created() {
      this.checkRtSettlement()
    },
  }
</script>

<style lang="less">
  .page-view {
    --card-bg-color: #1a202e;
    .page-billing-box {
      .content-page-tab {
        margin-top: 10px;
        background: transparent;
        position: relative;
        .ivu-tabs-bar {
          margin-bottom: 10px;
        }
      }
      .ivu-tabs-nav-wrap {
        background: var(--card-bg-color);
        border-radius: 5px;
        .ivu-tabs-nav-prev,
        .ivu-tabs-nav-next {
          line-height: 50px;
        }
      }
      .content-page-tab .ivu-tabs-nav-scroll {
        background: var(--card-bg-color);
        padding: 5px;
        font-size: 16px;
      }
    }
    span.status {
      display: inline-block;
      border-radius: 4px;
      padding: 2px 5px;
      font-size: 12px;
    }
    span.status.error {
      color: #e03c3a;
      background: rgba(224, 60, 58, 0.2);
    }
    span.status.success {
      color: #70b603;
      background: rgba(112, 182, 3, 0.2);
    }
    span.status.disabled {
      color: #d7d7d7;
      background: rgba(215, 215, 215, 0.2);
    }
    span.status.warn {
      color: #f59a23;
      background: rgba(245, 154, 35, 0.098);
    }
    span.status.primary {
      color: #57a3f3;
      background: rgba(0, 126, 255, 0.1);
    }
    .textError {
      color: #e03c3a;
    }
  }
</style>
