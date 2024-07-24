<template>
  <div id="LatitudeLongitudeTiming">
    <div v-if="curPageView === '1'">
      <Row class="LatitudeLongitudeTiming-head">
        <Col :span="24">
          <Form :inline="true" :model="formInline" ref="formInline" class="form-wrap" @submit.native.prevent>
            <FormItem>
              <Select v-model="formInline.actionType" class="w-200" :placeholder="$t('pleaseSelectActionType')" clearable>
                <Option v-for="item in actionList" :value="item.value" :key="item.value" :label="item.label"></Option>
              </Select>
            </FormItem>
            <FormItem>
              <Input v-model="formInline.mac" :placeholder="$t('enterDeviceNo')" style="width: 200px"></Input>
            </FormItem>
            <FormItem>
              <Button class="b-blue" @click="queryList">{{ $t('query') }}</Button>
            </FormItem>
            <FormItem>
              <Button @click="empty">{{ $t('reset') }}</Button>
            </FormItem>
            <FormItem>
              <Dropdown trigger="click" @on-click="handleDevicePull" transfer>
                <Button class="export">
                  <Icon custom="icon-v5 icon-v5-tiqumingxi" />
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem name="all">{{ $t('extractFromDevice') }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row class="table">
        <Col :span="24" class="tableHeader">
          <h3>{{ $t('lnglatTimerConfig') }}</h3>
          <div style="text-align: right">
            <Button class="b-blue pointer" @click="handleEdit(false)">
              <i class="el-icon-plus"></i>
              {{ $t('addTimer') }}
            </Button>
            <Button type="text" class="b-dger" :class="multipleSelection.length === 0 ? 'c-info pointer' : 'c-danger pointer'" :disabled="multipleSelection.length === 0" @click="openPwdsModal(false)">
              <i class="el-icon-close"></i>
              {{ $t('batchDelete') }}
            </Button>
          </div>
        </Col>
        <Col :span="24">
          <Pro808Table
            @updateCurSelect="updateCurSelect"
            :selectedAllApi="selectedAllApi"
            :source="source"
            :selectedAllParams="{ filterFields: 'configId,lineType', types: searchBarValues.types }"
            :searchBarValues="searchBarValues"
            :columns="columns"
            autoInit
            idField="configId"
            ref="selection"
            maxHeight="600px">
            <template #configDetail="{ row }">{{ row.totalMac ? $t('macAddrCount', row) : '' }}</template>
            <template #weekday="{ row }">
              <div v-if="row.weekday.split('').length === 7">{{ $t('everyDay') }}</div>
              <div v-else>
                <div v-if="row.weekday">
                  <span v-for="(item, index) in row.weekday.split('')" :key="item">{{ weekConfig[item] + (index === row.weekday.split('').length - 1 ? '' : '、') }}</span>
                </div>
                <div v-if="!row.weekday">{{ '-' }}</div>
              </div>
            </template>
            <template #timeName="{ row }">
              <template v-if="[2, 5].includes(row.type)">{{ +row.time < 0 ? $t('beforeSunrise') : $t('afterSunrise') }}</template>
              <template v-else>{{ +row.time < 0 ? $t('beforeSunset') : $t('afterSunset') }}</template>
            </template>
            <template #timeValue="{ row }">{{ +row.time < 0 ? row.time * -1 : row.time }}s</template>
            <template slot-scope="{ row }" slot="operating">
              <Button class="c-primary" @click="handleHistory(row, false)" type="text">{{ $t('view') }}</Button>
              <Button class="c-primary" @click="handleEdit(row)" type="text">{{ $t('edit') }}</Button>
              <Button class="c-primary" @click="handleHistory(row, true)" type="text">{{ $t('commandHistory') }}</Button>
              <Button class="c-danger" @click="openPwdsModal(row)" type="text">{{ $t('delete') }}</Button>
            </template>
          </Pro808Table>
        </Col>
      </Row>
    </div>
    <div v-if="curPageView === '2'">
      <lalongEditAddVue :rowPropData="rowPropData" @lalongShow="lalongShow"></lalongEditAddVue>
    </div>
    <div v-if="curPageView === '3'">
      <latlongDetailsVue :rowPropData="rowPropData" @lalongShow="lalongShow"></latlongDetailsVue>
    </div>
    <Modal :title="timingTitle" :close-on-click-modal="false" v-model="timingFlag" width="680px">
      <Edit ref="child" :options="timing" v-if="timingFlag" @queryList="inits" @closeEdit="timingFlag = false" @handleLatitudeLongitude="handleLatitudeLongitude"></Edit>
      <div slot="footer"></div>
    </Modal>

    <Modal :title="this.$t('tip')" v-model="delVisible" width="420px" top="45vh" :close-on-click-modal="false" :close-on-press-escape="false">
      <Row>
        <Col class="ml-20">
          <div class="el-message-box__status el-icon-warning"></div>
        </Col>
        <Col class="marlft-30">
          <div class="el-message-box__message">{{ $t('confirmDeleteConfigCompletely') }}</div>
        </Col>
      </Row>
      <div slot="footer" :class="rowData.model === 1 ? 'footer-del-button' : ''">
        <Col class="tl mt-10" v-show="rowData.model === 1">
          <Checkbox v-model="checked">{{ this.$t('forceDeletePlatformRecord') }}</Checkbox>
        </Col>
        <Col>
          <Button @click="handleCancel">{{ $t('cancel') }}</Button>
          <Button class="b-blue" @click="handleOk">{{ $t('confirm') }}</Button>
        </Col>
      </div>
    </Modal>
    <Modal :title="$t('setLatLng')" :close-on-click-modal="false" v-model="latitudeFlag" :width="$store.state.locale !== 'zh-CN' ? '780px' : '680px'">
      <div class="title">
        <div class="description-title">
          <i class="icon-v5 icon-v5-huifu"></i>
          {{ $t('explanation') + '：' }}
        </div>
        <div class="description-text">
          <div class="description">
            {{ $t('latLngText1') }}
          </div>
          <div class="description">
            {{ $t('latLngText2') }}
          </div>
        </div>
      </div>
      <Form :model="setupForm" style="margin-top: 20px">
        <FormItem :label="$t('equipmentNo') + '：'">
          <Input style="width: 260px" :disabled="true" v-model="setupForm.mac"></Input>
        </FormItem>

        <FormItem :label="$t('lngValue') + '：'" style="margin-top: 20px">
          <Row>
            <Col>
              <Input style="width: 150px" :placeholder="$t('longitude')" v-model="setupForm.longitude"></Input>
            </Col>
            <Col style="margin: 0 10px">
              <Input style="width: 150px" :placeholder="$t('latitude')" v-model="setupForm.latitude"></Input>
            </Col>
            <Col>
              <Button class="pointer c-primary bg" @click="handleRefresh" style="margin: 0 10px">{{ $t('refresh') }}</Button>
              <Button class="pointer c-primary bg" @click="handleExtract(setupForm.mac)" style="margin: 0 10px">{{ $t('extractFromDevice') }}</Button>
            </Col>
          </Row>
        </FormItem>
        <!-- @click="latitudeFlag = false" timingFlag" -->
        <FormItem class="footerBtn">
          <Button class="b-blue" @click="handleSubmit" :disabled="setupForm.mac === '' || setupForm.longitude === '' || setupForm.latitude === ''">{{ $t('confirm') }}</Button>
          <Button @click="latitudeFlagCancel">{{ $t('cancel') }}</Button>
        </FormItem>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <Modal v-model="openSeconedPwd" :title="$t('validate')" :mask-closable="false">
      <PwsSeconedCheckVue v-if="openSeconedPwd" :isfoucs="false" @close="closePwdModal" @getnewPwds="getnewPwdsVal"></PwsSeconedCheckVue>
      <div slot="footer">
        <div style="padding: 10px 20px; border-top: 1px solid #3d3d41">
          <Button type="default" @click="openSeconedPwd = false">{{ $t('cancel') }}</Button>
          <Button type="primary" style="margin-left: 10px" @click="checkSecondePwds">{{ $t('confirm') }}</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { checkSecondPwd, timerConfigList, timerConfigAllList } from '@/api/public'
  import PwsSeconedCheckVue from '../../Common/PwsSeconedCheck.vue'
  import { downGetTime } from '@/api/multiManage/builtlnTimer'
  import { batchDel, longitudeAndLatitude, refreshLongitudeLatitude, setLongitudeLatitude } from '@/api/multiManage/latlongTimer'
  import { JSEncrypt } from 'jsencrypt'
  import { getBpk } from '@/api/account'
  import lalongEditAddVue from './lalongEditAdd.vue'
  import latlongDetailsVue from './latlongDetails.vue'
  import { weekConfig } from '@/untils/weekMap'
  export default {
    name: 'multiManage-latlongTimer',
    components: {
      PwsSeconedCheckVue,
      lalongEditAddVue,
      latlongDetailsVue,
    },
    data() {
      return {
        weekConfig,
        rowPropDetail: {},
        rowPropData: {},
        rowData: {},
        curPageView: '1',
        bpk: null,
        newPwdsSeconed: '',
        openSeconedPwd: false,
        rowDatas: {},
        formInline: { actionType: '', mac: '' },
        setupForm: {
          mac: '',
          longitude: '',
          latitude: '',
        },
        multipleSelection: [],
        actionList: [
          { value: 'false', label: this.$t('opening') },
          { value: 'true', label: this.$t('closing') },
          { value: 'closeAndLock', label: this.$t('openAndLock') },
          { value: '1', label: 'ON' },
          { value: '2', label: 'OFF' },
          // { value: '3', label: 'PWM' },
          { value: '4', label: this.$t('inching') },
        ],
        packetFilterList: [],
        rowList: {},
        timingTitle: '',
        checked: false,
        timingFlag: false,
        msgboxFlag: false,
        delVisible: false,
        latitudeFlag: false,
        returnFlag: false,
        forceDelData: [],
        timing: { mac: '', autoid: '', channel: '', weekday: '', time: '', type: '', monitorTime: '', status: '', tags: '' },
        columns: [
          { type: 'selection', width: 60, align: 'center' },
          { type: 'index', title: this.$t('index'), width: 80, align: 'center' },
          { title: this.$t('timerName'), key: 'name', align: 'center' },
          { title: this.$t('configurationSituation'), slot: 'configDetail', align: 'center' },
          { title: this.$t('executionMode'), key: 'modelName', align: 'center' },
          { title: this.$t('cyclePeriod'), slot: 'weekday', align: 'center' },
          { title: this.$t('timeType'), slot: 'timeName', align: 'center' },
          { title: `${this.$t('time')}(s)`, slot: 'timeValue', align: 'center' },
          { title: this.$t('performAction'), key: 'actionName', align: 'center', width: 120 },
          { title: this.$t('operation'), slot: 'operating', align: 'center', width: 250 },
        ],
      }
    },
    computed: {
      searchBarValues() {
        return {
          projectCode: this.$store.state.projectCode,
          action: this.formInline.actionType,
          model: 0,
          mac: this.formInline.mac,
          status: -1,
          types: '2,3,5,6',
        }
      },
    },
    mounted() {
      this.init()
      // 此注释代码为从每日执行列表跳转而来的操作，暂且注释，勿删;
      //   if (this.$route.params.executeConfigId) {
      //     let obj = { id: this.$route.params.executeConfigId }
      //
      //   }
    },
    methods: {
      handleHistory(row, val) {
        this.rowPropData = { ...row, isHistroy: val }
        this.curPageView = '3'
      },
      updateCurSelect(curSelect) {
        console.log('🚀 ~ file: index.vue:249 ~ updateCurSelect ~ curSelect:', curSelect)
        this.multipleSelection = curSelect
      },
      source: timerConfigList,
      selectedAllApi: timerConfigAllList,
      handleView(row) {
        this.rowPropData = row ? { ...row, isNewAdd: false, isEditDisabled: true } : { isNewAdd: true }
        this.curPageView = '2'
      },
      handleEdit(val) {
        this.rowPropData = val ? { ...val, isNewAdd: false, isEditDisabled: false } : { isNewAdd: true }
        this.curPageView = '2'
      },
      lalongShow(val) {
        this.curPageView = val
      },
      openPwdsModal(row) {
        this.newPwdsSeconed = ''
        let data = this.$store.state.setSecondPwds
        if (data) {
          this.openSeconedPwd = true
          this.rowDatas = row || null
        } else {
          if (row) {
            this.handleDelete(row)
          } else {
            this.handleforceDel()
          }
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
                if (this.rowDatas) {
                  this.handleDelete(this.rowDatas)
                } else {
                  this.handleforceDel()
                }
              }
            } else {
              this.$Message.error({ content: res.message })
            }
          })
        })
      },
      init() {
        this.queryList()
      },
      inits() {
        setTimeout(() => {
          this.queryList()
        }, 2000)
      },
      async queryList() {
        this.$refs.selection.getData()
      },
      handleDelete(row) {
        this.delVisible = true
        this.rowData = row
      },
      handleforceDel() {
        this.delVisible = true
        this.rowData = {}
        this.rowData.model = 1
      },
      handleCancel() {
        this.$Message.info({ content: this.$t('cancelDelete') })
        this.checked = this.delVisible = false
      },
      async handleOk() {
        let params = {
          configIds: this.rowData.configId ? this.rowData.configId : this.multipleSelection.toString(),
          forceDel: this.checked,
        }
        let res = await batchDel(params)
        if (res.success) {
          this.delVisible = false
          this.$refs.selection.deleteItems(params.configIds.toString().split(','))
          this.queryList()
        } else {
          this.$Message.error({ content: res.message })
        }
      },
      handleLatitudeLongitude(row) {
        this.rowList = row
        this.setupForm.mac = row.mac
        this.returnFlag = row.flag === 'ture'
        this.setLatitudeLongitude()
      },
      setLatitudeLongitude() {
        this.timingFlag = false
        this.latitudeFlag = true
      },
      handleRefresh() {
        refreshLongitudeLatitude({ mac: this.setupForm.mac }).then(res => {
          if (res.success) {
            this.setupForm = {
              mac: this.setupForm.mac,
              longitude: res.data.longitude,
              latitude: res.data.latitude,
            }
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleExtract(mac) {
        longitudeAndLatitude({ mac: mac }).then(res => {
          if (res.success) {
            this.$Message.success({ content: res.message })
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      handleSubmit() {
        setLongitudeLatitude(this.setupForm).then(res => {
          if (res.success) {
            this.$Message.success({ content: res.message })
            this.handlelatitudeClose()
          } else {
            this.$Message.error({ content: res.message })
          }
        })
      },
      async handleDevicePull(commmand) {
        if (!this.formInline.mac) {
          return this.$Message.error({
            content: this.$t('enterDeviceNo'),
          })
        }
        const res = await downGetTime({ mac: this.formInline.mac })
        if (!res.success) {
          return this.$Message.error({ content: res.message })
        }
        this.$Message.success({ content: this.$t('submitCommand') })
      },
      handlelatitudeClose() {
        if (this.returnFlag) {
          this.latitudeFlag = false
          this.timing = {
            mac: this.rowList.mac,
            autoid: this.rowList.autoid,
            weekday: this.rowList.week,
            time: this.rowList.time,
            type: this.rowList.type,
            digitalOuts: this.rowList.digitalOuts || '',
            isDigtalouts: this.rowList.isDigtalouts || '',
            monitorTime: this.rowList.monitorTime,
            status: this.rowList.action,
            tags: this.rowList.tags,
            portes: this.rowList.portes,
          }
          this.timingFlag = true
        } else {
          this.latitudeFlag = false
        }
      },
      empty() {
        this.formInline.actionType = ''
        this.formInline.mac = ''
        this.queryList()
      },
      latitudeFlagCancel() {
        this.timingFlag = true
        this.latitudeFlag = false
      },
    },
  }
</script>
<style lang="less" scoped>
  .footer-del-button {
    display: flex;
    justify-content: space-between;
  }
  .w-200 {
    width: 200px;
  }
  .marlft-30 {
    margin-left: 30px;
  }
  .ivu-form-item {
    margin-bottom: 0;
  }
  #LatitudeLongitudeTiming {
    .LatitudeLongitudeTiming-head {
      display: flex;
      padding-top: 10px;
      padding: 10px;
      background: #1a202e;
    }
  }
  .table {
    margin-top: 10px;
    background: #1a202e;
    padding: 20px;
    .tableHeader {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      justify-content: space-between;
      Button {
        margin: 0 5px;
      }
    }
  }
  /deep/.ivu-modal-footer {
    border: none;
  }
  .title {
    background: rgba(153, 153, 153, 0.05);
    border: 1px solid #999999;
    font-size: 14px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #999999;
    display: flex;
    padding: 10px;
    .description-title {
      width: 106px;
      display: flex;
    }
  }
  .bg {
    background: rgba(0, 126, 255, 0.1);
    border: 1px solid #007eff;
    border-radius: 5px;
  }
  .footerBtn {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    Button {
      margin: 5px;
    }
  }
</style>
