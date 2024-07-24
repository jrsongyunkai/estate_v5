<template>
  <div class="power-content">
    <Tabs v-model="activeName" :animated="false" name="name" class="content-tab">
      <TabPane :label="$t('electricityUsage')" name="first" tab="name">
        <eletrcDetail v-if="activeName === 'first'"></eletrcDetail>
      </TabPane>
      <TabPane :label="$t('electricityUsageLast2Years')" name="second" tab="name">
        <useEleticModule v-if="activeName === 'second'"></useEleticModule>
      </TabPane>
      <TabPane :label="$t('groupPower')" name="fourth" tab="name">
        <GroupPowerConsumption v-if="activeName === 'fourth'"></GroupPowerConsumption>
      </TabPane>
      <TabPane :label="tabLabel($t('customCombinationPower'), $t('viewCustomCombinationPower'))" name="third" tab="name">
        <Custompower v-if="activeName === 'third'"></Custompower>
      </TabPane>
      <TabPane :label="tabLabel($t('customTimePower'), $t('powerPageTips1'))" name="forth" tab="name">
        <CustomLoopPower v-if="activeName === 'forth'" />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import eletrcDetail from './eletrcDetail.vue'
  import Custompower from './CustompowerCombination.vue'
  import useEleticModule from './modules/useEleticModule.vue'
  import CustomLoopPower from './CustomLoopPower'
  import GroupPowerConsumption from './GroupPowerConsumption'
  export default {
    name: 'energyMonitor-power',
    components: { eletrcDetail, useEleticModule, Custompower, CustomLoopPower, GroupPowerConsumption },
    data() {
      return {
        activeName: 'first',
      }
    },
    methods: {
      tabLabel: (title, tips) => {
        return h => h('div', [h('span', title), h('Tooltip', { props: { transfer: true, content: tips } }, [h('Icon', { props: { type: 'ios-information-circle-outline', color: '#1497db' } })])])
      },
    },
  }
</script>
<style lang="less" scoped>
  .power-content {
    height: 100%;
    /deep/ .content-tab > .ivu-tabs-bar {
      margin-bottom: 10px;
      .ivu-tabs-nav-scroll {
        background: #1a202e;
        padding: 10px;
        border-radius: 5px;
        font-size: 16px;
      }
    }
  }
  .active {
    width: 10px;
    height: 10px;
    margin-top: 3px;
    margin-right: 5px;
  }
  .active1 {
    margin-left: 40px;
    background: #0dd667;
  }
  .active2 {
    background: #1c57ff;
    margin-left: 35px;
  }
</style>
