<template>
  <div class="linkageScene">
    <LinkagePro v-if="version === 'pro'" />
    <LinkageOld v-if="version === 'old'" />
    <FirstEnterModal />
  </div>
</template>
<script>
  import LinkagePro from './pro/index.vue'
  import LinkageOld from '../builtInTimer/LinkageScene.vue'
  import FirstEnterModal from './FirstEnterModal.vue'
  import { mapState } from 'vuex'
  export default {
    name: 'multiManage-linkageScene',
    components: {
      LinkagePro,
      LinkageOld,
      FirstEnterModal,
    },
    computed: {
      ...mapState('linkage', ['version']),
    },
  }
</script>
<style lang="less" scoped></style>
