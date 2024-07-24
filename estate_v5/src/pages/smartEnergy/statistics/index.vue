<template>
  <div v-if="isOverLoad">
    <EnablingView v-if="isNeedAuth" @ActivationStatus="getConfigValue" />
    <div v-else class="statistics-box">
      <div class="content">
        <Tabs :value="tabName" name="sub-tab" @on-click="handleTabsSelect">
          <TabPane v-for="tab in tabs" :key="tab.prop" :label="tab.label" :name="tab.prop" tab="sub-tab">
            <NoSupport v-if="!tab.isSupport"></NoSupport>
            <EnergyModule ref="energyModule" v-else-if="tabName === tab.prop" :energyType="tab.value" @handleUrge="handleUrge" @handleMaintenance="queryMaintenance" />
          </TabPane>
        </Tabs>
      </div>
      <Modal id="modal" :title="title" v-model="dialogVisible" @close="closeMaintenance">
        <MaintenanceEditor v-if="dialogVisible" :maintenanceBoxObj="maintenanceBoxObj" v-on:close-maintenance="closeMaintenance"></MaintenanceEditor>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
  import EnergyModule from './modules/EnergyModule.vue'
  import NoSupport from '@/components/energyModule/noSupport.vue'
  import EnablingView from '@/components/energyModule/EnablingView.vue'
  import MaintenanceEditor from '@/pages/safetyMonitor/allWarn/MaintenanceEditor.vue'
  import { alarmUrgePush, findMaintenance } from '@/api/control/index'
  import store from '@/store'
  import { energyTypeMap } from '@/untils/configuration'
  import enablingEnergy from '@/mixins/enablingEnergy'
  export default {
    name: 'smartEnergy-statistics',
    components: {
      EnergyModule,
      MaintenanceEditor,
      NoSupport,
      EnablingView,
    },
    mixins: [enablingEnergy],
    data() {
      return {
        tabName: 'elec',
        title: '',
        dialogVisible: false,
        maintenanceBoxObj: null,
        tabs: energyTypeMap,
      }
    },
    methods: {
      handleTabsSelect(e) {
        this.tabName = e
      },
      closeMaintenance() {
        store.dispatch('resetMaintenanceObj')
        this.dialogVisible = false
        this.$refs.energyModule.queryAlarmList()
      },
      async queryMaintenance(obj) {
        if (obj.processStatus === 0) {
          this.title = this.$t('createWorkOrder')
        } else if (obj.processStatus === 1) {
          this.title = this.$t('editWorkOrder')
        } else {
          this.title = this.$t('workOrderDetails')
        }
        let params = { mac: obj.mac, alarmId: obj.id, id: '' }
        let res = await findMaintenance(params)
        if (res.success) {
          store.commit('maintenanceObj', res.data)
          store.commit('alarmId', obj.id)
          this.maintenanceBoxObj = obj
          this.dialogVisible = true
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async handleUrge(id) {
        const res = await alarmUrgePush({ id: id })
        if (res.code === '0') {
          this.$Message.success({ content: res.message })
        } else {
          this.$Message.error({ content: res.message })
        }
      },
    },
    mounted() {},
  }
</script>

<style lang="less">
  .statistics-box {
    .content {
      margin-top: 10px;
      background: transparent;
      position: relative;
      .ivu-tabs-bar {
        margin-bottom: 10px;
      }
    }
    .content .ivu-tabs-nav-scroll {
      background: #1a202e;
      padding: 10px;
      border-radius: 5px;
      font-size: 16px;
    }
  }
</style>
