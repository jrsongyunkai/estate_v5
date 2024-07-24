<template>
  <div class="contextmenu" v-show="visible" :style="style" ref="contextmenu">
    <div class="contextmenu-list" @click.stop="handleClick">
      <template v-for="(item, index) of menuList">
        <div v-if="item.type === 'menu-item'" :key="item.value" :class="{ disabled: item.disabled }" :style="{ display: item.visible ? 'flex' : 'none' }" :data-value="item.value" class="contextmenu-item">
          <i v-if="item.icon" :class="`${item.icon}`" />
          <div class="contextmenu-item-title">{{ item.title }}</div>
          <span class="shortcut-key">{{ item.shortcut }}</span>
        </div>
        <div v-if="item.type === 'split-line'" :key="index" class="split-line"></div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      visible: { type: Boolean, default: false },
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      menuList: { type: Array, default: () => [] },
    },
    data() {
      return {}
    },
    computed: {
      style() {
        return {
          left: this.x + 'px',
          top: this.y + 'px',
          display: this.visible ? 'block' : 'none',
        }
      },
    },
    methods: {
      watchContextmenu(event) {
        if ((this.$refs.contextmenu && !this.$refs.contextmenu.contains(event.target)) || event.button !== 0) {
          this.visible = false
        }
        window.removeEventListener('mousedown', this.watchContextmenu)
      },
      handleClick(event) {
        let el = event.target
        while (!el.dataset.value) {
          el = el.parentNode
        }
        const menu = this.menuList.find(m => {
          return m.value === el.dataset.value
        })
        if (menu && menu.disabled) return
        this.$emit('menuClick', el.dataset.value)
      },
    },
    mounted() {
      document.querySelector('body').appendChild(this.$refs.contextmenu)
    },
  }
</script>

<style lang="less" scoped>
  .contextmenu {
    position: absolute;
    padding: 5px 0;
    z-index: 3018;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .contextmenu-list {
      .contextmenu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 20px 8px 15px;
        margin: 0;
        font-size: 12px;
        color: #000000d9;
        cursor: pointer;
        min-width: 200px;
        user-select: none;
        &:hover {
          background: #f5f5f5;
          color: #000000d9;
        }
        &.disabled {
          background: #fff;
          color: #00000040;
          cursor: not-allowed;
        }
        .t-icon {
          font-size: 12px;
        }
        .contextmenu-item-title {
          flex: 1;
          margin-left: 10px;
        }
        .shortcut-key {
          flex: 0 50px;
          text-align: right;
        }
      }
      .split-line {
        height: 0px;
        width: 100%;
        border-top: 1px solid #f0f0f0;
      }
    }
  }
</style>
