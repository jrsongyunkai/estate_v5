<template>
  <div class="price-content">
    <Tabs v-if="!subPageName" :value="tabName" type="card" :animated="false" @on-click="handleTabsSelect">
      <TabPane v-for="tab in tabs" :key="tab.prop" :label="tab.label" :name="tab.prop" tab="subTab">
        <ContentModule v-if="tabName === tab.prop" :configType="tab.prop" />
      </TabPane>
    </Tabs>
    <component v-if="!!subPageName" :is="subPageName" :record="rowInfo" :callback="closeCallback" @close="subPageName = null" />
    <component :is="modalName" :record="modalInfo" :callback="callbackAction" @close="modalName = null" />
  </div>
</template>
<script>
  import parameterConfig from './modules/parameterConfig.vue'
  import priceConfig from './modules/priceConfig.vue'
  import ContentModule from './modules/ContentModule.vue'
  export default {
    name: 'billingSystem-priceConfig',
    components: {
      parameterConfig,
      priceConfig,
      ContentModule,
      PickGroupModal: () => import('./modals/PickGroupModal.vue'),
      PickLineModal: () => import('./modals/PickLineModal.vue'),
    },
    data() {
      return {
        subPageName: '',
        rowInfo: null,
        closeCallback: null,
        modalName: '',
        modalInfo: null,
        callbackAction: null,
        tabName: 'all',
        tabs: [
          { label: '全部(20)', prop: 'all' },
          { label: '电价(10)', prop: 'elec' },
          { label: '水价(5)', prop: 'water' },
          { label: '气价(5)', prop: 'gas' },
          { label: '其他(0)', prop: 'other' },
        ],
      }
    },
    provide() {
      return {
        openSubPage: this.openSubPage,
        openModal: this.openModal,
      }
    },
    methods: {
      handleTabsSelect(name) {
        this.tabName = name
      },
      openSubPage(name, record, callback) {
        this.subPageName = name
        this.rowInfo = record
        this.closeCallback = callback
      },
      openModal(name, record, callback) {
        this.modalName = name
        this.modalInfo = record
        this.callbackAction = callback
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  .price-content {
    // /deep/.ivu-tabs-nav-scroll {
    //   font-size: 14px !important;
    //   padding: 10px 10px 10px 20px !important;
    // }
    /deep/.ivu-tabs-bar {
      margin-bottom: 10px;
    }
    /deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
      background: rgba(215, 215, 215, 0.2);
      border: none;
    }
    /deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
      background: rgba(2, 167, 240, 0.2);
      border: none;
    }
    // /deep/.ivu-tabs-bar .ivu-tabs-nav-container {
    //   height: 50px;
    //   margin-bottom: 10px;
    // }
  }
</style>
