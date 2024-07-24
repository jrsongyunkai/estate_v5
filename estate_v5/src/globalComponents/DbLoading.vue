<template>
  <div class="container">
    <img src="@/assets/images/db-loading.gif" alt="" class="db-loading" v-show="loading" />
    <slot></slot>
  </div>
</template>
<script>
  export default {
    props: ['loading'],
    data: () => ({}),
  }
</script>
<style scoped lang="less">
  .container {
    position: relative;
    .db-loading {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      transform: scale(0.45);
      z-index: 999;
    }
  }
</style>
