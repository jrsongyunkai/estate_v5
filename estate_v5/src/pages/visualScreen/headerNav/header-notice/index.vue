<template>
  <span class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in" @click="handleSystemPage">
    <img v-show="innerMessage" src="../../../../assets/images/icon_nav_visNotice.png"  alt="" />
  </span>
</template>
<script>
  import { mapState } from 'vuex'
  import store from '@/store/index'
  export default {
    name: 'iHeaderNotice',
    data() {
      return {
        badgeProps: {
          offset: [20, 0],
        },
        innerMessage: this.$store.state.innerMessage,
      }
    },
    methods: {
      handleSystemPage() {
        this.$router.push({ path: '/news' })
        store.commit('innerMessage', !this.$store.state.innerMessage)
      },
    },
    created() {},
    computed: {
      ...mapState('admin/layout', ['isMobile']),
    },
    destroyed() {
      // 页面毁坏后
      clearInterval(this.time)
    },
    watch: {
      $route(to, from) {
        if (to.path === '/News') this.innerMessage = 'false'
      },
      '$store.state.innerMessage': {
        handler(newVal, oldVal) {
          this.innerMessage = newVal
          if (newVal) {
            this.time = setInterval(() => {
              this.innerMessage = !this.innerMessage
            }, 500)
          } else {
            clearTimeout(this.time)
            this.innerMessage = true
          }
        },
      },
    },
  }
</script>

<style lang="less" scoped></style>
