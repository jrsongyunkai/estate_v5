<template>
  <div ref="el" v-bind="$attrs" @mousedown="moveStart" @click="onClick" :style="btnStyle">
    <slot />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        shouldEmitClick: true,
        dragData: {
          x: null,
          y: null,
          dragX: null,
          dragY: null,
          dragging: false,
          rect: null,
        },
      }
    },
    computed: {
      btnStyle() {
        let style = {}

        if (this.dragData.x !== null) {
          style.left = `${this.dragData.x}px`
          style.right = 'auto'
        }
        if (this.dragData.y !== null) {
          style.top = `${this.dragData.y}px`
          style.bottom = 'auto'
        }

        return style
      },
    },
    methods: {
      onClick() {
        if (!this.shouldEmitClick) {
          return
        }
        this.$emit('click')
      },
      moveStart(event) {
        this.shouldEmitClick = true

        const rect = this.$refs.el.getBoundingClientRect()
        this.dragData.rect = rect
        this.dragData.x = rect.x || rect.left
        this.dragData.y = rect.y || rect.top

        const distance = {
          x: event.clientX,
          y: event.clientY,
        }

        this.dragData.dragX = distance.x
        this.dragData.dragY = distance.y

        this.dragData.dragging = true

        document.addEventListener('mousemove', this.move)
        document.addEventListener('mouseup', this.moveEnd)
      },
      move(event) {
        if (!this.dragData.dragging) return false

        this.shouldEmitClick = false
        document.body.style.userSelect = 'none'

        const distance = {
          x: event.clientX,
          y: event.clientY,
        }

        const diffDistance = {
          x: distance.x - this.dragData.dragX,
          y: distance.y - this.dragData.dragY,
        }

        const w = document.documentElement.clientWidth
        const h = document.documentElement.clientHeight

        this.dragData.x += diffDistance.x
        this.dragData.y += diffDistance.y
        const { width, height } = this.dragData.rect
        if (this.dragData.x < 0) {
          this.dragData.x = 0
        }
        if (this.dragData.x > w - width) {
          this.dragData.x = w - width
        }
        if (this.dragData.y < 0) {
          this.dragData.y = 0
        }
        if (this.dragData.y > h - height) {
          this.dragData.y = h - height
        }
        this.dragData.dragX = distance.x
        this.dragData.dragY = distance.y
      },
      moveEnd() {
        document.body.style.userSelect = 'auto'
        document.removeEventListener('mousemove', this.move)
        document.removeEventListener('mouseup', this.moveEnd)
      },
    },
  }
</script>

<style lang="less" scoped></style>
