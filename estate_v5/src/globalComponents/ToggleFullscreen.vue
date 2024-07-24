<template>
  <ToggleIcon defaultIcon="icon-v5-quanping" reverseIcon="icon-v5-quanpingshouqi" v-model="fullscreen" @change="toggleFullScreen" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
  export default {
    props: {
      getElement: Function,
    },
    data() {
      return {
        fullscreen: false,
      }
    },
    methods: {
      toggleFullScreen(fullscreen) {
        if (fullscreen) {
          document.addEventListener('fullscreenchange', this.onFullscreenChange)
          const element = this.getElement()
          element.requestFullscreen()
        } else {
          document.exitFullscreen()
        }
      },
      onFullscreenChange() {
        this.fullscreen = !!document.fullscreenElement
        if (!this.fullscreen) {
          document.removeEventListener('fullscreenchange', this.onFullscreenChange)
        }
      },
    },
  }
</script>

<style lang="less" scoped></style>
