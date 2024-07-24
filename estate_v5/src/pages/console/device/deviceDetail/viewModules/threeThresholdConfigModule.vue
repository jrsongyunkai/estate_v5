<template>
  <div class="threeThresholdConfig">
    <div class="left">
      <LinesSelectView ref="LinesSelectViewRef" @nodeClick="nodeClick"></LinesSelectView>
    </div>
    <div class="right">
      <ThreeThresholdTable :addrInfo="addrInfo"></ThreeThresholdTable>
    </div>
  </div>
</template>

<script>
  import LinesSelectView from './modulesSubView/LinesSelectView.vue'
  import ThreeThresholdTable from './component/ThreeThresholdTable.vue'
  export default {
    components: {
      LinesSelectView,
      ThreeThresholdTable,
    },
    data() {
      return {
        addrInfo: {},
      }
    },
    methods: {
      nodeClick(info) {
        this.addrInfo = info
      },
    },
  }
</script>

<style lang="less" scoped>
  .threeThresholdConfig {
    height: 100%;
    display: flex;
    .left {
      width: 300px;
      height: 100%;
      padding: 15px 10px;
      background: #1a202e;
      margin-right: 10px;
    }
    .right {
      background: #1a202e;
      flex: 1;
      padding: 10px;
    }
  }
</style>
