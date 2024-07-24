<template>
  <component :is="tag" v-bind="$attrs" @click="onClick" :class="permissionCls">
    <slot />
  </component>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      tag: {
        type: String,
        default: 'Button',
      },
      roKey: {
        type: String,
        required: true,
      },
      grayWithFilter: Boolean,
    },
    computed: {
      ...mapState('pageAuth', ['roKeys']),
      hasPermission() {
        return this.roKeys.includes(this.roKey)
      },
      permissionCls() {
        return {
          gray: this.grayWithFilter && !this.hasPermission,
          'no-permission': !this.hasPermission,
        }
      },
    },
    methods: {
      onClick() {
        if (!this.hasPermission) {
          this.$Message.error(this.$t('noAuth'))
          return
        }
        this.$emit('click')
      },
    },
  }
</script>

<style lang="less" scoped>
  .gray {
    filter: grayscale(1);
  }
</style>
