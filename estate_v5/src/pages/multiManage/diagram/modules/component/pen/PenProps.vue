<template>
  <div class="pen-props">
    <Tabs v-model="tabVal" :animated="false">
      <TabPane :label="$t('style')" name="appearance">
        <AppearanceProps v-if="tabVal === 'appearance'" :activePen="activePen" :key="keyId" />
      </TabPane>
      <TabPane :label="$t('event2')" name="event">
        <EventProps v-if="tabVal === 'event'" :activePen="activePen" :key="keyId" />
      </TabPane>
      <TabPane :label="$t('animation2')" name="animation">
        <AnimationProps v-if="tabVal === 'animation'" :activePen="activePen" :key="keyId" />
      </TabPane>
      <TabPane :label="$t('data')" name="data" v-if="activePen && (activePen.name === 'text' || (activePen.tag === this.$t('ns_iconGroups.lowVoltageApparatus') && activePen.name === 'combine'))">
        <DataProps v-if="tabVal === 'data'" :activePen="activePen" />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import AppearanceProps from './AppearanceProps.vue'
  import EventProps from './EventProps.vue'
  import AnimationProps from './AnimationProps.vue'
  import DataProps from './DataProps.vue'
  export default {
    components: { AppearanceProps, EventProps, AnimationProps, DataProps },
    data() {
      return {
        tabVal: 'appearance',
        activePen: null,
        keyId: null,
      }
    },
    mounted() {},
    watch: {
      '$store.state.diagram.activePenIds': {
        handler(value) {
          if (window.meta2d) {
            this.activePen = window.meta2d.findOne(value[0])
            this.keyId = value[0]
          }
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .pen-props {
    height: 100%;
    /deep/.ivu-tabs-ink-bar {
      bottom: 0;
    }
    /deep/.ivu-tabs-nav {
      margin-left: 16px;
      .ivu-tabs-tab {
        padding: 8px 2px;
      }
    }
    /deep/.ivu-tabs {
      height: 100%;
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
