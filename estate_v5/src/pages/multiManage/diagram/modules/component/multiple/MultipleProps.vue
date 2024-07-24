<template>
  <div class="multiple-props">
    <Tabs v-model="tabVal" :animated="false">
      <TabPane :label="$t('style')" name="appearance">
        <AppearanceProps />
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
  import AppearanceProps from './AppearanceProps.vue'
  export default {
    components: { AppearanceProps },
    data() {
      return { tabVal: 'appearance' }
    },
  }
</script>

<style lang="less" scoped>
  .multiple-props {
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
