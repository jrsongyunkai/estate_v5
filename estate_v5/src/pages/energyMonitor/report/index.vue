<template>
  <div>
    <div class="report-energy" v-show="!isCorrection">
      <SearchForm @querySubmit="querySubmit" @correction="handleCorrection" @handleCommand="handleCommand" :selectList="selectList" />
      <div class="table-content">
        <div class="header">
          <div class="left">{{ $t('electricityStatistics') }}</div>
          <div class="right">
            <RadioGroup v-if="showType === 'topology'" v-model="showModel" type="button">
              <Radio label="table"><Icon custom="icon-v5 icon-v5-liebiao" size="20" /></Radio>
              <Radio label="echart"><Icon custom="icon-v5 icon-v5-qushi" size="20" /></Radio>
            </RadioGroup>
            <RadioGroup v-model="showType" class="ml-10" type="button">
              <Radio label="topology">{{ $t('aggregateByTopology') }}</Radio>
              <Radio label="device">{{ $t('aggregateByDevice') }}</Radio>
            </RadioGroup>
          </div>
        </div>
        <TopologyTable v-if="showType === 'topology'" ref="topologyTableRef" :showModel="showModel" @selectChange="selectChange" :queryParams="queryParams" @returnGetDataParams="returnGetDataParams"></TopologyTable>
        <DeviceTable v-else ref="deviceTableRef" @selectChange="selectChange" :queryParams="queryParams" @returnGetDataParams="returnGetDataParams"></DeviceTable>
      </div>
    </div>
    <div v-if="isCorrection">
      <Correction @report="handlePageType" />
    </div>
  </div>
</template>

<script>
  import SearchForm from './component/SearchForm.vue'
  import TopologyTable from './component/TopologyTable.vue'
  import DeviceTable from './component/DeviceTable.vue'
  import Correction from './correction.vue'
  import qs from 'qs'
  export default {
    name: 'energyMonitor-report',
    components: { SearchForm, TopologyTable, Correction, DeviceTable },
    data() {
      return {
        showType: 'topology',
        showModel: 'table',
        queryParams: {
          projectCode: this.$store.state.projectCode,
          startTime: this.$Date().add(-29, 'day').format('YYYY-MM-DD'),
          endTime: this.$Date().format('YYYY-MM-DD'),
          statsType: '2',
        },
        isCorrection: false,
        selectList: [],
        getDataParams: null,
      }
    },
    methods: {
      init() {
        this.$nextTick(() => {
          if (this.showType === 'topology') {
            this.$refs.topologyTableRef.handleData()
          } else {
            this.$refs.deviceTableRef.handleData()
          }
        })
      },
      selectChange(list) {
        this.selectList = [...list]
      },
      querySubmit(params) {
        this.queryParams = params
        this.init()
      },
      returnGetDataParams(params) {
        this.getDataParams = params
      },
      handleCorrection() {
        this.isCorrection = true
      },
      handlePageType() {
        this.isCorrection = false
      },
      mergeResId(data = []) {
        const resultMap = data.reduce((acc, obj) => {
          if (!acc[obj.resId]) {
            acc[obj.resId] = { resId: obj.resId, addrs: '' }
          }
          acc[obj.resId].addrs += (acc[obj.resId].addrs ? ',' : '') + obj.addrs
          return acc
        }, {})
        return Object.values(resultMap)
      },
      handleCommand(command) {
        const isTopology = this.showType === 'topology'
        if (isTopology) {
          if (command === 'current') this.handleExport()
          if (command === 'currentAll') this.handleExport('', '', 'all')
          if (command === 'currentSelect') {
            if (!this.selectList.length) return this.$message.warning(this.$t('pleaseSelectExportData'))
            let ttIdsList = this.selectList.map(item => item.ttIds).join(',')
            let ptIdsList = Array.from(new Set(this.selectList.map(item => item.ptIds))).join(',')
            this.handleExport(ptIdsList, ttIdsList)
          }
        } else {
          if (command === 'current') this.exportDeviceSelect()
          if (command === 'currentAll') this.exportDeviceSelect('', 'all')
          if (command === 'currentSelect') {
            if (!this.selectList.length) return this.$message.warning(this.$t('pleaseSelectExportData'))
            const jsonResId = JSON.stringify(this.mergeResId(this.selectList))
            this.exportDeviceSelect(jsonResId)
          }
        }
      },
      handleExport(ptIds = '', ttIds = '', all = '') {
        if (!this.getDataParams) return this.$message.error(this.$t('pleaseQueryFirst'))
        let params = { ...this.getDataParams, ptIds: ptIds || '', exportType: all || '', ttIds: ttIds || '' }
        const paramsStr = `/energy/manage/v5/xls/new/powerReport.as?${qs.stringify(params)}`
        this.$func.windowCountDown(paramsStr)
      },
      exportDeviceSelect(resId = '', val = '') {
        if (!this.getDataParams) return this.$message.error(this.$t('pleaseQueryFirst'))
        let params = { ...this.getDataParams, resIdAddrs: resId, exportType: val }
        const routeStr = `/energy/manage/v5/xls/new/newPowerReportByBox.as?${qs.stringify(params)}`
        this.$func.windowCountDown(routeStr)
      },
    },
    watch: {
      showType() {
        this.init()
      },
    },
  }
</script>

<style lang="less" scoped>
  .report-energy {
    width: 100%;
    .table-content {
      margin-top: 10px;
      padding: 15px;
      background: #1a202e;
      .header {
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: space-between;
        .left {
          text-align: left;
        }
        .right {
          display: flex;
          justify-content: flex-end;
        }
      }
      .table {
        margin-top: 10px;
        .table-page {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .page-sum {
            margin-right: 15px;
          }
        }
      }
    }
  }
</style>
