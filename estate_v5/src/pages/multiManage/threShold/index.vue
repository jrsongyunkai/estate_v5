<template>
  <div class="threShold">
    <template v-if="threShow === 'threIndex'">
      <Row class="threSearch">
        <Col><Input class="w200" v-model="nameVal" :placeholder="$t('pleaseInputName')" /></Col>
        <Col>
          <Select v-model="pattern" class="w200" :placeholder="$t('pleaseSelectMode')">
            <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col>
          <Select v-model="state" class="w200" :placeholder="$t('pleaseSelectState')">
            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </Col>
        <Col><DatePicker @on-change="hanldeCreateTime" class="w200" :value="creationTime" format="yyyy-MM-dd" type="daterange" placement="bottom-end" :placeholder="$t('pleaseSelectCreateTimeRange')"></DatePicker></Col>
        <Col>
          <Button type="primary" @click="handleThresholdList">{{ $t('query') }}</Button>
          <Button class="ml-10" @click="rest">{{ $t('reset') }}</Button>
        </Col>
      </Row>
      <div class="threContent">
        <div class="tableHead">
          <h4 style="font-size: 16px">{{ $t('thresholdConfigurationList') }}</h4>
          <div>
            <Button type="primary" @click="handleAdd">{{ $t('addConfig') }}</Button>
            <Button type="primary" @click="conflictDetection" class="ml-10">{{ $t('conflictDetection') }}</Button>
          </div>
        </div>
        <Table :columns="columns" :data="data" :row-class-name="rowClassName">
          <template slot-scope="{ row }" slot="model">
            <span>{{ row.model === 0 ? $t('allModes') : row.model === 1 ? $t('simpleMode') : $t('timeSlotMode') }}</span>
          </template>
          <template slot-scope="{ row }" slot="cycleDesc">{{ row.cycleDesc ? row.cycleDesc : '-' }}</template>
          <template slot-scope="{ row }" slot="remark">{{ row.remark ? row.remark : '-' }}</template>
          <template slot-scope="{ row }" slot="action">
            <Button size="small" type="text" style="margin-right: 5px" class="danger-pra" @click="handleDetails(row)">{{ $t('view') }}</Button>
            <Button size="small" type="text" style="margin-right: 5px" class="danger-pra" @click="handleEdit(row)">{{ $t('edit') }}</Button>
            <Button size="small" type="text" class="danger-text" @click="openPwdsModal(row)">{{ $t('delete') }}</Button>
          </template>
        </Table>
        <Page show-total :current="currentPage" @on-change="changePage" @on-page-size-change="changesize" :total="total" show-elevator />
      </div>
    </template>
    <template v-if="threShow === 'threAdd'">
      <threSholdNewAdd ref="newAdd" @toback="addBack" :rowData="rowData" :configId="configId" @threShow="threNewAddBack" :threSholdList="handleThresholdList" :devicesObj="devicesObj" @devicesValue="backdevicesObj" />
    </template>
    <template v-if="threShow === 'threDetails'">
      <threDetails @toback="detailsBack" :configId="configId" :model="model" @threShow="handleDetailsEdit" @detailsData="handledetailsData" />
    </template>
    <Modal v-model="comflict" :title="$t('thresholdConflictDetection')" class="comflictModal" style="width: 1230px">
      <div class="headerror" v-if="temNoConflict">
        <Icon custom="icon-v5 icon-v5-weiwancheng"></Icon>
        <span class="ml-10">{{ temNoConContent }}</span>
      </div>
      <div class="headSussce" v-if="!temNoConflict">
        <Icon custom="icon-v5 icon-v5-wancheng"></Icon>
        <span class="ml-10">{{ temNoConContent }}</span>
      </div>
      <Table :columns="comflictColumn" :data="comflictData">
        <template slot-scope="{ row }" slot="conlictConfigName">
          <div>
            <span class="comflictName" @click="handlecomflictEdit(row)">{{ row.configName }}</span>
            <Icon style="color: red" custom="icon-v5 icon-v5-chongtu"></Icon>
            <span class="comflictName" @click="handlecomflictEdit(row)">{{ row.conlictConfigName }}</span>
          </div>
        </template>
        <template slot-scope="{ row }" slot="timer">
          <span>{{ `${row.startTime}-${row.endTime}` }}</span>
        </template>
        <template slot-scope="{ row }" slot="HasConlict">
          <span>{{ `${row.alarmValueHasConlict ? $t('alarmValueConflict') : ''}  ${row.actionHasConlict ? $t('alarmActionConflict') : ''}` }}</span>
        </template>
      </Table>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
        <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import threSholdNewAdd from './threSholdNewAdd'
  import threDetails from './threDetails'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import { thresholdList, checkSecondPwd, thresholdStatus, thresholdDel, getMacAddrConflictList, thresholdGetBaseInfo, queryDateConfig } from '@/api/public'
  export default {
    name: 'multiManage-threShold',
    components: {
      threSholdNewAdd,
      PwsSeconedCheckVue,
      threDetails,
    },
    data() {
      return {
        bpk: null,
        rowDatas: {},
        openSeconedPwd: false,
        devicesObj: '',
        nameVal: '',
        pattern: '',
        state: '',
        creationTime: ['', ''],
        currentPage: 1,
        pageSize: 10,
        total: 0,
        threShow: 'threIndex',
        temNoConflict: false,
        modeList: [
          { value: '0', label: this.$t('allModes') },
          { value: '1', label: this.$t('simpleMode') },
          { value: '2', label: this.$t('timeSlotMode') },
        ],
        stateList: [
          { value: '0', label: this.$t('allStatus') },
          { value: '1', label: this.$t('disabled') },
          { value: '2', label: this.$t('enabled') },
        ],
        columns: [
          { width: 200, align: 'center', title: this.$t('configurationNo'), key: 'projectConfigId' },
          { title: this.$t('name'), key: 'name' },
          { title: this.$t('description'), key: 'remark', slot: 'remark' },
          { title: this.$t('mode'), slot: 'model' },
          { title: this.$t('circularInformation'), key: 'cycleDesc', slot: 'cycleDesc' },
          {
            title: this.$t('state'),
            key: 'status',
            render: (h, params) => {
              return h('i-switch', {
                props: { value: params.row.status !== 1 },
                on: {
                  'on-change': value => {
                    this.handleThresholdStatus(params.row.configId, value)
                  },
                },
              })
            },
          },
          { title: this.$t('createdTime'), key: 'createTime' },
          { title: this.$t('operation'), slot: 'action', width: 200, align: 'center' },
        ],
        data: [],
        configId: 0,
        msg: this.$route.query.threShow,
        comflict: false,
        comflictData: [],
        comflictColumn: [
          { type: 'index', title: this.$t('index'), align: 'center', width: 100 },
          { title: this.$t('conflictThreshold'), slot: 'conlictConfigName', width: 300 },
          { title: this.$t('deviceName'), key: 'macName', width: 150 },
          { title: this.$t('equipmentNo'), key: 'mac', width: 150 },
          { title: this.$t('line'), key: 'addrName' },
          { title: this.$t('thresholdType'), key: 'thresholdTypeName' },
        ],
        deleteSure: false,
        rowData: {},
        topAddrs: '',
        temNoConContent: '',
      }
    },
    activated() {
      // 如果keep-alive为true，走这里
      if (this.$route.params.executeConfigId && this.$route.params.model) {
        let obj = { model: this.$route.params.model, configId: this.$route.params.executeConfigId }
        this.handleDetails(obj)
      }
    },
    mounted() {
      this.handlequeryDateConfig()
      this.msg = this.$route.query.threShow
      if (this.msg !== undefined) {
        this.threShow = this.msg
        this.rowData = {}
        this.devicesObj = {
          addrs: this.$route.query.addr,
          mac: this.$route.query.mac,
        }
      }
      this.handleThresholdList()
      // 如果keep-alive为false，走这里
      if (this.$route.params.executeConfigId && this.$route.params.model) {
        let obj = { model: this.$route.params.model, configId: this.$route.params.executeConfigId }
        this.handleDetails(obj)
      }
    },
    deactivated() {
      if (this.$store.state.threShowKeepAlin) {
        this.threShow = 'threIndex'
      }
      this.$store.commit('threShowKeepAlin', false)
    },
    methods: {
      openPwdsModal(row) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = row
        } else {
          this.handledels(row)
        }
      },
      closePwdModal() {
        this.openSeconedPwd = false
      },
      getnewPwdsVal(val) {
        this.newPwdsSeconed = val
      },
      checkSecondePwds() {
        if (this.newPwdsSeconed.length < 6) {
          this.newPwdsSeconed = ''
          return this.$Message.error({ content: this.$t('pleaseEnterComplateSubPassword') })
        }
        const encry = new JSEncrypt()
        getBpk().then(r => {
          this.bpk = r.data
          encry.setPublicKey(this.bpk.pubkey) // 设置公钥
          checkSecondPwd({ secondPwd: encry.encrypt(this.newPwdsSeconed), encB64: true }).then(res => {
            if (res.success) {
              if (res.code === '0') {
                this.openSeconedPwd = false
                this.handledel(this.rowDatas)
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      handledels(row) {
        this.$Modal.confirm({
          title: this.$t('deleteConfirmTip'),
          okText: this.$t('confirm'),
          cancelText: this.$t('cancel'),
          onOk: () => {
            let params = { configId: row.configId }
            thresholdDel(params).then(res => {
              if (res.success) {
                this.$Message.success(this.$t('deleteSuccessful'))
                if (this.data.length === 1) {
                  this.currentPage = this.currentPage - 1
                }
              } else {
                this.$Message.error({ content: res.message })
              }
              this.handleThresholdList()
            })
          },
        })
      },
      rowClassName(row, index) {
        if (row.isTop === 1) {
          return 'demo-table-info-row'
        }
      },
      handlequeryDateConfig() {
        let params = {
          projectCode: this.$store.state.projectCode,
        }
        queryDateConfig(params).then(res => {
          this.$store.commit('mondaySelect', res.data.weekFirstDay === '1')
        })
      },
      threNewAddBack(val) {
        this.threShow = val
      },
      handleAdd() {
        this.threShow = 'threAdd'
        this.rowData = {}
      },
      handlecomflictEdit(row) {
        this.handleComflictDetails(row.conlictConfigId)
        this.configId = row.configId
      },
      handleComflictDetails(id) {
        this.threShow = 'threDetails'
        let params = { configId: id }
        thresholdGetBaseInfo(params).then(res => {
          if (res.success) {
            this.comflict = false
            this.threShow = 'threDetails'
            this.model = String(res.data.model)
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleEdit(row) {
        this.threShow = 'threAdd'
        this.rowData = row
        this.rowData.edit = true
      },
      addBack(val) {
        this.threShow = val
      },
      detailsBack(val) {
        this.threShow = val
        this.handleThresholdList()
      },
      handleDetailsEdit(val) {
        this.threShow = val
      },
      handledetailsData(val) {
        this.rowData = val
        this.rowData.edit = true
      },
      handleDetails(val) {
        this.model = String(val.model)
        this.threShow = 'threDetails'
        this.configId = val.configId
      },
      rest() {
        this.nameVal = ''
        this.state = ''
        this.creationTime = ''
        this.pattern = ''
      },
      handleThresholdList() {
        let params = {
          projectCode: this.$store.state.projectCode,
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          name: this.nameVal,
          model: this.pattern,
          status: this.state,
          startTime: this.creationTime[0],
          endTime: this.creationTime[1],
          topMacAddr: this.topAddrs,
        }
        thresholdList(params).then(res => {
          if (res.success) {
            this.total = res.total
            this.data = res.datas
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleThresholdStatus(id, status) {
        let params = { configId: id, status: status === false ? '1' : '2' }
        thresholdStatus(params).then(res => {
          if (res.success) {
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handledel(row) {
        let params = { configId: row.configId }
        thresholdDel(params).then(res => {
          if (res.success) {
            this.$Message.success(this.$t('deleteSuccessful'))
            if (this.data.length === 1) {
              this.currentPage = this.currentPage - 1
            }
          } else {
            this.$Message.error({ content: res.message })
          }
          this.handleThresholdList()
        })
      },
      conflictDetection() {
        let params = { projectCode: this.$store.state.projectCode, configId: 0 }
        getMacAddrConflictList(params).then(res => {
          if (res.success) {
            this.comflict = true
            this.comflictData = res.data.conlictList
            let arrayStatus = Array.isArray(this.comflictData) && this.comflictData.length > 0
            if (res.data.temNoConflict) {
              this.temNoConContent = this.$t('conflictDetectionResult1')
              this.temNoConflict = false
            }
            if (!res.data.temNoConflict && !arrayStatus) {
              this.temNoConContent = this.$t('conflictDetectionResult2')
              this.temNoConflict = false
            }
            if (res.data.temNoConflict === false && arrayStatus) {
              this.temNoConContent = this.$t('conflictDetectionResult3')
              this.temNoConflict = true
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      hanldeCreateTime(e) {
        this.creationTime = e
      },
      changePage(e) {
        this.currentPage = e
        this.handleThresholdList()
      },
      changesize(e) {
        this.pageSize = e
        this.handleThresholdList()
      },
      backdevicesObj(val) {
        this.devicesObj = val
      },
    },
    watch: {
      $route: function (val) {
        if (val.name === 'multiManage-threShold') {
          this.topAddrs = val.params.topaddrs
          this.msg = val.query.threShow
          if (this.msg !== undefined) {
            this.threShow = this.msg
            this.rowData = {}
            this.devicesObj = { addrs: val.query.addr, mac: val.query.mac }
          }
          this.handleThresholdList()
        }
      },
    },
  }
</script>
<style lang="less">
  .threShold {
    .ivu-table .demo-table-info-row td {
      background-color: #1a202e;
      color: #fff;
    }
    .w200 {
      width: 200px;
      margin-right: 10px;
    }
    .threSearch,
    .threContent {
      background: #1a202e;
      padding: 20px;
    }
    .threContent {
      margin-top: 10px;
      .tableHead {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
    }
    .ivu-table-wrapper {
      overflow: unset;
      .ivu-table {
        overflow: unset;
      }
    }
    .ivu-poptip-confirm .ivu-poptip-body .ivu-icon {
      top: 18px;
      left: 20px;
    }
  }
  .comflictModal {
    .headSussce {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 10px;
      color: #21f27f;
      background: rgba(33, 242, 127, 0.05);
      border: 1px solid #21f27f;
      margin-bottom: 20px;
    }
    .headerror {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 10px;
      color: #e03c3a;
      background: rgba(224, 60, 58, 0.05);
      border: 1px solid #e03c3a;
      margin-bottom: 20px;
    }
    .comflictName {
      cursor: pointer;
      color: #007eff;
    }
    .ivu-modal {
      width: 1230px !important;

      background: #1a202e;
      box-shadow: 0px 0px 46px 0px #060b17, 0px 0px 10px 0px rgba(60, 72, 99, 0.6);
      border-radius: 5px;
    }
    .ivu-modal-body {
      height: 453px;
      overflow: auto;
      ::-webkit-scrollbar {
        display: none;
      }
    }
    .ivu-modal-footer {
      border: 0;
      padding: 0;
    }
  }
</style>
