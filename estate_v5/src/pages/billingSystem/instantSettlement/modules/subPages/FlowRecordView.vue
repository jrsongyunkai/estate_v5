<template>
  <div class="record-view">
    <BackTopTitle :title="`${$t('flowRecord')} (${record.username})`" @close="$emit('close')"></BackTopTitle>
    <div class="config-view">
      <Tabs :value="tabName" name="tab-record" @on-click="handleTabsSelect">
        <TabPane v-for="tab in tabs" :key="tab.prop" :label="tab.label" :name="tab.prop" tab="tab-record">
          <component v-if="tab.prop === tabName" :is="tab.prop" :record="record" />
        </TabPane>
      </Tabs>
    </div>
  </div>
</template>

<script>
  import noMarginTop from '@/mixins/noMarginTop'
  import BackTopTitle from '@/pages/billingSystem/component/BackTopTitle.vue'
  import consumeRecord from './tabModules/consumeRecord.vue'
  import rechargeRecord from './tabModules/rechargeRecord.vue'
  import refundRecord from './tabModules/refundRecord.vue'
  export default {
    props: {
      record: { type: Object, default: () => {} },
    },
    components: { BackTopTitle, consumeRecord, rechargeRecord, refundRecord },
    data() {
      return {
        tabName: 'consumeRecord',
        tabs: [
          { label: this.$t('consumptionRecords'), prop: 'consumeRecord' },
          { label: this.$t('rechargeRecords'), prop: 'rechargeRecord' },
          { label: this.$t('refundRecord'), prop: 'refundRecord' },
        ],
      }
    },
    mixins: [noMarginTop],
    methods: {
      handleTabsSelect(e) {
        this.tabName = e
      },
    },
  }
</script>

<style lang="less" scoped>
  .record-view {
    .config-view {
      height: calc(~'100vh - 185px');
      overflow: auto;
      margin-top: 10px;
      padding: 0 10px;
      scrollbar-width: none; // firefox
      &::-webkit-scrollbar {
        width: 0px;
        display: none;
      }
      /deep/ .ivu-tabs-bar {
        margin-bottom: 10px;
      }
      /deep/ .ivu-tabs-nav-wrap {
        .ivu-tabs-nav-prev,
        .ivu-tabs-nav-next {
          line-height: 50px;
        }
      }
      /deep/ .ivu-tabs-nav-scroll {
        background: var(--card-bg-color);
        padding: 5px;
        border-radius: 5px;
        font-size: 14px;
      }
    }
  }
</style>
