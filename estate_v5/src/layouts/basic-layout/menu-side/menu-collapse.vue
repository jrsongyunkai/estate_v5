<template>
  <Dropdown :transfer="false" placement="right-start" :class="dropdownClasses">
    <div :class="menuItemClasses" v-if="topLevel">
      <i-menu-side-title :menu="menu" hide-title collapse />
    </div>
    <DropdownItem v-else>
      <i-menu-side-title :menu="menu" :selected="openNames.indexOf(menu.path) >= 0" collapse />
      <Icon type="ios-arrow-forward" class="i-layout-menu-side-arrow" />
    </DropdownItem>
    <DropdownMenu slot="list">
      <div class="i-layout-menu-side-collapse-title" v-if="showCollapseMenuTitle">
        <i-menu-side-title :menu="menu" collapse />
      </div>
      <template v-for="(item, index) in menu.children">
        <i-link :to="item.path" :target="item.target" v-if="item.children === undefined || !item.children.length" :key="index" @click.native="handleClick(item.path)">
          <DropdownItem :divided="item.divided" :class="{ 'i-layout-menu-side-collapse-item-selected': item.path === activePath }">
            <i-menu-side-title :menu="item" collapse />
          </DropdownItem>
        </i-link>
        <i-menu-side-collapse v-else :menu="item" :key="index" />
      </template>
    </DropdownMenu>
  </Dropdown>
</template>
<script>
  import iMenuSideTitle from './menu-title'
  import clickItem from '../mixins/click-item'
  import { mapState } from 'vuex'
  export default {
    name: 'iMenuSideCollapse',
    components: { iMenuSideTitle },
    mixins: [clickItem],
    props: {
      menu: {
        type: Object,
        default() {
          return {}
        },
      },
      // 是否是第一级，区分在于左侧和展开侧
      topLevel: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState('admin/layout', ['siderTheme', 'showCollapseMenuTitle']),
      ...mapState('admin/menu', ['activePath', 'openNames']),
      dropdownClasses() {
        return {
          'i-layout-menu-side-collapse-top': this.topLevel,
          'i-layout-menu-side-collapse-dark': this.siderTheme === 'dark',
        }
      },
      menuItemClasses() {
        return [
          'ivu-menu-item i-layout-menu-side-collapse-top-item',
          {
            'ivu-menu-item-selected ivu-menu-item-active': this.openNames.indexOf(this.menu.path) >= 0, // -active 在高亮时，有背景
          },
        ]
      },
    },
  }
</script>
