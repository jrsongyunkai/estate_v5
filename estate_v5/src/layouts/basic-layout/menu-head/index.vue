<template>
  <div class="i-layout-menu-head" :class="{ 'i-layout-menu-head-mobile': isMobile }">
    <Menu mode="horizontal" :active-name="headerName" v-if="!isMobile && !isMenuLimit" ref="menu">
      <template v-for="(item, index) in filterHeader">
        <Submenu v-if="item.children && item.children.length" :name="item.name" :key="index">
          <template slot="title">
            <i-menu-head-title :item="item" />
          </template>
          <MenuItem v-for="subitem in item.children" :to="subitem.path" :replace="subitem.replace" :target="subitem.target" :name="item.name" :key="subitem.path" @click.native="handleClick(subitem.path, 'header')">
            <i-menu-head-title :item="subitem" />
          </MenuItem>
        </Submenu>
        <MenuItem v-else :to="item.path" :replace="item.replace" :target="item.target" :name="item.name" :key="item.path" @click.native="handleClick(item.path, 'header')">
          <i-menu-head-title :item="item" :key="item.path" />
        </MenuItem>
      </template>
    </Menu>
    <div class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in i-layout-header-trigger-no-height" v-else>
      <Dropdown trigger="click" :class="{ 'i-layout-menu-head-mobile-drop': isMobile }">
        <Icon type="ios-apps" />
        <DropdownMenu slot="list">
          <template v-for="(item, index) in filterHeader">
            <template v-if="item.children && item.children.length">
              <DropdownItem class="i-layout-menu-head-mobile-subtitle" disabled :key="index">
                <i-menu-head-title :item="item" />
              </DropdownItem>
              <i-link v-for="subitem in item.children" :to="subitem.path" :replace="subitem.replace" :target="subitem.target" :key="subitem.path" @click.native="handleClick(subitem.path, 'header')">
                <DropdownItem>
                  <i-menu-head-title :item="subitem" />
                </DropdownItem>
              </i-link>
            </template>
            <i-link v-else :to="item.path" :replace="item.replace" :target="item.target" :key="item.path" @click.native="handleClick(item.path, 'header')">
              <DropdownItem>
                <i-menu-head-title :item="item" />
              </DropdownItem>
            </i-link>
          </template>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
</template>
<script>
  import iMenuHeadTitle from './title'
  import { mapState, mapGetters } from 'vuex'
  import { getStyle } from 'view-design/src/utils/assist'
  import clickItem from '../mixins/click-item'
  // import { on, off } from 'view-design/src/utils/dom';
  // import { throttle } from 'lodash';

  export default {
    name: 'iMenuHead',
    components: { iMenuHeadTitle },
    mixins: [clickItem],
    computed: {
      ...mapState('admin/layout', ['isMobile']),
      ...mapState('admin/menu', ['headerName']),
      ...mapGetters('admin/menu', ['filterHeader']),
    },
    data() {
      return {
        handleResize: () => {},
        isMenuLimit: false,
        menuMaxWidth: 0, // 达到这个值后，menu 就显示不下了
      }
    },
    methods: {
      handleGetMenuHeight() {
        const menuWidth = parseInt(getStyle(this.$el, 'width'))
        const $menu = this.$refs.menu
        if ($menu) {
          const menuHeight = parseInt(getStyle(this.$refs.menu.$el, 'height'))
          if (menuHeight > 64) {
            if (!this.isMenuLimit) {
              this.menuMaxWidth = menuWidth
            }
            this.isMenuLimit = true
          }
        } else if (menuWidth >= this.menuMaxWidth) {
          this.isMenuLimit = false
        }
      },
    },
    watch: {
      filterHeader() {
        this.handleGetMenuHeight()
      },
      isMobile() {
        this.handleGetMenuHeight()
      },
    },
    mounted() {
      // this.handleResize = throttle(this.handleGetMenuHeight, 100, { leading: false });
      // on(window, 'resize', this.handleResize);
      this.handleGetMenuHeight()
    },
    beforeDestroy() {
      // off(window, 'resize', this.handleResize);
    },
  }
</script>
