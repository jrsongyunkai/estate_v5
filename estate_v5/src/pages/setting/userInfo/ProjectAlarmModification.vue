<template>
  <div class="systemBody">
    <div>
      <PageHeader :title="$t('alarmConfig1')" />
      <ProjectAlarmTable :data="alarmList" height="520" />
    </div>
    <div>
      <PageHeader :title="$t('warningConfig')" />
      <ProjectAlarmTable :data="warningList" height="520" />
    </div>
    <Button @click="saveConfig" type="primary" class="mt-10">{{ $t('save') }}</Button>
  </div>
</template>

<script>
  import { queryAlarms4Custom, saveCustomAlarms } from '@/api/public'
  import ProjectAlarmTable from '@/pages/setting/userInfo/ProjectAlarmTable'
  import { cloneDeep } from 'lodash'

  export default {
    name: 'ProjectAlarmModification',
    components: {
      ProjectAlarmTable,
    },
    data() {
      return {
        lastAlarmList: [],
        lastWarningList: [],
        alarmList: [],
        warningList: [],
      }
    },
    methods: {
      transformList(list = []) {
        return list.map(item => {
          return {
            ...item,
            cusInfo: item.cusInfo || item.info,
          }
        })
      },
      saveSnapshot() {
        this.lastAlarmList = cloneDeep(this.alarmList)
        this.lastWarningList = cloneDeep(this.warningList)
      },
      async getConfig() {
        const { success, message, data } = await queryAlarms4Custom({
          projectCode: this.$store.state.projectCode,
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.alarmList = this.transformList(data.alarms)
        this.warningList = this.transformList(data.warns)
        this.saveSnapshot()
      },
      modifiedFilter(list, lastList) {
        return list.filter((item, index) => item.policeSen !== lastList[index].policeSen || item.cusInfo !== lastList[index].cusInfo)
      },
      async saveConfig() {
        const modifiedAlarmList = this.modifiedFilter(this.alarmList, this.lastAlarmList)
        const modifiedWarningList = this.modifiedFilter(this.warningList, this.lastWarningList)
        const modifiedList = modifiedAlarmList.concat(modifiedWarningList)
        if (!modifiedList.length) {
          return this.$Message.warning(this.$t('noModificationsHaveBeenMadeYet'))
        }
        const data = modifiedList.map(({ typeNumber, cusInfo, policeSen }) => {
          return {
            typeNumber,
            info: cusInfo,
            policeSen,
          }
        })
        const { success, message } = await saveCustomAlarms({
          projectCode: this.$store.state.projectCode,
          customAlarm: JSON.stringify(data),
        })
        if (!success) {
          return this.$Message.error(message)
        }
        this.saveSnapshot()
        this.$Message.success(this.$t('savedSuccessfully'))
      },
    },
    mounted() {
      this.getConfig()
    },
  }
</script>

<style lang="less" scoped>
  .systemBody {
    /deep/.ivu-page-header {
      padding-left: 0;
    }
  }
</style>
