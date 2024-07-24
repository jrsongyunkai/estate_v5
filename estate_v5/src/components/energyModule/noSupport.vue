<template>
  <div class="no-info">
    <div>
      <div style="text-align: center"><img src="@/assets/images/developing.png" alt="" style="width: 300px" /></div>
      <div style="text-align: center; margin-bottom: 100px">{{ $t('noOpenPage') }}</div>
    </div>
  </div>
</template>
<script>
  export default {}
</script>
<style lang="less" scoped>
  .no-info {
    background: #1a202e;
    text-align: center;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 12vh 0px;
  }
</style>
