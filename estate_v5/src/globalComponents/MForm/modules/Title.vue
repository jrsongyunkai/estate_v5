<template>
  <div class="title-content">
    {{ title }}
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: window.$t('title'),
      },
    },
    data() {
      return {}
    },
  }
</script>
<style lang="less" scoped>
  .title-content {
    line-height: 1em;
    height: 1em;
    padding-left: 10px;
    border-left: 3px solid #007eff;
  }
</style>
