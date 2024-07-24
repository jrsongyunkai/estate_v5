<template>
  <div class="project-info">
    <div class="top">
      <Row :gutter="10">
        <Col class="item-box" span="7">
          <div>
            <div class="bx lb oneBg">
              <img src="../../../assets/svg/icon-v5-shebeixinxi.svg" alt="" />
            </div>
            <div class="rb">
              <div class="number">{{ infoDetail.totalMac || 0 }}</div>
              <div class="title">{{ $t('totalDevice') }}</div>
            </div>
            <div class="rb">
              <div class="number">{{ infoDetail.totalOnlineMac || 0 }}</div>
              <div class="title">{{ $t('numOfOnlineDevice') }}</div>
            </div>
            <div class="rb">
              <div class="number">{{ infoDetail.totalOfflineMac || 0 }}</div>
              <div class="title">{{ $t('numOfOfflineDevice') }}</div>
            </div>
          </div>
        </Col>
        <Col class="item-box" span="7">
          <div>
            <div class="bx la twoBg">
              <img src="../../../assets/svg/icon-v5-xianlu1.svg" alt="" />
            </div>
            <div class="rb">
              <div class="number">{{ statisticInfo.yesterdayPower || 0 }}</div>
              <div class="title">{{ $t('electricityYesterday') }}</div>
            </div>
            <div class="rb">
              <div class="number">{{ statisticInfo.curMonthPower || 0 }}</div>
              <div class="title">{{ $t('electricityMonth') }}</div>
            </div>
            <div class="rb">
              <div class="number">{{ statisticInfo.curYearPower }}</div>
              <div class="title">{{ $t('electricityYear') }}</div>
            </div>
          </div>
        </Col>
        <Col class="item-box" span="5">
          <div>
            <div class="bx lr threeBg">
              <i><img src="../../../assets/svg/icon-v5-baojingjingbaoyujing.svg" alt="" /></i>
            </div>
            <div class="rb fs">
              <div class="number">
                <span class="red">{{ infoDetail.totalAlarmNoProcessThisMonth }}</span>
                <span>/{{ infoDetail.totalAlarmThisMonth || 0 }}</span>
              </div>
              <div class="title">{{ $t('unprocessedOfAlarmTitle') }}</div>
            </div>
          </div>
        </Col>
        <Col class="item-box" span="5">
          <div>
            <div class="bx ly fourBg">
              <i><img src="../../../assets/svg/icon-v5-guzhang.svg" alt="" /></i>
            </div>
            <div class="rb">
              <div class="number">{{ infoDetail.totalWarnThisMonth }}</div>
              <div class="title">{{ $t('totalWarnings') }}</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
    <Row :gutter="20" style="margin: 0; padding: 0px">
      <Col style="width: 100%">
        <Form inline :model="formInline" style="display: flex" class="demo-form-inline mt-20">
          <slot name="foldBtn"></slot>
          <FormItem>
            <Input v-model="formInline.mac" :clearable="true" :placeholder="$t('enterDeviceNo')" @on-keyup.enter.native="onSubmit" />
          </FormItem>
          <FormItem>
            <Input v-model="formInline.aliasName" :clearable="true" :placeholder="$t('enterDeviceAlias')" @on-keyup.enter.native="onSubmit" />
          </FormItem>
          <FormItem>
            <Input v-model="formInline.addr" :placeholder="$t('enterPosition')" :clearable="true" @on-keyup.enter.native="onSubmit" />
          </FormItem>
          <FormItem>
            <Input v-model="formInline.simKey" :placeholder="$t('enterICCIDAndIMSI')" :clearable="true" @on-keyup.enter.native="onSubmit" />
          </FormItem>
          <FormItem>
            <Select v-model="formInline.status" multiple :clearable="true" :placeholder="$t('equipmentStatus')">
              <Option v-for="item in stats" :key="item.value" :label="item.label" :value="item.value"></Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onSubmit">{{ $t('query') }}</Button>
          </FormItem>
          <FormItem>
            <Button @click="onEliminate">{{ $t('reset') }}</Button>
          </FormItem>
          <FormItem>
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
          </FormItem>
        </Form>
        <Table :data="devicesData.list" :columns="columns" :max-height="tableHeight">
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
        <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :page-size-opts="[10, 20, 50, 100, 500]" :current="devicesData.pageNo" :page-size="devicesData.pageSize" :total="devicesData.total"></Page>
      </Col>
    </Row>
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
    <Modal :title="titleFlag ? $t('equipmentPatrolinspection') : $t('equipmentPatrolrecord')" :mask="false" width="580px" style="background-color: #68313f" v-model="inspectionFlag">
      <div style="margin: 10px 20px">
        <InspectionDevice ref="inspection" v-if="inspectionFlag" @handleInspectionClose="handleInspectionClose" :inspectionData="inspectionData" :infoData="infoData" :titleFlag="titleFlag"></InspectionDevice>
      </div>
      <div slot="footer">
        <Button type="default" @click="handleInspectionClose">{{ $t('cancel') }}</Button>
        <Button type="primary" @click="submitInformation">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import store from '@/store'
  import { indexStatData, getStatistics } from '@/api/console/project'
  import { queryProjectMacDetails } from '@/api/public'
  import InspectionDevice from '../../Common/InspectionDevice.vue'
  export default {
    components: {
      InspectionDevice,
    },
    props: {
      projectInfo: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data() {
      return {
        projectCode: '',
        infoDetail: {},
        statisticInfo: {},
        tableHeight: 500,
        devicesData: { list: [], pageSize: 10, pageNo: 1, total: 0 },
        columns: [
          { title: this.$t('equipmentNo'), slot: 'mac', align: 'center', minWidth: 150 },
          { title: this.$t('deviceAliases'), slot: 'macname', align: 'center', minWidth: 150 },
          { title: this.$t('projectName'), slot: 'projectName', align: 'center', minWidth: 150 },
          { title: this.$t('position'), key: 'projectAddress', align: 'center', minWidth: 150 },
          { title: this.$t('state'), slot: 'status', align: 'center', width: 80 },
          { title: this.$t('offlineTime'), key: 'offlineTime', align: 'center', width: 150 },
          { title: this.$t('contacts'), key: 'linkman', align: 'center', width: 150 },
          { title: this.$t('contactNumber'), key: 'linktel', align: 'center', width: 120 },
          { title: 'IMSI', key: 'imsi', width: 160, align: 'center' },
          { title: 'ICCID', key: 'iccid', width: 200, align: 'center' },
          { title: this.$t('expireTime'), key: 'expireTime', width: 120, align: 'center' },
          { title: this.$t('patrolInspection'), slot: 'inspection', width: 120, align: 'center', fixed: 'right' },
          { title: this.$t('patrolInspectionRecords'), slot: 'recording', width: 120, align: 'center', fixed: 'right' },
        ],
        formInline: { projectCode: '', status: '', mac: '', aliasName: '', addr: '', simKey: '' },
        exportRangeFlags: false,
        monthColor: 'success',
        yearColor: 'default',
        dateValue: true,
        valueYear: this.$Date().format('YYYY'),
        valueMonth: this.$Date().format('YYYYMMDD'),
        inspectionFlag: false,
        titleFlag: false,
        inspectionData: { projectCode: '', macs: '' },
        infoData: { type: '', id: '' },
        stats: [
          { value: '0', label: this.$t('offline') },
          { value: '1', label: this.$t('online') },
          { value: '-1', label: this.$t('disconnected') },
        ],
      }
    },
    methods: {
      onSubmit() {
        this.devicesData.pageNo = 1
        this.queryDevices()
      },
      handleSizeChange(val) {
        this.devicesData.pageNo = 1
        this.devicesData.pageSize = val
        this.queryDevices()
      },
      handleCurrentChange(val) {
        this.devicesData.pageNo = val
        this.queryDevices()
      },
      onEliminate() {
        this.formInline.mac = ''
        this.formInline.aliasName = ''
        this.formInline.addr = ''
        this.formInline.status = ''
        this.formInline.simKey = ''
        this.devicesData.pageNo = 1
        this.queryDevices()
      },
      handleInspection(row) {
        this.titleFlag = true
        this.inspectionFlag = true
        this.inspectionData = { projectCode: row.projectCode, macs: row.mac }
        this.infoData = { type: 1, id: row.id }
      },
      async queryDevices() {
        let params = {
          projectCode: this.projectCode,
          mac: this.formInline.mac,
          macName: this.formInline.aliasName,
          address: this.formInline.addr,
          simKey: this.formInline.simKey,
          provinceId: '',
          cityId: '',
          countyId: '',
          onlineStats: this.formInline.status.toString(),
          pageNo: this.devicesData.pageNo,
          pageSize: this.devicesData.pageSize,
        }
        let res = await queryProjectMacDetails(params)
        if (res.success) {
          this.devicesData.list = [...res.datas]
          this.devicesData.total = res.total
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleInspectionClose() {
        this.inspectionFlag = false
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
      handleSwitch(row, type) {
        if (type !== 'project') {
          store.commit('equipmentType', row.equipmentType)
          store.commit('overviewMac', row.mac)
        } else {
          store.commit('equipmentType', 1)
          store.commit('overviewMac', '')
        }
        this.$func.switchToProject(row, '/console/device')
      },
      async queryStatistics(projectCode) {
        let res = await getStatistics({ projectCode })
        if (res.success) {
          this.statisticInfo = { ...res.data }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      async queryInfo(projectCode) {
        let params = {
          projectCodes: projectCode,
          hasQueryLineDataAuth: true,
        }
        let res = await indexStatData(params)
        if (res.success) {
          this.infoDetail = { ...res.data }
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      toChannelList() {
        this.$router.push({
          name: 'ChannelList',
          query: {
            mac: this.formInline.mac,
            status: this.formInline.status,
            projectCode: this.formInline.projectCode,
          },
        })
      },
      handleCommand(command) {
        if (command === 'device') {
          this.exportRangeFlags = true
        } else {
          this.$func.windowCountDown(
            this.$func.ctxPaths() +
              '/project/main/v3/xls/exportProjectMacDetails.as?projectCode=' +
              this.projectCode +
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
              this.devicesData.pageSize +
              '&pageNo=' +
              this.devicesData.pageNo +
              '&onlineStats=' +
              this.formInline.status +
              '&exportType=' +
              (command === 'current' ? 'exportCurrent' : '')
          )
        }
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
    },
    mounted() {
      this.tableHeight = document.body.clientHeight - 330
    },
    watch: {
      projectInfo: {
        handler(value) {
          this.projectCode = value.projectCode
          this.queryInfo(value.projectCode)
          this.queryStatistics(value.projectCode)
          this.queryDevices()
        },
        deep: true,
        immediate: true,
      },
    },
  }
</script>

<style lang="less" scoped>
  .project-info {
    height: 100%;
    width: 100%;
    .top {
      width: 100%;
      background: #1a202e;
      .item-box {
        > div {
          background: #212832;
          height: 94px;
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 4px;
        }
        .bx {
          width: 60px;
          height: 60px;
          padding: 10px;
          border-radius: 10px;
          img {
            width: 100%;
            object-fit: scale-down;
          }
        }
        .oneBg {
          background: rgba(46, 149, 255, 0.2);
        }
        .twoBg {
          background: rgba(68, 92, 219, 0.2);
        }
        .threeBg {
          background: rgba(242, 78, 76, 0.2);
        }
        .fourBg {
          background: rgba(255, 168, 84, 0.2);
        }
        .rb {
          flex: 1;
          padding-left: 10px;
          .number {
            font-size: 16px;
            font-weight: 700;
            .red {
              color: #f34e50;
            }
          }
          .title {
            font-size: 14px;
            color: #ddd;
          }
          .value {
            color: #fff;
            font-size: 14px;
          }
        }
        .fs {
          padding-left: 10px;
          .value {
            color: #fff;
            font-size: 14px;
            .red {
              color: #f34e50;
            }
          }
        }
      }
    }
  }
</style>
