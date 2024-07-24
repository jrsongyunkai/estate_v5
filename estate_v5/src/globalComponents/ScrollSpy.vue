<template>
  <Row :wrap="false">
    <Col :flex="navigationFlexBasis">
      <div class="navigation" :style="{ width: navigationWidth + 'px', height: navigationHeight }">
        <div v-for="(item, idx) in innerNavigationList" :key="item.text" class="navigation-item" :class="{ 'navigation-item-active': idx === activeIndex }" @click="scrollIntoView(idx)">
          <slot name="navigationItem" :item="item" :index="idx" />
          <template v-if="!$scopedSlots.navigationItem">
            <div class="circle">{{ idx + 1 }}</div>
            <div class="text">{{ item.text }}</div>
          </template>
        </div>
      </div>
    </Col>
    <Col flex="auto" ref="content" style="overflow: hidden">
      <slot name="default"></slot>
    </Col>
  </Row>
</template>

<script>
  export default {
    name: 'ScrollSpy',
    props: {
      navigationWidth: {
        type: Number,
        default: 200,
      },
      navigationHeight: {
        type: String,
        default: 'calc(100vh - 140px)',
      },
      navigationList: {
        type: Array,
        required: true,
      },
      threshold: {
        type: Number,
        default: 0,
      },
      defaultActiveIndex: {
        type: Number,
        default: 0,
      },
      scrollMode: {
        type: String,
        default: 'window', // window or parent
      },
    },
    computed: {
      navigationFlexBasis() {
        return `${this.navigationWidth + 10}px`
      },
      innerNavigationList() {
        return this.navigationList.map(item => {
          return {
            text: item.text || item,
            threshold: item.threshold || this.threshold,
          }
        })
      },
    },
    data() {
      return {
        activeIndex: this.defaultActiveIndex,
      }
    },
    mounted() {
      this.updateConfig()
      this.watchResize()
      this.scrollContainer = this.scrollMode === 'window' ? window : this.$el.parentElement
      this.scrollContainer.addEventListener('scroll', this.handleScroll)
      this.scrollIntoView(this.activeIndex)
    },
    beforeDestroy() {
      this.scrollContainer.removeEventListener('scroll', this.handleScroll)
      this.unwatchResize()
    },
    methods: {
      watchResize() {
        this.observer = new ResizeObserver(this.updateConfig)
        Array.from(this.$refs.content.$el.children).forEach(item => this.observer.observe(item))
      },
      unwatchResize() {
        this.observer.disconnect()
      },
      updateConfig() {
        this.offsets = Array.from(this.$refs.content.$el.children).map((item, idx) => {
          const { threshold } = this.innerNavigationList[idx] || { threshold: 0 }
          return item.offsetTop - threshold
        })
      },
      handleScroll() {
        const scrollTop = 'scrollTop' in this.scrollContainer ? this.scrollContainer.scrollTop : this.scrollContainer.scrollY
        const activeIndex = this.offsets.findIndex((offset, index) => {
          const nextOffset = this.offsets[index + 1]
          return scrollTop >= offset && (!nextOffset || scrollTop < nextOffset)
        })
        this.activeIndex = activeIndex
      },
      scrollIntoView(idx, smooth = true) {
        const top = this.offsets[idx]
        this.scrollContainer.scrollTo({
          top,
          behavior: smooth ? 'smooth' : 'instant',
        })
      },
    },
  }
</script>

<style lang="less" scoped>
  .navigation {
    position: fixed;
    --active-color: #1882e5;
    background: #1a202e;
    border-radius: 5px;
    padding: 20px;
    .navigation-item {
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      height: 50px;
      padding: 0 10px;
      margin-bottom: 25px;
      .circle {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 20px;
        text-align: center;
        line-height: 30px;
        background: #999;
        flex-shrink: 0;
      }
      &.navigation-item-active {
        .circle {
          background: var(--active-color);
        }
        .text {
          color: var(--active-color);
        }
      }
      &::after {
        content: '';
        position: absolute;
        left: 25px;
        top: 100%;
        height: 25px;
        width: 1px;
        background: #1882e5;
      }
      &:last-child {
        margin-bottom: 0;
        &::after {
          display: none;
        }
      }
    }
  }
</style>
