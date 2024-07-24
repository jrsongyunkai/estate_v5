<template>
  <img src="@/assets/images/zanwu.png" alt="" class="no-access" @click="$Message.error($t('cameraNoVideoSource'))" />
</template>

<script></script>

<style lang="less" scoped>
  .no-access {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
