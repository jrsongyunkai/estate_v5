<template>
  <div>
    <Row :gutter="20" style="margin: 0; padding: 20px">
      <Col style="width: 100%">
        <Breadcrumb separator-class="el-icon-arrow-right">
          <BreadcrumbItem class="pointer" @click.native="back">{{ $t('back') }}</BreadcrumbItem>
          <BreadcrumbItem>{{ $t('deviceList') }}</BreadcrumbItem>
        </Breadcrumb>
        <div class="deviceListHead">
          <Row :gutter="5" class="demo-form-inline tr">
            <Col>
              <!-- <Select v-model="formInline.projectCode" :clearable="true" filterable :placeholder="$t('placeholder.projectPls')">
              <Option v-for="item in projectNames" :key="item.projectCode" :label="item.projectName" :value="item.projectCode"></Option>
            </Select> -->
              <PickProject :disabled="pickProjectDisabled" :defaultCheckedKeys="checkedKeys" @pickProject="pickProject"></PickProject>
            </Col>
            <Col>
              <Input v-model="formInline.mac" :clearable="true" :placeholder="$t('enterDeviceNo')" @on-keyup.enter.native="onSubmit" />
            </Col>
            <Col>
              <Input v-model="formInline.aliasName" :clearable="true" :placeholder="$t('deviceAliases')" @on-keyup.enter.native="onSubmit" />
            </Col>
            <Col>
              <Input v-model="formInline.addr" :placeholder="$t('enterPosition')" :clearable="true" @on-keyup.enter.native="onSubmit" />
            </Col>
            <Col>
              <Input v-model="formInline.simKey" :placeholder="$t('enterICCIDAndIMSI')" :clearable="true" @on-keyup.enter.native="onSubmit" />
            </Col>
            <Col>
              <Select v-model="formInline.status" multiple :clearable="true" :placeholder="$t('equipmentStatus')">
                <Option v-for="item in stats" :key="item.value" :label="item.label" :value="item.value"></Option>
              </Select>
            </Col>
            <Col>
              <Button type="primary" @click="onSubmit">{{ $t('query') }}</Button>
            </Col>
            <Col>
              <Button @click="onEliminate">{{ $t('reset') }}</Button>
            </Col>
            <Col>
              <Dropdown trigger="click" @on-click="handleCommand">
                <Button>
                  {{ $t('export') }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="current">{{ $t('exportCurrent') }}</DropdownItem>
                  <DropdownItem name="all">{{ $t('exportAll') }}</DropdownItem>
                  <DropdownItem name="device">{{ $t('exportMacElec') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Col>
          </Row>
          <Col>
            <Button type="text" @click="toChannelList">{{ $t('channelList') }}</Button>
          </Col>
        </div>

        <Table :data="devicesData" :columns="columns">
          <template slot-scope="{ row }" slot="mac">
            <div @click="handleSwitch(row)" class="pointer">{{ row.mac }}</div>
          </template>
          <template slot-scope="{ row }" slot="macname">
            <div>{{ row.name }}</div>
          </template>
          <template slot-scope="{ row }" slot="projectName">
            <div @click="handleSwitch(row, 'project')" class="pointer">
              {{ row.projectName }}
            </div>
          </template>
          <template #linkman="{ row }">
            {{ row.linkman || row.linkman2 }}
          </template>
          <template #linktel="{ row }">
            {{ row.linktel || row.linktel2 }}
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-show="row.stats === -1" class="c-info">{{ $t('disconnected') }}</span>
            <span v-show="row.stats === 0" class="c-danger">{{ $t('offline') }}</span>
            <span v-show="row.stats === 1" class="c-success">{{ $t('online') }}</span>
          </template>
          <template slot-scope="{ row }" slot="inspection">
            <Button type="text" class="fs-14" @click="handleInspection(row)">{{ $t('conductPatrolInspection') }}</Button>
          </template>
          <template slot-scope="{ row }" slot="recording">
            <Button type="text" class="fs-14" @click="handleViewInspection(row)">{{ $t('view') }}</Button>
          </template>
        </Table>
        <div style="display: flex; justify-content: flex-end">
          <div>
            <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :page-size-opts="[20, 50, 100, 500]" :current="currentPage" :page-size="pageSize" :total="devicesTotal"></Page>
          </div>
        </div>
      </Col>
    </Row>
    <Modal :title="titleFlag ? $t('equipmentPatrolinspection') : $t('equipmentPatrolRecord')" :mask="false" width="580px" style="background-color: #68313f" v-model="inspectionFlag">
      <div style="margin: 10px 20px">
        <InspectionDevice ref="inspection" v-if="inspectionFlag" @handleInspectionClose="handleInspectionClose" :inspectionData="inspectionData" :infoData="infoData" :titleFlag="titleFlag"></InspectionDevice>
      </div>
      <div slot="footer">
        <Button type="default" @click="handleInspectionClose">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="submitInformation">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
    <Modal v-model="exportRangeFlags" :title="$t('exportStatistics')" footer-hide>
      <Row>
        <Col :span="3">
          <Button :type="monthColor" shape="circle" @click="getMonthValue">{{ $t('month') }}</Button>
        </Col>
        <Col :span="3">
          <Button :type="yearColor" shape="circle" @click="getYearValue">{{ $t('year') }}</Button>
        </Col>
        <Col :span="8" v-if="!dateValue">
          <DatePicker type="year" format="yyyy" v-model="valueYear" :placeholder="$t('plsSelectYear')"></DatePicker>
        </Col>
        <Col :span="8" v-if="dateValue">
          <DatePicker type="month" format="yyyy-MM" v-model="valueMonth" :placeholder="$t('plsSelectMonth')"></DatePicker>
        </Col>
        <Col :span="5" style="margin-left: 10px">
          <Button type="primary" @click="handleExportRange">{{ $t('export') }}</Button>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import store from '@/store'
  import InspectionDevice from '../Common/InspectionDevice.vue'
  import { queryProjectMacDetailsV5 } from '@/api/public'
  import PickProject from '@/globalComponents/PickProject.vue'
  export default {
    components: {
      InspectionDevice,
      PickProject,
    },
    props: {
      queryType: { type: String },
    },
    data() {
      return {
        fromPath: '',
        valueYear: this.$Date().format('YYYY'),
        valueMonth: this.$Date().format('YYYYMMDD'),
        dateValue: true,
        monthColor: 'success',
        yearColor: 'default',
        exportRangeFlags: false,
        detailsValue: '',
        columns: [
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'center' },
          { title: this.$t('deviceAliases'), slot: 'macname', align: 'center' },
          { title: this.$t('projectName'), slot: 'projectName', align: 'center' },
          { title: this.$t('position'), key: 'projectAddress', align: 'center' },
          { title: this.$t('state'), slot: 'status', align: 'center' },
          { title: this.$t('offlineTime'), key: 'offlineTime', align: 'center' },
          { title: this.$t('contacts'), slot: 'linkman', align: 'center' },
          { title: this.$t('contactNumber'), slot: 'linktel', align: 'center' },
          { title: 'IMSI', key: 'imsi', width: 120, align: 'center' },
          { title: 'ICCID', key: 'iccid', width: 120, align: 'center' },
          { title: this.$t('expireTime'), key: 'expireTime', width: 120, align: 'center' },
          { title: this.$t('patrolInspection'), slot: 'inspection', width: 120, align: 'center' },
          { title: this.$t('patrolInspectionRecords'), slot: 'recording', width: 120, align: 'center' },
        ],
        stats: [
          { value: '0', label: this.$t('offline') },
          { value: '1', label: this.$t('online') },
          { value: '-1', label: this.$t('disconnected') },
        ],
        projectNames: [],
        devicesData: [],
        devicesTotal: 0,
        currentPage: 1,
        pageSize: 20,
        formInline: { projectCode: [], status: this.$route.params.status === '100' ? '' : this.$route.params.status, mac: '', aliasName: '', addr: '', simKey: '' },
        loading: false,
        inspectionFlag: false,
        titleFlag: false,
        inspectionData: { projectCode: '', macs: '' },
        infoData: { type: '', id: '' },
        deviceParams: '',
        checkedKeys: [],
        pickProjectDisabled: false,
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        //  这里的vm指的就是vue实例，可以用来当做this使用
        if (from.path === '/visualScreen') {
          store.commit('deviceListRouter', '/visualScreen')
        } else if (from.path === '/console/project') {
          store.commit('deviceListRouter', '/console/project')
        }
        if (from.path === '/ChannelList') {
          if (store.state.deviceListRouter) {
            vm.fromPath = store.state.deviceListRouter
          } else {
            vm.fromPath = '/visualScreen'
          }
        } else {
          vm.fromPath = '/visualScreen'
          // console.log(from.path, ' vm.fromPath') // 获取上一级路由的路径
        }
      })
    },
    created() {
      if (this.$route.query.projectCode) {
        this.formInline.status = this.$route.query.status
      }
    },
    mounted() {
      if (this.$route.query.projectCode) {
        this.pickProjectDisabled = true
        this.checkedKeys = [this.$route.query.projectCode]
      } else {
        this.checkedKeys = this.$store.state.allProjects.data.map(it => it.projectCode)
      }
      this.formInline.projectCode = [...this.checkedKeys]
      this.init()
    },
    methods: {
      back() {
        this.$router.push(this.fromPath)
      },
      init() {
        this.queryDevices()
      },
      pickProject(selectProjectTreeData, cb) {
        this.checkedKeys = selectProjectTreeData.filter(it => it.projectCode).map(it => it.projectCode)
        this.formInline.projectCode = [...this.checkedKeys]
        cb()
      },
      toChannelClear() {
        this.formInline.projectCode = []
        this.formInline.aliasName = ''
        this.formInline.mac = ''
        this.formInline.aliasName = ''
        this.formInline.addr = ''
        this.formInline.status = ''
      },
      queryDevices() {
        if (this.$route.params.status && this.$route.params.status !== '100') {
          this.formInline.status = this.$route.params.status.split(',')
          this.$route.params.status = ''
        }
        this.devicesData = []
        let params = {
          projectCode: this.formInline.projectCode.toString(),
          mac: this.formInline.mac,
          macName: this.formInline.aliasName,
          address: this.formInline.addr,
          simKey: this.formInline.simKey,
          onlineStats: this.formInline.status ? this.formInline.status.toString() : this.$store.state.status,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
        }
        queryProjectMacDetailsV5(params)
          .then(res => {
            if (res.success) {
              this.devicesData = res.datas
              this.devicesTotal = res.total
              this.projectNames = this.$store.state.allProjects.data
              this.deviceFlag = true
            } else if (res.code === '-1') {
            } else {
              this.$Message.error({ content: res.message })
            }
          })
          .catch(err => {
            if (err) {
              this.$Message.error({
                content: this.$t('unknown'),
              })
            }
          })
          .finally(() => {})
      },
      onSubmit() {
        this.currentPage = 1
        this.queryDevices()
      },
      handleSizeChange(val) {
        this.currentPage = 1
        this.pageSize = val
        this.queryDevices()
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.queryDevices()
      },
      getMonthValue() {
        this.dateValue = true
        this.monthColor = 'success'
        this.yearColor = 'default'
      },
      getYearValue() {
        this.dateValue = false
        this.monthColor = 'default'
        this.yearColor = 'success'
      },
      handleExportRange() {
        // 这是设备列表页，勿搞混
        const valueYears = this.$Date(this.valueYear).format('YYYY')
        const valueMonths = this.$Date(this.valueMonth).format('YYYYMM')
        if (this.dateValue) {
          this.$func.windowCountDown('/project/main/v5/xls/userBoxPowerStats.as?startYm=' + valueMonths + '&endYm=' + valueMonths)
        } else if (!this.dateValue) {
          this.$func.windowCountDown('/project/main/v5/xls/userBoxPowerStats.as?startYm=' + valueYears + '01' + '&endYm=' + valueYears + '12')
        }
      },
      // 导出功能后续需改动，有bug
      handleCommand(command) {
        if (command === 'device') {
          this.exportRangeFlags = true
        } else {
          this.$func.windowCountDown(
            this.$func.ctxPaths() +
              '/project/main/v3/xls/exportProjectMacDetails.as?projectCode=' +
              (this.$route.params.projectCode ? this.$route.params.projectCode : this.$store.state.projectCode) +
              '&provinceId=' +
              (this.$store.state.provinceId ? this.$store.state.provinceId : '') +
              '&cityId=' +
              (this.$store.state.cityId ? this.$store.state.cityId : '') +
              '&countyId=' +
              (this.$store.state.countyId ? this.$store.state.countyId : '') +
              '&mac=' +
              this.formInline.mac +
              '&address=' +
              this.formInline.addr +
              '&macName=' +
              this.formInline.aliasName +
              '&pageSize=' +
              this.pageSize +
              '&pageNo=' +
              this.currentPage +
              '&onlineStats=' +
              (this.formInline.status || '') +
              '&exportType=' +
              (command === 'current' ? 'exportCurrent' : '')
          )
        }
        //
        // http://localhost:8080/project/main/v3/xls/exportProjectMacDetails.as?projectCode=&provinceId=&cityId=&countyId=&mac=&address=&macName=&pageSize=20&pageNo=1&onlineStats=undefined&exportType=exportCurrent
        // http://localhost:8081/project/main/v3/xls/exportProjectMacDetails.as?projectCode=&provinceId=&cityId=&countyId=&mac=&address=&macName=&pageSize=20&pageNo=1&onlineStats=&exportType=
      },
      handleSwitch(row, type) {
        var path = '/console/device'
        if (type !== 'project') {
          store.commit('equipmentType', row.equipmentType)
          store.commit('overviewMac', row.mac)
        } else {
          store.commit('equipmentType', 1)
          store.commit('overviewMac', '')
        }
        this.$func.switchToProject(row, path)
      },
      toChannelList() {
        this.$router.push({
          name: 'ChannelList',
          query: {
            mac: this.formInline.mac,
            status: this.formInline.status,
            projectCode: this.formInline.projectCode.toString(),
          },
        })
      },
      handleInspection(row) {
        this.titleFlag = this.inspectionFlag = true
        this.inspectionData = {
          projectCode: row.projectCode,
          macs: row.mac,
        }
        this.infoData = {
          type: 1,
          id: row.id,
        }
      },
      handleViewInspection(row) {
        this.titleFlag = false
        this.inspectionFlag = true
        this.inspectionData = {
          projectCode: row.projectCode,
          macs: row.mac,
        }
      },
      submitInformation() {
        this.$refs.inspection.submitForm()
      },
      handleInspectionClose() {
        this.inspectionFlag = false
      },
      onEliminate() {
        this.formInline.mac = ''
        this.formInline.aliasName = ''
        this.formInline.addr = ''
        this.formInline.status = ''
        this.formInline.simKey = ''
        this.currentPage = 1
        this.queryDevices()
      },
    },
    watch: {
      '$store.state.location': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.queryDevices()
          }
        },
        deep: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .deviceListHead {
    background: #1a202e;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  /deep/.ivu-select-item {
    text-align: left;
  }
  /deep/.ivu-table-tip {
    overflow: auto;
  }
</style>
