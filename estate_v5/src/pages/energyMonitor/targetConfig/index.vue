<template>
  <div style="width: 100%" v-if="isOverLoad">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="getConfigValue" />
    <EnergySources v-else />
  </div>
</template>

<script>
  import EnablingView from '@/components/energyModule/EnablingView.vue'
  import EnergySources from './modules/EnergySources.vue'
  import enablingEnergy from '@/mixins/enablingEnergy'
  export default {
    name: 'energyMonitor-targetConfig',
    components: { EnablingView, EnergySources },
    mixins: [enablingEnergy],
  }
</script>
