<template>
  <div class="biz-modal-context">
    <slot />
    <div v-for="(item, index) in bizModalStack" :key="item.id">
      <component :is="item.component" v-model="item.visible" v-bind="item.props" v-on="item.on" @on-hidden="closeBizModal(index)" />
    </div>
  </div>
</template>

<script>
  let modalId = 1

  export default {
    data() {
      return {
        bizModalStack: [],
      }
    },
    provide() {
      return {
        openBizModal: this.openBizModal,
        top: this.top,
      }
    },
    methods: {
      openBizModal(component, options = {}) {
        this.bizModalStack.push({
          id: ++modalId,
          component,
          visible: false,
          ...options,
        })
        this.$nextTick(() => {
          this.$set(this.bizModalStack.at(-1), 'visible', true)
        })
      },
      closeBizModal(index) {
        this.bizModalStack.splice(index, 1)
      },
      top() {
        return this.bizModalStack.at(-1) || null
      },
    },
  }
</script>

<style lang="less" scoped>
.biz-modal-context {
  height: 100%;
}
</style>
