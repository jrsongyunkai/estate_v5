<template>
  <div v-if="isOverLoad">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="getConfigValue" />
    <div v-else class="diagram-content">
      <div class="content">
        <Tabs :value="tabName" name="sub-tab" @on-click="handleTabsSelect">
          <TabPane v-for="tab in tabs" :key="tab.prop" :label="tab.label" :name="tab.prop" tab="sub-tab">
            <NoSupport v-if="!tab.isSupport"></NoSupport>
            <GraphModule v-else-if="tabName === tab.prop" :energyType="tab.value" :models="models" />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import { listBoxGroups } from '@/api/public'
  import GraphModule from './modules/GraphModule.vue'
  import NoSupport from '@/components/energyModule/noSupport.vue'
  import EnablingView from '@/components/energyModule/EnablingView.vue'
  import { energyTypeMap } from '@/untils/configuration'
  import enablingEnergy from '@/mixins/enablingEnergy'
  export default {
    name: 'smartEnergy-diagram',
    components: { GraphModule, NoSupport, EnablingView },
    mixins: [enablingEnergy],
    data() {
      return {
        tabName: 'elec',
        models: [{ label: this.$t('byGeographicalLocation'), value: 'location' }],
        tabs: energyTypeMap,
      }
    },
    created() {
      this.getClassGroupList()
    },
    methods: {
      // 获取分组类别
      async getClassGroupList() {
        let res = await listBoxGroups({ projectCode: this.$store.state.projectCode, pageNo: 1, pageSize: 9999 })
        if (res.success) {
          let beforeModels = [{ label: this.$t('byGeographicalLocation'), value: 'location' }]
          this.models = res.datas && res.datas.length ? [...beforeModels, ...res.datas.map(it => ({ ...it, value: it.id.toString(), label: it.type }))] : beforeModels
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleTabsSelect(e) {
        this.tabName = e
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  .diagram-content {
    height: calc(~'100vh - 142px');
    .content {
      margin-top: 10px;
      background: transparent;
      position: relative;
      /deep/.ivu-tabs-bar {
        margin-bottom: 10px;
      }
      /deep/.ivu-tabs-nav-scroll {
        background: #1a202e;
        padding: 10px;
        border-radius: 5px;
        font-size: 16px;
      }
      /deep/.ivu-tabs {
        height: 100%;
      }
    }
  }
</style>

<style lang="less">
  .g6-grid {
    background-color: #1a202e;
  }
</style>
