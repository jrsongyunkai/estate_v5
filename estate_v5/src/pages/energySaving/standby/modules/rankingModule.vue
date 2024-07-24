<template>
  <div class="statistics-box">
    <Tabs :value="tabName" type="card" :animated="false" @on-click="handleTabsSelect">
      <TabPane v-for="tab in tabs" :key="tab.prop" :label="tab.label" :name="tab.prop" tab="subTab">
        <NoSupport v-if="!tab.isSupport"></NoSupport>
        <ContentModule v-else-if="tabName === tab.prop" :energyType="tab.value" :unit="tab.unit" :models="models" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import { listBoxGroups } from '@/api/public'
  import ContentModule from './rankingModules/ContentModule.vue'
  import NoSupport from '@/components/energyModule/noSupport.vue'
  export default {
    props: {
      tabs: { type: Array, default: () => [] },
    },
    data() {
      return {
        tabName: 'elec',
        models: [{ label: this.$t('byGeographicalLocation'), value: 'location' }],
      }
    },
    components: { ContentModule, NoSupport },
    methods: {
      handleTabsSelect(e) {
        this.tabName = e
      },
      async getClassGroupList() {
        let res = await listBoxGroups({ projectCode: this.$store.state.projectCode, pageNo: 1, pageSize: 9999 })
        if (res.success) {
          let beforeModels = [{ label: this.$t('byGeographicalLocation'), value: 'location' }]
          this.models = res.datas && res.datas.length ? [...beforeModels, ...res.datas.map(it => ({ ...it, value: it.id.toString(), label: it.type }))] : beforeModels
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    created() {
      this.getClassGroupList()
    },
  }
</script>
<style lang="less" scoped>
  .statistics-box {
    height: calc(~'100vh - 191px');
    border-top: 1px solid rgb(51, 51, 51);
    /deep/.ivu-tabs-nav-scroll {
      font-size: 14px !important;
      padding: 10px 10px 10px 20px !important;
    }
    /deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab {
      background: rgba(215, 215, 215, 0.2);
      border: none;
    }
    /deep/.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active {
      background: rgba(2, 167, 240, 0.2);
      border: none;
    }
    /deep/.ivu-tabs-bar .ivu-tabs-nav-container {
      height: 50px;
      margin-bottom: 10px;
    }
  }
</style>
