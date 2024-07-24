<template>
  <div v-if="isOverLoad">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="getConfigValue" />
    <div v-else class="statistics-box">
      <div class="content">
        <Tabs :value="tabName" name="sub-tab" @on-click="handleTabsSelect">
          <TabPane :label="$t('totalCarbonEmissions')" name="total" tab="sub-tab">
            <TotalModule v-if="tabName === 'total'" />
          </TabPane>
          <TabPane v-for="(tab, index) in tabs" :key="tab.name" :label="tab.label" :name="tab.name" tab="sub-tab">
            <NoSupport v-if="!tab.isSupport"></NoSupport>
            <EnergyModule v-else-if="tabName === tab.name" :energyType="index + 1" :alias="tab.name" :label="tab.label" @setWarnSetting="showWarnSetting" />
          </TabPane>
        </Tabs>
      </div>
      <WarnSetting ref="warnSetting"></WarnSetting>
    </div>
  </div>
</template>

<script>
  import TotalModule from './modules/TotalModule.vue'
  import EnergyModule from './modules/EnergyModule.vue'
  import WarnSetting from './modules/WarnSetting.vue'
  import NoSupport from '@/components/energyModule/noSupport.vue'
  import EnablingView from '@/components/energyModule/EnablingView.vue'
  import enablingEnergy from '@/mixins/enablingEnergy'
  export default {
    name: 'energyMonitor-carbon',
    components: { TotalModule, EnergyModule, WarnSetting, NoSupport, EnablingView },
    mixins: [enablingEnergy],
    data() {
      return {
        tabName: 'total',
        title: '',
        dialogVisible: false,
        maintenanceBoxObj: null,
        tabs: [
          { label: this.$t('electricityCarbonEmissions'), name: 'elec', isSupport: true },
          { label: this.$t('waterCarbonEmissions'), name: 'water', isSupport: true },
          { label: this.$t('gasCarbonEmissions'), name: 'gas', isSupport: false },
          { label: this.$t('heatingCarbonEmissions'), name: 'heating', isSupport: false },
        ],
      }
    },
    methods: {
      handleTabsSelect(e) {
        this.tabName = e
      },
      showWarnSetting() {
        this.$refs.warnSetting.openModel()
      },
    },
    mounted() {},
  }
</script>

<style lang="less">
  .statistics-box {
    .content {
      margin-top: 10px;
      background: transparent;
      position: relative;
      .ivu-tabs-bar {
        margin-bottom: 10px;
      }
    }
    .content .ivu-tabs-nav-scroll {
      background: #1a202e;
      padding: 10px;
      border-radius: 5px;
      font-size: 16px;
    }
  }
</style>
