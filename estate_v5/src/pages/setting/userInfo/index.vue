<template>
  <div class="setting-box">
    <div style="padding: 16px" class="left">
      <CellGroup @on-click="handleChangeCell">
        <Cell :title="this.$t('baseinfo')" name="baseinfo" :selected="currentType === 'baseinfo'" />
        <Cell :title="this.$t('alarmConfig')" name="safety" :selected="currentType === 'safety'" />
        <Cell :title="this.$t('alarmReciverMgt')" name="recipient" :selected="currentType === 'recipient'" />
        <Cell :title="this.$t('concatAccount')" name="account" :selected="currentType === 'account'" />
        <Cell :title="this.$t('menuConfig')" name="monitor" :selected="currentType === 'monitor'" />
        <Cell :title="this.$t('neutral')" name="neutral" :selected="currentType === 'neutral'" />
      </CellGroup>
    </div>
    <div class="right">
      <div style="padding: 16px">
        <baseinfo v-if="currentType === 'baseinfo'" />
        <safety v-if="currentType === 'safety'" />
        <recipientManage v-if="currentType === 'recipient'" />
        <account v-if="currentType === 'account'" />
        <monitor v-if="currentType === 'monitor'" />
        <neutral v-if="currentType === 'neutral'" />
        <!-- <setAdress  v-if="currentType === 'setAdress'"  /> -->
        <!-- <notification v-if="currentType === 'notification'" /> -->
        <!-- <configurings v-if="currentType === 'configurings'" />
          <ProjectAlarmModification
            v-if="currentType === 'ProjectAlarmModification'"
          /> -->
      </div>
    </div>
  </div>
</template>
<script>
  import baseinfo from './baseinfo'
  import account from './account.vue'
  import safety from './safety.vue'
  import monitor from './monitor.vue'
  import neutral from './neutral.vue'
  import recipientManage from './recipientManage.vue'
  import store from '@/store'
  import { queryAlarmForConfig } from '@/api/public'
  export default {
    name: 'setting-userInfo',
    components: { baseinfo, account, safety, monitor, neutral, recipientManage },
    data() {
      return {
        currentType: 'baseinfo',
      }
    },
    mounted() {
      this.queryConfig()
    },
    methods: {
      handleChangeCell(name) {
        this.currentType = name
      },
      async queryConfig() {
        const res = await queryAlarmForConfig()
        if (!res.success) {
          return this.$Message.error(res.message)
        }
        store.commit('alarmForConfig', res.data.alarms.concat(res.data.warns))
      },
    },
  }
</script>
<style lang="less" scoped>
  .setting-box {
    display: flex;
    width: 100%;
    height: 100%;
    .left {
      width: 240px;
      margin-right: 10px;
      background: #1a202e;
      height: 100%;
    }
    .right {
      flex: calc(~'100% - 250px');
      height: 100%;
      background: #1a202e;
      overflow-y: auto;
    }
  }
</style>
