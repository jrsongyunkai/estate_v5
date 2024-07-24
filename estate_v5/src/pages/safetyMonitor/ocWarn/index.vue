<template>
  <div>
    <warnS v-show="!showDetail" @lookDeviceDetails="lookDeviceDetails" :datas="datas" @sendPage="changePage" @sendSize="changesize" @search="search" @reset="reset"></warnS>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import warnS from '@/components/seftcontrol'
  import { warnList } from '@/api/safetyMonitor/ocWarn'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'safetyMonitor-ocWarn',
    mixins: [deviceDetails],
    data() {
      return {
        datas: {
          tableData1: [],
          tableColumns1: [
            { title: this.$t('deviceAliases'), key: 'boxName' },
            { title: this.$t('equipmentNo'), key: 'mac', slot: 'mac' },
            { title: this.$t('eventId'), key: 'id' },
            { title: this.$t('place'), key: 'address' },
            { title: this.$t('line'), key: 'channel' },
            { title: this.$t('warningType'), slot: 'type_number' },
            { title: this.$t('warningTime'), key: 'alarmTime' },
          ],
          isoutput: true,
          total: 0,
          date: true,
        },
        params: { projectCode: this.$store.state.projectCode, pageNo: 1, pageSize: 10, mac: '', startTime: this.$Date().format('YYYY-MM') + '-01', endTime: this.$Date().format('YYYY-MM-DD'), nodeIds: '' },
      }
    },
    methods: {
      init() {
        this.getTableData()
      },
      getTableData() {
        warnList(this.params).then(res => {
          this.datas.tableData1 = res.datas
          this.datas.total = res.total
        })
      },
      changeDM(e) {
        this.params.startTime = e[1][0]
        this.params.endTime = e[1][1]
        this.getTableData()
      },
      changePage(e) {
        this.params.pageNo = e
        this.getTableData()
      },
      changesize(e) {
        // 改变每页显示数据
        this.params.rows = e
        this.getTableData()
      },
      changemac(e) {
        // 搜索设备号
        this.params.mac = e
        this.getTableData()
      },
      changeID(e) {
        this.params.nodeIds = e || ''
        this.getTableData()
      },
      search(e) {
        this.params.pageNo = 1
        this.params.mac = e.mac
        this.params.startTime = e.startTime
        this.params.endTime = e.endTime
        this.params.nodeIds = e.nodeIds

        this.getTableData()
      },
      reset() {
        this.params = { projectCode: this.$store.state.projectCode, pageNo: 1, pageSize: 10, mac: '', startTime: this.$Date().format('YYYY-MM-DD'), endTime: this.$Date().format('YYYY-MM-DD'), nodeIds: '' }
        this.init()
      },
    },
    created() {
      this.init()
    },
    components: {
      warnS,
      detailView,
    },
  }
</script>
