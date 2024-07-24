<template>
  <div>
    <warnS v-show="!showDetail" @lookDeviceDetails="lookDeviceDetails" :datas="datas" @sendPage="changePage" @sendSize="changesize" @search="search" @reset="reset"></warnS>
    <detailView v-if="showDetail" :showSwitch="showSwitch" @closeView="closeView" :initTab="initTab" :key="deviceInfo.mac" :rowInfo="deviceInfo"></detailView>
  </div>
</template>
<script>
  import warnS from '@/components/seftcontrol'
  import { warnList } from '@/api/safetyMonitor/abnormalState'
  import detailView from '@/pages/console/device/deviceDetail/detailView.vue'
  import deviceDetails from '@/mixins/deviceDetails'
  export default {
    name: 'safetyMonitor-abnormalState',
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
            { title: this.$t('inspectRuls'), key: 'ruleDesc' },
            { title: this.$t('exceptionDescription'), key: 'erreoState' },
            { title: this.$t('contacts'), key: 'linkInfo' },
          ],
          isoutput: true,
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
          // 获取数据
          this.datas.tableData1 = res.datas
          this.datas.tableData1.forEach(item => {
            item.erreoState = item.createTime + item.errDesc
          })
          this.datas.total = res.total
        })
      },
      changePage(e) {
        // 改变页码
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
        this.params.nodeIds = e
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
      reset() {},
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
