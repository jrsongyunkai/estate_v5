<template>
  <div class="footer">
    <GlobalFooter class="i-copyright" :copyright="copyright" />
    <span style="margin-right: 5px" v-if="loginObj.loginPageCopyRight" :style="`color:${loginObj.loginPageCopyRight.color};font-size:${loginObj.loginPageCopyRight.size}`">{{ loginObj.loginPageCopyRight.text }}</span>
    <div class="links" v-if="loginObj.loginPageIcpNumber">
      <a :href="miit" target="_blank" :style="`color:${loginObj.loginPageIcpNumber.color};font-size:${loginObj.loginPageIcpNumber.size}`">{{ loginObj.loginPageIcpNumber.text }}</a>
    </div>
    <span class="v6">
      {{ $t('currentEdition') }}
      <span class="edition">{{ version }}</span>
    </span>
  </div>
</template>
<script>
  import Setting from '@/setting'
  export default {
    props: {
      loginObj: {
        type: Object,
      },
    },
    name: 'i-copyright',
    data() {
      return {
        miit: 'https://beian.miit.gov.cn',
        copyright: '',
        obj: '',
        version: Setting.version,
      }
    },
    mounted() {},
    methods: {},
  }
</script>
<style lang="less">
  a {
    color: inherit;
  }
  .footer {
    display: flex;
    justify-content: center;
    height: 40px;
    line-height: 40px;
  }
  .i-copyright {
    &-hidden {
      display: none;
    }
  }
  .ivu-global-footer {
    margin: 0 !important;
    padding: 0 !important;
  }
  .ivu-global-footer-copyright,
  .links {
    color: #808695 !important;
    font-size: 14px;
  }
  .v6 {
    margin: 0 5px;
    color: #808695;
  }
  .edition {
    color: #1054ff;
  }
</style>
