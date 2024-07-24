<template>
  <div v-if="isOverLoad">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="getConfigValue" />
    <div v-else class="standby-box">
      <div class="content" v-show="!showAddRule">
        <Tabs :value="tabName" :animated="false" name="sub-tab" @on-click="handleTabsSelect">
          <TabPane :label="$t('energyConsumptionStatistics')" name="statistics" tab="sub-tab">
            <StatisticsModule v-if="tabName === 'statistics'" :tabs="tabs" />
          </TabPane>
          <TabPane :label="$t('conditionMonitoringEnergyRanking')" name="ranking" tab="sub-tab">
            <rankingModule v-if="tabName === 'ranking'" :tabs="tabs" />
          </TabPane>
          <TabPane :label="$t('ruleConfiguration')" name="config" tab="sub-tab">
            <RuleConfigModule ref="ruleConfigModule" v-if="tabName === 'config'" @toAddRule="toAddRule" />
          </TabPane>
        </Tabs>
      </div>
      <AddRuleConfigModule v-if="showAddRule" @cancel="cancel" :editInfo="editInfo" />
    </div>
  </div>
</template>
<script>
  import StatisticsModule from './modules/statisticsModule.vue'
  import rankingModule from './modules/rankingModule.vue'
  import RuleConfigModule from './modules/RuleConfigModule.vue'
  import AddRuleConfigModule from './modules/AddRuleConfigModule.vue'
  import { energyTypeMap } from '@/untils/configuration'
  import EnablingView from '@/components/energyModule/EnablingView.vue'
  import enablingEnergy from '@/mixins/enablingEnergy'
  export default {
    name: 'energySaving-standby',
    components: {
      StatisticsModule,
      rankingModule,
      RuleConfigModule,
      AddRuleConfigModule,
      EnablingView,
    },
    mixins: [enablingEnergy],
    data() {
      return {
        tabName: 'statistics',
        showAddRule: false,
        editInfo: null,
        tabs: energyTypeMap,
      }
    },
    methods: {
      handleTabsSelect(e) {
        this.tabName = e
      },
      toAddRule(info) {
        this.showAddRule = true
        this.editInfo = info
      },
      cancel(reLoad = false) {
        this.showAddRule = false
        if (reLoad) this.$refs.ruleConfigModule.queryData()
      },
    },
  }
</script>

<style lang="less" scoped>
  .standby-box {
    .content {
      margin-top: 10px;
      background: transparent;
      position: relative;
    }
    /deep/.ivu-tabs-bar {
      margin-bottom: 0px;
      border-radius: 0px;
    }
    .content /deep/.ivu-tabs-nav-scroll {
      background: #1a202e;
      padding: 10px 10px 0px 10px;
      border-radius: 0px;
      font-size: 16px;
    }
  }
</style>
