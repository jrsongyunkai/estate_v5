<template>
  <span class="i-layout-header-trigger i-layout-header-trigger-min" style="display: flex; align-items: center">
    <Avatar size="small" :src="user" style="min-width: 24px" />
    <Dropdown :trigger="isMobile ? 'click' : 'hover'" class="i-layout-header-user" :class="{ 'i-layout-header-user-mobile': isMobile }" @on-click="handleClick">
      <span class="i-layout-header-user-name" v-if="!isMobile">
        <div class="scroll_box pointer" v-textRoll>
          {{ $store.state.realName }}
        </div>
      </span>
      <DropdownMenu slot="list">
        <i-link to="/settingConfig">
          <DropdownItem>
            <Icon custom="icon-v5 icon-v5-shezhi" />
            <span>{{ $t('setting') }}</span>
          </DropdownItem>
        </i-link>
        <i-link to="/Logs">
          <DropdownItem>
            <Icon type="md-radio-button-on" />
            <span>{{ $t('operationLog') }}</span>
          </DropdownItem>
        </i-link>

        <DropdownItem name="feedback">
          <Icon custom="icon-v5 icon-v5-fankui" />
          <span>{{ $t('needFeedback') }}</span>
        </DropdownItem>

        <DropdownItem divided name="logout">
          <Icon type="ios-log-out" />
          <span>{{ $t('logout') }}</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </span>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import { findStaffInfo } from '@/api/public'
  import store from '@/store/index'
  export default {
    name: 'iHeaderUser',
    components: {},
    computed: {
      ...mapState('admin/user', ['info']),
      ...mapState('admin/layout', ['isMobile', 'logoutConfirm']),
    },
    data() {
      return {
        user: require('../../../assets/images/user.png'),
      }
    },
    methods: {
      ...mapActions('admin/account', ['logout']),
      handleClick(name) {
        store.commit('lacation', window.location.href)
        if (name === 'logout') {
          this.logout({
            confirm: this.logoutConfirm,
            vm: this,
          }).then(res => {
            let storage = window.sessionStorage
            storage.removeItem('realName')
          })
        }
        if (name === 'feedback') {
          this.$emit('feedback', true)
        }
      },
      handlePassword() {
        findStaffInfo()
          .then(res => {
            if (res.success) {
              this.user = res.data.iconUrl
              store.commit('staffName', res.data.loginName)
              store.commit('realName', res.data.realName)
              store.commit('mobile', res.data.mobile)
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
      },
    },
    mounted() {
      this.handlePassword()
    },
    created() {},
  }
</script>
<style lang="less" scoped>
  // .i-layout-header-user{
  //    white-space:nowrap;
  //    text-overflow: ellipsis;
  //    overflow: hidden;
  // }
  /deep/.ivu-dropdown-rel {
    display: flex;
  }
  .scroll_box {
    width: 100px;
  }
  .ivu-dropdown-item {
    width: 150px;
  }
</style>
