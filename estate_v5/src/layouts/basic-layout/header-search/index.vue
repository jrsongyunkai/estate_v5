<template>
  <span v-if="isDesktop" class="i-layout-header-trigger i-layout-header-trigger-min i-layout-header-trigger-in i-layout-header-trigger-nohover">
    <Dropdown @on-click="handleSelect" trigger="click">
      <input class="i-layout-header-search" v-model="message" type="text" :placeholder="$t('search')" />
      <DropdownMenu slot="list">
        <DropdownItem v-for="(item, index) in matchedOptions" :key="index" :name="item.projectCode" :title="item.projectName">{{ item.projectName }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </span>
  <span v-else class="i-layout-header-trigger i-layout-header-trigger-min">
    <Dropdown trigger="click" class="i-layout-header-search-drop" ref="dropdown">
      <Icon type="ios-search" />
      <DropdownMenu slot="list">
        <div class="i-layout-header-search-drop-main">
          <Input size="large" prefix="ios-search" type="text" :placeholder="$t('search')" />
          <span class="i-layout-header-search-drop-main-cancel" @click="handleCloseSearch">{{ $t('cancel') }}</span>
        </div>
      </DropdownMenu>
    </Dropdown>
  </span>
</template>
<script>
  import store from '@/store/index'
  import { mapState } from 'vuex'
  import { switchHover } from '@/api/index'
  import { projectIndexDB } from '@/plugins/indexDB/index'
  // import { checkMenuEnable } from '@/api/public'
  export default {
    name: 'iHeaderSearch',
    data() {
      return {
        optionShow: false,
        message: '',
        checkedProjectStr: [],
      }
    },
    computed: {
      ...mapState('admin/layout', ['isDesktop', 'headerMenu']),
      matchedOptions() {
        if (this.message !== '') {
          return this.checkedProjectStr.filter(item => item.projectName.indexOf(this.message) > -1)
        } else {
          return this.checkedProjectStr
        }
      },
    },
    created() {},
    mounted() {
      this.init()
    },
    methods: {
      init() {
        projectIndexDB.getItem('checkedProjectStr').then(res => {
          this.checkedProjectStr = JSON.parse(res)
        })
      },
      handleCloseSearch() {
        this.$refs.dropdown.handleClick()
      },
      async handleSelect(item) {
        let params = { projectCode: item }
        const res = await switchHover(params)
        if (res.success) {
          store.commit('projectCode', item)
          store.commit('fullName', item.projectName)
          store.commit('equipmentType', 1)
          store.commit('overviewMac', '')
          store.commit('distributionDateType', 1)
          store.commit('prjName', res.data.prjName)
          store.commit('prjTitle', res.data.prjTitle)
          store.commit('admin/page/keepAliveClean')
          this.handleReload()
          this.$router.push({ path: '/console/project' })
          store.commit('showMenus', Math.random())
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleReload() {
        this.$emit('on-reload')
      },
    },
  }
</script>
<style lang="less" scoped>
  .i-layout-header-trigger {
    ul {
      list-style: none;
      height: 280px;
      width: 252px;
      overflow-y: scroll;
      position: relative;
      border-radius: 10px;
      scrollbar-width: none;
      &::-webkit-scrollbar {
        display: none;
      }
      .ivu-dropdown-item {
        padding: 10px;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: background 0.2s ease-in-out;
        &:hover {
          background: #2c2c2e;
        }
      }
    }
  }
</style>
