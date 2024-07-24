<template>
  <div class="map-props">
    <Tabs v-model="tabVal" :animated="false">
      <TabPane :label="$t('drawing')" name="canvas">
        <CanvasProps />
      </TabPane>
      <TabPane :label="$t('global')" name="global">
        <GlobalProps />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import CanvasProps from './CanvasProps.vue'
  import GlobalProps from './GlobalProps.vue'
  export default {
    components: { CanvasProps, GlobalProps },
    data() {
      return {
        tabVal: 'canvas',
      }
    },
  }
</script>

<style lang="less" scoped>
  .map-props {
    height: 100%;
    /deep/.ivu-tabs {
      height: 100%;
      .ivu-tabs-nav {
        margin-left: 16px;
      }
      .ivu-tabs-nav-wrap {
        margin-bottom: 0px;
        border-bottom: 1px solid #424b5f;
      }
      .ivu-tabs-bar {
        margin-bottom: 0px;
      }
      .ivu-tabs-content {
        height: calc(~'100% - 40px');
        overflow: auto;
      }
    }
  }
</style>
