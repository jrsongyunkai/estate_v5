<template>
  <div class="configuration-props">
    <Split v-model="splitSpan" mode="vertical">
      <template #top>
        <MapProps v-if="$store.state.diagram.activePenIds.length === 0" />
        <PenProps v-else-if="$store.state.diagram.activePenIds.length === 1" />
        <MultipleProps v-else-if="$store.state.diagram.activePenIds.length > 1" />
      </template>
      <template #bottom>
        <ConfigurationStructure ref="configurationStructure" />
      </template>
      <template #trigger>
        <div class="split-line"></div>
      </template>
    </Split>
  </div>
</template>

<script>
  import ConfigurationStructure from './ConfigurationStructure.vue'
  import MapProps from './map/MapProps.vue'
  import PenProps from './pen/PenProps.vue'
  import MultipleProps from './multiple/MultipleProps.vue'

  export default {
    components: { ConfigurationStructure, MapProps, PenProps, MultipleProps },
    data() {
      return {
        splitSpan: 0.8,
        activePen: false,
        multiPen: false,
      }
    },
    methods: {
      updateTree() {
        this.$refs.configurationStructure.updateTree()
      },
    },
    mounted() {},
  }
</script>

<style lang="less" scoped>
  .configuration-props {
    height: 100%;
    width: 100%;
    .split-line {
      width: 100%;
      border-top: 1px solid #424b5f;
      display: flex;
      justify-content: center;
      cursor: n-resize;
    }
    /deep/.ivu-form-item {
      margin-bottom: 0px;
    }
  }
</style>
