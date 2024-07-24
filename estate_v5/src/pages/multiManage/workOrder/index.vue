<template>
  <div class="workOrderIndex">
    <div class="tab-header" v-if="(!showAlarm && orderPage === 'table') || showAlarm">
      <Tabs v-model="tabName">
        <!-- <span v-show="count > 0" class="count-box" slot="extra">{{ count }}</span> -->
        <TabPane :label="label" name="maintenanceOrder"></TabPane>
        <TabPane :label="$t('policeWorkOrder')" name="alarmOrder"></TabPane>
      </Tabs>
    </div>
    <div v-if="!showAlarm && orderPage === 'table'">
      <MaintenanceOrder ref="maintenanceOrder" @changeMaintenancePage="changeMaintenancePage" @openViewOrder="openViewOrder" @changeUnReadTotal="changeUnReadTotal"></MaintenanceOrder>
    </div>
    <div v-if="isShow && showAlarm">
      <div class="blocksss" ref="top">
        <Input :placeholder="$t('enterWorkerOrderOrProcessor')" v-model="device" :clearable="true" style="width: 200px; margin-left: 20px" />

        <DatePicker type="datetimerange" :value="days" format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('pleaseSelectDate')" style="width: 300px; margin-left: 10px" @on-change="getdate" :editable="false" :clearable="true"></DatePicker>

        <Select :clearable="true" v-model="workType" style="width: 200px; margin-left: 10px" :placeholder="$t('workOrderType')">
          <Option v-for="item in workTypeList" :value="item.value" :key="item.value">{{ item.type }}</Option>
        </Select>
        <Select :clearable="true" v-model="workstatus" style="width: 200px; margin-left: 10px" :placeholder="$t('pleaseSelectState')">
          <Option v-for="item in workstatusList" :value="item.value" :key="item.value">{{ item.type }}</Option>
        </Select>
        <Button @click="getTableData" type="primary" class="btnb">{{ $t('query') }}</Button>
        <Button @click="reset" style="margin-left: 10px">{{ $t('reset') }}</Button>
        <Tooltip :content="$t('export')">
          <Button @click="output" class="outputs"><Icon custom="icon-v5 icon-v5-daochu2" size="18" /></Button>
        </Tooltip>
      </div>
      <!-- 表格部分 -->
      &nbsp;
      <div class="table">
        <!-- 表格 -->
        <div class="content">
          <h4>{{ $t('workOrderManagement') }}</h4>
          <div></div>
        </div>

        <Table :data="tableData1" :columns="tableColumns1" :height="520" :disabled-hover="true" ref="table">
          <template slot="orderNumber" slot-scope="{ row }">
            <span>{{ row.orderNumber.toUpperCase() }}</span>
          </template>
          <template slot="status" slot-scope="{ row }">
            <p class="work-order-status" :style="row.status === $t('processing') ? 'color:#FFA854;background:rgba(255, 168, 84,.1);text-align: center;height:20px' : 'color:#0DD667;background:rgba(13, 214, 103,.1);text-align: center;height:20px'">{{ row.status }}</p>
            <!-- <p style="">{{row.status}}</p> -->
          </template>
          <template slot="workOrderType" slot-scope="{ row }">
            {{ workOrderTypeTextArr[row.workOrderType] }}
          </template>
        </Table>
        <!-- 分页 -->

        <div style="margin: 10px 10px 0 10px; overflow: hidden">
          <div style="float: right">
            <Page show-total :current="params.pageNo" @on-change="changePage" :total="total" show-elevator />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!showAlarm && orderPage === 'viewOrder'">
      <ViewWorkOrder :rowData="rowData" @changePage="changeMaintenancePage"></ViewWorkOrder>
    </div>
    <div v-if="!showAlarm && orderPage === 'addOrder'">
      <AddWorkOrder @changePage="changeMaintenancePage"></AddWorkOrder>
    </div>
    <checkInput v-if="isCI && showAlarm" @close="check" :inpdata="checkInputData" :isbz="bzFlag" />
    <maintenanceInput v-if="isMI && showAlarm" @close="check" :inpdata="maintenanceInputData" :isbz="bzFlag1" />
    <customInput v-if="isCustom && showAlarm" @close="check" :inpdata="customInputData" :isCustomEdit="isCustomEdit" />
    <Modal v-model="modal" class-name="vertical-center-modal" width="600" :footer-hide="true">
      <div v-if="modalWorkOrderType === 0 || modalWorkOrderType === 1" class="main" style="height: 300px; height: 450px">
        <Form ref="formCustom" :label-width="100">
          <Row>
            <Col :span="12">
              <FormItem :label="$t('position') + ':'">
                {{ detail.addres }}
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('equipmentNo') + ':'">
                {{ detail.mac }}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
              <FormItem :label="$t('createdTime') + ':'">
                {{ detail.createTime }}
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('accordingDeviceAlias') + ':'">
                {{ detail.macName }}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="24">
              <FormItem :label="$t('content') + ':'">
                <div style="max-height: 100px; max-width: 450px; overflow: auto">
                  <span style="width: 100%">
                    {{ detail.content }}
                  </span>
                </div>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="$t('state') + ':'">
                <span :class="detail.status === 0 ? 'processing' : 'untreated'">{{ detail.status === 0 ? $t('processing') : $t('processed') }}</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem :label="`${$t('workOrderType')}:`">
              {{ workOrderTypeTextArr[detail.workOrderType] }}
            </FormItem>
          </Row>
          <Row>
            <template v-if="detail.workOrderType !== 0">
              <Col :span="12">
                <FormItem :label="$t('imgBeforeMaintenance') + ':'">
                  <span v-if="!detail.imgUrls1">{{ $t('noData') }}</span>
                  <el-image v-else style="width: 100px; height: 100px" :src="detail.imgUrls1" :preview-src-list="[detail.imgUrls1]"></el-image>
                </FormItem>
              </Col>
              <Col :span="12">
                <FormItem :label="$t('imgAfterMaintenance') + ':'">
                  <span v-if="!detail.imgUrls2">{{ $t('noData') }}</span>
                  <el-image v-else style="width: 100px; height: 100px" :src="detail.imgUrls2" :preview-src-list="[detail.imgUrls2]"></el-image>
                </FormItem>
              </Col>
            </template>
            <template v-else>
              <Col :span="12">
                <FormItem :label="`${$t('inspectionImg')}:`">
                  <span v-if="detail.imgUrls.length === 0">{{ $t('noData') }}</span>
                  <el-image v-else style="width: 100px; height: 100px" :src="detail.imgUrls[0]" :preview-src-list="[detail.imgUrls[0]]"></el-image>
                </FormItem>
              </Col>
            </template>
          </Row>
        </Form>
      </div>
      <div v-if="modalWorkOrderType === 2" class="main" style="max-height: 700px">
        <Form ref="formCustom" :label-width="100">
          <Row>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.date.label">
                {{ customWorkOrderData.date.value }}
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.content.label">
                {{ customWorkOrderData.content.value }}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.malfunctionContent.label">
                {{ customWorkOrderData.malfunctionContent.value }}
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.result.label">
                {{ customWorkOrderData.result.value }}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.suggest.label">
                {{ customWorkOrderData.suggest.value }}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem :label="`${$t('workOrderType')}:`">
              {{ workOrderTypeTextArr[detail.workOrderType] }}
            </FormItem>
          </Row>
          <Row>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.beforeImg.label">
                <span v-if="!customWorkOrderData.beforeImg.value">{{ $t('noData') }}</span>
                <el-image v-else style="width: 100px; height: 100px" :src="customWorkOrderData.beforeImg.value" :preview-src-list="[customWorkOrderData.beforeImg.value]"></el-image>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem :label="customWorkOrderData.afterImg.label">
                <span v-if="!customWorkOrderData.afterImg.value">{{ $t('noData') }}</span>
                <el-image v-else style="width: 100px; height: 100px" :src="customWorkOrderData.afterImg.value" :preview-src-list="[customWorkOrderData.afterImg.value]"></el-image>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="12" v-for="(item, index) in customWorkOrderData.customField" :key="index">
              <FormItem :label="item.label">
                {{ item.value }}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
      <div slot="footer"></div>
      <div slot="header">
        <h3>{{ $t('workOrderDetail') }}</h3>
      </div>
    </Modal>
  </div>
</template>
<script>
  import MaintenanceOrder from './Maintenance.vue'
  import AddWorkOrder from './AddWorkOrder.vue'
  // 新建工单的组件
  import checkInput from './checkInput.vue'
  import maintenanceInput from './maintenanceInput.vue'
  import customInput from './customInput.vue'

  // 引入表格数据的api
  import { detailInput, inquireInput } from '@/api/multiManage/workOrder'
  import noMarginTop from '@/mixins/noMarginTop'
  import ViewWorkOrder from './ViewWorkOrder.vue'
  export default {
    name: 'multiManage-workOrder',
    data() {
      return {
        label: h => {
          return h('div', { style: { position: 'relative' } }, [
            h('span', this.$t('maintenanceWorkOrder')),
            h('Badge', {
              props: {
                count: this.count,
              },
              style: {
                position: 'absolute',
                left: '55px',
                top: '-6px',
              },
            }),
          ])
        },
        rowData: null,
        orderPage: 'table',
        count: 0,
        tabName: 'maintenanceOrder',
        workOrderTypeTextArr: [this.$t('inspectionWorkOrder'), this.$t('maintenanceWorkOrder'), this.$t('customWorkOrder')],
        data: [],
        days: [this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00', this.$Date().format('YYYY-MM-DD hh:mm:ss')],
        mouths: '',
        workTypeList: [
          {
            value: '',
            type: this.$t('whole'),
          },
          {
            value: 2,
            type: this.$t('customWorkOrder'),
          },
          {
            value: 0,
            type: this.$t('inspectionWorkOrder'),
          },
          {
            value: 1,
            type: this.$t('maintenanceWorkOrder'),
          },
        ],
        workstatusList: [
          {
            value: 2,
            type: this.$t('whole'),
          },
          {
            value: 0,
            type: this.$t('processing'),
          },
          {
            value: 1,
            type: this.$t('processed'),
          },
        ],
        workType: '',
        workstatus: '',
        device: '',
        tableData1: [],
        maintenanceInputData: {},
        checkInputData: {},
        customInputData: {},
        tableColumns1: [
          {
            title: this.$t('index'),
            key: 'number',
            width: 100,
          },
          { title: this.$t('workOrderNo'), slot: 'orderNumber' },
          { title: this.$t('workOrderType'), slot: 'workOrderType' },
          { title: this.$t('equipmentNo'), key: 'mac' },
          { title: this.$t('accordingDeviceAlias'), key: 'macName' },
          { title: this.$t('position'), key: 'addres' },
          { title: this.$t('state'), slot: 'status', width: 150 },
          { title: this.$t('personnel'), key: 'handlerName', width: 200 },
          { title: this.$t('createdTime'), key: 'createTime', sortable: true, width: 170 },
          {
            title: this.$t('operation'),
            key: 'operation',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    style: {
                      marginRight: '5px',
                      color: '#007EFF',
                    },
                    on: {
                      click: () => {
                        const { workOrderType, id } = params.row
                        detailInput({ workOrderType, id }).then(res => {
                          // 详情数据
                          this.modal = false
                          this.detail = res.data
                          this.customWorkOrderData = {}
                          this.modalWorkOrderType = workOrderType

                          if (params.row.workOrderType === 0) {
                            if (this.detail.imgUrls) {
                              this.detail.imgUrls = this.detail.imgUrls.split(';')
                            } else {
                              this.detail.imgUrls = ''
                            }
                          }
                          if (params.row.workOrderType === 1) {
                            if (this.detail.imgUrls) {
                              const arr = this.detail.imgUrls.split(';')
                              this.detail.imgUrls1 = arr[0]
                              this.detail.imgUrls2 = arr[1]
                            } else {
                              this.detail.imgUrls = ''
                            }
                          }
                          if (params.row.workOrderType === 2 && res.data) {
                            this.customWorkOrderData = JSON.parse(res.data.content)
                          }
                          this.modal = true
                        })
                      },
                    },
                  },
                  this.$t('workOrderDetail')
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'text',
                      size: 'small',
                    },
                    style: {
                      marginRight: '5px',
                      color: '#007EFF',
                    },
                    on: {
                      click: () => {
                        const { workOrderType, id } = params.row
                        detailInput({ workOrderType, id }).then(res => {
                          if (params.row.workOrderType === 0) {
                            this.checkInputData = res.data
                          }
                          if (params.row.workOrderType === 1) {
                            this.maintenanceInputData = res.data
                          }
                          if (params.row.workOrderType === 2) {
                            this.customInputData = res.data
                          }
                          this.switchs(workOrderType, false)
                        })
                      },
                    },
                  },
                  this.$t('editWorkOrder')
                ),
              ])
            },
          },
        ],
        total: 0,
        isShow: true,
        isCI: false,
        isMI: false,
        isCustom: false,
        modal: false,
        detail: {},
        params: {
          projectCodeList: [],
          workOrderType: '',
          status: '',
          keyword: '',
          startTime: this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00',
          endTime: this.$Date().format('YYYY-MM-DD HH:mm:SS'),
          pageNo: 1,
          pageSize: 10,
        },
        bzFlag: true,
        bzFlag1: true,
        isCustomEdit: true,
        customWorkOrderData: {},
        modalWorkOrderType: -1,
      }
    },
    methods: {
      reset() {
        if (this.$route.params.projectCode !== undefined) {
          this.params.projectCodeList = [this.$route.params.projectCode]
        } else {
          this.params.projectCodeList = [this.$store.state.projectCode]
        }
        this.workType = ''
        this.workstatus = ''
        this.days = [this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00', this.$Date().format('YYYY-MM-DD') + ' 23:59:59']
        this.device = ''
        this.getTableData()
      },
      init() {
        this.days = [this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00', this.$Date().format('YYYY-MM-DD') + ' 23:59:59']
        this.getTableData()
      },
      changeUnReadTotal(val) {
        this.count = val
      },
      changeMaintenancePage(val) {
        this.orderPage = val
      },
      openViewOrder(val) {
        this.rowData = val
        this.orderPage = val.page
      },
      searchDevice() {
        // 搜索处理人或者工单号
        this.params.keyword = this.device
        this.getTableData()
      },
      changePage(e) {
        // 改变页码
        this.params.pageNo = e
        this.getTableData()
      },
      output() {
        let arr = this.days
        this.$func.windowCountDown(`${this.$func.ctxPaths()}/wo/xls/export.as?st=${arr[0]}&et=${arr[1]}&projectCode=${this.$store.state.projectCode}`)
      },

      switchs(e, status) {
        if (e === 0) {
          this.isShow = false
          this.isCI = true
          this.bzFlag = !status
        }
        if (e === 1) {
          this.isShow = false
          this.isMI = true
          this.bzFlag1 = !status
        }
        if (e === 2) {
          this.isShow = false
          this.isCustom = true
          this.isCustomEdit = !status
        }
      },
      check() {
        this.isShow = true
        this.isCI = false
        this.isMI = false
        this.isCustom = false
        this.init()
      },
      getTableData() {
        let params

        params = {
          workOrderType: this.workType,
          status: this.workstatus === 2 ? '' : this.workstatus,
          keyword: this.device,
          startTime: this.days ? this.days[0] : this.$Date().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00',
          endTime: this.days ? this.days[1] : this.$Date().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
          pageNo: this.params.pageNo,
          pageSize: 10,
        }
        inquireInput(params).then(res => {
          // 列表数据
          this.tableData1 = res.datas
          this.total = res.total
          //
          for (let i = 0; i < this.tableData1.length; i++) {
            this.tableData1[i].number = i + 1 + (params.pageNo - 1) * params.pageSize

            // if (this.tableData1[i].workOrderType === 0 || this.tableData1[i].workOrderType === '0') {
            //   this.tableData1[i].workOrderType = this.$t('page.table.patrolWorkorder')
            // } else this.tableData1[i].workOrderType = this.$t('page.table.maintenanceWorkorder')
            //
            if (this.tableData1[i].status === '1' || this.tableData1[i].status === 1) {
              this.tableData1[i].status = this.$t('processed')
            } else this.tableData1[i].status = this.$t('processing')
          }
        })
      },
      getdate(e) {
        this.params.startTime = e[0]
        this.params.endTime = e[1]
        this.days = e
      },
    },
    mounted() {
      this.init()
    },
    computed: {
      showAlarm() {
        return this.tabName === 'alarmOrder'
      },
    },
    mixins: [noMarginTop],
    destroyed() {
      this.params = null
    },
    components: {
      checkInput,
      maintenanceInput,
      customInput,
      MaintenanceOrder,
      AddWorkOrder,
      ViewWorkOrder,
    },
    watch: {
      detail: {
        handler(newVal, oldVal) {
          this.detail = newVal
        },
        deep: true,
      },
    },
    props: {
      datas: {
        type: Object,
        default() {
          return {}
        },
      },
    },
  }
</script>

<style lang="less">
  .el-image-viewer__wrapper {
    z-index: 9999 !important;
  }
  .workOrderIndex {
    .processing {
      color: #ffa854;
      background: rgba(255, 168, 84, 0.1);
      padding: 5px;
    }
    .tab-header {
      background: #1a202e;
      padding: 10px;
      position: relative;
    }
    .count-box {
      position: absolute;
      // width: 16px;
      // height: 16px;
      aspect-ratio: 1/ 1;

      border-radius: 50%;
      background: #ed4014;
      top: 5px;
      left: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
      // line-height: 16px;
      font-size: 12px;
    }
    .untreated {
      color: #0dd667;
      background: rgba(13, 214, 103, 0.1);
      padding: 5px;
    }
    .btnb {
      background: #007eff;
      color: #fff;
      border: none;
      margin-left: 10px;
    }

    .blocksss {
      margin: 10px 10px 0 10px;
      overflow: hidden;
      background: #1a202e;
      height: 52px;
      line-height: 52px;
      .inp {
        width: 260px;
        height: 36px;
      }
      .outputs {
        border: 1px solid #007eff;
        padding: 3px;
        color: #007eff;
        margin-left: 10px;
        width: 36px;
        height: 32px;
        background-color: rgba(0, 126, 255, 0.1);
        border-radius: 5px;
      }
    }
    .table {
      width: 100%;

      margin-top: 30px;
      background-color: #1a202e;
      background: #1a202e;
      margin-top: -10px;
      padding: 20px;
      margin-left: 10px;
      margin-right: 10px;
      h2 {
        color: #fff;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        // margin-top: 15px;
      }
      .content {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        justify-content: space-between;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
    }
    .echarts {
      margin-top: 30px;
    }
  }
</style>

<style lang="less" scoped>
  .work-order-status {
    display: inline-block;
    padding: 0 10px;
    white-space: nowrap;
  }
</style>
