<template>
  <div class="page">
    <div class="page-header">
      <Button type="text" style="font-size: 20px" ghost icon="ios-arrow-back" @click="$router.push(pathUrl)"></Button>
      <span class="ml-10">{{ $t('globalConfiguration') }}</span>
    </div>
    <div class="page-content">
      <settings></settings>
    </div>
  </div>
</template>
<script>
  import settings from '../setting/userInfo/index.vue'
  export default {
    components: {
      settings,
    },
    data() {
      return {
        pathUrl: '',
      }
    },
    mounted() {
      let routerArr = this.$store.state.lacation.split('/')
      if (routerArr.length === 4) {
        this.pathUrl = `${routerArr[3]}`
      } else if (routerArr.length === 5) {
        this.pathUrl = `/${routerArr[3]}/${routerArr[4]}`
      }
    },
    methods: {},
  }
</script>

<style lang="less" scoped>
  .page {
    width: 100vw;
    .page-header {
      height: 50px;
      display: flex;
      align-items: center;
      background: #1a202e;
      width: 100%;
      padding: 0px 20px;
      font-size: 16px;
    }
    .page-content {
      height: calc(~'100vh - 50px');
      width: 100vw;
      padding: 10px;
    }
  }
</style>
