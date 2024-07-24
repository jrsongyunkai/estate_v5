<template>
  <Modal v-model="inspectionFlag" footer-hide :title="$t('equipmentPatrolRecord')" :mask="false">
    <div style="margin: 10px 20px">
      <InspectionDevice ref="inspection" v-if="inspectionFlag" :inspectionData="inspectionData" :titleFlag="false"></InspectionDevice>
    </div>
  </Modal>
</template>

<script>
  import InspectionDevice from '@/pages/Common/InspectionDevice.vue'
  export default {
    components: { InspectionDevice },
    data() {
      return {
        inspectionFlag: false,
        inspectionData: { projectCode: '', macs: '' },
      }
    },
    methods: {
      openModel(row) {
        this.inspectionData = { projectCode: row.projectCode, macs: row.mac }
        this.inspectionFlag = true
      },
    },
  }
</script>

<style></style>
