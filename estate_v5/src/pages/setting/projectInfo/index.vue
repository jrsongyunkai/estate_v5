<template>
  <div class="projectinfo">
    <Row :gutter="24">
      <Col :xl="5" :lg="6" :md="0" :sm="0" :xs="0">
        <Card shadow height="100%" :padding="0" class="ivu-card">
          <CellGroup @on-click="handleChangeCell" class="ivu-pt-8 ivu-pb-8">
            <!-- <Cell title="默认电量算法" name="algorithm" :selected="currentType === 'algorithm'" /> -->
            <Cell :title="$t('serviceDirection')" name="configurings" :selected="currentType === 'configurings'" />
            <Cell :title="$t('alarmNameModification')" name="ProjectAlarmModification" :selected="currentType === 'ProjectAlarmModification'" />
            <Cell :title="$t('projectAddrAndContact')" name="setAdress" :selected="currentType === 'setAdress'" />
            <Cell :title="$t('routeSetting')" name="projectRoad" :selected="currentType === 'projectRoad'" />
            <Cell :title="$t('weeklyStart')" name="weekConfig" :selected="currentType === 'weekConfig'" />
            <Cell :title="$t('customAlarm')" name="cunstomAlarm" :selected="currentType === 'cunstomAlarm'" />
            <Cell :title="$t('mapAreaConfiguration')" name="mapAreaConfiguration" :selected="currentType === 'mapAreaConfiguration'" />
            <Cell :title="$t('menuConfig')" name="menuProjectConfig" :selected="currentType === 'menuProjectConfig'" v-if="isHaveAuth" />
            <Cell :title="$t('absoluteBatteryLevelWriteBack')" name="BatteryWriteBackVue" :selected="currentType === 'BatteryWriteBackVue'" v-if="isElecAuth" />
            <Cell :title="$t('instantaneousPowerAlarmRuleConfiguration')" name="maxPower" :selected="currentType === 'maxPower'" />
            <Cell :title="$t('projectUnifiedThresholdDisplay')" v-if="isfutian" name="UnifiedthresholdShow" :selected="currentType === 'UnifiedthresholdShow'" />
          </CellGroup>
        </Card>
      </Col>
      <Col :xl="19" :lg="18" :md="24" :sm="24" :xs="24">
        <Card :bordered="false" dis-hover style="background: transparent; padding: 0">
          <!-- <algorithmView v-if="currentType === 'algorithm'"></algorithmView> -->
          <configurings v-if="currentType === 'configurings'" />
          <ProjectAlarmModification v-if="currentType === 'ProjectAlarmModification'" />
          <setAdress v-if="currentType === 'setAdress'" />
          <projectRoad v-if="currentType === 'projectRoad'" :actives="active" />
          <weekConfig v-if="currentType === 'weekConfig'"></weekConfig>
          <cunstomAlarm v-if="currentType === 'cunstomAlarm'"></cunstomAlarm>
          <dom v-if="currentType === 'mapAreaConfiguration'"></dom>
          <menuConfigProject v-if="currentType === 'menuProjectConfig'"></menuConfigProject>
          <BatteryWriteBackVue v-if="currentType === 'BatteryWriteBackVue'"></BatteryWriteBackVue>
          <MaxPower v-if="currentType === 'maxPower'"></MaxPower>
          <UnifiedthresholdShow v-if="currentType === 'UnifiedthresholdShow'"></UnifiedthresholdShow>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
  import configurings from '../userInfo/configurings.vue'
  import menuConfigProject from '../userInfo/menuConfigProject.vue'
  import setAdress from '../userInfo/setAdress.vue'
  import weekConfig from '../userInfo/weekConfig.vue'
  import cunstomAlarm from '../userInfo/customAlarm.vue'
  import ProjectAlarmModification from '../userInfo/ProjectAlarmModification.vue'
  import dom from '../userInfo/mapArea/dom.vue'
  import projectRoad from '../userInfo/projectRoad.vue'
  // import algorithmView from './modules/algorithmView.vue'
  import { getMainLineMode, queryPageAuth } from '@/api/public'
  import BatteryWriteBackVue from '../userInfo/BatteryWriteBack.vue'
  // import menuConfiguration from '../userInfo/menuConfiguration.vue'
  import MaxPower from './modules/MaxPower.vue'
  import UnifiedthresholdShow from './modules/UnifiedthresholdShow.vue'
  export default {
    name: 'setting-projectInfo',
    components: {
      // menuConfiguration,
      cunstomAlarm,
      setAdress,
      configurings,
      weekConfig,
      ProjectAlarmModification,
      dom,
      projectRoad,
      menuConfigProject,
      BatteryWriteBackVue,
      // algorithmView,
      MaxPower,
      UnifiedthresholdShow,
    },
    data() {
      return {
        currentType: 'configurings',
        active: 0,
        isHaveAuth: false,
        isElecAuth: false,
        isfutian: null,
      }
    },
    created() {
      this.getIsPageAuth()
    },
    mounted() {
      this.handleGetMainLineMode()
      this.isfutian = window.sessionStorage.getItem('isFuTian')
    },
    methods: {
      handleChangeCell(name) {
        this.currentType = name
      },
      async handleGetMainLineMode() {
        let params = { projectCode: this.$store.state.projectCode }
        const res = await getMainLineMode(params)
        if (res.success) {
          this.active = res.data.mode - 1
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async getIsPageAuth() {
        let parmars = {
          resKeys: 'V5_MENU_USE,V5_PROJECT_USE',
          operKeys: 'V5_PRJ_CONF_SHOW_MENU_CONF,AUTO_POWER_WRITE_BACK_CONFIG',
        }
        const res = await queryPageAuth(parmars)
        if (res.success) {
          this.isHaveAuth = res.data[0].result
          this.isElecAuth = res.data[1].result
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
  }
</script>
<style lang="less">
  .projectinfo {
    .ivu-card {
      margin-right: -20px;
      height: 100%;
    }
    .ivu-card-body {
      padding: 0px !important;
    }
  }
</style>
