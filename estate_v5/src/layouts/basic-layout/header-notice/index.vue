<template>
  <span class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in" @click="handleSystemPage">
    <span v-show="innerMessage" class="icon-v5 icon-v5-tixing_remind" style="color: #fff"></span>
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
    computed: {
      ...mapState('admin/layout', ['isMobile']),
    },
    destroyed() {
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
