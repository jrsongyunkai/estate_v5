<template>
  <div class="i-layout-header-trigger i-layout-header-trigger-min">
    <Dropdown :trigger="isMobile ? 'click' : 'hover'" class="i-layout-header-i18n" transfer-class-name="vis-Drop-down" :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
      <img src="../../../../assets/images/icon_nav_visLang.png" style="margin-top: 6px" alt="" />
      <DropdownMenu slot="list">
        <DropdownItem v-for="(item, key) in languages" :key="key" :name="key" :selected="locale === key">
          <span>{{ item.language }}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
  import util from '@/libs/util'
  import Languages from '@/i18n/locale'
  import { mapState, mapActions } from 'vuex'
  import store from '@/store/index'

  export default {
    inject: ['reload'],
    name: 'iHeaderI18n',
    data() {
      return {
        muneArray: '',
        dataList: [],
        languages: Languages,
      }
    },
    computed: {
      ...mapState('admin/i18n', ['locale']),
      ...mapState('admin/layout', ['isMobile']),
    },
    methods: {
      ...mapActions('admin/i18n', ['setLocale']),
      handleClick(locale) {
        window.sessionStorage.setItem('localeSwitch', true)
        // store.commit('localeSwitch', true)
        if (locale === this.locale) return
        this.setLocale({ locale, vm: this })
        store.commit('locale', locale)
        if (document.location.pathname === '/login' || document.location.pathname === '/visualScreen') {
          this.$func.setCookie('lang', locale)
          setTimeout(() => {
            location.reload()
          }, 1000)
        }
        if (document.location.pathname !== '/login') {
          util.cookies.remove('lang')
          util.cookies.set('lang', locale)
          //  this.handleQueryShowMenus()
          setTimeout(() => {
            location.reload()
          }, 1000)
        }
      },
    },
  }
</script>
<style lang="less" scoped>
  a {
    color: #989aa1;
  }
  .goingGo {
    cursor: pointer;
    margin-right: 20px;
  }
  .ivu-dropdown {
    color: #333;
  }
  /deep/.ivu-select-dropdown {
    position: absolute;
    left: 0;
  }
  .i-layout-header-trigger:hover {
    background: transparent;
  }
  .i-layout-header-trigger-min i {
    color: #fff;
  }
</style>
